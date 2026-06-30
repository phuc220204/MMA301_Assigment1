# 04. Checklist kiểm tra và cleanup

## Nguyên tắc

Tài liệu này chỉ ghi nhận và đề xuất. Không file nào được tự động xóa trong quá trình tạo tài liệu.

## Kết quả kiểm tra nhanh

| Hạng mục | Trạng thái hiện tại | Kết luận |
| --- | --- | --- |
| Expo SDK 54 | `expo: ~54.0.34` | Đúng |
| Entry point | `package.json` dùng `main: index.js` | Đúng |
| Expo Router | Không có source `app/`, không cài trực tiếp `expo-router` | Không sử dụng |
| Bottom Tabs | Không có package trực tiếp hoặc code `createBottomTabNavigator` | Không sử dụng |
| Navigation | `@react-navigation/native-stack` | Đúng |
| Số screen | Home, Profile, EditProfile, Settings | Đúng 4 screen |
| SearchScreen | Không tìm thấy | Đúng |
| TypeScript | Không có `.ts`, `.tsx`, `tsconfig.json` | Đúng JavaScript |
| API/backend/database | Không có fetch, axios, server hoặc database | Đúng phạm vi |
| AsyncStorage | Không sử dụng | Đúng phạm vi |
| Form | Formik + Yup, chỉ Name/Bio | Đúng |
| Profile state | `useState` trong `ProfileContext` | Đúng |
| Theme state | `useState` trong `ThemeContext` | Đúng |
| Reusable components | Có và đều đang được sử dụng | Đúng |

## File và thư mục bắt buộc nên giữ

### Root/config

- `App.js`: root component và provider hierarchy.
- `index.js`: entry point cho Expo.
- `package.json`: script và dependency.
- `package-lock.json`: khóa phiên bản dependency.
- `app.json`: cấu hình Expo, app icon, Android icon, favicon và plugin.
- `eslint.config.js`: kiểm tra chất lượng source.
- `.gitignore`: tránh commit file sinh tự động.
- `README.md`: hướng dẫn chạy app.

### Source chính

- `src/screens/HomeScreen.js`
- `src/screens/ProfileScreen.js`
- `src/screens/EditProfileScreen.js`
- `src/screens/SettingsScreen.js`
- `src/navigation/AppNavigator.js`
- `src/context/ProfileContext.js`
- `src/context/ThemeContext.js`
- `src/theme/colors.js`
- `src/components/AppHeader.js`
- `src/components/AppButton.js`
- `src/components/ProfileCard.js`
- `src/components/FormInput.js`
- `src/components/ThemeToggleSwitch.js`
- `src/components/Avatar.js`

`Avatar.js` không nằm trong danh sách component tối thiểu của đề nhưng không phải component dư. Nó đang được `ProfileCard` và `EditProfileScreen` sử dụng để tránh lặp UI avatar.

### Asset đang được dùng

Các file sau được tham chiếu trong `app.json` và phải giữ:

- `assets/images/icon.png`
- `assets/images/android-icon-background.png`
- `assets/images/android-icon-foreground.png`
- `assets/images/android-icon-monochrome.png`
- `assets/images/favicon.png`

### Dependency cần giữ

- `expo`, `react`, `react-native`: nền tảng app.
- `@react-navigation/native`, `@react-navigation/native-stack`: navigation.
- `react-native-safe-area-context`, `react-native-screens`: dependency native cho navigation/safe area.
- `formik`, `yup`: quản lý và validate form.
- `@expo/vector-icons`, `expo-font`: icon và font backend của icon.
- `expo-status-bar`: đổi style status bar.
- `react-native-gesture-handler`: được import ở đầu `index.js`.
- `react-dom`, `react-native-web`: hỗ trợ script web hiện có.

## File có thể xóa sau khi xác nhận

### Asset template không được dùng

Source và `app.json` hiện không tham chiếu các file sau:

