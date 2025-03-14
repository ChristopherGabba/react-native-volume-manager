#import <AVFoundation/AVFoundation.h>
#import <VolumeManager.h>
#import <AVKit/AVRoutePickerView.h>

@import MediaPlayer;
@import UIKit;

@interface CustomVolumeView : UIView
@property(nonatomic, strong) UISlider *volumeSlider;
@property(nonatomic, strong) MPVolumeView *systemVolumeView;
@end

@implementation CustomVolumeView

- (instancetype)initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  if (self) {
    self.translatesAutoresizingMaskIntoConstraints = NO;
    self.userInteractionEnabled = NO;
    [self setupSystemVolumeView];
    [self setupVolumeSlider];
  }
  return self;
}

- (void)setupSystemVolumeView {
  self.systemVolumeView = [[MPVolumeView alloc] initWithFrame:CGRectMake(-2000, -2000, 1, 1)];
  self.systemVolumeView.alpha = 0.01;
  [self addSubview:self.systemVolumeView];
}

- (void)setupVolumeSlider {
  MPVolumeView *volumeView = [[MPVolumeView alloc] initWithFrame:self.bounds];
  for (UIView *view in [volumeView subviews]) {
    if ([view isKindOfClass:[UISlider class]]) {
      self.volumeSlider = (UISlider *)view;
      break;
    }
  }
  
  if (self.volumeSlider) {
    [self addSubview:self.volumeSlider];
    self.volumeSlider.translatesAutoresizingMaskIntoConstraints = NO;
    self.volumeSlider.hidden = YES;
    
    [NSLayoutConstraint activateConstraints:@[
      [self.volumeSlider.leadingAnchor constraintEqualToAnchor:self.leadingAnchor constant:8],
      [self.volumeSlider.trailingAnchor constraintEqualToAnchor:self.trailingAnchor constant:-8],
      [self.volumeSlider.centerYAnchor constraintEqualToAnchor:self.centerYAnchor],
      [self.heightAnchor constraintEqualToConstant:44]
    ]];
  }
}

@end

@implementation VolumeManager {
  bool hasListeners;
  CustomVolumeView *customVolumeView;
  AVAudioSession *audioSession;
  MPVolumeView *hiddenVolumeView;
}

- (void)dealloc {
  [self removeVolumeListener];
}

- (instancetype)init {
  self = [super init];
  if (self) {
    audioSession = [AVAudioSession sharedInstance];
    [self addVolumeListener];
  }
  [self initVolumeView];
  return self;
}

- (UIWindow *)getAppropriateWindow {
  UIWindowScene *windowScene = nil;
  NSSet<UIScene *> *connectedScenes = [[UIApplication sharedApplication] connectedScenes];
  
  for (UIScene *scene in connectedScenes) {
    if ([scene isKindOfClass:[UIWindowScene class]] &&
        scene.activationState == UISceneActivationStateForegroundActive) {
      windowScene = (UIWindowScene *)scene;
      break;
    }
  }
  
  if (!windowScene) {
    return nil;
  }
  
  // Look for key window in the active scene
  for (UIWindow *window in windowScene.windows) {
    if (window.isKeyWindow) {
      return window;
    }
  }
  
  // Fallback to first window if no key window found
  return windowScene.windows.firstObject;
}

- (void)initVolumeView {
  hiddenVolumeView = [[MPVolumeView alloc] initWithFrame:CGRectMake(-2000, -2000, 1, 1)];
  hiddenVolumeView.alpha = 0.01;
  
  UIWindow *window = [self getAppropriateWindow];
  [window addSubview:hiddenVolumeView];
  
  customVolumeView = [[CustomVolumeView alloc] initWithFrame:CGRectZero];
  [self showVolumeUI:YES];
  
  [[NSNotificationCenter defaultCenter]
   addObserver:self
   selector:@selector(applicationWillEnterForeground:)
   name:UIApplicationWillEnterForegroundNotification
   object:nil];
}

