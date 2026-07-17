import { SD_AVATAR_COLORS } from "@/constants/theme";
import { PersistentStorage } from "@/lib/PersistentStorage";
import { createContext, useContext, useState, type ReactNode } from "react";

interface ProfileContextType {
  name: string;
  initial: string;
  isSignedIn: boolean;
  avatarIdx: number;
  avatarColor: string;
  setAvatarIdx: (idx: number) => void;
  setName: (name: string) => void;
}

const ProfileContext = createContext<ProfileContextType>({
  name: "Guest",
  initial: "G",
  isSignedIn: false,
  avatarIdx: 0,
  avatarColor: SD_AVATAR_COLORS[0],
  setAvatarIdx: () => {},
  setName: () => {},
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [avatarIdx, setAvatarIdxState] = useState(() =>
    PersistentStorage.get("avatarIdx", 0),
  );
  const [name, setNameState] = useState(() =>
    PersistentStorage.get("playerName", "Guest"),
  );

  const setAvatarIdx = (idx: number) => {
    PersistentStorage.set("avatarIdx", idx);
    setAvatarIdxState(idx);
  };

  const setName = (next: string) => {
    PersistentStorage.set("playerName", next);
    setNameState(next);
  };

  const initial = (name.trim()[0] ?? "G").toUpperCase();
  const avatarColor = SD_AVATAR_COLORS[avatarIdx % SD_AVATAR_COLORS.length];

  return (
    <ProfileContext.Provider
      value={{
        name,
        initial,
        isSignedIn: false,
        avatarIdx,
        avatarColor,
        setAvatarIdx,
        setName,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
