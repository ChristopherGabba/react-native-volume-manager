/**
 * Represents the mute switch status of the ring.
 * @export
 * @interface RingMuteSwitchStatus
 * @property {boolean} isMuted - Indicates if the ring is muted.
 * @property {boolean} initialQuery - Represents the initial query status.
 */
export type RingMuteSwitchStatus = {
  isMuted: boolean;
  initialQuery: boolean;
};

/**
 * Called when there is a ring mute switch event.
 * @export
 * @callback
 * @param {RingMuteSwitchStatus} status - The current mute switch status.
 */
export type RingMuteSwitchEventCallback = (
  status: RingMuteSwitchStatus
) => void;

/**
 * Used to set the interval check.
 * @export
 * @callback
 * @param {number} newInterval - The new interval to be set.
 */
export type setCheckIntervalType = (newInterval: number) => void;

export enum AVAudioSessionCategory {
  /**
   * This category is also appropriate for “play-along” apps, such as a virtual piano that a user plays while the Music app is playing. When you use this category, audio from other apps mixes with your audio. Screen locking and the Silent switch (on iPhone, the Ring/Silent switch) silence your audio.
   */
  Ambient = 'Ambient',
  /**
   * Your audio is silenced by screen locking and by the Silent switch (called the Ring/Silent switch on iPhone).
   *
   * By default, using this category implies that your app’s audio is nonmixable—activating your session will interrupt any other audio sessions which are also nonmixable. To allow mixing, use the ambient category instead.
   */
  SoloAmbient = 'SoloAmbient',
  /**
   * When using this category, your app audio continues with the Silent switch set to silent or when the screen locks. (The switch is called the Ring/Silent switch on iPhone.) To continue playing audio when your app transitions to the background (for example, when the screen locks), add the audio value to the UIBackgroundModes key in your information property list file.
   *
   * By default, using this category implies that your app’s audio is nonmixable—activating your session will interrupt any other audio sessions which are also nonmixable. To allow mixing for this category, use the mixWithOthers option.
   */
  Playback = 'Playback',
  /**
   * Your audio continues with the Silent switch set to silent and with the screen locked. (The switch is called the Ring/Silent switch on iPhone.) To continue playing audio when your app transitions to the background (for example, when the screen locks), add the audio value to the UIBackgroundModes key in your information property list file.
   * This category is appropriate for simultaneous recording and playback, and also for apps that record and play back, but not simultaneously.
   * By default, using this category implies that your app’s audio is nonmixable—activating your session will interrupt any other audio sessions which are also nonmixable. To allow mixing for this category, use the mixWithOthers option.
   *
   * The user must grant permission for audio recording.
   *
   * This category supports the mirrored version of Airplay. However, AirPlay mirroring will be disabled if the AVAudioSessionModeVoiceChat mode is used with this category.
   */
  PlayAndRecord = 'PlayAndRecord',
  /**
   * This category has the effect of silencing virtually all output on the system, for as long as the session is active. Unless you need to prevent any unexpected sounds from being played, use playAndRecord instead.
   * To continue recording audio when your app transitions to the background (for example, when the screen locks), add the audio value to the UIBackgroundModes key in your information property list file.
   *
   * The user must grant permission for audio recording.
   */
  Record = 'Record',
  /**
   * @deprecated
   * This category disables playback (audio output) and disables recording (audio input). Use this category, for example, when performing offline audio format conversion.
   */
  AudioProcessing = 'AudioProcessing',
  /**
   * This category can be used for input, output, or both. For example, use this category to route audio to both a USB device and a set of headphones. Use of this category requires a more detailed knowledge of, and interaction with, the capabilities of the available audio routes.
   * @important
   * Route changes can invalidate part or all of your multi-route configuration. When using the multiRoute category, it is essential that you register to observe routeChangeNotification notifications and update your configuration as necessary.
   */
  MultiRoute = 'MultiRoute',
}

