import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useVideoPlayer, VideoSource, VideoView } from 'expo-video';
import {
  AVAudioSessionCategory,
  AVAudioSessionCategoryOptions,
  AVAudioSessionCompatibleCategoryOptions,
  AVAudioSessionCompatibleModes,
  AVAudioSessionMode,
  configureAudioSession,
  getAudioSessionStatus,
  VolumeManager,
} from 'react-native-volume-manager';
import { Dropdown } from 'react-native-element-dropdown';
import { useState } from 'react';

type AudioModalProps = {
  visible: boolean;
  onCloseButtonPressed: () => void;
};

type TestConfiguration = {
  key: number;
  title: string;
  configuration: {
    category: AVAudioSessionCategory;
    mode: AVAudioSessionCompatibleModes[AVAudioSessionCategory];
    categoryOptions: AVAudioSessionCompatibleCategoryOptions[AVAudioSessionCategory][];
    prefersNoInterruptionFromSystemAlerts: boolean;
  };
};

const testConfigurations: TestConfiguration[] = [
  {
    key: 0,
    title: 'Ambient - Default',
    configuration: {
      category: AVAudioSessionCategory.Ambient,
      mode: AVAudioSessionMode.Default,
      categoryOptions: [AVAudioSessionCategoryOptions.AllowBluetooth],
      prefersNoInterruptionFromSystemAlerts: true,
    },
  },
  {
    key: 1,
    title: 'Recording Audio',
    configuration: {
      category: AVAudioSessionCategory.Record,
      mode: AVAudioSessionMode.Default,
      categoryOptions: [AVAudioSessionCategoryOptions.AllowBluetooth],
      prefersNoInterruptionFromSystemAlerts: true,
    },
  },
  {
    key: 2,
    title: 'Movie Playback and Ducking Audio',
    configuration: {
      category: AVAudioSessionCategory.Playback,
      mode: AVAudioSessionMode.MoviePlayback,
      categoryOptions: [
        AVAudioSessionCategoryOptions.DuckOthers,
        AVAudioSessionCategoryOptions.AllowBluetooth,
      ],
      prefersNoInterruptionFromSystemAlerts: true,
    },
  },
  {
    key: 3,
    title: 'Playing And Recording Simultaneously',
    configuration: {
      category: AVAudioSessionCategory.PlayAndRecord,
      mode: AVAudioSessionMode.VideoRecording,
      categoryOptions: [AVAudioSessionCategoryOptions.AllowBluetooth],
      prefersNoInterruptionFromSystemAlerts: true,
    },
  },
  {
    key: 4,
    title: 'Movie Playback And Mixing',
    configuration: {
      category: AVAudioSessionCategory.Playback,
      mode: AVAudioSessionMode.MoviePlayback,
      categoryOptions: [AVAudioSessionCategoryOptions.AllowBluetooth],
      prefersNoInterruptionFromSystemAlerts: true,
    },
  },
];

/**
 * This component is used for testing the AVAudioSession.
 * In order to test this properly, we use the `expo-video` package with a patch that comments out
 * its internal AudioSession controls. This will allow us to test how our functions handle the audio.
 */
export const AVAudioSessionTestingModal = (props: AudioModalProps) => {
  const { visible, onCloseButtonPressed } = props;

  const bigBuckBunnySource: VideoSource =
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  const elephantsDreamSource: VideoSource =
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';

  const [selectedConfig, setSelectedConfig] = useState<TestConfiguration>(
    testConfigurations[0]
  );

  async function runConfigurationWithLogging(fn: () => Promise<void>) {
    const initialStatus = await getAudioSessionStatus();
    console.log('INITIAL_STATUS:', JSON.stringify(initialStatus, null, 4));

    await fn();

    const statusAfterConfiguration = await getAudioSessionStatus();
    console.log(
      'NEW_STATUS:',
      JSON.stringify(statusAfterConfiguration, null, 4)
    );
  }

  const player1 = useVideoPlayer(bigBuckBunnySource, (player) => {
    player.loop = true;
  });

  const player2 = useVideoPlayer(elephantsDreamSource, (player) => {
    player.loop = true;
  });

  function activateAudioSession() {
    VolumeManager.activateAudioSession({
      runAsync: true
    });
  }

  function terminateAudioSession() {
    VolumeManager.deactivateAudioSession({
      restorePreviousSessionOnDeactivation: true,
      runAsync: true
    });
  }

  return (
    <Modal
      visible={visible} 
      style={styles.modal}
      presentationStyle="overFullScreen"
    >
      {visible && (
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Select Audio Configuration</Text>
            <Dropdown
              style={[styles.dropdown]}
              data={testConfigurations}
              maxHeight={300}
              labelField="title"
              valueField="configuration"
              value={selectedConfig}
              onChange={(item: TestConfiguration) => {
                setSelectedConfig(item)
                runConfigurationWithLogging(() =>
                  configureAudioSession(item.configuration)
                );
              }}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={activateAudioSession}
            >
              <Text style={styles.buttonText}>Start Audio Session</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={terminateAudioSession}
            >
              <Text style={styles.buttonText}>Stop Audio Session</Text>
            </TouchableOpacity>
            <View style={styles.container}>
              <VideoView player={player1} style={styles.video} />
              <VideoView player={player2} style={styles.video} />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                player1.pause();
                player2.pause();
                onCloseButtonPressed();
              }}
            >
              <Text style={styles.buttonText}>Close Modal</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  dropdown: {
    width: '100%',
    alignSelf: 'center',
    borderRadius: 2,
    borderWidth: 1,
    padding: 10,
  },
  container: {
    padding: 20,
    paddingTop: 75,
    backgroundColor: '#F5F5F5',
  },
  video: {
    width: '100%',
    height: 200,
  },
  card: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#000',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
  },
});
