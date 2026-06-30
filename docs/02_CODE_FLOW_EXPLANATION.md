# 02. Giải thích luồng code

## Flow 1: App khởi động

### Bước 1: Expo đọc `package.json`

Trong `package.json`, trường `main` có giá trị `index.js`. Vì vậy Expo chạy `index.js` thay vì tìm route trong thư mục `app/`. Đây là một dấu hiệu rõ ràng cho thấy project không dùng Expo Router.

### Bước 2: `index.js` đăng ký root component

`index.js` thực hiện ba việc:

1. Import `react-native-gesture-handler` trước các phần navigation.
2. Import root component `App` từ `App.js`.
3. Gọi `registerRootComponent(App)` của Expo.

`registerRootComponent` đăng ký component gốc và chuẩn bị môi trường chạy phù hợp cho Android, iOS và web.

### Bước 3: `App.js` tạo các provider dùng chung

Thứ tự render là:

```text
SafeAreaProvider
└── ThemeProvider
    └── ProfileProvider
        └── AppContent
            ├── StatusBar
            └── AppNavigator
```

`SafeAreaProvider` cung cấp thông tin vùng an toàn của màn hình. `ThemeProvider` cung cấp theme cho toàn app. `ProfileProvider` cung cấp dữ liệu profile cho mọi screen.

Hai provider được đặt ở `App.js` vì navigator và toàn bộ screen đều nằm bên dưới. Nếu provider chỉ đặt trong một screen, screen khác sẽ không đọc được state chung.

`AppContent` nằm bên trong `ThemeProvider`, vì nó cần gọi `useTheme()` để đổi `StatusBar` sang chữ sáng khi dark mode và chữ tối khi light mode.

### Bước 4: `AppNavigator` được render

`AppNavigator` đọc màu từ `ThemeContext`, tạo navigation theme, rồi render `NavigationContainer` và `Stack.Navigator`. `initialRouteName="Home"` khiến `HomeScreen` là màn hình đầu tiên.

## Flow 2: Navigation

### Vì sao dùng Stack Navigator?

Luồng ứng dụng có quan hệ trước/sau rõ ràng: Home mở Profile, Profile mở Edit hoặc Settings, sau đó người dùng quay lại. Stack Navigator phù hợp vì nó hoạt động như một chồng màn hình:

```text
Home
Home → Profile
Home → Profile → EditProfile
Home → Profile → Settings
```

Màn hình mới được push lên trên; `goBack()` loại màn hình trên cùng và hiển thị màn hình ngay bên dưới.

### Home đi sang Profile

Trong `HomeScreen`, nút `View My Profile` nhận callback:

```js
onPress={() => navigation.navigate('Profile')}
```

Tên `Profile` phải trùng với tên đã đăng ký trong `Stack.Screen`.

### Profile đi sang Edit Profile và Settings

`ProfileScreen` có hai nút:

```js
navigation.navigate('EditProfile')
navigation.navigate('Settings')
```

React Navigation tìm route tương ứng trong `AppNavigator` và render component đã đăng ký.

### `navigation.goBack()` hoạt động thế nào?

`EditProfileScreen` và `SettingsScreen` truyền `navigation.goBack` vào `AppHeader`. Khi người dùng nhấn mũi tên, Native Stack pop route hiện tại. Nút Cancel và flow save thành công trên Edit Profile cũng gọi `goBack()`.

`goBack()` không tạo screen mới; nó quay về instance Profile đã có trong stack. Vì vậy lịch sử navigation được giữ đúng.

## Flow 3: Hiển thị Profile

### Profile data nằm ở đâu?

Profile nằm trong state của `ProfileProvider`:

```js
const [profile, setProfile] = useState(initialProfile);
```

Giá trị mặc định gồm:

- `name: 'Nguyen Van A'`
- `bio: 'React Native learner building clean mobile apps.'`
- `avatar: null`

### ProfileScreen lấy dữ liệu như thế nào?

`ProfileScreen` gọi custom hook:

```js
const { profile } = useProfile();
```

Hook lấy object hiện tại từ `ProfileContext`. Screen truyền nguyên object vào `ProfileCard`:

```jsx
<ProfileCard profile={profile} />
```

### `ProfileCard` nhận props gì?

- `profile`: object có `name`, `bio`, `avatar`.
- `compact`: boolean tùy chọn, mặc định là `false`.

Khi `compact={true}`, card hiển thị nội dung welcome cho Home. Khi `false`, card hiển thị đầy đủ dữ liệu profile.