/**
 * Categories of AV Audio sessions.
 * Refer to Apple Docs: https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct
 */
// export type AVAudioSessionCategory = typeof AVAudioSessionCategory[keyof typeof AVAudioSessionCategoryMap];

export enum AVAudioSessionMode {
  /**
   * Default mode, no specific optimizations applied. You can use this mode with every audio session category.
   */
  Default = 'Default',
  /**
   * Use this mode for Voice over IP (VoIP) apps that use the playAndRecord category. When you set this mode, the session optimizes the device’s tonal equalization for voice and reduces the set of allowable audio routes to only those appropriate for voice chat.
   * Using this mode has the side effect of enabling the allowBluetooth category option.
   * For apps that use voice or video chat, also use the Voice-Processing I/O audio unit. The Voice-Processing I/O unit provides several features for VoIP apps, including automatic gain correction, adjustment of voice processing, and muting. See Voice-Processing I/O Unit for more information.
   * If an app uses the Voice-Processing I/O audio unit and hasn’t set its mode to one of the chat modes (voice, video, or game), the session sets the voiceChat mode implicitly. On the other hand, if the app had previously set its category to playAndRecord and its mode to videoChat or gameChat, instantiating the Voice-Processing I/O audio unit doesn’t cause the mode to change.
   */
  VoiceChat = 'VoiceChat',
  /**
   * Use this mode for video chat apps that use the playAndRecord or record categories. When you set this mode, the audio session optimizes the device’s tonal equalization for voice. It also reduces the set of allowable audio routes to only those appropriate for video chat.
   * Using this mode has the side effect of enabling the allowBluetooth category option.
   * For apps that use voice or video chat, also use the Voice-Processing I/O audio unit. The Voice-Processing I/O unit provides several features for VoIP apps, including automatic gain correction, adjustment of voice processing, and muting. See Voice-Processing I/O Unit for more information.
   * If an app uses the Voice-Processing I/O audio unit and hasn’t set its mode to one of the chat modes (voice, video, or game), the session sets the voiceChat mode implicitly. On the other hand, if the app had previously set its category to playAndRecord and its mode to videoChat or gameChat, instantiating the Voice-Processing I/O audio unit doesn’t cause the mode to change.
   */
  VideoChat = 'VideoChat',
  /**
   * This mode is valid only with the playAndRecord audio session category.
   * Don’t set this mode directly. If you need similar behavior and aren’t using a GKVoiceChat object, use voiceChat or videoChat instead.
   */
  GameChat = 'GameChat',
  /**
   * This mode is valid only with the record and playAndRecord audio session categories. On devices with more than one built-in microphone, the audio session uses the microphone closest to the video camera.
   * Use this mode to ensure that the system provides appropriate audio-signal processing.
   * Use AVCaptureSession in conjunction with the video recording mode for greater control of input and output routes. For example, setting the automaticallyConfiguresApplicationAudioSession property results in the session automatically choosing the best input route for the device and camera used.
   */
  VideoRecording = 'VideoRecording',
  /**
   * Use this mode for apps that need to minimize the amount of system-supplied signal processing to input and output signals. If recording on devices with more than one built-in microphone, the session uses the primary microphone.
   * For use with the playback, record, or playAndRecord audio session categories.
   * @important
   * This mode disables some dynamics processing on input and output signals, resulting in a lower-output playback level.
   */
  Measurement = 'Measurement',
  /**
   * When you set this mode, the audio session uses signal processing to enhance movie playback for certain audio routes such as built-in speaker or headphones. You may only use this mode with the playback audio session category.
   */
  MoviePlayback = 'MoviePlayback',
  /**
   * This mode is appropriate for apps that play continuous spoken audio, such as podcasts or audio books. Setting this mode indicates that your app should pause, rather than duck, its audio if another app plays a spoken audio prompt. After the interrupting app’s audio ends, you can resume your app’s audio playback.
   */
  SpokenAudio = 'SpokenAudio',
  /**
   * Setting this mode allows for different routing behaviors when your app connects to certain audio devices, such as CarPlay. An example of an app that uses this mode is a turn-by-turn navigation app that plays short prompts to the user.
   * Typically, apps of the same type also configure their sessions to use the duckOthers and interruptSpokenAudioAndMixWithOthers options.
   */
  VoicePrompt = 'VoicePrompt',
}

