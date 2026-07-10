import { PersistentStorage } from "@/lib/PersistentStorage";
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

const clickSound = require("@/assets/sounds/click.wav");

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  hapticsEnabled: boolean;
  toggleHaptics: () => void;
  playClick: () => void;
  /** Physical thump for dice landing on a result. */
  impactHaptic: () => void;
  /** Celebratory buzz for pay day & wins. */
  successHaptic: () => void;
}

const SoundContext = createContext<SoundContextType>({
  soundEnabled: true,
  toggleSound: () => {},
  hapticsEnabled: true,
  toggleHaptics: () => {},
  playClick: () => {},
  impactHaptic: () => {},
  successHaptic: () => {},
});

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(() =>
    PersistentStorage.get("soundEnabled", true),
  );
  const [hapticsEnabled, setHapticsEnabled] = useState(() =>
    PersistentStorage.get("hapticsEnabled", true),
  );
  const player = useAudioPlayer(clickSound);

  const toggleSound = () =>
    setSoundEnabled((prev) => {
      PersistentStorage.set("soundEnabled", !prev);
      return !prev;
    });
  const toggleHaptics = () =>
    setHapticsEnabled((prev) => {
      PersistentStorage.set("hapticsEnabled", !prev);
      return !prev;
    });

  const playClick = () => {
    if (soundEnabled && player) {
      player.seekTo(0);
      player.play();
    }
  };

  const impactHaptic = () => {
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  const successHaptic = () => {
    if (hapticsEnabled)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        hapticsEnabled,
        toggleHaptics,
        playClick,
        impactHaptic,
        successHaptic,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}