`Avatar` nhận `profile.avatar`. Vì avatar hiện là `null`, component hiển thị icon `person` làm fallback. Nếu sau này có source ảnh cục bộ hợp lệ, `Avatar` sẽ render `Image`.

### Vì sao tách `ProfileCard`?

Home và Profile đều cần phần avatar/profile nhưng cách trình bày hơi khác nhau. Một component có prop `compact` giúp tái sử dụng logic, giữ style thống nhất và tránh copy nhiều đoạn JSX.

## Flow 4: Save Profile

### Dữ liệu đang ở đâu khi người dùng nhập?

Khi form mở, Formik sao chép profile hiện tại vào `initialValues`:

```js
initialValues={{ name: profile.name, bio: profile.bio }}
```

Trong lúc người dùng gõ, dữ liệu mới nằm trong `values.name` và `values.bio` của Formik, chưa ghi ngay vào `ProfileContext`.

### Formik quản lý `values` thế nào?

Mỗi `FormInput` là controlled input:

```jsx
value={values.name}
onChangeText={handleChange('name')}
onBlur={handleBlur('name')}
```

`value` đến từ Formik. Khi `TextInput` phát sinh text mới, `handleChange('name')` cập nhật đúng field trong state nội bộ của Formik. Code không regex, trim, replace hay normalize trong `onChangeText`, nên không phá quá trình ghép dấu tiếng Việt.

### Yup validate ở bước nào?

Form có:

```jsx
validateOnBlur
validateOnChange={false}
```

Vì vậy Yup không chạy sau mỗi ký tự. Validation chạy khi input mất focus hoặc khi người dùng submit.

Schema dùng `.test()` để đọc `value.trim().length`:

- Name rỗng sau khi bỏ khoảng trắng hai đầu → `Name is required.`
- Name ngắn hơn 2 ký tự sau khi trim → lỗi min length.
- Bio rỗng sau khi trim → `Bio is required.`

`String.trim()` trả về chuỗi mới; các test chỉ đọc kết quả trong lúc validate và không gán ngược vào `values`, nên text đang gõ không bị mutate.

### Điều gì xảy ra khi bấm Save Changes?

1. `AppButton` gọi `handleSubmit` của Formik.
2. Formik chạy Yup schema.
3. Nếu có lỗi, `onSubmit` không chạy và lỗi được hiển thị dưới input.
4. Nếu hợp lệ, Formik gọi `onSubmit(values, helpers)`.
5. `onSubmit` trim khoảng trắng hai đầu của name/bio vì người dùng đã gõ xong.
6. `updateProfile()` cập nhật context.
7. `setSubmitting(false)` kết thúc trạng thái submitting.
8. `navigation.goBack()` quay về Profile.

Đoạn cập nhật là:

```js
updateProfile({
  name: values.name.trim(),
  bio: values.bio.trim(),
});
```

### `updateProfile()` lưu dữ liệu ở đâu?

`updateProfile` gọi functional state update:

```js
setProfile((current) => ({ ...current, ...updates }))
```

Object mới giữ các field cũ như avatar và ghi đè field được gửi lên như name/bio. Dữ liệu chỉ nằm trong RAM của phiên chạy hiện tại.

### Vì sao không cần database?

Assignment yêu cầu state management cục bộ và không yêu cầu lưu lâu dài hoặc đồng bộ nhiều thiết bị. `useState` trong Context đủ để chứng minh luồng nhập, validate, cập nhật và render lại.

### Vì sao ProfileScreen tự cập nhật?

`ProfileScreen` đã subscribe `ProfileContext` qua `useProfile()`. Khi `profile` đổi, React render lại mọi consumer cần giá trị đó. `ProfileCard` nhận props mới và hiển thị name/bio mới mà không cần gọi API hay refresh thủ công.

### Vì sao reload app thì dữ liệu quay về mặc định?

State nằm trong bộ nhớ. Khi app bị đóng hoặc JavaScript bundle reload, `ProfileProvider` được tạo lại và `useState(initialProfile)` chạy lại. Muốn lưu lâu dài cần thêm persistence như AsyncStorage hoặc database, nhưng đó không thuộc phạm vi Assignment hiện tại.

## Flow 5: Theme Light/Dark

### Theme state nằm ở đâu?

`ThemeProvider` giữ:

```js
const [themeMode, setThemeMode] = useState('light');
```

