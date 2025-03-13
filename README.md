![React Native Volume Manager Ringer Mute Silent Switch](gh-banner.png)

# react-native-volume-manager

Take control of system volume on **iOS** and **Android** with this powerful native package. Seamlessly adjust volume levels, track changes, and design custom sliders for a tailored user experience. With an intuitive API, you can access the current volume, detect the silent switch on iOS, and monitor ringer mode changes on Android.

| ![React Native Volume Manager](ios-preview.gif) | ![React Native Volume Manager](android-preview.gif) |
| ----------------------------------------------- | --------------------------------------------------- |

## Features

- Adjust system volume
- Monitor volume changes
- Suppress default volume UI
- Access current volume level
- Detect silent switch status (iOS)
- Enable/disable audio session and change category (iOS)
- Track ringer mode changes (Android)

## Installation

Using npm:

```sh
npm install react-native-volume-manager
```

Using Yarn:

```sh
yarn add react-native-volume-manager
```

New and old architecture are supported. React Native 0.76+ is required. iOS 15+ is required.
If you are using Expo, make sure to use expo-build-properties to set the minimum iOS version to 15. (Default in SDK 52+). Kotlin 1.8+ is required. No support for older versions!

```json
[
  "expo-build-properties",
  {
    "android": {
      "compileSdkVersion": 34,
      "targetSdkVersion": 34,
      "buildToolsVersion": "34.0.0"
    },
    "ios": {
      "deploymentTarget": "15.2"
    }
  }
]
```

> Note: This library is incompatible with Expo Go. To use it, you can install a [custom development client](https://docs.expo.dev/develop/development-builds/create-a-build/).

## Simulators / Emulators

- iOS: The AVAudioSession API provides control over audio behaviors and settings on iOS devices. However, hardware-specific features like volume control and audio route selection are unavailable on macOS, where the simulator runs. Consequently, this package only works on a physical device, as events won’t trigger in the simulator.

- Android: It runs on both a real device (API level 21+) and the emulator (API level 33+).

## Web

This library is not functional on the web. While the package exports no-op methods for web usage, allowing you to include it without any issues, these methods have no actual effect.

## Usage

All methods are available under the `VolumeManager` namespace or can be imported directly. Here are some examples:

```tsx
import { VolumeManager } from 'react-native-volume-manager';

// Disable the native volume toast globally (iOS, Android)
VolumeManager.showNativeVolumeUI({ enabled: true });

// Set the volume (value between 0 and 1)
await VolumeManager.setVolume(0.5);

// Get the current volume async
const { volume } = await VolumeManager.getVolume();

// Listen to volume changes
const volumeListener = VolumeManager.addVolumeListener((result) => {
  console.log(result.volume);

  // On Android, additional volume types are available:
  // music, system, ring, alarm, notification
});

// Remove the volume listener
volumeListener.remove();
```

## iOS Audio Session Management

This section provides methods related to AVAudioSession on iOS. For example:

```tsx
import { VolumeManager } from 'react-native-volume-manager';

// Configure the audio session for some specific use case

// For recording a video with a camera 
await VolumeManager.configureAVAudioSession({
    category: AVAudioSessionCategory.PlayAndRecord,
    mode: AVAudioSessionMode.VideoRecording,
    policy: AVAudioSessionPolicy.Default,
    categoryOptions: [AVAudioSessionCategoryOptions.MixWithOthers],
    prefersNoInterruptionFromSystemAlerts: true
})
  
// Or for controlling a video session
await VolumeManager.configureAVAudioSession({
    category: AVAudioSessionCategory.Playback,
    mode: AVAudioSessionMode.MediaPlayback,
    policy: AVAudioSessionPolicy.Default,
    categoryOptions: [AVAudioSessionCategoryOptions.MixWithOthers],
    prefersNoInterruptionFromSystemAlerts: true
})

// Or for enabling the audio session and ignoring the silent switch 
// (note have to activate the session after configuration)
await VolumeManager.configureAVAudioSession({
    category: AVAudioSessionCategory.Playback,
    mode: AVAudioSessionMode.Default,
    policy: AVAudioSessionPolicy.Default,
    prefersNoInterruptionFromSystemAlerts: true
})

// Activate the session
await VolumeManager.setActive(true, true); // Activate async

// Deactive session when complete
await VolumeManager.setActive(false, true); // Deactivate async, non-blocking

```

## iOS Mute Switch Listener

To monitor the mute switch status on iOS, you can use the following:

```tsx
import { VolumeManager } from 'react-native-volume-manager';

const silentListener = VolumeManager.addSilentListener((status) => {
  console.log(status.isMuted);
  console.log(status.initialQuery);
});

// Remove the silent listener
silentListener.remove();
```

## Android Ringer Listener

To listen to ringer mode changes on Android, you can use the following:

```tsx
import { VolumeManager } from 'react-native-volume-manager';

const ringerListener = VolumeManager.addRingerListener((status) => {
  console.log(status.ringerMode);
});

// Remove the ringer listener
VolumeManager.removeRingerListener(ringerListener);
```

## useSilentSwitch hook

`useSilentSwitch` is a custom React hook that monitors the silent switch on an iOS device. The nativeIntervalCheck parameter (optional) allows you to set the interval at which the silent switch status is checked in seconds. If the parameter is not provided, a default interval is used (2.0).

The hook returns an object with two properties: isMuted (which represents the ring/mute switch position) and initialQuery (which indicates whether the reported status is the first one after the application launch). On non-iOS platforms or for the first call, the hook returns undefined. This hook is only applicable to iOS.

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useSilentSwitch } from 'react-native-volume-manager';

