import { createContext, useContext, useMemo, useState } from 'react';

const ProfileContext = createContext(undefined);

const initialProfile = {
  name: 'Nguyen Van A',
  bio: 'React Native learner building clean mobile apps.',
  avatar: require('../assets/images/AvatarProfile.png'),
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(initialProfile);

  const value = useMemo(
    () => ({
      profile,
      updateProfile: (updates) => setProfile((current) => ({ ...current, ...updates })),
    }),
    [profile]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error('useProfile must be used inside ProfileProvider.');
  }

  return context;
}
