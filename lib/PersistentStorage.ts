import Storage from "expo-sqlite/kv-store";
import { Platform } from "react-native";

interface Schema {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  avatarIdx: number;
}

const PREFIX = "salaryday:";

// expo-sqlite's sync wasm bridge is unreliable on web — localStorage covers it
const readRaw = (key: string): string | null =>
  Platform.OS === "web"
    ? window.localStorage.getItem(key)
    : Storage.getItemSync(key);

const writeRaw = (key: string, value: string): void => {
  if (Platform.OS === "web") {
    window.localStorage.setItem(key, value);
  } else {
    Storage.setItemSync(key, value);
  }
};

export const PersistentStorage = {
  get<K extends keyof Schema>(key: K, fallback: Schema[K]): Schema[K] {
    const raw = readRaw(PREFIX + key);
    if (raw == null) return fallback;
    try {
      return JSON.parse(raw) as Schema[K];
    } catch {
      return fallback;
    }
  },

  set<K extends keyof Schema>(key: K, value: Schema[K]): void {
    writeRaw(PREFIX + key, JSON.stringify(value));
  },
};
