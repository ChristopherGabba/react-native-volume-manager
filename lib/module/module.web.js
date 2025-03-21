"use strict";

// Track if warning has been shown
let hasWarned = false;

// Helper function to show warning only in development
const warnOnWeb = () => {
  if (__DEV__ && !hasWarned) {
    console.warn('react-native-volume-manager is not functional on the web. While the package exports no-op methods for web usage, allowing you to include it without any issues, these methods have no actual effect. This warning is only visible in development mode.');
    hasWarned = true;
  }
};
const noopEmitterSubscription = {
  remove: () => {
    // noop
  }
};

// Base volume result for web platform
const defaultVolumeResult = {
  volume: 1
};
export async function getRingerMode() {
  warnOnWeb();
  return undefined;
}
export async function setRingerMode(_mode) {
  warnOnWeb();
  return undefined;
}
export async function activateAudioSession({}) {
  warnOnWeb();
  return undefined;
}
export async function deactivateAudioSession({}) {
  warnOnWeb();
  return undefined;
}
export async function configureAudioSession({}) {
  warnOnWeb();
  return undefined;
}
export async function getAudioSessionStatus() {
  warnOnWeb();
  return undefined;
}
export async function checkDndAccess() {
  warnOnWeb();
  return undefined;
}
export async function requestDndAccess() {
  warnOnWeb();
  return undefined;
}
export async function getVolume() {
  warnOnWeb();
  return defaultVolumeResult;
}
export async function setVolume(_value, _config = {}) {
  warnOnWeb();
  return undefined;
}
export async function showNativeVolumeUI(_config) {
  warnOnWeb();
  return undefined;
}
export function addVolumeListener(_callback) {
  warnOnWeb();
  return noopEmitterSubscription;
}
export const addSilentListener = _callback => {
  warnOnWeb();
  return noopEmitterSubscription;
};
export const setNativeSilenceCheckInterval = _value => {
  warnOnWeb();
  // noop
};
export const isAndroidDeviceSilent = () => {
  warnOnWeb();
  return Promise.resolve(null);
};
export const addRingerListener = _callback => {
  warnOnWeb();
  return noopEmitterSubscription;
};
export const removeRingerListener = _listener => {
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
  requestDndAccess
};
export default VolumeManager;
//# sourceMappingURL=module.web.js.map