export default function App() {
  const status = useSilentSwitch();

  return (
    <View>
      <Text>Silent Switch Status:</Text>
      {status ? (
        <View>
          <Text>Is Muted: {status.isMuted ? 'YES' : 'NO'}</Text>
          <Text>Is Initial Query: {status.initialQuery ? 'YES' : 'NO'}</Text>
        </View>
      ) : (
        <Text>Fetching...</Text>
      )}
    </View>
  );
}
```

In this example, `useSilentSwitch` is used to monitor the status of the silent switch on iOS devices. The status of the switch (`isMuted`) and whether it's the initial query (`initialQuery`) are displayed. If the status is not available yet, "Fetching..." is displayed.

### useRingerMode Hook

You can use the `useRingerMode` hook to get and set the ringer mode on Android:

```tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import {
  useRingerMode,
  RINGER_MODE,
  RingerModeType,
} from 'react-native-volume-manager';

const modeText = {
  [RINGER_MODE.silent]: 'Silent',
  [RINGER_MODE.normal]: 'Normal',
  [RINGER_MODE.vibrate]: 'Vibrate',
};

export default function App() {
  const { mode, error, setMode } = useRingerMode();

  return (
    <View>
      <Text>Ringer Mode: {mode !== undefined ? modeText[mode] : null}</Text>

      <View>
        <Button title="Silent" onPress={() => setMode(RINGER_MODE.silent)} />
        <Button title="Normal" onPress={() => setMode(RINGER_MODE.normal)} />
        <Button title="Vibrate" onPress={() => setMode(RINGER_MODE.vibrate)} />
      </View>

      <View>
        <Text>{error?.message}</Text>
      </View>
    </View>
  );
}
```

# API

The `VolumeManager` API provides an interface for controlling and observing volume settings on iOS and Android devices. The API is designed to offer a consistent experience across both platforms where possible, with some platform-specific functionality provided where necessary.

---
## Cross-platform methods:

#### **`showNativeVolumeUI(config: { enabled: boolean }): Promise<void>`**

Controls the visibility of the native volume UI when volume changes occur.

- **Parameters**:
  - `enabled` (`boolean`): Whether to show (`true`) or hide (`false`) the native volume UI.

<br/>

- **Description**:
  This asynchronous function allows you to control whether the native volume UI should be shown when the volume changes. You can use this to show or hide the volume overlay UI on the device.

<br/>

- **Example**:
  ```typescript
  // Show the native volume UI
  await VolumeManager.showNativeVolumeUI({ enabled: true });

  // Hide the native volume UI
  await VolumeManager.showNativeVolumeUI({ enabled: false });
  ```

#### **`getVolume(): Promise<void>`**

Asynchronously fetches the current volume level.

<br/>

- **Returns**: 
  `Promise<VolumeResult>`: A promise that resolves to an object containing the current volume information.
  
<br/>

- **Description**:
  This asynchronous function allows you to retrieve the current volume level of the device. The returned promise resolves to a `VolumeResult` object that contains information about the current volume state.

<br/>

- **Example**:
  ```typescript
  // Get the current volume
  const volumeInfo = await VolumeManager.getVolume();
  console.log(`Current volume: ${volumeInfo.volume}`);
  ```

#### **`setVolume(value: number): Promise<void>`**

Allows you to programmatically adjust the device's volume level.

- **Parameters**:
  - `value` (`number`): The volume level to set, between 0 and 1.
  - `config` (`VolumeManagerSetVolumeConfig`, optional): Additional configuration options.

<br/>

- **Returns**: 
  - `Promise<void>`: A promise that resolves when the volume has been set.

<br/>

- **Description**:
  This asynchronous function allows you to programmatically change the device's volume level. The value parameter should be a number between 0 (muted) and 1 (maximum volume). The optional config parameter allows you to specify additional settings for the volume adjustment.

<br/>

- **Example**:
  ```typescript
  // Set volume to 50%
  await VolumeManager.setVolume(0.5);
  
  // Set volume to 75% with additional configuration
  await VolumeManager.setVolume(0.75, { showUI: true });
  ```

#### **`addVolumeListener(callback: (result: VolumeResult) => void): EmitterSubscription`**

Adds a listener that will be called when the device's volume changes.

- **Parameters**:
  - `callback` (`(result: VolumeResult) => void`): A function that will be called when the volume changes.

<br/>

- **Returns**: 
  - `EmitterSubscription`: A subscription object that can be used to remove the listener.

<br/>

- **Description**:
  This function allows you to register a callback that will be invoked whenever the device's volume changes. The callback receives a `VolumeResult` object containing the updated volume information. The function returns an `EmitterSubscription` object that can be used to remove the listener when it's no longer needed.

<br/>

- **Example**:
  ```typescript
  // Add a volume change listener
  const subscription = VolumeManager.addVolumeListener((result) => {
    console.log(`Volume changed to: ${result.volume}`);
  });
  
  // Later, when you want to stop listening
  subscription.remove();
  ```
---

## iOS-only Methods

#### **`configureAVAudioSession({category: AVAudioSessionCategory, mode: AVAudioSessionMode, policy: AVAudioSessionRouteSharingPolicy, categoryOptions: AVAudioSessionCategoryOptions, prefersNoInterruptionFromSystemAlerts?: boolean, prefersInterruptionOnRouteDisconnect?: boolean, allowHapticsAndSystemSoundsDuringRecording?: boolean }): Promise<void>`**

Configures the AVAudioSession category with compatible AVAudioSession modes and allows further customization of audio session properties.

- **Parameters**:
  - `category` (`AVAudioSessionCategory`): The category of the audio session (e.g., `Playback`, `Record`, `PlayAndRecord`).
  - `mode` (`AVAudioSessionMode`): The type-safe compatible mode of the audio session (e.g., `VideoRecording`, `Measurement`).
  - `policy` (`AVAudioSessionRouteSharingPolicy`): The route sharing policy (e.g., `Default`, `LongFormAudio`).
  - `options` (`AVAudioSessionCategoryOptions`): Options for configuring the audio session (e.g., `MixWithOthers`, `AllowBluetoothA2DP`).
  - `prefersNoInterruptionFromSystemAlerts` (`boolean?`): If `true`, prevents interruptions from system alerts.
  - `prefersInterruptionOnRouteDisconnect` (`boolean?`): If `true`, triggers interruptions when the route disconnects.
  - `allowHapticsAndSystemSoundsDuringRecording` (`boolean?`): If `true`, allows system sounds during recording.

<br/>

- **Description**:
  Configures the AVAudioSession with specific settings, such as the category, mode, and route sharing policy. This method allows for fine-tuning of audio behavior based on your app’s needs.

<br/>

- **Example**:
  ```typescript
  await VolumeManager.configureAVAudioSession({
    category: AVAudioSessionCategory.Playback,
    mode: AVAudioSessionMode.VideoRecording,
    policy: AVAudioSessionRouteSharingPolicy.Default,
    options: [AVAudioSessionCategoryOptions.MixWithOthers],
  });
  ```

#### **`getAVAudioSessionStatus(): Promise<AVAudioSessionStatus>`**

Returns the current status of the AVAudioSession.

<br/>

- **Description**:
  Configures the AVAudioSession with specific settings, such as the category, mode, and route sharing policy. This method allows for fine-tuning of audio behavior based on your app’s needs.

<br/>

- **Example**:
  ```typescript
  const { 
    category, 
    mode, 
    policy, 
    options, 
    prefersNoInterruptionFromSystemAlerts,
    prefersInterruptionOnRouteDisconnect, 
    allowHapticsAndSystemSoundsDuringRecording
  } = await VolumeManager.getAVAudioSessionStatus();

  console.log("Current AVAudioSessionCategory is", category)
  ```


#### **`setActive(value: boolean, async: boolean): Promise<void>`**

Activates or deactivates the audio session. Deactivating the session reactivates any sessions that were interrupted by this one.

- **Parameters**:
  - `value` (`boolean`): Whether to activate (`true`) or deactivate (`false`) the audio session.
  - `async` (`boolean`): If `true`, the action is performed asynchronously.

<br/>

- **Description**:
  This method either activates or deactivates the audio session. Deactivating the session will also restore any interrupted sessions.

<br/>

- **Example**:
  ```typescript
  // Activate audio session
  await VolumeManager.setActive(true, true);
  
  // Deactivate audio session
  await VolumeManager.setActive(false, false);
  ```

#### **`setNativeSilenceCheckInterval(value: number)`**

Sets the interval at which the native system checks the state of the silent switch.

- **Parameters**:
  - `value` (`number`): The interval in milliseconds to check the silent switch.

<br/>

- **Description**:
  Sets the frequency at which the system checks the silent switch's state. This can help ensure that your app reacts promptly to changes in the device's silent mode.

<br/>

- **Example**:
  ```typescript
  // Set silent switch check interval to 1000ms (1 second)
  await VolumeManager.setNativeSilenceCheckInterval(1000);
  ```

#### **`addSilentListener(callback: RingMuteSwitchEventCallback): EmitterSubscription | EmitterSubscriptionNoop`**

Adds a listener that will be called when the silent switch state changes.

- **Parameters**:
  - `callback` (`RingMuteSwitchEventCallback`): The function to be called when the silent switch changes state.

<br/>

- **Description**:
  Adds a listener that responds to changes in the device's silent mode. The callback will be triggered whenever the silent mode is toggled.

<br/>

- **Example**:
  ```typescript
  // Add listener for silent mode changes
  useEffect(() => {
    const subscription = VolumeManager.addSilentListener((state) => {
      console.log('Silent mode state changed:', state);
    });
  
  // Remove listener (optional)
    return ()=> subscription.remove();
  },[])

  ```



#### **Deprecated Method (Replaced with `configureAVAudioSession`)**

---

#### **`setCategory(value: AVAudioSessionCategory, mixWithOthers?: boolean): Promise<void>`**

Sets the category for the AVAudioSession in your iOS app. `mixWithOthers` is an optional parameter that, if `true`, allows your audio to mix with audio from other apps.

- **Parameters**:
  - `value` (`AVAudioSessionCategory`): The category of the audio session (e.g., `Playback`, `Record`).
  - `mixWithOthers` (`boolean?`): If `true`, allows mixing with other audio.

<br/>

- **Description**:
  Sets the audio session category, which determines how your app interacts with other audio. This method is deprecated and has been replaced with `configureAVAudioSession`.

<br/>

- **Example**:
  ```typescript
  await VolumeManager.setCategory(AVAudioSessionCategory.Playback, true);
  ```

#### **`setMode(mode: AVAudioSessionMode): Promise<void>`**

Sets the mode for the AVAudioSession in your iOS app.

- **Parameters**:
  - `mode` (`AVAudioSessionMode`): The mode of the audio session (e.g., `VideoRecording`).

<br/>

- **Description**:
  Sets the audio session mode. This method is deprecated and has been replaced with `configureAVAudioSession`.

<br/>

- **Example**:
  ```typescript
  await VolumeManager.setMode(AVAudioSessionMode.VideoRecording);
  ```

#### **`enable(enabled: boolean, async: boolean): Promise<void>`**

Enable or disable the audio session.

- **Parameters**:
  - `enabled` (`boolean`): Whether to enable (`true`) or disable (`false`) the audio session.
  - `async` (`boolean`): Whether the action should be performed asynchronously.

<br/>

- **Description**:
  Enabling the audio session sets the session's category to `Ambient`, allowing it to mix with other audio from other apps. Disabling it will prevent audio mixing.

<br/>

- **Example**:
  ```typescript
  // Enable audio session
  await VolumeManager.enable(true, true);  
  
  // Disable audio session
  await VolumeManager.enable(false, false); 
  ```

#### **`enableInSilenceMode(value: boolean): Promise<void>`**

If `value` is true, this function allows your app to play audio even when the device is in silent mode. When `value` is false, audio will not play in silent mode. This sets the AVAudioSessionCategory to `Playback` under the hood and activates the session.

- **Parameters**:
  - `value` (`boolean`): If `true`, audio will play even when the device is in silent mode. If `false`, it will not.

<br/>

- **Description**:
  Enables or disables audio playback in silent mode. Use this if you want your app to play audio regardless of the device’s silent switch.

<br/>

- **Example**:
  ```typescript
  // Enable audio in silent mode
  await VolumeManager.enableInSilenceMode(true);  
  
  // Disable audio in silent mode
  await VolumeManager.enableInSilenceMode(false); 
  ```

---


## Android-only methods:

#### **`getRingerMode(): Promise<RingerModeType | undefined>`**

Asynchronously fetches the current ringer mode of the device (silent, vibrate, or normal).

- **Description**:
  Retrieves the current ringer mode of the device, which can be `silent`, `vibrate`, or `normal`.

- **Example**:
  ```typescript
  const ringerMode = await VolumeManager.getRingerMode();
  console.log("Current ringer mode:", ringerMode);
  ```

#### **`setRingerMode(mode: RingerModeType): Promise<RingerModeType | undefined>`**

Sets the device's ringer mode.

- **Parameters**:
  - `mode` (`RingerModeType`): The ringer mode to set (`silent`, `vibrate`, or `normal`).

- **Description**:
  Changes the ringer mode of the device. You can set the mode to `silent`, `vibrate`, or `normal`.

- **Example**:
  ```typescript
  // Set ringer mode to silent
  await VolumeManager.setRingerMode('silent');  
  
  // Set ringer mode to vibrate
  await VolumeManager.setRingerMode('vibrate'); 
  
  // Set ringer mode to normal
  await VolumeManager.setRingerMode('normal'); 
  ```

#### **`isAndroidDeviceSilent(): Promise<boolean | null>`**

Asynchronously checks if the device is in a silent state (including silent mode, vibrate mode, or muted volume / do not disturb mode).

- **Description**:
  Returns a `true` if the device is in silent mode, `false` if it's not, and `null` if the device's silent status can't be determined.

- **Example**:
  ```typescript
  const isSilent = await VolumeManager.isAndroidDeviceSilent();
  console.log("Is the device silent?", isSilent);
  ```

#### **`addRingerListener(callback: RingerEventCallback): EmitterSubscription | EmitterSubscriptionNoop`**

Adds a listener that will be called when the ringer mode changes.

- **Parameters**:
  - `callback` (`RingerEventCallback`): The function to be called when the ringer mode changes.

- **Description**:
  Registers a listener for changes in the ringer mode, so your app can react when the device switches between `silent`, `vibrate`, or `normal`.

- **Example**:
  ```typescript
  // Add listener for ringer mode changes
  useEffect(() => {
    const subscription = VolumeManager.addRingerListener((mode) => {
      console.log('Ringer mode changed:', mode);
    });

    // Cleanup listener when component unmounts
    return () => subscription.remove();
  }, []);
  ```

#### **`removeRingerListener(listener: EmitterSubscription | EmitterSubscriptionNoop): void`**

Removes a previously added ringer mode listener.

- **Parameters**:
  - `listener` (`EmitterSubscription | EmitterSubscriptionNoop`): The listener to remove.

- **Description**:
  Removes the ringer mode listener that was previously added, stopping the listener from being triggered.

- **Example**:
  ```typescript
  // Remove listener
  VolumeManager.removeRingerListener(subscription);
  ```

#### **`checkDndAccess(): Promise<boolean | undefined>`**

Asynchronously checks if 'Do Not Disturb' access has been granted.

- **Description**:
  This method checks whether your app has the necessary permissions to access the 'Do Not Disturb' (DND) mode on the device.

- **Example**:
  ```typescript
  const hasDndAccess = await VolumeManager.checkDndAccess();
  console.log("Do Not Disturb access granted:", hasDndAccess);
  ```

#### **`requestDndAccess(): Promise<boolean | undefined>`**

Initiates a request for 'Do Not Disturb' access.

- **Description**:
  Requests the necessary permissions for accessing 'Do Not Disturb' (DND) mode.

- **Example**:
  ```typescript
  const dndAccessGranted = await VolumeManager.requestDndAccess();
  console.log("Do Not Disturb access granted:", dndAccessGranted);
  ```
___

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## Special thanks

- Uses code from https://github.com/c19354837/react-native-system-setting
- Uses code from https://github.com/zmxv/react-native-sound
- Uses code from https://github.com/vitorverasm/react-native-silent
- Uses code from https://github.com/GeorgyMishin/react-native-silent-listener
- Fully implements https://github.com/reyhankaplan/react-native-ringer-mode

I used parts, or even the full source code, of these libraries (with plenty of adjustments and rewrites to TypeScript) to make this library work on Android and iOS and to have a mostly unified API that handles everything related to volume. Since many of the packages I found were unmaintained or abandoned and only solved some of the issues, I decided to create my own. I hope you don't mind it and find it useful!

## License

MIT
