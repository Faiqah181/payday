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
}

const ProfileContext = createContext<ProfileContextType>({
  name: "Guest",
  initial: "G",
  isSignedIn: false,
  avatarIdx: 0,
  avatarColor: SD_AVATAR_COLORS[0],
  setAvatarIdx: () => {},
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [avatarIdx, setAvatarIdxState] = useState(() =>
    PersistentStorage.get("avatarIdx", 0),
  );

  const setAvatarIdx = (idx: number) => {
    PersistentStorage.set("avatarIdx", idx);
    setAvatarIdxState(idx);
  };

  const name = "Guest";
  const initial = name[0].toUpperCase();
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
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
