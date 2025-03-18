type AudioModalProps = {
    visible: boolean;
    onCloseButtonPressed: () => void;
};
/**
 * This component is used for testing the AVAudioSession.
 * In order to test this properly, we use the `expo-video` package with a patch that comments out
 * its internal AudioSession controls. This will allow us to test how our functions handle the audio.
 */
export declare const AVAudioSessionTestingModal: (props: AudioModalProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=AVAudioSessionTestingModal.d.ts.map