/**
 * Route Sharing Policies for AV Audio Sessions.
 * Refer to Apple Docs: https://developer.apple.com/documentation/avfaudio/avaudiosession/routesharingpolicy-swift.enum
 */
// export type AVAudioSessionCategory = typeof AVAudioSessionCategory[keyof typeof AVAudioSessionCategoryMap];

export enum AVAudioSessionRouteSharingPolicy {
  /**
   * A policy that follows standard rules for routing audio output.
   */
  Default = 'Default',
  /**
   * Apps that play long-form audio, such as music or audio books, can use this policy to play to the same output as the built-in Music and Podcast apps. Long-form audio apps should also use the Media Player framework to add support for remote control events and to provide Now Playing information.
   */
  LongFormAudio = 'LongFormAudio',
  /**
   * Apps that play long-form video content can use this policy to play to the same output as other long-form video apps, such as the built-in TV app.
   */
  LongFormVideo = 'LongFormVideo',
  /**
   * In iOS, the system sets this policy in cases where the user directs video to a wireless route using the route picker UI. Apps shouldn’t try to set this value directly.
   */
  Independent = 'Independent',
}

/**
 * Route Sharing Policies for AV Audio Sessions.
 * Refer to Apple Docs: https://developer.apple.com/documentation/avfaudio/avaudiosession/routesharingpolicy-swift.enum
 */
// export type AVAudioSessionCategory = typeof AVAudioSessionCategory[keyof typeof AVAudioSessionCategoryMap];

export enum AVAudioSessionCategoryOptions {
  /**
   * An option that indicates whether audio from this session mixes with audio from active sessions in other audio apps.
   */
  MixWithOthers = 'MixWithOthers',
  /**
   * An option that reduces the volume of other audio sessions while audio from this session plays.
   */
  DuckOthers = 'DuckOthers',
  /**
   * An option that determines whether to pause spoken audio content from other sessions when your app plays its audio.
   */
  InterruptSpokenAudioAndMixWithOthers = 'InterruptSpokenAudioAndMixWithOthers',
  /**
   * An option that determines whether Bluetooth hands-free devices appear as available input routes
   */
  AllowBluetooth = 'AllowBluetooth',
  /**
   * An option that determines whether you can stream audio from this session to Bluetooth devices that support the Advanced Audio Distribution Profile (A2DP).
   */
  AllowBluetoothA2DP = 'AllowBluetoothA2DP',
  /**
   * An option that determines whether you can stream audio from this session to AirPlay devices.
   */
  AllowAirPlay = 'AllowAirPlay',
  /**
   * An option that determines whether audio from the session defaults to the built-in speaker instead of the receiver.
   */
  DefaultToSpeaker = 'DefaultToSpeaker',
  /**
   * An option that indicates whether the system interrupts the audio session when it mutes the built-in microphone.
   */
  OverrideMutedMicrophoneInterruption = 'OverrideMutedMicrophoneInterruption',
}

/**
 * Mapping of AVAudioSessionCategory to compatible AVAudioSessionMode values.
 */
