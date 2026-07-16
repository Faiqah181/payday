import { PersistentStorage } from "@/lib/PersistentStorage";
import { useAudioPlayer, type AudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import clickSound from "@/assets/sounds/bolkmar__fx-retro-videogame-click-menu.wav";
import diceRollSound from "@/assets/sounds/patrigrief__dice1.wav";
import cashRegisterSound from "@/assets/sounds/disman_cash-register-chching.mp3";
import coinsSound from "@/assets/sounds/noisyredfox__coins2.wav";

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  hapticsEnabled: boolean;
  toggleHaptics: () => void;
  playClick: () => void;

  /** Dice tumble sound for the roll overlay. */
  playDiceRoll: () => void;

  /** Cha-ching for buying & selling deals. */
  playCashRegister: () => void;

  /** Coin clatter for instant board expenses. */
  playCoins: () => void;

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
  playDiceRoll: () => {},
  playCashRegister: () => {},
  playCoins: () => {},
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
  const dicePlayer = useAudioPlayer(diceRollSound);
  const cashRegisterPlayer = useAudioPlayer(cashRegisterSound);
  const coinsPlayer = useAudioPlayer(coinsSound);

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

  const playSound = (audio: AudioPlayer | null) => {
    if (!soundEnabled || !audio) return;
    audio.seekTo(0);
    audio.play();
  };

  const playClick = () => playSound(player);
  const playDiceRoll = () => playSound(dicePlayer);
  const playCashRegister = () => playSound(cashRegisterPlayer);
  const playCoins = () => playSound(coinsPlayer);

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
        playDiceRoll,
        playCashRegister,
        playCoins,
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
