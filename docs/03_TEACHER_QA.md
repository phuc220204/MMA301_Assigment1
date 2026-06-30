# 03. Câu hỏi và trả lời vấn đáp

## 1. App của em giải quyết yêu cầu gì?

App cho phép người dùng xem hồ sơ, chỉnh sửa name/bio và đổi giao diện light/dark. App có đúng bốn màn hình và dùng local state/Context thay vì backend.

## 2. Project đang dùng Expo SDK nào?

Project dùng Expo SDK 54, được khai báo bằng dependency `expo: ~54.0.34` trong `package.json`.

## 3. Vì sao em dùng JavaScript thay vì TypeScript?

Đề bài yêu cầu JavaScript. Toàn bộ source của app là file `.js`, không có file `.ts` hoặc `.tsx`.

## 4. Vì sao em dùng Native Stack Navigator?

Luồng màn hình có quan hệ trước/sau rõ ràng. Native Stack quản lý lịch sử màn hình theo dạng stack và cung cấp chuyển cảnh native phù hợp cho Home → Profile → Edit/Settings.

## 5. Vì sao không dùng Bottom Tabs?

Đề bài không yêu cầu các khu vực chính song song. Edit Profile và Settings là màn hình con của Profile, nên stack đúng với luồng nghiệp vụ hơn và cũng tuân thủ yêu cầu Assignment.

## 6. Project có dùng Expo Router không?

Không. `package.json` dùng `main: index.js`, source không có thư mục `app/`, và route được đăng ký thủ công trong `AppNavigator.js` bằng React Navigation.

## 7. `index.js` có vai trò gì?

Đây là entry point. Nó import gesture handler, import `App`, rồi dùng `registerRootComponent(App)` để đăng ký root component với Expo.

## 8. `App.js` có vai trò gì?

`App.js` bọc ứng dụng bằng `SafeAreaProvider`, `ThemeProvider`, `ProfileProvider`, cấu hình StatusBar và render `AppNavigator`.

## 9. Tại sao provider phải bọc navigator?

Vì tất cả screen được render bên trong navigator. Khi provider nằm bên ngoài navigator, mọi screen đều có thể đọc cùng profile và theme state.

## 10. Profile được lưu ở đâu?

Profile được lưu trong `useState` của `ProfileProvider`. State gồm `name`, `bio`, `avatar` và chỉ tồn tại trong bộ nhớ của phiên app hiện tại.

## 11. `ProfileContext` có dùng local state không?

Có. Context chỉ là cách phân phối dữ liệu; dữ liệu thực tế vẫn được giữ bằng `useState(initialProfile)` trong `ProfileProvider`.

## 12. Save profile hoạt động như thế nào?

Formik validate form bằng Yup. Nếu hợp lệ, `onSubmit` trim khoảng trắng hai đầu, gọi `updateProfile({ name, bio })`, rồi `navigation.goBack()` về Profile.

## 13. `updateProfile()` làm gì?

Hàm dùng functional update để tạo object mới: giữ field cũ bằng spread và ghi đè các field mới. Nhờ đó avatar vẫn được giữ khi chỉ sửa name/bio.

## 14. Vì sao ProfileScreen tự cập nhật sau khi save?

ProfileScreen gọi `useProfile()`, nên nó là consumer của ProfileContext. Khi context state thay đổi, React render lại ProfileScreen và ProfileCard với dữ liệu mới.

## 15. Dữ liệu có lưu vào database không?

Không. Assignment không yêu cầu backend hoặc lưu bền vững. Dữ liệu chỉ nằm trong React state.

## 16. Nếu tắt app mở lại thì dữ liệu còn không?

Không. Khi app khởi động lại, `ProfileProvider` được tạo mới với `initialProfile`. Muốn giữ dữ liệu cần thêm persistence như AsyncStorage hoặc database.

## 17. Vì sao hiện tại không cần database?

Mục tiêu Assignment là minh họa navigation, state management, Context, form và validation. Database sẽ tăng độ phức tạp ngoài phạm vi mà không giúp chứng minh yêu cầu chính.

## 18. Context API là gì?

Context API là cơ chế của React để cung cấp dữ liệu cho nhiều component con mà không cần truyền props qua từng tầng trung gian.

## 19. ThemeContext khác một `useState` đặt trong SettingsScreen thế nào?

Nếu state chỉ nằm trong SettingsScreen, màn hình khác không biết theme đã đổi. ThemeContext đặt state ở cấp app và phân phối nó cho mọi screen/component.

## 20. Theme được đổi như thế nào?

Switch gọi `toggleTheme()`. Hàm đổi `themeMode` giữa `light` và `dark`; ThemeContext chọn bảng màu tương ứng và các consumer render lại.

## 21. Vì sao toàn bộ app đổi màu cùng lúc?

Mọi screen và component đều đọc `colors` từ cùng ThemeContext. Khi Context value đổi, React thông báo các consumer và render lại chúng với palette mới.

## 22. Vì sao dùng Formik?

Formik quản lý values, errors, touched, blur, change và submit. Nó giảm số lượng state/handler thủ công và làm flow form rõ ràng hơn.

## 23. Vì sao dùng Yup?

Yup cho phép khai báo luật validation tập trung trong schema. Formik có thể dùng trực tiếp schema và ánh xạ lỗi đúng field.

