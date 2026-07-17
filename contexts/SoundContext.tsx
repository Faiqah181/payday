import { PersistentStorage } from "@/lib/PersistentStorage";
import { useAudioPlayer, type AudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import clickSound from "@/assets/sounds/bolkmar__fx-retro-videogame-click-menu.wav";
import diceRollSound from "@/assets/sounds/patrigrief__dice1.wav";
import cashRegisterSound from "@/assets/sounds/disman_cash-register-chching.mp3";
import coinsSound from "@/assets/sounds/noisyredfox__coins2.wav";
import mailSound from "@/assets/sounds/esperar_bird-2-c.mp3";
import dealOfferSound from "@/assets/sounds/female_hi.wav";
import resultSound from "@/assets/sounds/dzedenz__result-7.mp3";
import eventWinSound from "@/assets/sounds/mihacappy__sfx_win_3.wav";
import cashWinSound from "@/assets/sounds/wagna__collect.wav";
import bgmSound from "@/assets/sounds/8bit Bossa.mp3";

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  musicEnabled: boolean;
  toggleMusic: () => void;
  hapticsEnabled: boolean;
  toggleHaptics: () => void;
  playClick: () => void;

  /** Dice tumble sound for the roll overlay. */
  playDiceRoll: () => void;

  /** Cha-ching for buying & selling deals. */
  playCashRegister: () => void;

  /** Coin clatter for instant board expenses. */
  playCoins: () => void;

  /** Chirp for drawing a mail card. */
  playMail: () => void;

  /** Greeting when a deal offer card opens. */
  playDealOffer: () => void;

  /** Fanfare for the final results screen. */
  playResult: () => void;

  /** Win sting for event winner screens (poker, election, commission). */
  playEventWin: () => void;

  /** Collect chime for instant cash gains (birthdays, bonuses…). */
  playCashWin: () => void;

  /** Physical thump for dice landing on a result. */
  impactHaptic: () => void;

  /** Celebratory buzz for pay day & wins. */
  successHaptic: () => void;
}

const SoundContext = createContext<SoundContextType>({
  soundEnabled: true,
  toggleSound: () => {},
  musicEnabled: true,
  toggleMusic: () => {},
  hapticsEnabled: true,
  toggleHaptics: () => {},
  playClick: () => {},
  playDiceRoll: () => {},
  playCashRegister: () => {},
  playCoins: () => {},
  playMail: () => {},
  playDealOffer: () => {},
  playResult: () => {},
  playEventWin: () => {},
  playCashWin: () => {},
  impactHaptic: () => {},
  successHaptic: () => {},
});

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(() =>
    PersistentStorage.get("soundEnabled", true),
  );
  const [musicEnabled, setMusicEnabled] = useState(() =>
    PersistentStorage.get("musicEnabled", true),
  );
  const [hapticsEnabled, setHapticsEnabled] = useState(() =>
    PersistentStorage.get("hapticsEnabled", true),
  );
  const player = useAudioPlayer(clickSound);
  const dicePlayer = useAudioPlayer(diceRollSound);
  const cashRegisterPlayer = useAudioPlayer(cashRegisterSound);
  const coinsPlayer = useAudioPlayer(coinsSound);
  const mailPlayer = useAudioPlayer(mailSound);
  const dealOfferPlayer = useAudioPlayer(dealOfferSound);
  const resultPlayer = useAudioPlayer(resultSound);
  const eventWinPlayer = useAudioPlayer(eventWinSound);
  const cashWinPlayer = useAudioPlayer(cashWinSound);
  const bgmPlayer = useAudioPlayer(bgmSound);

  useEffect(() => {
    bgmPlayer.loop = true;
    bgmPlayer.volume = 0.35;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (musicEnabled) bgmPlayer.play();
    else bgmPlayer.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicEnabled]);

  const toggleSound = () =>
    setSoundEnabled((prev) => {
      PersistentStorage.set("soundEnabled", !prev);
      return !prev;
    });
  const toggleMusic = () =>
    setMusicEnabled((prev) => {
      PersistentStorage.set("musicEnabled", !prev);
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
  const playMail = () => playSound(mailPlayer);
  const playDealOffer = () => playSound(dealOfferPlayer);
  const playResult = () => playSound(resultPlayer);
  const playEventWin = () => playSound(eventWinPlayer);
  const playCashWin = () => playSound(cashWinPlayer);

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
        musicEnabled,
        toggleMusic,
        hapticsEnabled,
        toggleHaptics,
        playClick,
        playDiceRoll,
        playCashRegister,
        playCoins,
        playMail,
        playDealOffer,
        playResult,
        playEventWin,
        playCashWin,
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
