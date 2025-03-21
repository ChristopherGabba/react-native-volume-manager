"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VolumeManager = void 0;
exports.activateAudioSession = activateAudioSession;
exports.addSilentListener = exports.addRingerListener = void 0;
exports.addVolumeListener = addVolumeListener;
exports.checkDndAccess = checkDndAccess;
exports.configureAudioSession = configureAudioSession;
exports.deactivateAudioSession = deactivateAudioSession;
exports.default = void 0;
exports.getAudioSessionStatus = getAudioSessionStatus;
exports.getRingerMode = getRingerMode;
exports.getVolume = getVolume;
exports.removeRingerListener = exports.isAndroidDeviceSilent = void 0;
exports.requestDndAccess = requestDndAccess;
exports.setNativeSilenceCheckInterval = void 0;
exports.setRingerMode = setRingerMode;
exports.setVolume = setVolume;
exports.showNativeVolumeUI = showNativeVolumeUI;
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
async function getRingerMode() {
  warnOnWeb();
  return undefined;
}
async function setRingerMode(_mode) {
  warnOnWeb();
  return undefined;
}
async function activateAudioSession({}) {
  warnOnWeb();
  return undefined;
}
async function deactivateAudioSession({}) {
  warnOnWeb();
  return undefined;
}
async function configureAudioSession({}) {
  warnOnWeb();
  return undefined;
}
async function getAudioSessionStatus() {
  warnOnWeb();
  return undefined;
}
async function checkDndAccess() {
  warnOnWeb();
  return undefined;
}
async function requestDndAccess() {
  warnOnWeb();
  return undefined;
}
async function getVolume() {
  warnOnWeb();
  return defaultVolumeResult;
}
async function setVolume(_value, _config = {}) {
  warnOnWeb();
  return undefined;
}
async function showNativeVolumeUI(_config) {
  warnOnWeb();
  return undefined;
}
function addVolumeListener(_callback) {
  warnOnWeb();
  return noopEmitterSubscription;
}
const addSilentListener = _callback => {
  warnOnWeb();
  return noopEmitterSubscription;
};
exports.addSilentListener = addSilentListener;
const setNativeSilenceCheckInterval = _value => {
  warnOnWeb();
  // noop
};
exports.setNativeSilenceCheckInterval = setNativeSilenceCheckInterval;
const isAndroidDeviceSilent = () => {
  warnOnWeb();
  return Promise.resolve(null);
};
exports.isAndroidDeviceSilent = isAndroidDeviceSilent;
const addRingerListener = _callback => {
  warnOnWeb();
  return noopEmitterSubscription;
};
exports.addRingerListener = addRingerListener;
const removeRingerListener = _listener => {
  warnOnWeb();
  // noop
};
exports.removeRingerListener = removeRingerListener;
const VolumeManager = exports.VolumeManager = {
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
var _default = exports.default = VolumeManager;
//# sourceMappingURL=module.web.js.map