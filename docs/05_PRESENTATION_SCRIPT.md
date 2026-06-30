# 05. Kịch bản trình bày 3–5 phút

## Bài trình bày

Em xin trình bày Assignment “Multi-Screen Profile App with Theme Support and State Management”. Ứng dụng của em được xây dựng bằng React Native, Expo SDK 54 và JavaScript. App có đúng bốn màn hình là Home, Profile, Edit Profile và Settings. Người dùng có thể xem hồ sơ, chỉnh sửa tên và bio, đồng thời chuyển toàn bộ giao diện giữa light mode và dark mode.

Về cấu trúc project, `index.js` là entry point được khai báo trong `package.json`. File này đăng ký `App` làm root component bằng `registerRootComponent`. Trong `App.js`, em đặt ba provider chính. `SafeAreaProvider` giúp giao diện không bị status bar hoặc vùng tai thỏ che. `ThemeProvider` quản lý light/dark theme. `ProfileProvider` quản lý dữ liệu profile. Sau đó `App.js` render `AppNavigator`.

Source được chia thành các thư mục theo trách nhiệm. `src/screens` chứa bốn màn hình. `src/components` chứa các component dùng lại như AppHeader, AppButton, ProfileCard, FormInput và ThemeToggleSwitch. `src/context` chứa ProfileContext và ThemeContext. `src/navigation` cấu hình Native Stack. `src/theme` chứa bảng màu light và dark. Cách chia này giúp code dễ đọc, tránh lặp và dễ bảo trì.

Về navigation, em dùng React Navigation Native Stack vì luồng của app có quan hệ trước và sau. HomeScreen gọi `navigation.navigate('Profile')` để mở ProfileScreen. Từ ProfileScreen, người dùng có thể gọi `navigation.navigate('EditProfile')` hoặc `navigation.navigate('Settings')`. Edit Profile và Settings có back button gọi `navigation.goBack()`, nghĩa là pop màn hình hiện tại khỏi stack và quay lại Profile. Em không dùng Expo Router và không dùng Bottom Tab Navigation vì không phù hợp với yêu cầu đề bài.

Về profile state, dữ liệu gồm name, bio và avatar được lưu trong `useState` của ProfileProvider. ProfileContext cung cấp object profile và hàm `updateProfile` cho các screen. ProfileScreen gọi `useProfile()` để lấy dữ liệu rồi truyền vào ProfileCard. Avatar hiện có giá trị mặc định là null nên component Avatar hiển thị icon person làm fallback. Đề chỉ cho sửa Name và Bio nên em không tạo input chỉnh avatar hoặc email.

Khi mở Edit Profile, Formik nhận name và bio hiện tại làm `initialValues`. Hai TextInput là controlled input: value lấy từ Formik và `onChangeText` gọi trực tiếp `handleChange` tương ứng. Trong lúc người dùng gõ, dữ liệu chỉ nằm trong Formik, chưa cập nhật ProfileContext.

Khi bấm Save Changes, Formik yêu cầu Yup validate trước. Name phải có nội dung sau khi bỏ khoảng trắng hai đầu và phải có ít nhất hai ký tự. Bio cũng phải có nội dung sau khi bỏ khoảng trắng. Nếu form không hợp lệ, `onSubmit` không chạy và lỗi được hiển thị dưới input. Nếu hợp lệ, `onSubmit` trim khoảng trắng hai đầu, gọi `updateProfile`, rồi gọi `navigation.goBack()`.

ProfileScreen tự hiển thị dữ liệu mới vì nó đang subscribe ProfileContext. Khi context state đổi, React render lại consumer với profile mới. App không cần database vì Assignment chỉ yêu cầu local state management. Do dữ liệu chỉ nằm trong bộ nhớ, nếu đóng hoặc reload app thì profile sẽ quay về giá trị mặc định. Nếu muốn lưu lâu dài trong phiên bản khác, em có thể thêm AsyncStorage hoặc backend, nhưng em không thêm ở đây vì ngoài phạm vi đề.

Về validation và nhập tiếng Việt, em đặt `validateOnChange={false}` và giữ validation khi blur hoặc submit. `onChangeText` không trim, normalize, replace hoặc regex filter. Điều này tránh can thiệp vào quá trình ghép dấu của bàn phím tiếng Việt. Yup dùng `.test()` để đọc độ dài sau trim khi validation, nhưng không gán kết quả đó ngược vào input. Trim thật sự chỉ diễn ra khi submit, lúc người dùng đã gõ xong.

Về theme, ThemeProvider giữ `themeMode` bằng `useState`. Từ `themeMode`, context tính `isDark` và chọn `lightColors` hoặc `darkColors`. Trong Settings, ThemeToggleSwitch gọi `toggleTheme()`. Khi theme state thay đổi, toàn bộ component đang dùng `useTheme()` render lại với bảng màu mới. Navigation theme và StatusBar cũng đổi theo. Context API giúp em tránh phải truyền colors và toggleTheme qua nhiều tầng props.

Cuối cùng, em tách reusable components để giữ giao diện nhất quán. AppHeader xử lý tiêu đề và back button. AppButton xử lý variant, icon, loading và trạng thái nhấn. FormInput xử lý label, TextInput và error. ProfileCard hiển thị profile ở chế độ compact hoặc đầy đủ. ThemeToggleSwitch đóng gói phần switch theme. Giao diện dùng StyleSheet, Flexbox, SafeAreaView và ScrollView nên có thể thích ứng với màn hình nhỏ và bàn phím.

Tóm lại, ứng dụng đáp ứng đúng yêu cầu Assignment: Expo SDK 54, JavaScript, bốn screen, Native Stack, profile state bằng useState trong Context, theme bằng Context API, form bằng Formik và Yup, reusable components, responsive layout, không Router, không Bottom Tabs, không Search, không Email và không backend. Em xin hết phần trình bày.

## Dàn ý ghi nhớ nhanh

1. App làm gì và có bốn screen nào.
2. `index.js` → `App.js` → Providers → `AppNavigator`.
3. Native Stack và các lệnh `navigate`/`goBack`.
4. Profile state nằm trong `ProfileContext` dùng `useState`.
5. Formik giữ values; Yup validate blur/submit.
6. Submit → trim → `updateProfile` → `goBack` → Profile render lại.
7. ThemeContext đổi palette toàn app.
8. Reusable components, SafeAreaView, ScrollView, Flexbox.
9. Không Router, Tabs, API, database, Search, Email hay TypeScript.