- (UIViewController *)topMostViewController {
  UIWindow *window = [self getAppropriateWindow];
  UIViewController *topController = window.rootViewController;
  
  while (topController.presentedViewController) {
    topController = topController.presentedViewController;
  }
  return topController;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[ @"RNVMEventVolume" ];
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

RCT_EXPORT_MODULE(VolumeManager)

- (void)startObserving {
  hasListeners = YES;
}

- (void)stopObserving {
  hasListeners = NO;
}

- (void)showVolumeUI:(BOOL)flag {
  __weak typeof(self) weakSelf = self;
  dispatch_async(dispatch_get_main_queue(), ^{
    __strong typeof(weakSelf) strongSelf = weakSelf;
    if (strongSelf) {
      if (!flag) {
        if (![strongSelf->hiddenVolumeView superview]) {
          UIWindow *window = [strongSelf getAppropriateWindow];
          [window addSubview:strongSelf->hiddenVolumeView];
        }
        strongSelf->customVolumeView.volumeSlider.hidden = YES;
      } else {
        [strongSelf->hiddenVolumeView removeFromSuperview];
        strongSelf->customVolumeView.volumeSlider.hidden = NO;
      }
    }
  });
}

- (void)addVolumeListener {
  [audioSession setCategory:AVAudioSessionCategoryAmbient
                withOptions:AVAudioSessionCategoryOptionMixWithOthers |
   AVAudioSessionCategoryOptionAllowBluetooth
                      error:nil];
  [audioSession setActive:YES error:nil];
  
  [audioSession addObserver:self
                 forKeyPath:@"outputVolume"
                    options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld
                    context:nil];
}

- (void)removeVolumeListener {
  [audioSession removeObserver:self forKeyPath:@"outputVolume"];
}

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary<NSString *, id> *)change
                       context:(void *)context {
  if (object == [AVAudioSession sharedInstance] &&
      [keyPath isEqualToString:@"outputVolume"]) {
    float newValue = [change[@"new"] floatValue];
    if (hasListeners) {
      [self sendEventWithName:@"RNVMEventVolume"
                         body:@{@"volume" : [NSNumber numberWithFloat:newValue]}];
    }
  }
}

RCT_EXPORT_METHOD(showNativeVolumeUI:(NSDictionary *)showNativeVolumeUI) {
  __weak typeof(self) weakSelf = self;
  dispatch_async(dispatch_get_main_queue(), ^{
    __strong typeof(weakSelf) strongSelf = weakSelf;
    if (strongSelf) {
      id enabled = [showNativeVolumeUI objectForKey:@"enabled"];
      [strongSelf showVolumeUI:(enabled != nil && [enabled boolValue])];
    }
  });
}

RCT_EXPORT_METHOD(setVolume:(float)val config:(NSDictionary *)config) {
  __weak typeof(self) weakSelf = self;
  dispatch_async(dispatch_get_main_queue(), ^{
    __strong typeof(weakSelf) strongSelf = weakSelf;
    if (strongSelf) {
      id showUI = [config objectForKey:@"showUI"];
      [strongSelf showVolumeUI:(showUI != nil && [showUI boolValue])];
      strongSelf->customVolumeView.volumeSlider.value = val;
    }
  });
}

RCT_EXPORT_METHOD(getVolume:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  __weak typeof(self) weakSelf = self;
  dispatch_async(dispatch_get_main_queue(), ^{
    __strong typeof(weakSelf) strongSelf = weakSelf;
    if (strongSelf) {
      NSNumber *volumeNumber = [NSNumber
                                numberWithFloat:[strongSelf->customVolumeView.volumeSlider value]];
      NSDictionary *volumeDictionary = @{@"volume" : volumeNumber};
      resolve(volumeDictionary);
    }
  });
}


RCT_EXPORT_METHOD(activateAudioSession:(BOOL)async) {
  
    void (^activateBlock)(void) = ^{
        AVAudioSession *session = [AVAudioSession sharedInstance];
        NSError *error = nil;
        [session setActive:YES
                     error:&error];
        if (error) {
            NSLog(@"Error activating audio session: %@", error.localizedDescription);
        }
    };

    if (async) {
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), activateBlock);
    } else {
        activateBlock();
    }
}

