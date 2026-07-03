# EXPLANATION.md — Giải thích chi tiết source code

> Tài liệu ôn tập bảo vệ **Assignment 1: Multi-Screen Profile App** (React Native + Expo).
> Mọi giải thích bám đúng code thực tế trong `src/`, có trích **tên file + số dòng** để bạn mở đúng chỗ kiểm chứng.
> Quy ước: mỗi điểm đều cố gắng trả lời 3 câu — **(a) làm gì**, **(b) tại sao cần**, **(c) khái niệm liên quan**.

---

## Mục lục

- [Tổng quan công nghệ (từ package.json)](#tổng-quan-công-nghệ-từ-packagejson)
- [Sơ đồ luồng khởi động & cây Provider](#sơ-đồ-luồng-khởi-động--cây-provider)
- [PHẦN 1 — Giải thích từng file](#phần-1--giải-thích-từng-file)
  - [1. `index.js` — Điểm vào](#1-indexjs--điểm-vào)
  - [2. `App.js` — Root component](#2-appjs--root-component)
  - [3. `src/context/ThemeContext.js` — Context theme](#3-srccontextthemecontextjs--context-theme)
  - [4. `src/context/ProfileContext.js` — Context profile](#4-srccontextprofilecontextjs--context-profile)
  - [5. `src/theme/colors.js` — Bảng màu](#5-srcthemecolorsjs--bảng-màu)
  - [6. `src/navigation/AppNavigator.js` — Điều hướng](#6-srcnavigationappnavigatorjs--điều-hướng)
  - [7. `src/screens/HomeScreen.js`](#7-srcscreenshomescreenjs)
  - [8. `src/screens/ProfileScreen.js`](#8-srcscreensprofilescreenjs)
  - [9. `src/screens/EditProfileScreen.js`](#9-srcscreenseditprofilescreenjs)
  - [10. `src/screens/SettingsScreen.js`](#10-srcscreenssettingsscreenjs)
  - [11. `src/components/AppHeader.js`](#11-srccomponentsappheaderjs)
  - [12. `src/components/Avatar.js`](#12-srccomponentsavatarjs)
  - [13. `src/components/ProfileCard.js`](#13-srccomponentsprofilecardjs)
  - [14. `src/components/AppButton.js`](#14-srccomponentsappbuttonjs)
  - [15. `src/components/FormInput.js`](#15-srccomponentsforminputjs)
  - [16. `src/components/ThemeToggleSwitch.js`](#16-srccomponentsthemetoggleswitchjs)
- [PHẦN 2 — DEEP DIVE: Luồng đổi Theme (Light/Dark)](#phần-2--deep-dive-luồng-đổi-theme-lightdark)
- [PHẦN 3 — DEEP DIVE: Luồng Edit Profile](#phần-3--deep-dive-luồng-edit-profile)
- [CÂU HỎI GIẢNG VIÊN CÓ THỂ HỎI & GỢI Ý TRẢ LỜI](#câu-hỏi-giảng-viên-có-thể-hỏi--gợi-ý-trả-lời)

---

## Tổng quan công nghệ (từ package.json)

Nguồn: [package.json](package.json). Các thư viện chính và vai trò:

| Thư viện | Vai trò trong app |
|---|---|
| `expo ~54.0.34` | Nền tảng chạy/đóng gói app React Native (Expo Go, dev build). |
| `react 19.1.0` / `react-native 0.81.5` | Thư viện UI và runtime native. Cung cấp `useState`, `useContext`, `useMemo`, component (`View`, `Text`, `TextInput`, `Pressable`, `Switch`...). |
| `@react-navigation/native` + `@react-navigation/native-stack` | Điều hướng nhiều màn (stack navigator). |
| `react-native-screens`, `react-native-gesture-handler`, `react-native-safe-area-context` | Phụ thuộc nền cho navigation + xử lý vùng an toàn (tai thỏ, status bar). |
| `formik 2.4.9` | Quản lý state form (values, errors, touched, submit) ở màn Edit Profile. |
| `yup 1.7.1` | Định nghĩa **validationSchema** kiểm tra dữ liệu form trước khi lưu. |
| `@expo/vector-icons` | Bộ icon `Ionicons` dùng khắp app. |
| `expo-status-bar` | Điều khiển màu chữ/icon trên thanh status. |

**Kiến trúc tổng:** App dùng **2 Context** làm "global state" — `ThemeContext` (giao diện sáng/tối) và `ProfileContext` (thông tin người dùng) — cộng với **React Navigation** để chuyển giữa 4 màn: Home → Profile → EditProfile / Settings.

---

## Sơ đồ luồng khởi động & cây Provider

```
index.js  (registerRootComponent)
   └─ App.js
        └─ SafeAreaProvider
             └─ ThemeProvider        ← cấp { colors, isDark, toggleTheme }
                  └─ ProfileProvider  ← cấp { profile, updateProfile }
                       └─ AppContent
                            ├─ StatusBar (màu theo theme)
                            └─ AppNavigator (NavigationContainer + Stack)
                                 ├─ HomeScreen     (route "Home", màn đầu)
                                 ├─ ProfileScreen  (route "Profile")
                                 ├─ EditProfileScreen (route "EditProfile")
                                 └─ SettingsScreen (route "Settings")
```

Thứ tự Provider quan trọng: `ThemeProvider`/`ProfileProvider` phải **bọc bên ngoài** mọi screen thì các screen mới gọi được `useTheme()` / `useProfile()`.

---

# PHẦN 1 — Giải thích từng file

> Đi theo đúng thứ tự app khởi động.

---

## 1. `index.js` — Điểm vào

File: [index.js](index.js) (13 dòng).

**Vai trò:** entry point thật sự của app Expo — nơi React được gắn vào thiết bị.

**Import / lệnh:**
- [index.js:5](index.js#L5) `import 'react-native-gesture-handler';`
  - (a) Import dạng **side-effect** (không lấy biến nào, chỉ chạy code khởi tạo của thư viện).
  - (b) `react-native-screens` / navigation cần gesture-handler được nạp **sớm nhất**; tài liệu yêu cầu đặt dòng này ở **đầu file entry**, nếu đặt sau dễ lỗi cử chỉ vuốt.
  - (c) *Side-effect import* = import chỉ để chạy, khác với `import X from '...'` lấy giá trị.
- [index.js:7](index.js#L7) `import { registerRootComponent } from 'expo';` — lấy hàm đăng ký component gốc của Expo.
- [index.js:9](index.js#L9) `import App from './App';` — lấy component `App` (root) để đăng ký.
- [index.js:12](index.js#L12) `registerRootComponent(App);`
  - (a) Đăng ký `App` làm component gốc.
  - (b) Hàm này bọc sẵn `AppRegistry.registerComponent` của React Native và xử lý khác biệt giữa **Expo Go** và **native build**, nên dùng nó thay vì tự gọi `AppRegistry`.

---

## 2. `App.js` — Root component

File: [App.js](App.js) (44 dòng).

**Vai trò:** dựng **cây Provider** (SafeArea → Theme → Profile) bao toàn app rồi render `AppNavigator`. Đây là nơi khởi tạo state dùng chung.

**Import:**
- [App.js:6](App.js#L6) `StatusBar` (expo-status-bar) — component điều khiển màu thanh status.
- [App.js:7](App.js#L7) `SafeAreaProvider, initialWindowMetrics` — Provider vùng an toàn + số đo khung hình ban đầu.
- [App.js:9-11](App.js#L9-L11) — `ProfileProvider`, `ThemeProvider` + `useTheme`, và `AppNavigator`.

**`function AppContent()` — [App.js:16-26](App.js#L16-L26)**
- (a) Đọc theme hiện tại rồi render `StatusBar` + `AppNavigator`.
- (b) **Tại sao tách riêng?** Vì `useTheme()` chỉ chạy được khi component nằm **bên trong** `ThemeProvider`. `App` (cha) nằm *ngoài* Provider nên không gọi được hook; phải tách `AppContent` đặt vào bên trong.
- Dòng quan trọng:
  - [App.js:17](App.js#L17) `const { isDark } = useTheme();` — lấy cờ `isDark` từ ThemeContext.
    - (c) *useContext / custom hook*: `useTheme` là custom hook bọc `useContext` để đọc giá trị context.
  - [App.js:22](App.js#L22) `<StatusBar style={isDark ? 'light' : 'dark'} />` — theme tối → chữ status màu sáng cho dễ đọc.
    - (c) *JSX*: cú pháp giống HTML để mô tả UI trong JS; `{...}` nhúng biểu thức JS.
  - [App.js:20-24](App.js#L20-L24) dùng **Fragment** `<>...</>` để trả về 2 phần tử anh em mà không thêm `View` thừa.

**`export default function App()` — [App.js:32-43](App.js#L32-L43)**
- (a) Trả về cây UI gốc: `SafeAreaProvider` → `ThemeProvider` → `ProfileProvider` → `AppContent`.
- (b) **Thứ tự lồng nhau** quyết định phạm vi: vì `AppContent` (và toàn bộ navigator bên trong) nằm trong cả hai Provider nên **mọi màn** đều dùng được theme và profile.
- [App.js:34](App.js#L34) `initialMetrics={initialWindowMetrics}` — cấp số đo khung ngay từ đầu để tránh "nhảy layout" (flicker) khi đo vùng an toàn.

---

## 3. `src/context/ThemeContext.js` — Context theme

File: [src/context/ThemeContext.js](src/context/ThemeContext.js) (50 dòng). **Đây là trái tim của luồng đổi theme.**

**Vai trò:** tạo và cung cấp state theme (sáng/tối) cho toàn app.

**Import — [ThemeContext.js:6-8](src/context/ThemeContext.js#L6-L8):**
- `createContext` — tạo "kênh" truyền dữ liệu xuyên cây component.
- `useContext` — đọc dữ liệu từ kênh đó.
- `useMemo` — ghi nhớ (cache) một giá trị, chỉ tính lại khi dependency đổi.
- `useState` — tạo state cục bộ trong component.
- `darkColors, lightColors` — 2 bảng màu nhập từ `theme/colors.js`.

**[ThemeContext.js:11](src/context/ThemeContext.js#L11)** `const ThemeContext = createContext(undefined);`
- (a) Tạo context, giá trị mặc định `undefined`.
- (b) Để `undefined` **có chủ đích**: nếu ai đó dùng `useTheme()` ngoài Provider, context sẽ là `undefined` và ta ném lỗi (xem dòng 44) → bắt bug sớm.
- (c) *Context API*: cơ chế của React để chia sẻ dữ liệu mà không truyền props qua từng tầng.

**`ThemeProvider({ children })` — [ThemeContext.js:16-35](src/context/ThemeContext.js#L16-L35)**
- (a) Bọc cây con và cấp giá trị theme xuống.
- (b) `children` là **props đặc biệt** — phần JSX được đặt giữa `<ThemeProvider>...</ThemeProvider>` (chính là `<ProfileProvider>` trong App.js).
- Dòng quan trọng:
  - [ThemeContext.js:18](src/context/ThemeContext.js#L18) `const [themeMode, setThemeMode] = useState('light');`
    - (a) Tạo state `themeMode` khởi tạo `'light'`, kèm hàm cập nhật `setThemeMode`.
    - (b) Đây là **nguồn sự thật duy nhất (single source of truth)** của theme. Đổi nó = đổi cả app.
    - (c) *useState*: trả về `[giá trị, hàm set]`; gọi hàm set sẽ khiến component **re-render**.
  - [ThemeContext.js:19](src/context/ThemeContext.js#L19) `const isDark = themeMode === 'dark';` — cờ boolean tiện dụng suy ra từ `themeMode`.
  - [ThemeContext.js:22-32](src/context/ThemeContext.js#L22-L32) `const value = useMemo(() => ({...}), [isDark, themeMode]);`
    - (a) Gói các thứ cần chia sẻ thành 1 object: `themeMode`, `isDark`, `colors`, `toggleTheme`.
    - (b) **Tại sao `useMemo`?** Giữ cho object `value` có **cùng tham chiếu (reference)** giữa các lần render không liên quan; chỉ tạo object mới khi `isDark`/`themeMode` đổi. Consumer của context re-render khi `value` đổi tham chiếu, nên việc này giúp tránh re-render thừa.
    - [ThemeContext.js:27](src/context/ThemeContext.js#L27) `colors: isDark ? darkColors : lightColors,` — **chọn bảng màu theo theme**. Toàn app lấy màu từ đây.
    - [ThemeContext.js:29](src/context/ThemeContext.js#L29) `toggleTheme: () => setThemeMode((current) => (current === 'light' ? 'dark' : 'light')),`
      - (a) Hàm đảo theme light ↔ dark.
      - (b) Dùng **updater function** `(current) => ...`: React đưa giá trị mới nhất của state vào `current`, an toàn hơn đọc biến `themeMode` cũ trong closure.
  - [ThemeContext.js:34](src/context/ThemeContext.js#L34) `return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;`
    - (a) `Provider` phát `value` xuống mọi component con.
    - (c) *Provider*: thành phần "phát sóng" giá trị; mọi `useContext(ThemeContext)` bên dưới nhận được `value`.

**`useTheme()` — [ThemeContext.js:41-49](src/context/ThemeContext.js#L41-L49)**
- (a) Custom hook đọc theme: `const context = useContext(ThemeContext);` ([dòng 42](src/context/ThemeContext.js#L42)).
- (b) Có guard [dòng 44-46](src/context/ThemeContext.js#L44-L46): nếu `context` rỗng (gọi ngoài Provider) → ném `Error` rõ ràng.
- (c) *Custom hook*: hàm bắt đầu bằng `use...` gói logic hook để tái dùng — ở đây giấu `useContext` + kiểm tra lỗi, nên ở các màn chỉ cần viết `useTheme()` gọn gàng.

---

## 4. `src/context/ProfileContext.js` — Context profile

File: [src/context/ProfileContext.js](src/context/ProfileContext.js) (51 dòng). **Cấu trúc song song hệt ThemeContext, nhưng giữ dữ liệu người dùng.**

**Vai trò:** lưu `profile` (name, bio, avatar) và cấp hàm `updateProfile` cho toàn app.

- [ProfileContext.js:9](src/context/ProfileContext.js#L9) `createContext(undefined)` — như Theme, để bắt lỗi dùng sai.
- [ProfileContext.js:12-16](src/context/ProfileContext.js#L12-L16) `const initialProfile = {...}`
  - (a) Giá trị mặc định khi mở app: `name`, `bio`, và `avatar: require('../assets/images/AvatarProfile.png')`.
  - (b) Dùng `require(...)` để **nạp ảnh tĩnh** (bundle sẵn) — đây là cách RN nhập asset cục bộ.

**`ProfileProvider({ children })` — [ProfileContext.js:21-36](src/context/ProfileContext.js#L21-L36)**
- [ProfileContext.js:22](src/context/ProfileContext.js#L22) `const [profile, setProfile] = useState(initialProfile);` — state giữ profile hiện tại.
- [ProfileContext.js:25-33](src/context/ProfileContext.js#L25-L33) `value = useMemo(...)` gồm `profile` và `updateProfile`.
  - [ProfileContext.js:30](src/context/ProfileContext.js#L30) `updateProfile: (updates) => setProfile((current) => ({ ...current, ...updates })),`
    - (a) Nhận `updates` (object phần cần đổi) và **gộp** vào profile cũ.
    - (b) Dùng **spread `{ ...current, ...updates }`**: giữ nguyên field cũ, ghi đè field mới → gọi `updateProfile({ name, bio })` chỉ đổi name & bio, **giữ nguyên avatar**.
    - (c) *Cập nhật bất biến (immutable update)*: không sửa trực tiếp object cũ mà tạo object mới — React mới nhận ra state đã đổi để re-render.

**`useProfile()` — [ProfileContext.js:42-50](src/context/ProfileContext.js#L42-L50)** — y hệt `useTheme`: đọc context, ném lỗi nếu dùng ngoài Provider, trả `{ profile, updateProfile }`.

---

## 5. `src/theme/colors.js` — Bảng màu

File: [src/theme/colors.js](src/theme/colors.js) (34 dòng).

**Vai trò:** tập trung toàn bộ mã màu (design tokens) ở 1 nơi.
- [colors.js:7-19](src/theme/colors.js#L7-L19) `export const lightColors = {...}` — bảng màu theme sáng.
- [colors.js:21-33](src/theme/colors.js#L21-L33) `export const darkColors = {...}` — bảng màu theme tối.
- (b) **Tại sao 2 object cùng key?** `ThemeContext` chỉ swap nguyên 1 trong 2 bảng vào `colors` ([ThemeContext.js:27](src/context/ThemeContext.js#L27)). Mọi component viết `colors.primary`, `colors.text`, `colors.background`... Nếu thiếu key ở một bảng thì khi đổi theme sẽ ra `undefined` → lỗi màu. Vì vậy 2 bảng **phải cùng tập key** (`background, card, text, textSecondary, primary, primaryLight, error, border, input, shadow, white`).

---

## 6. `src/navigation/AppNavigator.js` — Điều hướng

File: [src/navigation/AppNavigator.js](src/navigation/AppNavigator.js) (66 dòng).

**Vai trò:** khai báo 4 màn dạng **stack** và đồng bộ màu của React Navigation với theme.

**Import — [AppNavigator.js:6-14](src/navigation/AppNavigator.js#L6-L14):**
- `useMemo` (react), `NavigationContainer` (gốc chứa toàn bộ navigation), `createNativeStackNavigator` (tạo stack điều hướng), `useTheme`, và 4 screen.

- [AppNavigator.js:17](src/navigation/AppNavigator.js#L17) `const Stack = createNativeStackNavigator();`
  - (a) Tạo bộ navigator có `Stack.Navigator` và `Stack.Screen`.
  - (b) Đặt **ngoài** component để không tạo lại mỗi lần render.
  - (c) *Stack navigator*: các màn xếp chồng như ngăn xếp; mở màn mới = push lên, back = pop ra.

**`AppNavigator()` — [AppNavigator.js:21-65](src/navigation/AppNavigator.js#L21-L65)**
- [AppNavigator.js:22](src/navigation/AppNavigator.js#L22) `const { colors, isDark } = useTheme();` — lấy màu hiện tại.
- [AppNavigator.js:25-44](src/navigation/AppNavigator.js#L25-L44) `navigationTheme = useMemo(() => ({...}), [colors, isDark])`
  - (a) Map bảng `colors` của app sang đúng schema theme mà React Navigation yêu cầu (`dark`, `colors`, `fonts`).
  - (b) Nhờ vậy nền/khung mặc định của navigation cũng đổi theo theme. `useMemo` chỉ dựng lại object khi `colors/isDark` đổi.
- [AppNavigator.js:47](src/navigation/AppNavigator.js#L47) `<NavigationContainer theme={navigationTheme}>` — bọc toàn bộ điều hướng.
- [AppNavigator.js:49-56](src/navigation/AppNavigator.js#L49-L56) `<Stack.Navigator initialRouteName="Home" screenOptions={{...}}>`
  - `initialRouteName="Home"` → màn đầu là Home.
  - `headerShown: false` ([dòng 54](src/navigation/AppNavigator.js#L54)) → **tắt header mặc định**; app tự vẽ `AppHeader` riêng.
  - `animation: 'slide_from_right'` → hiệu ứng trượt khi chuyển màn.
  - `contentStyle.backgroundColor: colors.background` → nền màn theo theme.
- [AppNavigator.js:58-61](src/navigation/AppNavigator.js#L58-L61) khai báo 4 `Stack.Screen`:
  - `name` (`"Home"`, `"Profile"`, `"EditProfile"`, `"Settings"`) là **route name** dùng cho `navigation.navigate(name)`.
  - `component` là màn tương ứng.
  - (c) *navigation object*: React Navigation tự **truyền prop `navigation`** vào mỗi screen — đó là lý do các màn có `{ navigation }` để gọi `navigate()` / `goBack()`.

---

## 7. `src/screens/HomeScreen.js`

File: [src/screens/HomeScreen.js](src/screens/HomeScreen.js) (91 dòng).

**Vai trò:** màn chính — chào người dùng (ProfileCard bản gọn) + nút sang Profile.

- [HomeScreen.js:17](src/screens/HomeScreen.js#L17) `export default function HomeScreen({ navigation })` — nhận prop `navigation` từ navigator.
- [HomeScreen.js:18-19](src/screens/HomeScreen.js#L18-L19) `useProfile()` lấy `profile`, `useTheme()` lấy `colors`.
- [HomeScreen.js:22](src/screens/HomeScreen.js#L22) `<SafeAreaView edges={[...]} style={[styles.safeArea, { backgroundColor: colors.background }]}>`
  - (a) `SafeAreaView` né tai thỏ/status bar; nền lấy `colors.background`.
  - (c) *StyleSheet & style mảng*: `style={[a, b]}` gộp nhiều style; phần `{ backgroundColor: colors.x }` là style động theo theme đặt **sau** để ghi đè.
- [HomeScreen.js:23](src/screens/HomeScreen.js#L23) `<AppHeader title="Profile App" />` — **không** truyền `onBack` ⇒ Home không có nút back (đúng vì là màn gốc).
- [HomeScreen.js:39](src/screens/HomeScreen.js#L39) `<ProfileCard compact profile={profile} />` — bản gọn (lời chào).
- [HomeScreen.js:41-45](src/screens/HomeScreen.js#L41-L45) `<AppButton title="View My Profile" onPress={() => navigation.navigate('Profile')} ... />`
  - (a) Bấm nút → `navigation.navigate('Profile')` đẩy sang màn Profile.
  - (c) *navigate(routeName)*: chuyển tới route đã khai báo trong `AppNavigator`.

---

## 8. `src/screens/ProfileScreen.js`

File: [src/screens/ProfileScreen.js](src/screens/ProfileScreen.js) (82 dòng).

**Vai trò:** xem profile đầy đủ + 2 nút sang EditProfile và Settings.

- [ProfileScreen.js:17-19](src/screens/ProfileScreen.js#L17-L19) nhận `navigation`, lấy `profile` (useProfile), `colors` (useTheme).
- [ProfileScreen.js:23](src/screens/ProfileScreen.js#L23) `<AppHeader title="My Profile" />` — vẫn không có back (vào từ Home, back bằng cử chỉ/Android back).
- [ProfileScreen.js:31](src/screens/ProfileScreen.js#L31) `<ProfileCard profile={profile} />` — **không** truyền `compact` ⇒ bản đầy đủ (avatar lớn + name + bio + tags). **Đây là nơi giá trị name/bio mới sau khi Edit được hiển thị.**
- [ProfileScreen.js:35-40](src/screens/ProfileScreen.js#L35-L40) `AppButton "Edit Profile"` → `navigation.navigate('EditProfile')`.
- [ProfileScreen.js:42-48](src/screens/ProfileScreen.js#L42-L48) `AppButton "Settings"` `variant="secondary"` → `navigation.navigate('Settings')`.

---

## 9. `src/screens/EditProfileScreen.js`

File: [src/screens/EditProfileScreen.js](src/screens/EditProfileScreen.js) (200 dòng). **Màn phức tạp nhất — Formik + Yup. Đọc kỹ cho PHẦN 3.**

**Vai trò:** sửa name/bio, validate, lưu vào ProfileContext rồi quay lại.

**Import — [EditProfileScreen.js:6-16](src/screens/EditProfileScreen.js#L6-L16):**
- `KeyboardAvoidingView`, `Platform` — đẩy nội dung lên khi bàn phím hiện.
- `Formik` — quản lý state form. `* as Yup` — tạo schema validate.
- `AppButton`, `AppHeader`, `Avatar`, `FormInput`, `useProfile`, `useTheme`.

**`profileSchema` (Yup) — [EditProfileScreen.js:20-36](src/screens/EditProfileScreen.js#L20-L36)**
- (a) Định nghĩa **quy tắc hợp lệ** cho `name` và `bio`.
- (b) Đặt ngoài component để khỏi tạo lại mỗi render.
- Chi tiết:
  - [EditProfileScreen.js:23](src/screens/EditProfileScreen.js#L23) `.test('name-required', 'Name is required.', (value) => Boolean(value?.trim().length))`
    - name **bắt buộc**: rỗng hoặc toàn khoảng trắng → lỗi.
  - [EditProfileScreen.js:24-29](src/screens/EditProfileScreen.js#L24-L29) `.test('name-min-length', 'Name must be at least 2 characters.', (value) => !value?.trim().length || value.trim().length >= 2)`
    - name tối thiểu **2 ký tự** (sau khi `trim`). Vế `!value?.trim().length ||` bỏ qua kiểm tra khi rỗng → tránh hiện **2 lỗi cùng lúc** (đã có lỗi "required").
  - [EditProfileScreen.js:31-35](src/screens/EditProfileScreen.js#L31-L35) `bio: Yup.string().test('bio-required', 'Bio is required.', ...)` — bio bắt buộc.
- **Lưu ý chính xác:** code **không dùng** `.required()` / `.min()` mặc định mà tự viết bằng `.test()` để kiểm tra trên giá trị đã **`trim()`** (loại khoảng trắng thừa). Khi thầy hỏi, nên nói đúng điều này.
- (c) *validationSchema*: object Yup mô tả ràng buộc; Formik dùng nó để tự sinh `errors`.

**`EditProfileScreen({ navigation })` — [EditProfileScreen.js:41-141](src/screens/EditProfileScreen.js#L41-L141)**
- [EditProfileScreen.js:42](src/screens/EditProfileScreen.js#L42) `const { profile, updateProfile } = useProfile();` — lấy data hiện tại + hàm lưu.
- [EditProfileScreen.js:47](src/screens/EditProfileScreen.js#L47) `<AppHeader title="Edit Profile" onBack={navigation.goBack} />` — **có** `onBack` ⇒ hiện nút back.
- [EditProfileScreen.js:48-51](src/screens/EditProfileScreen.js#L48-L51) `KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}`
  - (a) Trên iOS dùng `'padding'`; Android để `undefined`.
  - (b) iOS bàn phím che ô nhập nên cần đẩy; Android xử lý sẵn nên không cần.

**`<Formik>` — [EditProfileScreen.js:52-65](src/screens/EditProfileScreen.js#L52-L65)**
- [EditProfileScreen.js:54](src/screens/EditProfileScreen.js#L54) `initialValues={{ name: profile.name, bio: profile.bio }}` — nạp giá trị hiện tại làm điểm xuất phát của form.
- [EditProfileScreen.js:56-57](src/screens/EditProfileScreen.js#L56-L57) `validateOnBlur` (validate khi rời ô) + `validateOnChange={false}` (**không** validate mỗi lần gõ → đỡ làm phiền).
- [EditProfileScreen.js:58](src/screens/EditProfileScreen.js#L58) `validationSchema={profileSchema}` — gắn schema Yup.
- [EditProfileScreen.js:60-64](src/screens/EditProfileScreen.js#L60-L64) `onSubmit={(values, { setSubmitting }) => {...}}`
  - (a) Chỉ chạy **khi dữ liệu hợp lệ**: `updateProfile({ name: values.name.trim(), bio: values.bio.trim() })` → `setSubmitting(false)` → `navigation.goBack()`.
  - (b) `trim()` để lưu sạch khoảng trắng; `goBack()` đóng màn, quay lại Profile.

**Render-props của Formik — [EditProfileScreen.js:74-82](src/screens/EditProfileScreen.js#L74-L82)**
- (a) Formik truyền vào 1 object gồm `errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values`.
- (c) *Render props*: Formik nhận **một function con** và gọi nó với state/handlers để bạn dựng UI.

**Ô nhập — [EditProfileScreen.js:107-126](src/screens/EditProfileScreen.js#L107-L126)** (xem chi tiết controlled input ở PHẦN 3)
- FormInput "Name": `error={touched.name ? errors.name : undefined}` ([108](src/screens/EditProfileScreen.js#L108)), `onBlur={handleBlur('name')}` ([110](src/screens/EditProfileScreen.js#L110)), `onChangeText={handleChange('name')}` ([111](src/screens/EditProfileScreen.js#L111)), `value={values.name}` ([114](src/screens/EditProfileScreen.js#L114)).
  - **Chỉ hiện lỗi khi `touched`** → không báo đỏ ngay khi vừa mở form.
- FormInput "Bio": tương tự, thêm `maxLength={220}` ([120](src/screens/EditProfileScreen.js#L120)) và `multiline` ([121](src/screens/EditProfileScreen.js#L121)).

**Nút hành động — [EditProfileScreen.js:129-134](src/screens/EditProfileScreen.js#L129-L134)**
- [EditProfileScreen.js:131](src/screens/EditProfileScreen.js#L131) `<AppButton loading={isSubmitting} title="Save Changes" onPress={handleSubmit} />` — bấm → `handleSubmit` (validate rồi mới `onSubmit`).
- [EditProfileScreen.js:133](src/screens/EditProfileScreen.js#L133) `<AppButton title="Cancel" ... onPress={navigation.goBack} />` — hủy, quay lại **không lưu**.

---

## 10. `src/screens/SettingsScreen.js`

File: [src/screens/SettingsScreen.js](src/screens/SettingsScreen.js) (131 dòng).

**Vai trò:** bật/tắt Dark Mode + xem trước (preview) màu theme. **Liên quan trực tiếp PHẦN 2.**

- [SettingsScreen.js:17-18](src/screens/SettingsScreen.js#L17-L18) nhận `navigation`, lấy `colors, isDark` từ `useTheme()`.
- [SettingsScreen.js:22](src/screens/SettingsScreen.js#L22) `<AppHeader title="Settings" onBack={navigation.goBack} />` — có nút back.
- [SettingsScreen.js:26](src/screens/SettingsScreen.js#L26) `<ThemeToggleSwitch />` — công tắc đổi theme (logic nằm trong component này).
- [SettingsScreen.js:31-40](src/screens/SettingsScreen.js#L31-L40) khối **THEME PREVIEW**:
  - [SettingsScreen.js:33](src/screens/SettingsScreen.js#L33) `<Ionicons name={isDark ? 'moon' : 'sunny'} ... />` — icon đổi theo theme.
  - [SettingsScreen.js:36](src/screens/SettingsScreen.js#L36) nhãn `{isDark ? 'Dark Mode' : 'Light Mode'}`.
  - [SettingsScreen.js:43-48](src/screens/SettingsScreen.js#L43-L48) `[colors.primary, colors.primaryLight, colors.background, colors.border].map((color, index) => <View key={...} .../>)`
    - (a) Render 4 ô màu mẫu của theme hiện tại.
    - (b) `key={`${color}-${index}`}` ghép màu + index để **key luôn duy nhất**, kể cả khi 2 màu trùng nhau.
    - (c) *key trong list*: React cần `key` ổn định/duy nhất để theo dõi từng phần tử khi render danh sách.

---

## 11. `src/components/AppHeader.js`

File: [src/components/AppHeader.js](src/components/AppHeader.js) (72 dòng).

**Vai trò:** thanh tiêu đề dùng chung (app tự vẽ vì navigator đã `headerShown:false`).

- [AppHeader.js:16](src/components/AppHeader.js#L16) `AppHeader({ title, onBack })` — props: tiêu đề + callback back (tùy chọn).
- [AppHeader.js:23-33](src/components/AppHeader.js#L23-L33) `{onBack ? (<Pressable ... onPress={onBack}>...) : null}`
  - (a) **Chỉ render nút back khi có `onBack`**. Home/Profile không truyền → không nút.
  - (c) *Conditional rendering*: `điều_kiện ? <JSX/> : null` để hiện/ẩn phần tử.
- [AppHeader.js:36-38](src/components/AppHeader.js#L36-L38) `<Text numberOfLines={1} ...>{title}</Text>` — tiêu đề 1 dòng (cắt nếu dài).
- [AppHeader.js:41](src/components/AppHeader.js#L41) `<View style={styles.side} />` — View rỗng cùng bề rộng vùng trái để tiêu đề **căn giữa tuyệt đối**.

---

## 12. `src/components/Avatar.js`

File: [src/components/Avatar.js](src/components/Avatar.js) (57 dòng).

**Vai trò:** ảnh đại diện hình tròn; thiếu ảnh thì hiện icon người.

- [Avatar.js:16](src/components/Avatar.js#L16) `Avatar({ source, size = 116, subtle = false })` — props với **default value** (`size`, `subtle`).
- [Avatar.js:19](src/components/Avatar.js#L19) `const borderWidth = subtle ? 4 : 5;` — viền mảnh khi `subtle`.
- [Avatar.js:29](src/components/Avatar.js#L29) `borderRadius: size / 2,` — bo tròn nửa cạnh ⇒ hình tròn hoàn hảo.
- [Avatar.js:36-41](src/components/Avatar.js#L36-L41) `{source ? <Image .../> : <Ionicons name="person" size={size * 0.64} .../>}`
  - (a) Có ảnh → `Image`; không → icon `person` cỡ ~64% đường kính (fallback).

---

## 13. `src/components/ProfileCard.js`

File: [src/components/ProfileCard.js](src/components/ProfileCard.js) (108 dòng).

**Vai trò:** khối hiển thị profile, **dùng lại ở 2 ngữ cảnh** qua prop `compact`.

- [ProfileCard.js:12](src/components/ProfileCard.js#L12) `const tags = ['Student', 'Mobile App', 'Dark Mode Ready'];` — danh sách tag tĩnh.
- [ProfileCard.js:19](src/components/ProfileCard.js#L19) `ProfileCard({ profile, compact = false })`.
- [ProfileCard.js:23-33](src/components/ProfileCard.js#L23-L33) `if (compact) { return (...) }`
  - (a) **Early return**: chế độ gọn (lời chào "Welcome Back!") cho màn Home.
  - (c) *Early return*: thoát hàm sớm với 1 nhánh UI, giúp tách rõ 2 biến thể.
- [ProfileCard.js:36-50](src/components/ProfileCard.js#L36-L50) nhánh đầy đủ:
  - [39](src/components/ProfileCard.js#L39) `{profile.name}`, [40](src/components/ProfileCard.js#L40) `{profile.bio}` — **hiển thị data thật từ Context** (đây là lý do sau khi Edit, Profile đổi theo).
  - [43-47](src/components/ProfileCard.js#L43-L47) `{tags.map((tag) => <View key={tag} ...>...)}` — render từng chip; `key={tag}` vì các tag duy nhất.

---

## 14. `src/components/AppButton.js`

File: [src/components/AppButton.js](src/components/AppButton.js) (94 dòng).

**Vai trò:** nút bấm dùng chung, 2 biến thể primary/secondary, hỗ trợ icon/loading/disabled.

- [AppButton.js:21-29](src/components/AppButton.js#L21-L29) props: `title, onPress, variant='primary', icon, disabled=false, loading=false, style`.
- [AppButton.js:32](src/components/AppButton.js#L32) `const isPrimary = variant === 'primary';` — cờ chọn màu.
- [AppButton.js:38](src/components/AppButton.js#L38) `disabled={disabled || loading}` — đang loading thì cũng khóa bấm (tránh submit 2 lần).
- [AppButton.js:40-50](src/components/AppButton.js#L40-L50) `style={({ pressed }) => [...]}`
  - (a) `Pressable` cho phép **style theo trạng thái**: hàm nhận `{ pressed }`.
  - [44-45](src/components/AppButton.js#L44-L45) màu nền/viền theo `isPrimary`.
  - [47](src/components/AppButton.js#L47) `opacity: disabled ? 0.55 : pressed ? 0.86 : 1` — phản hồi thị giác khi disabled/nhấn.
  - (c) *Pressable*: component cảm ứng linh hoạt thay cho `TouchableOpacity` cũ.
- [AppButton.js:52-69](src/components/AppButton.js#L52-L69) `{loading ? <ActivityIndicator .../> : (<>icon + Text</>)}`
  - Loading → spinner; ngược lại → (icon nếu có) + `title`.

---

## 15. `src/components/FormInput.js`

File: [src/components/FormInput.js](src/components/FormInput.js) (102 dòng). **Quan trọng cho controlled input ở PHẦN 3.**

**Vai trò:** ô nhập có label + báo lỗi, bọc `TextInput`.

- [FormInput.js:17](src/components/FormInput.js#L17) `FormInput({ label, error, multiline = false, ...inputProps })`
  - (a) Tách riêng `label`, `error`, `multiline`; **gom phần còn lại vào `...inputProps`**.
  - (c) *Rest props (`...inputProps`)*: gói mọi prop khác (`value`, `onChangeText`, `onBlur`, `placeholder`, `maxLength`...) thành 1 object để chuyển thẳng cho `TextInput`.
- [FormInput.js:20](src/components/FormInput.js#L20) `const hasError = Boolean(error);` — ép `error` (string | undefined) về boolean.
- [FormInput.js:33](src/components/FormInput.js#L33) `borderColor: hasError ? colors.error : colors.border` — viền đỏ khi lỗi.
- [FormInput.js:37-49](src/components/FormInput.js#L37-L49) `<TextInput {...inputProps} ... />`
  - (a) **Trải `inputProps` lên TextInput** — đây là chỗ `value`/`onChangeText` từ Formik thực sự gắn vào ô, tạo nên **controlled input**.
- [FormInput.js:51-53](src/components/FormInput.js#L51-L53) icon cảnh báo chỉ hiện khi `hasError && !multiline`.
- [FormInput.js:56](src/components/FormInput.js#L56) `{hasError ? <Text ...>{error}</Text> : null}` — dòng mô tả lỗi.

---

## 16. `src/components/ThemeToggleSwitch.js`

File: [src/components/ThemeToggleSwitch.js](src/components/ThemeToggleSwitch.js) (72 dòng). **Điểm châm ngòi luồng đổi theme — đọc kỹ cho PHẦN 2.**

**Vai trò:** hàng UI có `Switch` để bật/tắt Dark Mode.

- [ThemeToggleSwitch.js:16](src/components/ThemeToggleSwitch.js#L16) `const { colors, isDark, toggleTheme } = useTheme();` — lấy cả **hàm `toggleTheme`** từ context.
- [ThemeToggleSwitch.js:22](src/components/ThemeToggleSwitch.js#L22) `<Ionicons name={isDark ? 'moon' : 'sunny'} ... />` — icon theo theme.
- [ThemeToggleSwitch.js:31-40](src/components/ThemeToggleSwitch.js#L31-L40) `<Switch ...>`
  - [35](src/components/ThemeToggleSwitch.js#L35) `onValueChange={toggleTheme}` — **gạt Switch → gọi `toggleTheme`** (đảo state theme trong Provider).
  - [39](src/components/ThemeToggleSwitch.js#L39) `value={isDark}` — Switch là **controlled component**, trạng thái luôn khớp `isDark`.
  - (c) *Controlled component*: `value` do state điều khiển, `onValueChange` báo ý định đổi; bản thân Switch không tự giữ trạng thái.

---

# PHẦN 2 — DEEP DIVE: Luồng đổi Theme (Light/Dark)

> 3 câu thầy hay hỏi, kèm **bằng chứng file:dòng**.

### Câu 1 — "Đổi theme NHƯ THẾ NÀO?" (truy từ lúc bấm)

Trình tự khi người dùng gạt công tắc ở màn Settings:

1. **Người dùng gạt `Switch`** trong `ThemeToggleSwitch` (được render bởi Settings tại [SettingsScreen.js:26](src/screens/SettingsScreen.js#L26)).
   `Switch` có `value={isDark}` và `onValueChange={toggleTheme}` — [ThemeToggleSwitch.js:35](src/components/ThemeToggleSwitch.js#L35) & [:39](src/components/ThemeToggleSwitch.js#L39).
2. **`toggleTheme` chạy** — định nghĩa tại [ThemeContext.js:29](src/context/ThemeContext.js#L29):
   `setThemeMode((current) => (current === 'light' ? 'dark' : 'light'))`.
3. **State `themeMode` đổi** ([ThemeContext.js:18](src/context/ThemeContext.js#L18)) ⇒ `ThemeProvider` **re-render**.
4. Khi re-render: `isDark` tính lại ([:19](src/context/ThemeContext.js#L19)); `useMemo` thấy dependency `[isDark, themeMode]` đổi nên **tạo `value` mới**, trong đó `colors` được chọn lại: `isDark ? darkColors : lightColors` ([:27](src/context/ThemeContext.js#L27)).
5. **`value` mới** được phát qua `<ThemeContext.Provider value={value}>` ([:34](src/context/ThemeContext.js#L34)).
6. **Mọi component gọi `useTheme()`** (Home, Profile, Settings, AppHeader, AppButton, Avatar, FormInput, ProfileCard, AppNavigator...) nhận `colors` mới và **re-render với màu mới** → cả app đổi màu "ngay lập tức".

> Tóm tắt 1 câu: *Bấm Switch → `toggleTheme` → `setThemeMode` đổi state → Provider phát `colors` mới → tất cả consumer re-render đổi màu.*

### Câu 2 — "Nó HOẠT ĐỘNG RA SAO?" (cơ chế Context + re-render)

- **`createContext`** tạo một "kênh" dữ liệu ([ThemeContext.js:11](src/context/ThemeContext.js#L11)).
- **`ThemeProvider` bọc toàn app** ở [App.js:36-40](App.js#L36-L40), nên *mọi* màn nằm dưới nó.
- Mỗi màn **đọc theme bằng `useContext`** (gói trong `useTheme`, [ThemeContext.js:41-49](src/context/ThemeContext.js#L41-L49)). Ví dụ Home đọc tại [HomeScreen.js:19](src/screens/HomeScreen.js#L19).
- **Vì sao đổi 1 chỗ mà MỌI màn đổi theo?** React quy định: component dùng `useContext(X)` sẽ **re-render mỗi khi `value` của Provider X đổi** (so sánh tham chiếu bằng `Object.is`). Khi `themeMode` đổi, `useMemo` tạo `value` **mới về tham chiếu** ⇒ tất cả consumer re-render. Vì màu đến từ object `colors` chung này, đổi 1 state ⇒ đồng bộ toàn app.
- **Vai trò `useMemo`** ([:22-32](src/context/ThemeContext.js#L22-L32)): giữ `value` **ổn định tham chiếu** giữa các render *không* liên quan tới theme, tránh re-render thừa cho consumer. Khi theme thật sự đổi thì nó chủ động tạo `value` mới để kích hoạt cập nhật.

### Câu 3 — "Dùng CÔNG NGHỆ GÌ?"

- **React Context API**: `createContext` ([:11](src/context/ThemeContext.js#L11)), `<ThemeContext.Provider>` ([:34](src/context/ThemeContext.js#L34)), `useContext` ([:42](src/context/ThemeContext.js#L42)).
- **`useState`** giữ theme hiện tại (`themeMode`) ([:18](src/context/ThemeContext.js#L18)).
- **`useMemo`** memo hóa `value` ([:22](src/context/ThemeContext.js#L22)).
- **Object theme (design tokens)**: `lightColors` / `darkColors` ([colors.js:7](src/theme/colors.js#L7) & [:21](src/theme/colors.js#L21)).
- **Vì sao chọn Context thay vì truyền props?** Theme cần ở **rất nhiều tầng** (mọi screen + mọi component con). Nếu truyền `colors` qua props thì phải xâu chuỗi qua từng cấp — gọi là **prop drilling**, dài dòng và dễ sai. Context cho phép component **lấy thẳng** giá trị bất kể nằm sâu bao nhiêu, lại đảm bảo một nguồn sự thật duy nhất.

---

# PHẦN 3 — DEEP DIVE: Luồng Edit Profile

> File trung tâm: [EditProfileScreen.js](src/screens/EditProfileScreen.js).

### Câu 1 — "Edit NHƯ THẾ NÀO?" (controlled input)

Ô Name/Bio là **controlled input** — giá trị hiển thị do **Formik `values`** điều khiển, không phải do TextInput tự giữ.

Vòng lặp dữ liệu khi gõ vào ô Name:
1. TextInput hiển thị `value={values.name}` — truyền từ [EditProfileScreen.js:114](src/screens/EditProfileScreen.js#L114) vào `FormInput`, rồi `FormInput` trải xuống `TextInput` qua `{...inputProps}` ([FormInput.js:38](src/components/FormInput.js#L38)).
2. Người dùng gõ → `TextInput` gọi `onChangeText` = `handleChange('name')` ([EditProfileScreen.js:111](src/screens/EditProfileScreen.js#L111)).
3. `handleChange('name')` (của Formik) **cập nhật `values.name`** trong state nội bộ của Formik.
4. Formik re-render → `values.name` mới chảy ngược lại `value` của ô → màn hình hiển thị ký tự vừa gõ.
   ⇒ Đây chính là cơ chế **controlled input**: *state là nguồn sự thật, UI chỉ phản chiếu state.*
- `onBlur={handleBlur('name')}` ([:110](src/screens/EditProfileScreen.js#L110)) đánh dấu `touched.name = true` khi rời ô; kết hợp `validateOnBlur` ([:56](src/screens/EditProfileScreen.js#L56)) → validate khi rời ô.
- Lỗi chỉ hiển thị khi đã chạm: `error={touched.name ? errors.name : undefined}` ([:108](src/screens/EditProfileScreen.js#L108)). `FormInput` nhận `error` này để tô viền đỏ + hiện dòng lỗi ([FormInput.js:33](src/components/FormInput.js#L33), [:56](src/components/FormInput.js#L56)).

### Câu 2 — "LƯU và HIỂN THỊ RA SAO?"

1. Bấm **Save Changes** → `onPress={handleSubmit}` ([EditProfileScreen.js:131](src/screens/EditProfileScreen.js#L131)).
2. `handleSubmit` (Formik) **chạy validate** theo `validationSchema={profileSchema}` ([:58](src/screens/EditProfileScreen.js#L58)).
   - Nếu **không hợp lệ**: `errors` được điền, **`onSubmit` KHÔNG chạy** → dữ liệu xấu không bao giờ được lưu.
   - Nếu **hợp lệ**: chạy `onSubmit` ([:60-64](src/screens/EditProfileScreen.js#L60-L64)).
3. Trong `onSubmit`: `updateProfile({ name: values.name.trim(), bio: values.bio.trim() })` ([:61](src/screens/EditProfileScreen.js#L61)).
4. `updateProfile` ([ProfileContext.js:30](src/context/ProfileContext.js#L30)) gọi `setProfile((current) => ({ ...current, ...updates }))` → **cập nhật state `profile`** trong `ProfileProvider` (merge, **giữ nguyên avatar**).
5. `setSubmitting(false)` rồi `navigation.goBack()` ([:62-63](src/screens/EditProfileScreen.js#L62-L63)) → đóng màn Edit, quay lại **ProfileScreen**.
6. **Vì sao ProfileScreen hiện giá trị mới?** ProfileScreen đọc `profile` bằng `useProfile()` ([ProfileScreen.js:18](src/screens/ProfileScreen.js#L18)). Khi `profile` đổi, `ProfileContext` phát `value` mới → ProfileScreen **re-render**, truyền `profile` mới vào `ProfileCard` ([ProfileScreen.js:31](src/screens/ProfileScreen.js#L31)), nơi hiển thị `profile.name`/`profile.bio` ([ProfileCard.js:39-40](src/components/ProfileCard.js#L39-L40)).

> **Dữ liệu KHÔNG truyền qua `navigation` params.** Nó được lưu vào **shared state (ProfileContext)**. Đó là lý do màn Profile thấy ngay giá trị mới mà không cần truyền tham số khi `goBack`. (Nói rõ điểm này nếu thầy hỏi "có dùng navigation để truyền data không?")

### Câu 3 — "Dùng CÔNG NGHỆ GÌ?"

- **Formik** — quản lý state form:
  - `initialValues` ([:54](src/screens/EditProfileScreen.js#L54)), `values` ([:114](src/screens/EditProfileScreen.js#L114)/[:125](src/screens/EditProfileScreen.js#L125)),
  - `handleChange` ([:111](src/screens/EditProfileScreen.js#L111)/[:123](src/screens/EditProfileScreen.js#L123)), `handleBlur` ([:110](src/screens/EditProfileScreen.js#L110)/[:122](src/screens/EditProfileScreen.js#L122)),
  - `errors`/`touched` ([:108](src/screens/EditProfileScreen.js#L108)/[:118](src/screens/EditProfileScreen.js#L118)), `isSubmitting` ([:131](src/screens/EditProfileScreen.js#L131)), `onSubmit` ([:60](src/screens/EditProfileScreen.js#L60)).
- **Yup** — `validationSchema`: `Yup.object`/`Yup.string` + các `.test()` cho name (required + min 2) và bio (required) ([:20-36](src/screens/EditProfileScreen.js#L20-L36)). *Lưu ý: tự viết bằng `.test()` trên giá trị `trim()`, không dùng `.required()/.min()` mặc định.*
- **Lưu trữ bằng `useState` + Context**: `ProfileContext` (`useState(initialProfile)` [ProfileContext.js:22](src/context/ProfileContext.js#L22), `updateProfile` [:30](src/context/ProfileContext.js#L30)).
- **Vì sao validate được TRƯỚC khi lưu?** Vì `handleSubmit` chạy validate dựa trên `validationSchema` **trước**, và `onSubmit` (nơi gọi `updateProfile`) **chỉ được Formik gọi khi không còn lỗi**. Logic lưu nằm trong `onSubmit` nên dữ liệu chắc chắn đã hợp lệ mới được ghi vào Context.

---

# CÂU HỎI GIẢNG VIÊN CÓ THỂ HỎI & GỢI Ý TRẢ LỜI

> Học thuộc **ý chính** (in đậm), phần còn lại để diễn giải.

### A. Nhóm câu về Theme

**1. "Bật Dark Mode thì chuyện gì xảy ra?"**
> Gạt `Switch` gọi **`toggleTheme`** ([ThemeContext.js:29](src/context/ThemeContext.js#L29)) → **`setThemeMode`** đổi state → `ThemeProvider` re-render, chọn lại **`colors = isDark ? darkColors : lightColors`** ([:27](src/context/ThemeContext.js#L27)) → phát `value` mới → **mọi component dùng `useTheme()` re-render** đổi màu.

**2. "Tại sao đổi 1 chỗ mà tất cả màn đổi màu?"**
> Vì dùng **Context API**: `ThemeProvider` bọc toàn app ([App.js:36](App.js#L36)), các màn đọc bằng `useContext`. Theo cơ chế React, **consumer re-render mỗi khi `value` của Provider đổi tham chiếu**. Một nguồn state (`themeMode`) → đồng bộ tất cả.

**3. "Sao không truyền màu bằng props?"**
> Sẽ bị **prop drilling** — phải xâu `colors` qua từng tầng component. Context tránh điều đó, cho component lấy thẳng dù nằm sâu, và giữ **một nguồn sự thật duy nhất**.

**4. "`useMemo` trong ThemeContext để làm gì?"**
> Memo hóa object `value` để **ổn định tham chiếu**, tránh tạo object mới (và re-render consumer) ở những render không đổi theme; chỉ tạo mới khi `[isDark, themeMode]` đổi.

**5. "Vì sao phải tách `AppContent` ra khỏi `App`?"**
> Vì `useTheme()` chỉ chạy được **bên trong** `ThemeProvider`. `App` nằm ngoài Provider; `AppContent` ([App.js:16](App.js#L16)) nằm trong nên mới gọi được hook để set màu `StatusBar`.

**6. "Mặc định context là `undefined` để làm gì?"**
> Để **bắt lỗi dùng sai**: nếu gọi `useTheme()`/`useProfile()` ngoài Provider, code ném `Error` rõ ràng ([ThemeContext.js:44-46](src/context/ThemeContext.js#L44-L46)).

### B. Nhóm câu về Edit Profile

**7. "Controlled input là gì? Ô Name hoạt động sao?"**
> **State là nguồn sự thật, UI phản chiếu state.** Ô có `value={values.name}` và `onChangeText={handleChange('name')}` — gõ → `handleChange` cập nhật `values.name` (Formik) → re-render → ô hiển thị giá trị mới. (Bằng chứng: [EditProfileScreen.js:111](src/screens/EditProfileScreen.js#L111),[:114](src/screens/EditProfileScreen.js#L114); [FormInput.js:38](src/components/FormInput.js#L38).)

**8. "Bấm Save thì dữ liệu đi đâu?"**
> `handleSubmit` → validate bằng Yup → nếu hợp lệ, `onSubmit` gọi **`updateProfile({name, bio})`** ([:61](src/screens/EditProfileScreen.js#L61)) → `setProfile` merge vào **ProfileContext** → `goBack()`. Dữ liệu lưu ở **shared state**, không qua navigation params.

**9. "Sao quay lại Profile thấy ngay tên mới?"**
> ProfileScreen đọc `profile` qua **`useProfile()`** ([ProfileScreen.js:18](src/screens/ProfileScreen.js#L18)). `profile` đổi → context phát value mới → ProfileScreen re-render, `ProfileCard` hiển thị `profile.name/bio` mới.

**10. "Validate bằng gì? Đảm bảo sao không lưu dữ liệu rỗng?"**
> **Yup `validationSchema`** ([:20-36](src/screens/EditProfileScreen.js#L20-L36)): name bắt buộc + ≥ 2 ký tự, bio bắt buộc (kiểm tra trên giá trị đã `trim`). `handleSubmit` validate **trước**; `onSubmit` (chỗ lưu) **chỉ chạy khi không còn lỗi** → dữ liệu rỗng/ngắn không bao giờ được ghi.

**11. "Vì sao lỗi không hiện ngay khi mở form?"**
> Vì chỉ truyền `error` khi **`touched`**: `touched.name ? errors.name : undefined` ([:108](src/screens/EditProfileScreen.js#L108)). Thêm `validateOnChange={false}` ([:57](src/screens/EditProfileScreen.js#L57)) nên không validate lúc đang gõ; chỉ validate khi rời ô (`validateOnBlur`).

**12. "Avatar có bị mất khi lưu name/bio không?"**
> Không. `updateProfile` **merge** `{ ...current, ...updates }` ([ProfileContext.js:30](src/context/ProfileContext.js#L30)) và `onSubmit` chỉ gửi `name`, `bio` → `avatar` giữ nguyên.

### C. Nhóm câu về Navigation & cấu trúc

**13. "Chuyển màn bằng gì?"**
> **React Navigation (native stack)**. Mỗi screen nhận prop `navigation`; dùng `navigation.navigate('TênRoute')` để mở (vd [HomeScreen.js:43](src/screens/HomeScreen.js#L43)) và `navigation.goBack()` để quay lại ([EditProfileScreen.js:63](src/screens/EditProfileScreen.js#L63)). Route khai báo ở [AppNavigator.js:58-61](src/navigation/AppNavigator.js#L58-L61).

**14. "Sao header tự vẽ mà không dùng header của navigation?"**
> Đã tắt bằng `headerShown: false` ([AppNavigator.js:54](src/navigation/AppNavigator.js#L54)) để chủ động về giao diện; app dùng `AppHeader` riêng, hiện nút back tùy có truyền `onBack` hay không.

**15. "Tại sao có cả `SafeAreaProvider`?"**
> Để né tai thỏ/status bar. `SafeAreaProvider` ở [App.js:34](App.js#L34) và các màn dùng `SafeAreaView` (vd [HomeScreen.js:22](src/screens/HomeScreen.js#L22)).

---

*Hết.* Trước buổi bảo vệ, nên chạy `npm start` (hoặc `npx expo start`) để mở app thật, vừa ôn vừa thao tác minh hoạ: bật Dark Mode ở Settings và sửa tên ở Edit Profile để thấy đúng như mô tả ở PHẦN 2 và PHẦN 3.
