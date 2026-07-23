"use client";

import { createContext, useContext, useState } from "react";

interface ProfileSaveContextType {
  isPending: boolean;
  setIsPending: (v: boolean) => void;
}

const ProfileSaveContext = createContext<ProfileSaveContextType>({
  isPending: false,
  setIsPending: () => {},
});

export function ProfileSaveProvider({ children }: { children: React.ReactNode }) {
  const [isPending, setIsPending] = useState(false);
  return (
    <ProfileSaveContext.Provider value={{ isPending, setIsPending }}>
      {children}
    </ProfileSaveContext.Provider>
  );
}

export function useProfileSave() {
  return useContext(ProfileSaveContext);
}
