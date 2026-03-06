import { useAudioPlayer } from "expo-audio";
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
  playClick: () => void;
}

const SoundContext = createContext<SoundContextType>({
  soundEnabled: true,
  toggleSound: () => {},
  playClick: () => {},
});

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const player = useAudioPlayer(clickSound);

  const toggleSound = () => setSoundEnabled((prev) => !prev);

  const playClick = () => {
    if (soundEnabled && player) {
      player.seekTo(0);
      player.play();
    }
  };

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, playClick }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}
