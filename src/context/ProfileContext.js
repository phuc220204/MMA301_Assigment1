/**
 * ProfileContext.js — Lưu thông tin profile (name, bio, avatar) toàn app bằng Context API.
 * Vai trò: cấp profile hiện tại và hàm updateProfile cho các screen (Home/Profile/EditProfile)
 * thông qua hook useProfile().
 */
import { createContext, useContext, useMemo, useState } from 'react';

// Context khởi tạo undefined để useProfile() phát hiện khi bị dùng ngoài Provider.
const ProfileContext = createContext(undefined);

// Giá trị profile mặc định khi app vừa mở (avatar nạp tĩnh bằng require).
const initialProfile = {
  name: 'Nguyen Van A',
  bio: 'React Native learner building clean mobile apps.',
  avatar: require('../assets/images/AvatarProfile.png'),
};

// ProfileProvider: bọc cây con và cấp state profile xuống qua Provider.
// Props: children — phần UI được bao bên trong.
// Trả về: <ProfileContext.Provider> chứa profile + updateProfile.
export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(initialProfile);

  // useMemo: chỉ tạo lại value khi profile đổi -> tránh consumer re-render thừa.
  const value = useMemo(
    () => ({
      profile,
      // updateProfile dùng updater function: gộp (merge) các field mới vào profile cũ
      // bằng spread, nên chỉ cần truyền field cần đổi (vd { name } hoặc { name, bio }).
      updateProfile: (updates) => setProfile((current) => ({ ...current, ...updates })),
    }),
    [profile]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

// useProfile: custom hook để đọc profile từ context.
// Tham số: không.
// Trả về: object { profile, updateProfile }.
// Side effect: ném Error nếu gọi bên ngoài ProfileProvider.
export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error('useProfile must be used inside ProfileProvider.');
  }

  return context;
}