RCT_EXPORT_METHOD(deactivateAudioSession:(BOOL)restorePreviousSessionOnDeactivation
                                        async:(BOOL)async) {
  
    AVAudioSessionSetActiveOptions options = 0;
    if (restorePreviousSessionOnDeactivation) {
        options |= AVAudioSessionSetActiveOptionNotifyOthersOnDeactivation;
    }
  
    void (^deactivateBlock)(void) = ^{
        AVAudioSession *session = [AVAudioSession sharedInstance];
        NSError *error = nil;
        [session setActive:NO
               withOptions:options
                     error:&error];
        if (error) {
            NSLog(@"Error activating audio session: %@", error.localizedDescription);
        }
    };

    if (async) {
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), deactivateBlock);
    } else {
        deactivateBlock();
    }
}
RCT_EXPORT_METHOD(configureAudioSession:(NSString *)categoryName
                  mode:(NSString *)modeName
                  policy:(NSString *)policyName
                  options:(NSArray<NSString *> *)optionsArray
                  prefersNoInterruptionFromSystemAlerts:(BOOL)prefersNoInterruptionFromSystemAlerts
                  prefersInterruptionOnRouteDisconnect:(BOOL)prefersInterruptionOnRouteDisconnect
                  allowHapticsAndSystemSoundsDuringRecording:(BOOL)allowHapticsAndSystemSoundsDuringRecording) {

    AVAudioSession *session = [AVAudioSession sharedInstance];
    
    NSString *category = nil;
    if ([categoryName isEqualToString:@"Ambient"]) {
        category = AVAudioSessionCategoryAmbient;
    } else if ([categoryName isEqualToString:@"SoloAmbient"]) {
        category = AVAudioSessionCategorySoloAmbient;
    } else if ([categoryName isEqualToString:@"Playback"]) {
        category = AVAudioSessionCategoryPlayback;
    } else if ([categoryName isEqualToString:@"Record"]) {
        category = AVAudioSessionCategoryRecord;
    } else if ([categoryName isEqualToString:@"PlayAndRecord"]) {
        category = AVAudioSessionCategoryPlayAndRecord;
    } else if ([categoryName isEqualToString:@"MultiRoute"]) {
        category = AVAudioSessionCategoryMultiRoute;
    }

    NSString *mode = nil;
    BOOL hasMode = NO;
    if ([modeName isEqualToString:@"Default"]) {
        mode = AVAudioSessionModeDefault;
        hasMode = YES;
    } else if ([modeName isEqualToString:@"VoiceChat"]) {
        mode = AVAudioSessionModeVoiceChat;
        hasMode = YES;
    } else if ([modeName isEqualToString:@"VideoChat"]) {
        mode = AVAudioSessionModeVideoChat;
        hasMode = YES;
    } else if ([modeName isEqualToString:@"GameChat"]) {
        mode = AVAudioSessionModeGameChat;
        hasMode = YES;
    } else if ([modeName isEqualToString:@"VideoRecording"]) {
        mode = AVAudioSessionModeVideoRecording;
        hasMode = YES;
    } else if ([modeName isEqualToString:@"Measurement"]) {
        mode = AVAudioSessionModeMeasurement;
        hasMode = YES;
    } else if ([modeName isEqualToString:@"MoviePlayback"]) {
        mode = AVAudioSessionModeMoviePlayback;
        hasMode = YES;
    } else if ([modeName isEqualToString:@"SpokenAudio"]) {
        mode = AVAudioSessionModeSpokenAudio;
        hasMode = YES;
    }

    AVAudioSessionRouteSharingPolicy policy = AVAudioSessionRouteSharingPolicyDefault;
    BOOL hasPolicy = NO;
    if ([policyName isEqualToString:@"LongFormAudio"]) {
        policy = AVAudioSessionRouteSharingPolicyLongFormAudio;
        hasPolicy = YES;
    } else if ([policyName isEqualToString:@"LongFormVideo"]) {
        policy = AVAudioSessionRouteSharingPolicyLongFormVideo;
        hasPolicy = YES;
    } else if ([policyName isEqualToString:@"Independent"]) {
        policy = AVAudioSessionRouteSharingPolicyIndependent;
        hasPolicy = YES;
    }

    AVAudioSessionCategoryOptions options = 0;
    BOOL hasOptions = NO;
    for (NSString *optionName in optionsArray) {
        if ([optionName isEqualToString:@"MixWithOthers"]) {
            options |= AVAudioSessionCategoryOptionMixWithOthers;
            hasOptions = YES;
        } else if ([optionName isEqualToString:@"AllowBluetooth"]) {
            options |= AVAudioSessionCategoryOptionAllowBluetooth;
            hasOptions = YES;
        } else if ([optionName isEqualToString:@"AllowBluetoothA2DP"]) {
            options |= AVAudioSessionCategoryOptionAllowBluetoothA2DP;
            hasOptions = YES;
        } else if ([optionName isEqualToString:@"AllowAirPlay"]) {
            options |= AVAudioSessionCategoryOptionAllowAirPlay;
            hasOptions = YES;
        } else if ([optionName isEqualToString:@"DuckOthers"]) {
            options |= AVAudioSessionCategoryOptionDuckOthers;
            hasOptions = YES;
        } else if ([optionName isEqualToString:@"DefaultToSpeaker"]) {
            options |= AVAudioSessionCategoryOptionDefaultToSpeaker;
            hasOptions = YES;
        } else if ([optionName isEqualToString:@"InterruptSpokenAudioAndMixWithOthers"]) {
            options |= AVAudioSessionCategoryOptionInterruptSpokenAudioAndMixWithOthers;
            hasOptions = YES;
        } else if ([optionName isEqualToString:@"OverrideMutedMicrophoneInterruption"]) {
            options |= AVAudioSessionCategoryOptionOverrideMutedMicrophoneInterruption;
            hasOptions = YES;
        }
    }

    NSError *error = nil;

    if (category) {
  
        // Handle all combinations of mode, policy, and options
        if (hasMode && hasPolicy && hasOptions) {
            [session setCategory:category mode:mode routeSharingPolicy:policy options:options error:&error];
        } else if (hasMode && hasPolicy) {
            [session setCategory:category mode:mode routeSharingPolicy:policy options:0 error:&error];
        } else if (hasMode && hasOptions) {
            [session setCategory:category mode:mode routeSharingPolicy:AVAudioSessionRouteSharingPolicyDefault options:options error:&error];
        } else if (hasPolicy && hasOptions) {
            [session setCategory:category mode:AVAudioSessionModeDefault routeSharingPolicy:policy options:options error:&error];
        } else if (hasMode) {
            [session setCategory:category mode:mode routeSharingPolicy:AVAudioSessionRouteSharingPolicyDefault options:0 error:&error];
        } else if (hasPolicy) {
            [session setCategory:category mode:AVAudioSessionModeDefault routeSharingPolicy:policy options:0 error:&error];
        } else if (hasOptions) {
            [session setCategory:category mode:AVAudioSessionModeDefault options:options error:&error];
        } else {
            [session setCategory:category error:&error];
        }
        
        if (error) {
            NSLog(@"Failed to configure audio session: %@", error);
            return;
        }

        [session setPrefersNoInterruptionsFromSystemAlerts:prefersNoInterruptionFromSystemAlerts error:&error];
        if (error) {
            NSLog(@"Failed to set prefersNoInterruptionsFromSystemAlerts: %@", error);
            error = nil;
        }
        
        if (@available(iOS 17.0, *)) {
            [session setPrefersInterruptionOnRouteDisconnect:prefersInterruptionOnRouteDisconnect error:&error];
            if (error) {
                NSLog(@"Failed to set prefersInterruptionOnRouteDisconnect: %@", error);
                error = nil;
            }
        }
        
        [session setAllowHapticsAndSystemSoundsDuringRecording:allowHapticsAndSystemSoundsDuringRecording error:&error];
        if (error) {
            NSLog(@"Failed to set allowHapticsAndSystemSoundsDuringRecording: %@", error);
        }
    } else {
        if(hasMode) {
          [session setMode:mode error:&error];
        } else {
          NSLog(@"Did not provide any category or mode to set:");
        }
       
    }
}

