# 01. Cấu trúc project

## Tổng quan

Project là ứng dụng React Native chạy bằng Expo SDK 54, viết hoàn toàn bằng JavaScript. Điểm vào của ứng dụng là `index.js`, không phải thư mục `app/` của Expo Router. Điều hướng dùng React Navigation Native Stack và ứng dụng có đúng bốn màn hình.

## Cây thư mục hiện tại

Các thư mục sinh tự động hoặc không cần trình bày như `node_modules`, `.git`, `.expo` đã được bỏ qua.

```text
profile-app/
├── .claude/
│   └── settings.json
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── assets/
│   └── images/
│       ├── android-icon-background.png
│       ├── android-icon-foreground.png
│       ├── android-icon-monochrome.png
│       ├── favicon.png
│       ├── icon.png
│       ├── partial-react-logo.png
│       ├── react-logo.png
│       ├── react-logo@2x.png
│       ├── react-logo@3x.png
│       └── splash-icon.png
├── docs/
│   ├── 01_PROJECT_STRUCTURE.md
│   ├── 02_CODE_FLOW_EXPLANATION.md
│   ├── 03_TEACHER_QA.md
│   ├── 04_CLEANUP_CHECKLIST.md
│   └── 05_PRESENTATION_SCRIPT.md
├── src/
│   ├── assets/
│   │   └── images/
│   │       └── .gitkeep
│   ├── components/
│   │   ├── AppButton.js
│   │   ├── AppHeader.js
│   │   ├── Avatar.js
│   │   ├── FormInput.js
│   │   ├── ProfileCard.js
│   │   └── ThemeToggleSwitch.js
│   ├── context/
│   │   ├── ProfileContext.js
│   │   └── ThemeContext.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── screens/
│   │   ├── EditProfileScreen.js
│   │   ├── HomeScreen.js
│   │   ├── ProfileScreen.js
│   │   └── SettingsScreen.js
│   └── theme/
│       └── colors.js
├── .gitignore
├── AGENTS.md
├── App.js
├── app.json
├── CLAUDE.md
├── eslint.config.js
├── index.js
├── package-lock.json
├── package.json
├── plan.md
├── README.md
└── rule.md
```

## Vai trò của từng thư mục

### `src/screens`

Chứa bốn component màn hình. Mỗi màn hình chịu trách nhiệm ghép các component nhỏ, đọc state cần thiết và xử lý navigation. Project chỉ có `HomeScreen`, `ProfileScreen`, `EditProfileScreen` và `SettingsScreen`, đúng phạm vi Assignment.

### `src/components`

Chứa các component có thể tái sử dụng. Việc tách component giúp giao diện nhất quán, giảm code lặp và làm screen dễ đọc hơn. Ví dụ, nhiều màn hình dùng chung `AppHeader`, `AppButton` và `Avatar`.

### `src/context`

Chứa state dùng chung cho nhiều màn hình:

- `ProfileContext` giữ dữ liệu hồ sơ trong bộ nhớ.
- `ThemeContext` giữ chế độ light/dark và bảng màu hiện tại.

Provider được đặt phía trên navigator nên mọi screen đều có thể đọc context bằng custom hook.

### `src/navigation`

Chứa cấu hình React Navigation. `AppNavigator.js` đăng ký đúng bốn route và dùng Native Stack để chuyển màn hình theo lịch sử dạng ngăn xếp.

### `src/theme`

Chứa các design token màu. `colors.js` tách riêng `lightColors` và `darkColors`, giúp component không phải viết lại mã màu ở nhiều nơi.

### `assets/images`

Chứa icon ứng dụng, adaptive icon Android và favicon web được tham chiếu trong `app.json`. Một số ảnh logo React và `splash-icon.png` là tài nguyên còn lại từ template, hiện không được source sử dụng.

### `src/assets/images`

Hiện chỉ có `.gitkeep` để Git giữ lại cấu trúc thư mục theo yêu cầu Assignment. Avatar hiện dùng icon `person` làm fallback nên chưa cần ảnh cục bộ trong thư mục này.

### `docs`

Chứa tài liệu giải thích project, flow code, câu hỏi vấn đáp, checklist cleanup và kịch bản thuyết trình.

## Vai trò của các file chính

### `index.js`

Là entry point được khai báo qua trường `main` trong `package.json`. File import `react-native-gesture-handler` trước, import `App`, rồi gọi `registerRootComponent(App)` để Expo đăng ký root component cho Android, iOS và web.

### `App.js`