## 24. Form validate Name như thế nào?

Yup `.test()` kiểm tra độ dài sau `value.trim()`. Name chỉ có khoảng trắng sẽ bị required; name có một ký tự sau trim sẽ bị lỗi tối thiểu 2 ký tự.

## 25. Form validate Bio như thế nào?

Yup `.test()` yêu cầu `value.trim().length` lớn hơn 0. Vì vậy chuỗi chỉ gồm khoảng trắng không hợp lệ.

## 26. `validateOnBlur` là gì?

Nó cho Formik chạy validation khi input mất focus. Người dùng hoàn thành việc nhập field rồi mới thấy lỗi.

## 27. `validateOnChange={false}` để làm gì?

Nó tắt validation sau mỗi ký tự. Điều này tránh validate quá liên tục và giúp quá trình nhập dấu tiếng Việt ổn định hơn.

## 28. Vì sao không trim hoặc regex trong `onChangeText`?

Bộ gõ tiếng Việt có quá trình composition. Nếu code liên tục biến đổi rồi gán lại controlled value, nó có thể làm mất dấu hoặc nhảy con trỏ. App truyền text thẳng vào `handleChange`.

## 29. Vì sao được trim khi submit?

Lúc submit người dùng đã gõ xong. Trim chỉ xóa khoảng trắng hai đầu trước khi lưu và không can thiệp vào quá trình ghép dấu.

## 30. Controlled input là gì?

Là input nhận `value` từ state và cập nhật state qua `onChangeText`. Trong app, Formik quản lý state đó, nên nội dung TextInput luôn đồng bộ với `values.name` hoặc `values.bio`.

## 31. `touched` trong Formik dùng để làm gì?

`touched` cho biết người dùng đã tương tác và rời khỏi field hay chưa. App chỉ hiển thị lỗi field khi field đã touched hoặc Formik đánh dấu touched lúc submit.

## 32. Vì sao tách reusable component?

Để giảm lặp code, giữ style và behavior nhất quán, đồng thời làm screen tập trung vào flow. Ví dụ sửa chiều cao button trong `AppButton` sẽ áp dụng cho mọi nơi dùng button.

## 33. `SafeAreaView` để làm gì?

Nó thêm khoảng inset để nội dung không bị status bar, notch, camera cutout hoặc home indicator che. Mỗi screen đều dùng SafeAreaView từ `react-native-safe-area-context`.

## 34. `SafeAreaProvider` khác `SafeAreaView` thế nào?

Provider đo và cung cấp thông tin safe area ở root. SafeAreaView sử dụng thông tin đó để áp padding phù hợp cho screen.

## 35. `ScrollView` để làm gì?

Nó cho phép nội dung cuộn khi màn hình nhỏ, khi font lớn hoặc khi bàn phím chiếm không gian. Nhờ đó form và button vẫn truy cập được.

## 36. `KeyboardAvoidingView` để làm gì?

Trên iOS, nó dịch/chỉnh vùng nội dung khi bàn phím mở để input không bị che. Edit Profile kết hợp nó với ScrollView.

## 37. App responsive bằng cách nào?

App dùng Flexbox, `flexGrow`, phần trăm chiều rộng, `maxWidth`, padding và ScrollView; không khóa theo một chiều cao màn hình cụ thể.

## 38. `AppHeader` xử lý back button ra sao?

Screen truyền `navigation.goBack` qua prop `onBack`. Nếu prop tồn tại, AppHeader hiển thị icon mũi tên và gọi callback khi nhấn.

## 39. `navigation.navigate()` khác `navigation.goBack()` thế nào?

`navigate()` đi tới một route theo tên. `goBack()` pop màn hình hiện tại khỏi stack và quay về màn hình trước đó.

## 40. Avatar hiện được xử lý thế nào?

Profile state có field `avatar`, hiện mặc định là `null`. `Avatar` kiểm tra source; nếu chưa có ảnh thì hiển thị icon `person`, vì đề chỉ cho sửa Name và Bio.

## 41. Vì sao không cho sửa Email hoặc Avatar?

Đề bài quy định Edit Profile chỉ chỉnh Name và Bio, không thêm Email. Avatar vẫn nằm trong model profile nhưng không có input chỉnh sửa.

## 42. Màu light/dark được quản lý ở đâu?

`src/theme/colors.js` khai báo `lightColors` và `darkColors`. ThemeContext chọn một object và component đọc màu bằng `useTheme()`.

## 43. `useMemo` trong Context để làm gì?

Nó tạo lại Context value khi dependency liên quan thay đổi, thay vì tạo object mới không cần thiết ở mọi render. Điều này giúp giới hạn các lần render do identity của value.

## 44. Nếu muốn lưu profile lâu dài thì cần thêm gì?

Có thể dùng AsyncStorage cho dữ liệu local đơn giản, hoặc API/database nếu cần đồng bộ tài khoản. Tuy nhiên không nên thêm vào phiên bản Assignment hiện tại khi chưa được yêu cầu.

## 45. App đã đáp ứng Assignment như thế nào?

App có đúng bốn screen, Native Stack, profile state bằng `useState` trong Context, theme bằng Context API, Edit Profile dùng Formik/Yup, reusable components, SafeAreaView và layout Flexbox responsive; không có Router, Bottom Tabs, Search, Email hay backend.
