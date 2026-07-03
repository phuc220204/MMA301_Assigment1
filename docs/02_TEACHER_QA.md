# 02. Câu hỏi và trả lời vấn đáp

> File Q&A duy nhất của project (đã gộp từ các bản Q&A cũ, loại bỏ trùng lặp).
> Muốn xem giải thích chi tiết từng dòng code kèm số dòng, mở [EXPLANATION.md](../EXPLANATION.md).

## A. Tổng quan project

### 1. App của em giải quyết yêu cầu gì?

App cho phép người dùng xem hồ sơ, chỉnh sửa name/bio và đổi giao diện light/dark. App có đúng bốn màn hình và dùng local state/Context thay vì backend.

### 2. Project đang dùng Expo SDK nào?

Project dùng Expo SDK 54, được khai báo bằng dependency `expo: ~54.0.34` trong `package.json`.

### 3. Vì sao em dùng JavaScript thay vì TypeScript?

Đề bài yêu cầu JavaScript. Toàn bộ source của app là file `.js`, không có file `.ts` hoặc `.tsx`.

### 4. Vì sao em dùng Native Stack Navigator?

Luồng màn hình có quan hệ trước/sau rõ ràng. Native Stack quản lý lịch sử màn hình theo dạng stack và cung cấp chuyển cảnh native phù hợp cho Home → Profile → Edit/Settings.

### 5. Vì sao không dùng Bottom Tabs?

Đề bài không yêu cầu các khu vực chính song song. Edit Profile và Settings là màn hình con của Profile, nên stack đúng với luồng nghiệp vụ hơn và cũng tuân thủ yêu cầu Assignment.

### 6. Project có dùng Expo Router không?

Không. `package.json` dùng `main: index.js`, source không có thư mục `app/`, và route được đăng ký thủ công trong `AppNavigator.js` bằng React Navigation.

### 7. `index.js` có vai trò gì?

Đây là entry point. Nó import gesture handler, import `App`, rồi dùng `registerRootComponent(App)` để đăng ký root component với Expo.

### 8. `App.js` có vai trò gì?

`App.js` bọc ứng dụng bằng `SafeAreaProvider`, `ThemeProvider`, `ProfileProvider`, cấu hình StatusBar và render `AppNavigator`.

### 9. Tại sao provider phải bọc navigator?

Vì tất cả screen được render bên trong navigator. Khi provider nằm bên ngoài navigator, mọi screen đều có thể đọc cùng profile và theme state.

### 10. Vì sao phải tách `AppContent` ra khỏi `App`?

Vì `useTheme()` chỉ chạy được khi component nằm **bên trong** `ThemeProvider`. `App` là nơi render Provider nên bản thân nó nằm *ngoài* Provider và không gọi được hook. `AppContent` được đặt bên trong Provider nên mới đọc được `isDark` để đổi màu `StatusBar`.

## B. Profile state

### 11. Profile được lưu ở đâu?

Profile được lưu trong `useState` của `ProfileProvider`. State gồm `name`, `bio`, `avatar` và chỉ tồn tại trong bộ nhớ của phiên app hiện tại.

### 12. `ProfileContext` có dùng local state không?

Có. Context chỉ là cách phân phối dữ liệu; dữ liệu thực tế vẫn được giữ bằng `useState(initialProfile)` trong `ProfileProvider`.

### 13. Save profile hoạt động như thế nào?

Formik validate form bằng Yup. Nếu hợp lệ, `onSubmit` trim khoảng trắng hai đầu, gọi `updateProfile({ name, bio })`, rồi `navigation.goBack()` về Profile.

### 14. `updateProfile()` làm gì?

Hàm dùng functional update để tạo object mới: giữ field cũ bằng spread và ghi đè các field mới. Nhờ đó avatar vẫn được giữ khi chỉ sửa name/bio.

### 15. Vì sao ProfileScreen tự cập nhật sau khi save?

ProfileScreen gọi `useProfile()`, nên nó là consumer của ProfileContext. Khi context state thay đổi, React render lại ProfileScreen và ProfileCard với dữ liệu mới.

### 16. Dữ liệu Edit Profile có truyền qua navigation params không?

Không. Dữ liệu được lưu vào **shared state (ProfileContext)** chứ không truyền qua `navigation` params. Đó là lý do khi `goBack()` về Profile, màn hình thấy ngay giá trị mới mà không cần nhận tham số nào.

