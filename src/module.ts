// Importing modules
import {
  NativeModules,
  NativeEventEmitter,
  Platform,
  EmitterSubscription,
} from 'react-native';
import {
  AVAudioSessionCategory,
  EmitterSubscriptionNoop,
  RingMuteSwitchEventCallback,
  RingerEventCallback,
  RingerModeType,
  setCheckIntervalType,
  VolumeManagerSetVolumeConfig,
  VolumeResult,
  AVAudioSessionCompatibleModes,
  AVAudioSessionStatus,
  AVAudioSessionCompatibleCategoryOptions,
  AVAudioSessionDeactivationOptions,
  AVAudioSessionActivationOptions,
} from './types';
import { AVAudioSessionRouteSharingPolicy } from './types';

/**
 * Error message when 'react-native-volume-manager' package is not linked properly
 */
const LINKING_ERROR =
  `The package 'react-native-volume-manager' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

/**
 * Creates a proxy to throw an error when the module is not properly linked
 */
const VolumeManagerNativeModule = NativeModules.VolumeManager
  ? NativeModules.VolumeManager
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

/**
 * Creates a proxy for the silent listener to throw an error when the module is not properly linked
 */
const SilentListenerNativeModule = NativeModules.VolumeManagerSilentListener
  ? NativeModules.VolumeManagerSilentListener
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

/**
 * No operation emitter subscription
 */
const noopEmitterSubscription = {
  remove: () => {
    // noop
  },
} as EmitterSubscriptionNoop;

/**
 * Native event emitter for the Volume Manager
 */
const eventEmitter = new NativeEventEmitter(VolumeManagerNativeModule);
const silentEventEmitter = new NativeEventEmitter(SilentListenerNativeModule);

/**
 * Checks if the current platform is Android
 */
const isAndroid = Platform.OS === 'android';

/**
 * Returns the current ringer mode. Android only.
 * @returns {Promise<RingerModeType | undefined>} - The current ringer mode or undefined if not Android.
 */
export async function getRingerMode(): Promise<RingerModeType | undefined> {
  if (!isAndroid) {
    return;
  }

  return VolumeManagerNativeModule.getRingerMode();
}

/**
 * Sets the current device's ringer mode. Android only.
 * @param {RingerModeType} mode - The ringer mode to set
 * @returns {Promise<RingerModeType | undefined>} - The new ringer mode or undefined if not Android.
 */
export async function setRingerMode(
  mode: RingerModeType
): Promise<RingerModeType | undefined> {
  if (!isAndroid) {
    return;
  }

  return VolumeManagerNativeModule.setRingerMode(mode);
}

/**
 * Activates the AVAudioSession.
 * @platform iOS
 * @returns {Promise<void>} - Resolves when the operation has finished. If an error occurs, it will be rejected with an instance of Error. On Android, this function returns undefined.
 */
export async function activateAudioSession(
  options: AVAudioSessionActivationOptions = {
    runAsync: true,
  }
): Promise<void> {
  if (!isAndroid) {
    return VolumeManagerNativeModule.activateAudioSession(options.runAsync);
  }
  return undefined;
}

/**
 * Activates the AVAudioSession.
 * @platform iOS
 * @returns {Promise<void>} - Resolves when the operation has finished. If an error occurs, it will be rejected with an instance of Error. On Android, this function returns undefined.
 */
export async function deactivateAudioSession(
  options: AVAudioSessionDeactivationOptions = {
    restorePreviousSessionOnDeactivation: true,
    runAsync: true,
  }
): Promise<void> {
  if (!isAndroid) {
    return VolumeManagerNativeModule.deactivateAudioSession(
      options.restorePreviousSessionOnDeactivation,
      options.runAsync
    );
  }
  return undefined;
}

/**
 * Configures an AVAudioSession with the specified category, mode, and additional options.
 * This method is only available on iOS and ensures compatibility between categories and modes.
 * @platform iOS
 * @returns {Promise<void>}
 * @see {@link https://developer.apple.com/documentation/avfaudio/avaudiosession|Apple AVAudioSession Documentation}
 * @example
 * ```tsx
 *   // For recording a video
 *   await configureAudioSession({
 *     category: AVAudioSessionCategory.PlayAndRecord,
 *     mode: AVAudioSessionMode.VideoRecording,
 *     policy: AVAudioSessionPolicy.Default,
 *     categoryOptions: [AVAudioSessionCategoryOptions.MixWithOthers],
 *     prefersNoInterruptionFromSystemAlerts: true
 *   })
 *
 *  // For controlling a video session
 *   await configureAudioSession({
 *     category: AVAudioSessionCategory.Playback,
 *     mode: AVAudioSessionMode.MediaPlayback,
 *     policy: AVAudioSessionPolicy.Default,
 *     categoryOptions: [AVAudioSessionCategoryOptions.MixWithOthers],
 *     prefersNoInterruptionFromSystemAlerts: true
 *   })
 * ```
 */
export async function configureAudioSession<
  T extends AVAudioSessionCategory,
  M extends AVAudioSessionCompatibleModes[T],
  N extends AVAudioSessionCompatibleCategoryOptions[T]
>({
  category,
  mode,
  policy = AVAudioSessionRouteSharingPolicy.Default,
  categoryOptions,
  prefersNoInterruptionFromSystemAlerts = true,
  prefersInterruptionOnRouteDisconnect = true,
  allowHapticsAndSystemSoundsDuringRecording = true,
}: {
  /**
   * The AVAudioSession category to tell the iPhone how to manage audio for different customized scenarios.
   *  @type {"Ambient" | "SoloAmbient" | "Playback" | "Record" | "PlayAndRecord" | "MultiRoute"}
   * @default AVAudioSessionCompatibleModes.Ambient
   */
  category: T;
  /**
   * The compatible modes with the categories.
   * @type {"Default" | "VoiceChat" | "VideoChat" | "GameChat" | "VideoRecording" | "Measurement" | "MoviePlayback" | "SpokenAudio"}
   * @default AVAudioSessionCompatibleModes.Default
   */
  mode: M;
  /**
   * @type {"Default" | "LongFormAudio" | "LongFormVideo" | "Independent"}
   * @default AVAudioSessionRouteSharingPolicy.Default
   */
  policy?: AVAudioSessionRouteSharingPolicy;
  /**
   * @type {Array<"MixWithOthers" | "AllowBluetooth" | "AllowBluetoothA2DP" | "AllowAirPlay" | "DuckOthers" | "DefaultToSpeaker" | "InterruptSpokenAudioAndMixWithOthers" | "OverrideMutedMicrophoneInterruption">}
   *
   * The category options are kind of tricky. You can only set category options that are compatible with each category. The TS compiler should limit you to only combinations that are possible.
   *
   * @default [AVAudioSessionCategoryOptions.MixWithOthers,AVAudioSessionCategoryOptions.AllowBluetooth]
   */
  categoryOptions?: N[];
  /**
   * If true, prefers no interruptions from system alerts (iOS 14.0+).
   * @default true
   */
  prefersNoInterruptionFromSystemAlerts?: boolean;
  /**
   * If true, prefers interruption on route disconnect (iOS 16.0+).
   * @default true
   */
  prefersInterruptionOnRouteDisconnect?: boolean;
  /**
   * If true, allows haptics and system sounds while recording
   * @default true
   */
  allowHapticsAndSystemSoundsDuringRecording?: boolean;
}): Promise<void> {
  if (!isAndroid) {
    return VolumeManagerNativeModule.configureAudioSession(
      category,
      mode,
      policy,
      categoryOptions,
      prefersNoInterruptionFromSystemAlerts,
      prefersInterruptionOnRouteDisconnect,
      allowHapticsAndSystemSoundsDuringRecording
    );
  }
  return undefined;
}

/**
 * Retrieves the current AVAudioSession status from the native iOS side.
 * @returns {Promise<AVAudioSessionStatus>} A promise that resolves with the audio session status.
 */
export const getAudioSessionStatus = (): Promise<
  AVAudioSessionStatus | undefined
> => {
  if (isAndroid) return Promise.resolve(undefined);
  return new Promise((resolve, reject) => {
    VolumeManagerNativeModule.getAudioSessionStatus(
      (error: Error, status: AVAudioSessionStatus) => {
        if (error) {
          reject(error);
        } else {
          resolve(status);
        }
      }
    );
  });
};

/**
 * Checks if Do Not Disturb access is granted. Android only.
 * @returns {Promise<boolean | undefined>} - Do Not Disturb access status or undefined if not Android.
 */
export async function checkDndAccess(): Promise<boolean | undefined> {
  if (!isAndroid) {
    return;
  }

  return VolumeManagerNativeModule.checkDndAccess();
}

/**
 * Requests Do Not Disturb access. Android only.
 * @returns {Promise<boolean | undefined>} - Do Not Disturb access request result or undefined if not Android.
 */
export async function requestDndAccess(): Promise<boolean | undefined> {
  if (!isAndroid) {
    return;
  }

  return VolumeManagerNativeModule.requestDndAccess();
}

/**
 * Get the current device volume.
 * @returns {Promise<VolumeResult>} - Returns a promise that resolves to an object with the volume value.
 */
export async function getVolume(): Promise<VolumeResult> {
  return await VolumeManagerNativeModule.getVolume();
}

/**
 * Set the current device volume.
 * @param {number} value - The volume value to set. Must be between 0 and 1.
 * @param {VolumeManagerSetVolumeConfig} [config={}] - Additional configuration for setting the volume.
 * @returns {Promise<void>} - Resolves when the operation has finished
 */
export async function setVolume(
  value: number,
  config: VolumeManagerSetVolumeConfig = {}
): Promise<void> {
  config = Object.assign(
    {
      playSound: false,
      type: 'music',
      showUI: false,
    },
    config
  );
  return await VolumeManagerNativeModule.setVolume(value, config);
}

/**
 * Shows or hides the native volume UI.
 * @param {object} config - An object with a boolean property 'enabled' to show or hide the native volume UI
 * @returns {Promise<void>} - Resolves when the operation has

 finished
 */
export async function showNativeVolumeUI(config: {
  enabled: boolean;
}): Promise<void> {
  return VolumeManagerNativeModule.showNativeVolumeUI(config);
}

/**
 * Adds a listener for volume changes.
 * @param {(result: VolumeResult) => void} callback - Function to be called when volume changes
 * @returns {EmitterSubscription} - The subscription to the volume change event
 */
export function addVolumeListener(
  callback: (result: VolumeResult) => void
): EmitterSubscription {
  return eventEmitter.addListener('RNVMEventVolume', callback);
}

/**
 * Adds a silent mode listener. iOS only.
 * @param {RingMuteSwitchEventCallback} callback - Function to be called when silent mode changes
 * @returns {EmitterSubscription | EmitterSubscriptionNoop} - The subscription to the silent mode change event
 */
export const addSilentListener = (
  callback: RingMuteSwitchEventCallback
): EmitterSubscription | EmitterSubscriptionNoop => {
  if (Platform.OS === 'ios') {
    return silentEventEmitter.addListener('RNVMSilentEvent', callback);
  }

  return noopEmitterSubscription;
};

/**
 * Sets the interval for the native silence check. iOS only.
 * @param {number} value - The interval in milliseconds
 */
export const setNativeSilenceCheckInterval: setCheckIntervalType = (
  value: number
) => {
  if (Platform.OS === 'ios') {
    SilentListenerNativeModule.setInterval(value);
  }
};

/**
 * Checks if the device is in a silent state (including silent mode, vibrate mode, or muted volume). Android only.
 * @returns {Promise<boolean | null>} - Returns true if device is in a silent state, false otherwise, or null if not Android
 */
export const isAndroidDeviceSilent = (): Promise<boolean | null> => {
  if (isAndroid) {
    return SilentListenerNativeModule.isDeviceSilent();
  }
  return Promise.resolve(null);
};

/**
 * Adds a ringer mode listener. Android only.
 * @param {RingerEventCallback} callback - Function to be called when ringer mode changes
 * @returns {EmitterSubscription | EmitterSubscriptionNoop} - The subscription to the ringer mode change event
 */
export const addRingerListener = (
  callback: RingerEventCallback
): EmitterSubscription | EmitterSubscriptionNoop => {
  if (isAndroid) {
    SilentListenerNativeModule.registerObserver();
    return silentEventEmitter.addListener('RNVMSilentEvent', callback);
  }
  return noopEmitterSubscription;
};

/**
 * Removes a ringer mode listener. Android only.
 * @param {EmitterSubscription | EmitterSubscriptionNoop} listener - The ringer mode listener to remove
 */
export const removeRingerListener = (
  listener: EmitterSubscription | EmitterSubscriptionNoop
): void => {
  if (isAndroid) {
    SilentListenerNativeModule.unregisterObserver();
    listener && listener.remove();
  }
};

/**
 * Exported object that includes all functions
 */
export const VolumeManager = {
  addVolumeListener,
  getVolume,
  setVolume,
  showNativeVolumeUI,
  isAndroidDeviceSilent,
  addSilentListener,
  addRingerListener,
  removeRingerListener,
  setNativeSilenceCheckInterval,
  getRingerMode,
  setRingerMode,
  checkDndAccess,
  requestDndAccess,
  activateAudioSession,
  deactivateAudioSession,
  configureAudioSession,
  getAudioSessionStatus,
};

export default VolumeManager;
