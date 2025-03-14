import type {
  AVAudioSessionCategory,
  EmitterSubscriptionNoop,
  RingMuteSwitchEventCallback,
  RingerEventCallback,
  RingerModeType,
  VolumeManagerSetVolumeConfig,
  VolumeResult,
  AVAudioSessionCompatibleModes,
  AVAudioSessionRouteSharingPolicy,
  AVAudioSessionStatus,
  AVAudioSessionCompatibleCategoryOptions,
} from './types';

// Track if warning has been shown
let hasWarned = false;

// Helper function to show warning only in development
const warnOnWeb = () => {
  if (__DEV__ && !hasWarned) {
    console.warn(
      'react-native-volume-manager is not functional on the web. While the package exports no-op methods for web usage, allowing you to include it without any issues, these methods have no actual effect. This warning is only visible in development mode.'
    );
    hasWarned = true;
  }
};

const noopEmitterSubscription: EmitterSubscriptionNoop = {
  remove: () => {
    // noop
  },
};

// Base volume result for web platform
const defaultVolumeResult: VolumeResult = {
  volume: 1,
};

export async function getRingerMode(): Promise<RingerModeType | undefined> {
  warnOnWeb();
  return undefined;
}

export async function setRingerMode(
  _mode: RingerModeType
): Promise<RingerModeType | undefined> {
  warnOnWeb();
  return undefined;
}

export async function activateAudioSession({}: {
  runAsync: boolean;
}): Promise<void> {
  warnOnWeb();
  return undefined;
}

export async function deactivateAudioSession({}: {
  restorePreviousSessionOnDeactivation: boolean;
  runAsync: boolean;
}): Promise<void> {
  warnOnWeb();
  return undefined;
}

export async function configureAudioSession<
  T extends AVAudioSessionCategory,
  M extends AVAudioSessionCompatibleModes[T],
  N extends AVAudioSessionCompatibleCategoryOptions[T]
>({}: {
  category: T;
  mode: M;
  policy?: AVAudioSessionRouteSharingPolicy;
  categoryOptions?: N;
  prefersNoInterruptionFromSystemAlerts?: boolean;
  prefersInterruptionOnRouteDisconnect?: boolean;
  allowHapticsAndSystemSoundsDuringRecording?: boolean;
}): Promise<void> {
  warnOnWeb();
  return undefined;
}

export async function getAudioSessionStatus(): Promise<
  AVAudioSessionStatus | undefined
> {
  warnOnWeb();
  return undefined;
}

export async function checkDndAccess(): Promise<boolean | undefined> {
  warnOnWeb();
  return undefined;
}

export async function requestDndAccess(): Promise<boolean | undefined> {
  warnOnWeb();
  return undefined;
}

export async function getVolume(): Promise<VolumeResult> {
  warnOnWeb();
  return defaultVolumeResult;
}

export async function setVolume(
  _value: number,
  _config: VolumeManagerSetVolumeConfig = {}
): Promise<void> {
  warnOnWeb();
  return undefined;
}

export async function showNativeVolumeUI(_config: {
  enabled: boolean;
}): Promise<void> {
  warnOnWeb();
  return undefined;
}

export function addVolumeListener(
  _callback: (result: VolumeResult) => void
): EmitterSubscriptionNoop {
  warnOnWeb();
  return noopEmitterSubscription;
}

export const addSilentListener = (
  _callback: RingMuteSwitchEventCallback
): EmitterSubscriptionNoop => {
  warnOnWeb();
  return noopEmitterSubscription;
};

export const setNativeSilenceCheckInterval = (_value: number): void => {
  warnOnWeb();
  // noop
};

export const isAndroidDeviceSilent = (): Promise<boolean | null> => {
  warnOnWeb();
  return Promise.resolve(null);
};

export const addRingerListener = (
  _callback: RingerEventCallback
): EmitterSubscriptionNoop => {
  warnOnWeb();
  return noopEmitterSubscription;
};

export const removeRingerListener = (
  _listener: EmitterSubscriptionNoop
): void => {
  warnOnWeb();
  // noop
};

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
};

export default VolumeManager;