Là root component của ứng dụng. File bọc app bằng `SafeAreaProvider`, `ThemeProvider` và `ProfileProvider`, sau đó render `AppNavigator`. Component con `AppContent` đọc `isDark` để đổi màu `StatusBar` theo theme.

### `src/navigation/AppNavigator.js`

Tạo Native Stack bằng `createNativeStackNavigator()`, bọc stack trong `NavigationContainer` và đăng ký bốn route: `Home`, `Profile`, `EditProfile`, `Settings`. Header mặc định bị ẩn để dùng `AppHeader` tự thiết kế. Navigation theme cũng được tạo từ màu của `ThemeContext`.

### `src/context/ThemeContext.js`

Dùng `useState('light')` để giữ `themeMode`. Từ đó tính `isDark`, chọn `lightColors` hoặc `darkColors`, và cung cấp `toggleTheme()`. Hook `useTheme()` giúp component đọc context và báo lỗi rõ ràng nếu dùng ngoài provider.

### `src/context/ProfileContext.js`

Dùng `useState(initialProfile)` để giữ `name`, `bio`, `avatar`. Hàm `updateProfile(updates)` merge dữ liệu mới vào state cũ. Hook `useProfile()` cho phép screen và component đọc profile mà không cần truyền props qua toàn bộ cây component.

### `src/screens/HomeScreen.js`

Là màn hình đầu tiên. Màn hình hiển thị tiêu đề `Profile App`, welcome card, avatar, nút `View My Profile` và footer Assignment. Nút gọi `navigation.navigate('Profile')`.

### `src/screens/ProfileScreen.js`

Đọc `profile` từ `ProfileContext`, truyền profile vào `ProfileCard`, và hiển thị hai nút để đi tới `EditProfile` hoặc `Settings`.

### `src/screens/EditProfileScreen.js`

Hiển thị form chỉnh sửa `name` và `bio`. Formik quản lý giá trị/touched/error/submit; Yup kiểm tra required và độ dài. Validation chỉ chạy khi blur hoặc submit. Khi hợp lệ, `onSubmit` trim khoảng trắng hai đầu, gọi `updateProfile()`, rồi `navigation.goBack()`.

### `src/screens/SettingsScreen.js`

Hiển thị phần Appearance và Theme Preview. Screen đọc `colors`, `isDark` từ `ThemeContext`; `ThemeToggleSwitch` thực hiện việc bật/tắt dark mode.

### `src/components/ProfileCard.js`

Nhận props `profile` và `compact`. Chế độ compact dùng trên Home để hiển thị welcome card; chế độ đầy đủ dùng trên Profile để hiển thị avatar, name, bio và các tag. Tách component giúp hai màn hình tái sử dụng cùng cách hiển thị profile.

### `src/components/FormInput.js`

Bọc `TextInput` cùng label, border và thông báo lỗi. Component nhận các props Formik như `value`, `onChangeText`, `onBlur`. Nó không trim, normalize, filter hay mutate input khi người dùng gõ; `autoCorrect={false}` và `autoCapitalize="none"` giúp nhập liệu ổn định.

### `src/components/AppButton.js`

Chuẩn hóa button của ứng dụng: kích thước, màu theme, trạng thái pressed/disabled/loading, icon và hai variant `primary`/`secondary`.

### `src/components/AppHeader.js`

Hiển thị tiêu đề giữa màn hình và back button tùy chọn. Khi có prop `onBack`, component render nút mũi tên và gọi callback khi nhấn.

### `src/components/ThemeToggleSwitch.js`

Đọc trực tiếp `isDark`, `colors`, `toggleTheme` từ `ThemeContext`. Switch phản ánh theme hiện tại và gọi `toggleTheme()` khi thay đổi.

### `src/components/Avatar.js`

Hiển thị ảnh nếu `source` tồn tại; nếu chưa có ảnh thì dùng icon `person`. Component nhận `size` và `subtle` để tái sử dụng ở Home, Profile và Edit Profile.

### `src/theme/colors.js`

Khai báo toàn bộ màu light/dark. Các component lấy màu qua `useTheme()` nên không cần biết theme đang là light hay dark.

## Các file cấu hình quan trọng

- `package.json`: khai báo Expo SDK 54, script và dependency; `main` là `index.js`.
- `app.json`: cấu hình tên app, icon, Android adaptive icon, web favicon và plugin `expo-font`.
- `eslint.config.js`: cấu hình ESLint cho project Expo.
- `package-lock.json`: khóa chính xác phiên bản dependency để cài đặt nhất quán.
- `README.md`: hướng dẫn ngắn để cài và chạy app.