### 17. Dữ liệu có lưu vào database không?

Không. Assignment không yêu cầu backend hoặc lưu bền vững. Dữ liệu chỉ nằm trong React state.

### 18. Nếu tắt app mở lại thì dữ liệu còn không?

Không. Khi app khởi động lại, `ProfileProvider` được tạo mới với `initialProfile`. Muốn giữ dữ liệu cần thêm persistence như AsyncStorage hoặc database.

### 19. Vì sao hiện tại không cần database?

Mục tiêu Assignment là minh họa navigation, state management, Context, form và validation. Database sẽ tăng độ phức tạp ngoài phạm vi mà không giúp chứng minh yêu cầu chính.

### 20. Nếu muốn lưu profile lâu dài thì cần thêm gì?

Có thể dùng AsyncStorage cho dữ liệu local đơn giản, hoặc API/database nếu cần đồng bộ tài khoản. Tuy nhiên không nên thêm vào phiên bản Assignment hiện tại khi chưa được yêu cầu.

## C. Context API và Theme

### 21. Context API là gì?

Context API là cơ chế của React để cung cấp dữ liệu cho nhiều component con mà không cần truyền props qua từng tầng trung gian.

### 22. ThemeContext khác một `useState` đặt trong SettingsScreen thế nào?

Nếu state chỉ nằm trong SettingsScreen, màn hình khác không biết theme đã đổi. ThemeContext đặt state ở cấp app và phân phối nó cho mọi screen/component.

### 23. Theme được đổi như thế nào?

Switch gọi `toggleTheme()`. Hàm đổi `themeMode` giữa `light` và `dark`; ThemeContext chọn bảng màu tương ứng và các consumer render lại.

### 24. Vì sao toàn bộ app đổi màu cùng lúc?

Mọi screen và component đều đọc `colors` từ cùng ThemeContext. Khi Context value đổi, React thông báo các consumer và render lại chúng với palette mới.

### 25. Màu light/dark được quản lý ở đâu?

`src/theme/colors.js` khai báo `lightColors` và `darkColors` với **cùng tập key**. ThemeContext chọn một object và component đọc màu bằng `useTheme()`, ví dụ `colors.primary`, `colors.background`.

### 26. `useMemo` trong Context để làm gì?

Nó giữ object `value` **ổn định tham chiếu** giữa các lần render không liên quan; chỉ tạo object mới khi dependency (`isDark`, `themeMode` hoặc `profile`) thay đổi. Consumer của context re-render theo identity của `value`, nên việc này tránh re-render thừa.

### 27. Vì sao Context được khởi tạo bằng `undefined`?

Để **bắt lỗi dùng sai**: nếu ai đó gọi `useTheme()`/`useProfile()` bên ngoài Provider, giá trị context sẽ là `undefined` và custom hook ném `Error` với thông báo rõ ràng, giúp phát hiện bug sớm thay vì lỗi khó hiểu ở nơi khác.

## D. Formik và Yup

### 28. Vì sao dùng Formik?

Formik quản lý values, errors, touched, blur, change và submit. Nó giảm số lượng state/handler thủ công và làm flow form rõ ràng hơn.

### 29. Vì sao dùng Yup?

Yup cho phép khai báo luật validation tập trung trong schema. Formik có thể dùng trực tiếp schema qua `validationSchema` và ánh xạ lỗi đúng field.

### 30. Form validate Name như thế nào?

Yup `.test()` kiểm tra độ dài sau `value.trim()`. Name chỉ có khoảng trắng sẽ bị required; name có một ký tự sau trim sẽ bị lỗi tối thiểu 2 ký tự. Lưu ý: code **tự viết `.test()`** thay vì dùng `.required()`/`.min()` mặc định để kiểm tra trên giá trị đã trim.

### 31. Form validate Bio như thế nào?

Yup `.test()` yêu cầu `value.trim().length` lớn hơn 0. Vì vậy chuỗi chỉ gồm khoảng trắng không hợp lệ.

### 32. `validateOnBlur` là gì?

Nó cho Formik chạy validation khi input mất focus. Người dùng hoàn thành việc nhập field rồi mới thấy lỗi.

### 33. `validateOnChange={false}` để làm gì?

Nó tắt validation sau mỗi ký tự. Điều này tránh validate quá liên tục và giúp quá trình nhập dấu tiếng Việt ổn định hơn.

### 34. Vì sao không trim hoặc regex trong `onChangeText`?

