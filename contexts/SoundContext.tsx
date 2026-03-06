import { Audio } from "expo-av";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

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
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    let mounted = true;
    Audio.Sound.createAsync(require("@/assets/sounds/click.wav")).then(
      ({ sound }) => {
        if (mounted) soundRef.current = sound;
      }
    );
    return () => {
      mounted = false;
      soundRef.current?.unloadAsync();
    };
  }, []);

  const toggleSound = () => setSoundEnabled((prev) => !prev);

  const playClick = () => {
    if (soundEnabled && soundRef.current) {
      soundRef.current.replayAsync();
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
