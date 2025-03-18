import type { AVAudioSessionCategory, EmitterSubscriptionNoop, RingMuteSwitchEventCallback, RingerEventCallback, RingerModeType, VolumeManagerSetVolumeConfig, VolumeResult, AVAudioSessionCompatibleModes, AVAudioSessionRouteSharingPolicy, AVAudioSessionStatus, AVAudioSessionCompatibleCategoryOptions } from './types';
export declare function getRingerMode(): Promise<RingerModeType | undefined>;
export declare function setRingerMode(_mode: RingerModeType): Promise<RingerModeType | undefined>;
export declare function activateAudioSession({}: {
    runAsync: boolean;
}): Promise<void>;
export declare function deactivateAudioSession({}: {
    restorePreviousSessionOnDeactivation: boolean;
    runAsync: boolean;
}): Promise<void>;
export declare function configureAudioSession<T extends AVAudioSessionCategory, M extends AVAudioSessionCompatibleModes[T], N extends AVAudioSessionCompatibleCategoryOptions[T]>({}: {
    category: T;
    mode: M;
    policy?: AVAudioSessionRouteSharingPolicy;
    categoryOptions?: N;
    prefersNoInterruptionFromSystemAlerts?: boolean;
    prefersInterruptionOnRouteDisconnect?: boolean;
    allowHapticsAndSystemSoundsDuringRecording?: boolean;
}): Promise<void>;
export declare function getAudioSessionStatus(): Promise<AVAudioSessionStatus | undefined>;
export declare function checkDndAccess(): Promise<boolean | undefined>;
export declare function requestDndAccess(): Promise<boolean | undefined>;
export declare function getVolume(): Promise<VolumeResult>;
export declare function setVolume(_value: number, _config?: VolumeManagerSetVolumeConfig): Promise<void>;
export declare function showNativeVolumeUI(_config: {
    enabled: boolean;
}): Promise<void>;
export declare function addVolumeListener(_callback: (result: VolumeResult) => void): EmitterSubscriptionNoop;
export declare const addSilentListener: (_callback: RingMuteSwitchEventCallback) => EmitterSubscriptionNoop;
export declare const setNativeSilenceCheckInterval: (_value: number) => void;
export declare const isAndroidDeviceSilent: () => Promise<boolean | null>;
export declare const addRingerListener: (_callback: RingerEventCallback) => EmitterSubscriptionNoop;
export declare const removeRingerListener: (_listener: EmitterSubscriptionNoop) => void;
export declare const VolumeManager: {
    addVolumeListener: typeof addVolumeListener;
    getVolume: typeof getVolume;
    setVolume: typeof setVolume;
    showNativeVolumeUI: typeof showNativeVolumeUI;
    isAndroidDeviceSilent: () => Promise<boolean | null>;
    addSilentListener: (_callback: RingMuteSwitchEventCallback) => EmitterSubscriptionNoop;
    addRingerListener: (_callback: RingerEventCallback) => EmitterSubscriptionNoop;
    removeRingerListener: (_listener: EmitterSubscriptionNoop) => void;
    setNativeSilenceCheckInterval: (_value: number) => void;
    getRingerMode: typeof getRingerMode;
    setRingerMode: typeof setRingerMode;
    checkDndAccess: typeof checkDndAccess;
    requestDndAccess: typeof requestDndAccess;
};
export default VolumeManager;
//# sourceMappingURL=module.web.d.ts.map