Bộ gõ tiếng Việt có quá trình composition (ghép dấu qua nhiều bước). Nếu code liên tục biến đổi rồi gán lại controlled value, nó có thể làm mất dấu hoặc nhảy con trỏ. App truyền text thẳng vào `handleChange`.

### 35. Vì sao được trim khi submit?

Lúc submit người dùng đã gõ xong. Trim chỉ xóa khoảng trắng hai đầu trước khi lưu và không can thiệp vào quá trình ghép dấu.

### 36. Controlled input là gì?

Là input nhận `value` từ state và cập nhật state qua `onChangeText` — *state là nguồn sự thật, UI chỉ phản chiếu state*. Trong app, Formik quản lý state đó, nên nội dung TextInput luôn đồng bộ với `values.name` hoặc `values.bio`.

### 37. `touched` trong Formik dùng để làm gì?

`touched` cho biết người dùng đã tương tác và rời khỏi field hay chưa. App chỉ hiển thị lỗi khi field đã touched (`error={touched.name ? errors.name : undefined}`), nên không báo đỏ ngay khi vừa mở form.

## E. Navigation và UI

### 38. `navigation.navigate()` khác `navigation.goBack()` thế nào?

`navigate()` đi tới một route theo tên. `goBack()` pop màn hình hiện tại khỏi stack và quay về màn hình trước đó.

### 39. `AppHeader` xử lý back button ra sao?

Screen truyền `navigation.goBack` qua prop `onBack`. Nếu prop tồn tại, AppHeader hiển thị icon mũi tên và gọi callback khi nhấn. Home/Profile không truyền `onBack` nên không có nút back.

### 40. Vì sao header tự vẽ mà không dùng header của navigation?

Navigator đã tắt header mặc định bằng `headerShown: false` để chủ động hoàn toàn về giao diện; app dùng `AppHeader` riêng với tiêu đề căn giữa và nút back tùy chọn.

### 41. Avatar hiện được xử lý thế nào?

Profile state có field `avatar`, mặc định là ảnh cục bộ `src/assets/images/AvatarProfile.png` được nạp bằng `require()` trong `ProfileContext`. Component `Avatar` render `Image` khi có `source`; nếu `source` rỗng thì hiển thị icon `person` làm fallback. Khi lưu name/bio, avatar không mất vì `updateProfile` merge state bằng spread.

### 42. Vì sao không cho sửa Email hoặc Avatar?

Đề bài quy định Edit Profile chỉ chỉnh Name và Bio, không thêm Email. Avatar vẫn nằm trong model profile nhưng không có input chỉnh sửa.

### 43. Vì sao tách reusable component?

Để giảm lặp code, giữ style và behavior nhất quán, đồng thời làm screen tập trung vào flow. Ví dụ sửa chiều cao button trong `AppButton` sẽ áp dụng cho mọi nơi dùng button.

### 44. `SafeAreaView` để làm gì?

Nó thêm khoảng inset để nội dung không bị status bar, notch, camera cutout hoặc home indicator che. Mỗi screen đều dùng SafeAreaView từ `react-native-safe-area-context`.

### 45. `SafeAreaProvider` khác `SafeAreaView` thế nào?

Provider đo và cung cấp thông tin safe area ở root. SafeAreaView sử dụng thông tin đó để áp padding phù hợp cho screen.

### 46. `ScrollView` để làm gì?

Nó cho phép nội dung cuộn khi màn hình nhỏ, khi font lớn hoặc khi bàn phím chiếm không gian. Nhờ đó form và button vẫn truy cập được.

### 47. `KeyboardAvoidingView` để làm gì?

Trên iOS, nó dịch/chỉnh vùng nội dung khi bàn phím mở để input không bị che (`behavior='padding'`). Android xử lý sẵn nên để `undefined`. Edit Profile kết hợp nó với ScrollView.

### 48. App responsive bằng cách nào?

App dùng Flexbox, `flexGrow`, phần trăm chiều rộng, `maxWidth`, padding và ScrollView; không khóa theo một chiều cao màn hình cụ thể.

### 49. App đã đáp ứng Assignment như thế nào?

App có đúng bốn screen, Native Stack, profile state bằng `useState` trong Context, theme bằng Context API, Edit Profile dùng Formik/Yup, reusable components, SafeAreaView và layout Flexbox responsive; không có Router, Bottom Tabs, Search, Email hay backend.
