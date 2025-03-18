import { EmitterSubscription } from 'react-native';
import { AVAudioSessionCategory, EmitterSubscriptionNoop, RingMuteSwitchEventCallback, RingerEventCallback, RingerModeType, setCheckIntervalType, VolumeManagerSetVolumeConfig, VolumeResult, AVAudioSessionCompatibleModes, AVAudioSessionStatus, AVAudioSessionCompatibleCategoryOptions, AVAudioSessionDeactivationOptions, AVAudioSessionActivationOptions } from './types';
import { AVAudioSessionRouteSharingPolicy } from './types';
/**
 * Returns the current ringer mode. Android only.
 * @returns {Promise<RingerModeType | undefined>} - The current ringer mode or undefined if not Android.
 */
export declare function getRingerMode(): Promise<RingerModeType | undefined>;
/**
 * Sets the current device's ringer mode. Android only.
 * @param {RingerModeType} mode - The ringer mode to set
 * @returns {Promise<RingerModeType | undefined>} - The new ringer mode or undefined if not Android.
 */
export declare function setRingerMode(mode: RingerModeType): Promise<RingerModeType | undefined>;
/**
 * Activates the AVAudioSession.
 * @platform iOS
 * @returns {Promise<void>} - Resolves when the operation has finished. If an error occurs, it will be rejected with an instance of Error. On Android, this function returns undefined.
 */
export declare function activateAudioSession(options?: AVAudioSessionActivationOptions): Promise<void>;
/**
 * Activates the AVAudioSession.
 * @platform iOS
 * @returns {Promise<void>} - Resolves when the operation has finished. If an error occurs, it will be rejected with an instance of Error. On Android, this function returns undefined.
 */
export declare function deactivateAudioSession(options?: AVAudioSessionDeactivationOptions): Promise<void>;
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
export declare function configureAudioSession<T extends AVAudioSessionCategory, M extends AVAudioSessionCompatibleModes[T], N extends AVAudioSessionCompatibleCategoryOptions[T]>({ category, mode, policy, categoryOptions, prefersNoInterruptionFromSystemAlerts, prefersInterruptionOnRouteDisconnect, allowHapticsAndSystemSoundsDuringRecording, }: {
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
}): Promise<void>;
/**
 * Retrieves the current AVAudioSession status from the native iOS side.
 * @returns {Promise<AVAudioSessionStatus>} A promise that resolves with the audio session status.
 */
export declare const getAudioSessionStatus: () => Promise<AVAudioSessionStatus | undefined>;
/**
 * Checks if Do Not Disturb access is granted. Android only.
 * @returns {Promise<boolean | undefined>} - Do Not Disturb access status or undefined if not Android.
 */
export declare function checkDndAccess(): Promise<boolean | undefined>;
/**
 * Requests Do Not Disturb access. Android only.
 * @returns {Promise<boolean | undefined>} - Do Not Disturb access request result or undefined if not Android.
 */
export declare function requestDndAccess(): Promise<boolean | undefined>;
/**
 * Get the current device volume.
 * @returns {Promise<VolumeResult>} - Returns a promise that resolves to an object with the volume value.
 */
export declare function getVolume(): Promise<VolumeResult>;
/**
 * Set the current device volume.
 * @param {number} value - The volume value to set. Must be between 0 and 1.
 * @param {VolumeManagerSetVolumeConfig} [config={}] - Additional configuration for setting the volume.
 * @returns {Promise<void>} - Resolves when the operation has finished
 */
export declare function setVolume(value: number, config?: VolumeManagerSetVolumeConfig): Promise<void>;
/**
 * Shows or hides the native volume UI.
 * @param {object} config - An object with a boolean property 'enabled' to show or hide the native volume UI
 * @returns {Promise<void>} - Resolves when the operation has

 finished
 */
export declare function showNativeVolumeUI(config: {
    enabled: boolean;
}): Promise<void>;
/**
 * Adds a listener for volume changes.
 * @param {(result: VolumeResult) => void} callback - Function to be called when volume changes
 * @returns {EmitterSubscription} - The subscription to the volume change event
 */
export declare function addVolumeListener(callback: (result: VolumeResult) => void): EmitterSubscription;
/**
 * Adds a silent mode listener. iOS only.
 * @param {RingMuteSwitchEventCallback} callback - Function to be called when silent mode changes
 * @returns {EmitterSubscription | EmitterSubscriptionNoop} - The subscription to the silent mode change event
 */
export declare const addSilentListener: (callback: RingMuteSwitchEventCallback) => EmitterSubscription | EmitterSubscriptionNoop;
/**
 * Sets the interval for the native silence check. iOS only.
 * @param {number} value - The interval in milliseconds
 */
export declare const setNativeSilenceCheckInterval: setCheckIntervalType;
/**
 * Checks if the device is in a silent state (including silent mode, vibrate mode, or muted volume). Android only.
 * @returns {Promise<boolean | null>} - Returns true if device is in a silent state, false otherwise, or null if not Android
 */
export declare const isAndroidDeviceSilent: () => Promise<boolean | null>;
/**
 * Adds a ringer mode listener. Android only.
 * @param {RingerEventCallback} callback - Function to be called when ringer mode changes
 * @returns {EmitterSubscription | EmitterSubscriptionNoop} - The subscription to the ringer mode change event
 */
export declare const addRingerListener: (callback: RingerEventCallback) => EmitterSubscription | EmitterSubscriptionNoop;
/**
 * Removes a ringer mode listener. Android only.
 * @param {EmitterSubscription | EmitterSubscriptionNoop} listener - The ringer mode listener to remove
 */
export declare const removeRingerListener: (listener: EmitterSubscription | EmitterSubscriptionNoop) => void;
/**
 * Exported object that includes all functions
 */
export declare const VolumeManager: {
    addVolumeListener: typeof addVolumeListener;
    getVolume: typeof getVolume;
    setVolume: typeof setVolume;
    showNativeVolumeUI: typeof showNativeVolumeUI;
    isAndroidDeviceSilent: () => Promise<boolean | null>;
    addSilentListener: (callback: RingMuteSwitchEventCallback) => EmitterSubscription | EmitterSubscriptionNoop;
    addRingerListener: (callback: RingerEventCallback) => EmitterSubscription | EmitterSubscriptionNoop;
    removeRingerListener: (listener: EmitterSubscription | EmitterSubscriptionNoop) => void;
    setNativeSilenceCheckInterval: setCheckIntervalType;
    getRingerMode: typeof getRingerMode;
    setRingerMode: typeof setRingerMode;
    checkDndAccess: typeof checkDndAccess;
    requestDndAccess: typeof requestDndAccess;
    activateAudioSession: typeof activateAudioSession;
    deactivateAudioSession: typeof deactivateAudioSession;
    configureAudioSession: typeof configureAudioSession;
    getAudioSessionStatus: () => Promise<AVAudioSessionStatus | undefined>;
};
export default VolumeManager;
//# sourceMappingURL=module.d.ts.map