`isDark` được tính bằng `themeMode === 'dark'`. `colors` chọn `darkColors` khi `isDark` là true, ngược lại chọn `lightColors`.

### Settings gọi `toggleTheme()` như thế nào?

`SettingsScreen` render `ThemeToggleSwitch`. Component này gọi:

```js
const { colors, isDark, toggleTheme } = useTheme();
```

`Switch` nhận `value={isDark}` và `onValueChange={toggleTheme}`. Khi toggle, hàm đổi `light` thành `dark` hoặc ngược lại.

### Vì sao toàn app đổi màu?

Khi `themeMode` đổi, `ThemeProvider` tạo Context value mới. Các component đang dùng `useTheme()` được render lại với object `colors` mới. Điều này áp dụng cho:

- Nền và card của tất cả screen.
- Text, button, border và icon.
- NavigationContainer theme.
- StatusBar.
- Theme preview trên Settings.

### Context tránh prop drilling thế nào?

Nếu không có Context, `colors` và `toggleTheme` phải được truyền từ `App` qua navigator, screen, card rồi đến component con. Context cho phép bất kỳ component con nào gọi `useTheme()` trực tiếp, miễn là nó nằm trong `ThemeProvider`.

## Flow 6: Form validation

### Vì sao dùng Formik?

Formik quản lý các phần thường lặp của form: initial values, current values, touched, errors, submitting, change, blur và submit. Nhờ đó screen không cần tạo nhiều `useState` và handler riêng cho từng field.

### Vì sao dùng Yup?

Yup tách luật validation khỏi JSX, giúp schema dễ đọc và dễ kiểm tra. Formik nhận schema qua `validationSchema` và tự ánh xạ lỗi về field `name` hoặc `bio`.

### `validateOnChange={false}` có tác dụng gì?

Formik không validate mỗi lần `onChangeText` chạy. Người dùng có thể hoàn thành việc gõ, đặc biệt là quá trình ghép dấu tiếng Việt, trước khi nhận lỗi. Validation vẫn chạy khi blur và submit.

### Vì sao không trim/filter khi đang gõ tiếng Việt?

Bộ gõ tiếng Việt có thể tạo chuỗi qua nhiều bước composition. Nếu `onChangeText` liên tục trim, normalize, replace hoặc regex filter rồi gán lại `value`, vị trí con trỏ và chuỗi composition có thể bị thay đổi, gây mất dấu hoặc nhập khó. Project truyền text thẳng vào `handleChange` nên giữ nguyên chuỗi từ bàn phím.

### Vì sao có thể trim khi submit?

Khi submit, người dùng đã hoàn tất nhập. Trim lúc này chỉ làm sạch khoảng trắng vô tình ở hai đầu trước khi lưu; nó không can thiệp vào composition đang diễn ra và không loại bỏ dấu tiếng Việt.

### Controlled input là gì?

Controlled input là `TextInput` có giá trị được điều khiển bởi state:

```jsx
<TextInput value={values.name} onChangeText={handleChange('name')} />
```

UI luôn phản ánh `values.name`. Mỗi thay đổi đi qua handler để cập nhật state. Điều quan trọng là handler không tự mutate giá trị giữa quá trình nhập.

## Flow 7: Reusable Components

### `AppHeader`

Chuẩn hóa chiều cao, tiêu đề giữa màn hình và back button. Screen chỉ truyền `title` và tùy chọn `onBack`.

### `AppButton`

Chuẩn hóa màu, chiều cao, border radius, icon, loading, disabled và hiệu ứng pressed. Prop `variant` cho phép dùng primary hoặc secondary mà không lặp style.

### `FormInput`

Ghép label, TextInput, error icon và error message. Nó nhận các props Formik từ screen nên có thể dùng lại cho Name và Bio.

### `ProfileCard`

Đóng gói cách hiển thị profile. Prop `compact` cho phép tái sử dụng trên Home và Profile.

### `ThemeToggleSwitch`

Đóng gói icon, mô tả, Switch và hành vi toggle theme. Settings không cần biết chi tiết cách Switch hoạt động.

### `Avatar`

Đóng gói ảnh/avatar fallback, kích thước và border theo theme. Nhiều màn hình có thể hiển thị avatar nhất quán.

### Lợi ích chung

- Giảm code lặp.
- Dễ đổi style ở một nơi.
- Screen tập trung vào flow thay vì chi tiết UI.
- Dễ kiểm thử và tái sử dụng.
- Giữ giao diện light/dark nhất quán.