export type AVAudioSessionCompatibleModes = {
  Ambient: AVAudioSessionMode.Default | AVAudioSessionMode.SpokenAudio;
  SoloAmbient: AVAudioSessionMode.Default | AVAudioSessionMode.SpokenAudio;
  Playback:
    | AVAudioSessionMode.Default
    | AVAudioSessionMode.MoviePlayback
    | AVAudioSessionMode.SpokenAudio
    | AVAudioSessionMode.Measurement;
  Record:
    | AVAudioSessionMode.Default
    | AVAudioSessionMode.VideoRecording
    | AVAudioSessionMode.VideoChat
    | AVAudioSessionMode.Measurement
    | AVAudioSessionMode.SpokenAudio;
  PlayAndRecord:
    | AVAudioSessionMode.Default
    | AVAudioSessionMode.Measurement
    | AVAudioSessionMode.SpokenAudio
    | AVAudioSessionMode.VoiceChat
    | AVAudioSessionMode.VideoChat
    | AVAudioSessionMode.GameChat
    | AVAudioSessionMode.VideoRecording;
  AudioProcessing: AVAudioSessionMode.Default | AVAudioSessionMode.SpokenAudio;
  MultiRoute: AVAudioSessionMode.Default | AVAudioSessionMode.SpokenAudio;
};

export type AVAudioSessionStatus = {
  isOtherAudioPlaying: boolean
  category: AVAudioSessionCategory,
  mode: AVAudioSessionMode
  categoryOptions: AVAudioSessionCategoryOptions[],
  routeSharingPolicy?: AVAudioSessionRouteSharingPolicy,
  prefersNoInterruptionsFromSystemAlerts?: boolean
  prefersInterruptionOnRouteDisconnect?: boolean
  allowHapticsAndSystemSoundsDuringRecording?: boolean
}

/**
 * Types of volume on Android.
 * @export
 */
export type AndroidVolumeTypes =
  | 'music'
  | 'call'
  | 'system'
  | 'ring'
  | 'alarm'
  | 'notification';

/**
 * The configuration settings for setting the volume.
 * @export
 * @interface VolumeManagerSetVolumeConfig
 * @property {boolean} playSound - Indicates whether to play a sound on volume change. Default is false.
 * @property {AndroidVolumeTypes} type - Defines the type of volume to change. Only applicable to Android. Default is 'music'.
 * @property {boolean} showUI - Indicates whether to show the native volume UI. Default is false.
 */
export interface VolumeManagerSetVolumeConfig {
  playSound?: boolean;
  type?: AndroidVolumeTypes;
  showUI?: boolean;
}

/**
 * Represents the volume result.
 * @export
 * @interface VolumeResult
 * @property {number} volume - The volume level. Both for iOS and Android. Defaults to music.
 * @property {AndroidVolumeTypes} type - The type of volume. Android only.
 */
export interface VolumeResult {
  // Both iOS and Android (defaults to type music for android)
  volume: number;
  // Android only
  type?: AndroidVolumeTypes;
}

// Accepted Ringer Mode values
export const RINGER_MODE = {
  silent: 0,
  vibrate: 1,
  normal: 2,
} as const;

/**
 * Represents the ringer mode.
 * @export
 * @typedef {0 | 1 | 2} RingerModeType
 */
export type RingerModeType = (typeof RINGER_MODE)[keyof typeof RINGER_MODE];

/**
 * Modes for the device.
 * @export
 * @enum {string}
 */
export enum Mode {
  SILENT = 'SILENT',
  VIBRATE = 'VIBRATE',
  NORMAL = 'NORMAL',
  MUTED = 'MUTED',
}

/**
 * Represents the silent status of the ringer.
 * @export
 * @interface RingerSilentStatus
 * @property {boolean} status - Indicates if the ringer is silent.
 * @property {Mode} mode - The current mode of the device.
 */
export type RingerSilentStatus = {
  status: boolean;
  mode: Mode;
};

/**
 * Called when there is a ringer event.
 * @export
 * @callback
 * @param {RingerSilentStatus} event - The ringer event.
 */
export type RingerEventCallback = (event: RingerSilentStatus) => void;

/**
 * Represents a subscription to an event that has a method to remove it.
 * @export
 * @interface EmitterSubscriptionNoop
 */
export interface EmitterSubscriptionNoop {
  remove(): void;
}