RCT_EXPORT_METHOD(getAudioSessionStatus:(RCTResponseSenderBlock)callback) {

  AVAudioSession *session = [AVAudioSession sharedInstance];

  BOOL isOtherAudioPlaying = [session isOtherAudioPlaying];

  // Handle additional preferences with version checks
  BOOL prefersInterruptionOnRouteDisconnect = NO;
  BOOL prefersNoInterruptionsFromSystemAlerts = NO;
  BOOL allowHapticsAndSystemSoundsDuringRecording = NO;

  NSString *category = session.category ?: @"None";
  NSString *mode = session.mode ?: @"None";
  NSUInteger options = session.categoryOptions;  
  NSString *sharingPolicy = @"Unknown";

  if (@available(iOS 13.0, *)) {
    switch (session.routeSharingPolicy) {
      case AVAudioSessionRouteSharingPolicyDefault:
        sharingPolicy = @"Default";
        break;
      case AVAudioSessionRouteSharingPolicyLongFormAudio:
        sharingPolicy = @"LongFormAudio";
        break;
      case AVAudioSessionRouteSharingPolicyIndependent:
        sharingPolicy = @"Independent";
        break;
      default:
        break;
    }
  }

  prefersNoInterruptionsFromSystemAlerts = [session prefersNoInterruptionsFromSystemAlerts];

  allowHapticsAndSystemSoundsDuringRecording = [session allowHapticsAndSystemSoundsDuringRecording];

  if (@available(iOS 17.0, *)) {
    prefersInterruptionOnRouteDisconnect = [session prefersInterruptionOnRouteDisconnect];
  }

  // Convert options to an array of human-readable strings 
  NSMutableArray *optionsArray = [NSMutableArray array];

// Check for each option and add to the options array
if (options & AVAudioSessionCategoryOptionMixWithOthers) {
    [optionsArray addObject:@"MixWithOthers"];
}
if (options & AVAudioSessionCategoryOptionDuckOthers) {
    [optionsArray addObject:@"DuckOthers"];
}
if (options & AVAudioSessionCategoryOptionInterruptSpokenAudioAndMixWithOthers) {
    [optionsArray addObject:@"InterruptSpokenAudioAndMixWithOthers"];
}
if (options & AVAudioSessionCategoryOptionAllowBluetooth) {
    [optionsArray addObject:@"AllowBluetooth"];
}
if (options & AVAudioSessionCategoryOptionAllowBluetoothA2DP) {
    [optionsArray addObject:@"AllowBluetoothA2DP"];
}
if (options & AVAudioSessionCategoryOptionAllowAirPlay) {
    [optionsArray addObject:@"AllowAirPlay"];
}
if (options & AVAudioSessionCategoryOptionDefaultToSpeaker) {
    [optionsArray addObject:@"DefaultToSpeaker"];
}
if (options & AVAudioSessionCategoryOptionOverrideMutedMicrophoneInterruption) {
    [optionsArray addObject:@"OverrideMutedMicrophoneInterruption"];
}
  // Package all properties into a dictionary
  NSDictionary *status = @{
    @"isOtherAudioPlaying": @(isOtherAudioPlaying),
    @"category": category,
    @"mode": mode,
    @"categoryOptions": optionsArray,
    @"routeSharingPolicy": sharingPolicy,
    @"prefersInterruptionOnRouteDisconnect": @(prefersInterruptionOnRouteDisconnect),
    @"prefersNoInterruptionsFromSystemAlerts": @(prefersNoInterruptionsFromSystemAlerts),
    @"allowHapticsAndSystemSoundsDuringRecording": @(allowHapticsAndSystemSoundsDuringRecording)
  };
  // Call the callback with no error (NSNull) and the status dictionary
  callback(@[[NSNull null], status]);
}

- (void)applicationWillEnterForeground:(NSNotification *)notification {
  if (hasListeners) {
    AVAudioSession *audioSession = [AVAudioSession sharedInstance];
    [audioSession setActive:YES error:nil];
  }
}

@end
