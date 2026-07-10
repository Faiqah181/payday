import Storage from "expo-sqlite/kv-store";

interface Schema {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  avatarIdx: number;
}

const PREFIX = "salaryday:";

export const PersistentStorage = {
  get<K extends keyof Schema>(key: K, fallback: Schema[K]): Schema[K] {
    const raw = Storage.getItemSync(PREFIX + key);
    if (raw == null) return fallback;
    try {
      return JSON.parse(raw) as Schema[K];
    } catch {
      return fallback;
    }
  },

  set<K extends keyof Schema>(key: K, value: Schema[K]): void {
    Storage.setItemSync(PREFIX + key, JSON.stringify(value));
  },
};