- `assets/images/partial-react-logo.png`
- `assets/images/react-logo.png`
- `assets/images/react-logo@2x.png`
- `assets/images/react-logo@3x.png`
- `assets/images/splash-icon.png`

Đây là ứng viên có thể xóa để project gọn hơn. Chỉ nên xóa sau khi xác nhận không định dùng chúng cho splash/avatar và chạy lại `expo-doctor`/bundle.

### File hỗ trợ công cụ, không ảnh hưởng runtime

- `AGENTS.md`, `CLAUDE.md`, `.claude/`: hướng dẫn/cấu hình cho coding agent, không được app import.
- `.vscode/`: cấu hình IDE cục bộ; có thể giữ nếu nhóm dùng chung VS Code.
- `plan.md`, `rule.md`: không tham gia runtime nhưng nên giữ làm tài liệu yêu cầu Assignment.

### Thư mục asset trống

`src/assets/images/.gitkeep` chỉ tồn tại để giữ cấu trúc thư mục. Có thể xóa nếu không cần thư mục này, nhưng plan hiện yêu cầu `src/assets/images`, vì vậy nên giữ.

## File/thư mục không nên có trong Assignment này

Hiện tại không tìm thấy các mục dưới đây. Nếu xuất hiện về sau, cần xem xét loại bỏ:

- `app/`, `_layout.*`, file route kiểu Expo Router.
- Dependency `expo-router` trong phần dependencies trực tiếp.
- `@react-navigation/bottom-tabs` hoặc code `createBottomTabNavigator`.
- `SearchScreen.js`.
- File `.ts`, `.tsx`, `tsconfig.json`.
- Screen thứ năm ngoài bốn screen bắt buộc.
- Input Email trong Edit Profile.
- API client, Express server, backend folder hoặc database code.
- AsyncStorage khi chưa được giảng viên yêu cầu.
- Animation hoặc state library phức tạp không phục vụ đề bài.

## Lưu ý về chuỗi `expo-router` trong `package-lock.json`

`package-lock.json` có thể chứa chữ `expo-router` trong metadata `peerDependencies`/`peerDependenciesMeta` của package Expo. Điều đó không có nghĩa Router đã được cài hoặc app đang dùng Router.

Các bằng chứng project không dùng Router:

1. `package.json` không khai báo `expo-router`.
2. `npm ls expo-router --depth=0` trả về `(empty)`.
3. `main` là `index.js`, không phải `expo-router/entry`.
4. Không có thư mục source `app/`.
5. `app.json` không có plugin `expo-router`.

Không nên sửa tay `package-lock.json` chỉ để xóa chuỗi metadata này.

## Kiểm tra component dư

| Component | Nơi đang sử dụng | Kết luận |
| --- | --- | --- |
| `AppButton` | Home, Profile, Edit Profile | Giữ |
| `AppHeader` | Cả bốn screen | Giữ |
| `Avatar` | ProfileCard, Edit Profile | Giữ |
| `FormInput` | Edit Profile | Giữ |
| `ProfileCard` | Home, Profile | Giữ |
| `ThemeToggleSwitch` | Settings | Giữ |

Không có component dư trong `src/components` tại thời điểm kiểm tra.

## Checklist trước khi nộp

- [ ] Chạy `npm install`.
- [ ] Chạy `npm run lint`.
- [ ] Chạy `npx expo-doctor`.
- [ ] Chạy `npm start` và mở app trên Expo Go/emulator.
- [ ] Test Home → Profile.
- [ ] Test Profile → Edit Profile → Save → quay lại Profile.
- [ ] Test Name rỗng, chỉ khoảng trắng và chỉ một ký tự.
- [ ] Test Bio rỗng/chỉ khoảng trắng.
- [ ] Test nhập tiếng Việt có dấu.
- [ ] Test Profile → Settings → toggle dark mode.
- [ ] Test back button ở Edit Profile và Settings.
- [ ] Xác nhận không có Email, Search hoặc Bottom Tabs.
- [ ] Chỉ xóa asset/template sau khi đã xác nhận.
