# EXPLANATION — Giải thích chi tiết source code

> Tài liệu này giải thích **toàn bộ** code thực tế của project, đi theo từng file. Mục tiêu là chứng minh em hiểu *tại sao* code được viết như vậy, không chỉ *mô tả* nó làm gì.
>
> **Nguyên tắc viết:** giữ nguyên thuật ngữ kỹ thuật tiếng Anh (props, state, hook, controlled input, navigation...). Tập trung vào **TẠI SAO**. Không bịa: chỗ nào code **chưa** đáp ứng đầy đủ một yêu cầu của đề, tài liệu nói thẳng trong phần *Điểm yếu*.

---

## Mục lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [package.json — dependencies](#2-packagejson--dependencies)
3. [index.js — entry point](#3-indexjs--entry-point)
4. [App.js — root component & provider hierarchy](#4-appjs--root-component--provider-hierarchy)
5. [src/theme/colors.js — design tokens](#5-srcthemecolorsjs--design-tokens)
6. [src/context/ThemeContext.js — custom ThemeContext](#6-srccontextthemecontextjs--custom-themecontext)
7. [src/context/ProfileContext.js — profile state](#7-srccontextprofilecontextjs--profile-state)
8. [src/navigation/AppNavigator.js — Stack Navigator](#8-srcnavigationappnavigatorjs--stack-navigator)
9. [src/screens/HomeScreen.js](#9-srcscreenshomescreenjs)
10. [src/screens/ProfileScreen.js](#10-srcscreensprofilescreenjs)
11. [src/screens/EditProfileScreen.js — Formik + Yup](#11-srcscreenseditprofilescreenjs--formik--yup)
12. [src/screens/SettingsScreen.js](#12-srcscreenssettingsscreenjs)
13. [src/components/ProfileCard.js](#13-srccomponentsprofilecardjs)
14. [src/components/ThemeToggleSwitch.js](#14-srccomponentsthemetoggleswitchjs)
15. [src/components/FormInput.js](#15-srccomponentsforminputjs)
16. [src/components/AppButton.js](#16-srccomponentsappbuttonjs)
17. [src/components/AppHeader.js](#17-srccomponentsappheaderjs)
18. [src/components/Avatar.js](#18-srccomponentsavatarjs)
19. [Bảng map tiêu chí chấm điểm](#19-bảng-map-tiêu-chí-chấm-điểm)
20. [Điểm yếu & hạn chế (trung thực)](#20-điểm-yếu--hạn-chế-trung-thực)
21. [5 điểm cần nắm chắc nhất](#21-5-điểm-cần-nắm-chắc-nhất)

---

## 1. Tổng quan kiến trúc

App là một ứng dụng **React Native** chạy bằng **Expo SDK 54**, viết bằng **JavaScript** (không có file `.ts`/`.tsx`). Có đúng **4 screen**: Home, Profile, Edit Profile, Settings.

### Sơ đồ cây render (component tree)

```text
index.js  →  registerRootComponent(App)
└── App  (App.js)
    └── SafeAreaProvider          ← cung cấp thông tin safe area (notch, status bar)
        └── ThemeProvider         ← cung cấp theme light/dark cho toàn app (Context)
            └── ProfileProvider   ← cung cấp dữ liệu profile cho toàn app (Context)
                └── AppContent
                    ├── StatusBar (màu chữ đổi theo theme)
                    └── AppNavigator
                        └── NavigationContainer
                            └── Stack.Navigator (initialRouteName = "Home")
                                ├── Home      → HomeScreen
                                ├── Profile   → ProfileScreen
                                ├── EditProfile → EditProfileScreen
                                └── Settings  → SettingsScreen
```

### Hai ý tưởng kiến trúc cốt lõi (cần nhớ)

1. **State dùng chung được "nâng lên" (lift up) trên navigator.** `ThemeProvider` và `ProfileProvider` bọc *bên ngoài* `AppNavigator`. Vì mọi screen đều nằm bên dưới chúng, mọi screen đều đọc được cùng một theme và cùng một profile. Nếu để state trong một screen, các screen khác sẽ không thấy.

2. **Component đọc state qua custom hook, không qua props xuyên tầng.** Thay vì truyền `colors`/`profile` qua `App → Navigator → Screen → Card → Avatar`, mỗi component tự gọi `useTheme()` hoặc `useProfile()`. Đây là cách **Context API** giải quyết vấn đề *prop drilling*.

---

## 2. package.json — dependencies

Đây không phải file code nhưng quyết định "app dùng gì". Giải thích từng dependency quan trọng:

| Package | Vai trò | Tại sao có mặt |
| --- | --- | --- |
| `expo: ~54.0.34` | Nền tảng Expo SDK 54 | Toolchain build/run cho Android, iOS, web |
| `react: 19.1.0` | Thư viện React | Cung cấp `useState`, `useContext`, `useMemo`, JSX |
| `react-native: 0.81.5` | Runtime React Native | `View`, `Text`, `TextInput`, `StyleSheet`, `Switch`... |
| `@react-navigation/native: ^7.3.3` | Lõi React Navigation | `NavigationContainer`, navigation object |
| `@react-navigation/native-stack: ^7.17.5` | **Stack Navigator** | `createNativeStackNavigator()` → đáp ứng yêu cầu Stack Navigator |
| `react-native-screens`, `react-native-safe-area-context` | Native deps cho navigation + safe area | Bắt buộc đi kèm React Navigation; cung cấp `SafeAreaView` |
| `formik: ^2.4.9` | **Quản lý form** | values/touched/errors/submit cho Edit Profile |
| `yup: ^1.7.1` | **Schema validation** | Khai báo luật validate tách khỏi JSX |
| `@expo/vector-icons: ^15.0.3` | Bộ icon (`Ionicons`) | Icon person, arrow-back, sunny/moon, alert... |
| `expo-font: ~14.0.12` | Backend font cho vector-icons | Khai báo trong `app.json` plugins |
| `expo-status-bar: ~3.0.9` | Điều khiển `StatusBar` | Đổi màu chữ status bar theo theme |
| `react-native-gesture-handler: ~2.28.0` | Cử chỉ vuốt | Import đầu `index.js` (yêu cầu của navigation) |
| `react-dom`, `react-native-web` | Hỗ trợ chạy web | Cho script `expo start --web` |

**Điểm quan trọng để bảo vệ bài:**
- `"main": "index.js"` → app **không** dùng Expo Router (Expo Router sẽ là `expo-router/entry`).
- Không có `@react-navigation/bottom-tabs` → **không** dùng Bottom Tabs.
- Không có `@react-native-async-storage/async-storage` → **không** persistence (dữ liệu chỉ trong RAM).
- Không có `styled-components` → styling dùng **`StyleSheet`** (đề cho phép "StyleSheet *hoặc* Styled-Components", nên đây là lựa chọn hợp lệ).

---

## 3. index.js — entry point

```js
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
```

**Vai trò:** file khởi động đầu tiên Expo chạy (vì `package.json` khai báo `main: index.js`).

**Giải thích từng dòng:**

- `import 'react-native-gesture-handler';`
  - **(a) LÀM GÌ:** import side-effect (không lấy biến nào, chỉ chạy code khởi tạo của thư viện).
  - **(b) TẠI SAO ở đây / đặt đầu tiên:** `react-native-gesture-handler` yêu cầu được import **trước** mọi thứ khác để gắn đúng vào native view. Đặt sai vị trí có thể gây lỗi cử chỉ vuốt trên một số thiết bị. React Navigation native-stack dựa trên cử chỉ nên dòng này phục vụ navigation.
- `registerRootComponent(App)`
  - **(a) LÀM GÌ:** đăng ký `App` làm component gốc của ứng dụng.
  - **(b) TẠI SAO dùng hàm của Expo thay vì `AppRegistry`:** `registerRootComponent` là wrapper của Expo gọi `AppRegistry.registerComponent` đồng thời thiết lập môi trường phù hợp cho cả Android, iOS và web — viết một lần chạy đa nền tảng.

**KHÁI NIỆM — entry point & root component:** mọi app React Native cần một "component gốc" để framework biết bắt đầu render từ đâu. Đây chính là gốc của cây component ở mục 1.

---

## 4. App.js — root component & provider hierarchy

```js
function AppContent() {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ThemeProvider>
        <ProfileProvider>
          <AppContent />
        </ProfileProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
```

**Vai trò:** root component — nơi lắp ráp các **provider** dùng chung trước khi render navigator.

**Lướt import:**
- `StatusBar` từ `expo-status-bar`: điều khiển màu chữ/icon trên thanh status bar hệ thống.
- `SafeAreaProvider`, `initialWindowMetrics` từ `react-native-safe-area-context`: đo và cung cấp kích thước vùng an toàn (notch, status bar, home indicator). `initialWindowMetrics` là số đo có sẵn ngay frame đầu.
- `ProfileProvider`, `ThemeProvider`, `useTheme`: các provider/hook tự viết.
- `AppNavigator`: cụm điều hướng.

**Giải thích logic:**

- **Thứ tự provider lồng nhau** (`SafeAreaProvider → ThemeProvider → ProfileProvider → AppContent`)
  - **(a) LÀM GÌ:** mỗi provider đặt một "vùng dữ liệu" bao quanh cây con của nó.
  - **(b) TẠI SAO theo thứ tự này:** provider phải nằm **trên** mọi component cần đọc nó. Vì `AppNavigator` và toàn bộ screen nằm trong cùng, chúng đọc được cả theme lẫn profile. Thứ tự Theme trước Profile ở đây không bắt buộc về mặt logic (hai context độc lập), nhưng đặt Theme ngoài cùng là hợp lý vì cả `AppContent` (StatusBar) lẫn navigator đều cần theme.

- **Tại sao tách `AppContent` ra khỏi `App`?**
  - **(a) LÀM GÌ:** `AppContent` gọi `useTheme()` để lấy `isDark`, đổi `StatusBar` sang chữ sáng khi dark mode.
  - **(b) TẠI SAO phải tách:** một component **không** thể gọi `useTheme()` của chính `ThemeProvider` mà nó render ra. Hook chỉ đọc được context khi component **nằm bên trong** provider. `App` render `ThemeProvider`, nên `App` ở *ngoài* provider; phải tạo `AppContent` *bên trong* provider thì `useTheme()` mới chạy. Nếu gọi `useTheme()` ngay trong `App`, sẽ ném lỗi *"useTheme must be used inside ThemeProvider"*. Đây là một chi tiết hiểu bài quan trọng.
  - **(c) KHÁI NIỆM — provider/consumer boundary:** ranh giới "ai ở trong, ai ở ngoài" provider quyết định ai đọc được context.

- `<> ... </>` — **React Fragment**
  - **(a) LÀM GÌ:** nhóm `StatusBar` và `AppNavigator` mà không tạo thêm một `View` thừa.
  - **(b) TẠI SAO:** JSX yêu cầu trả về một node gốc duy nhất; Fragment thỏa điều đó mà không thêm layout/box vào cây.

- `<StatusBar style={isDark ? 'light' : 'dark'} />`
  - **(a) LÀM GÌ:** khi dark mode → chữ status bar màu sáng để đọc được trên nền tối; ngược lại chữ tối.

**KHÁI NIỆM lần đầu xuất hiện:**
- **JSX:** cú pháp giống HTML để mô tả UI bằng JavaScript; mỗi thẻ là một lời gọi component.
- **Provider:** component bọc cây con và "phát" một giá trị Context xuống dưới.

**Câu hỏi giảng viên có thể hỏi & gợi ý trả lời:**
- *Tại sao có `AppContent` riêng?* → Vì cần gọi `useTheme()` ở **bên trong** `ThemeProvider`; component render ra provider thì ở ngoài, không đọc được context của chính nó.
- *Tại sao provider bọc navigator chứ không nằm trong một screen?* → Để mọi screen chia sẻ cùng theme/profile và tránh prop drilling.

---

## 5. src/theme/colors.js — design tokens

```js
export const lightColors = { background: '#FCF6FF', card: '#FFFFFF', text: '#111827', /* ... */ };
export const darkColors  = { background: '#111827', card: '#1F2937', text: '#F9FAFB', /* ... */ };
```

**Vai trò:** khai báo tập trung **bảng màu** (design tokens) cho light và dark. Hai object có **cùng bộ key** (`background`, `card`, `text`, `textSecondary`, `primary`, `primaryLight`, `error`, `border`, `input`, `shadow`, `white`).

**Giải thích thiết kế:**
- **(a) LÀM GÌ:** mỗi key là một "vai trò màu" (semantic token) — ví dụ `text` là màu chữ chính, `primary` là màu nhấn.
- **(b) TẠI SAO dùng cùng bộ key cho cả hai theme:** component chỉ cần viết `colors.text`, không cần biết đang là light hay dark. Khi đổi theme, chỉ object `colors` bị thay; mọi nơi tự nhận màu mới. Đây là lý do component như `AppButton`, `ProfileCard` không hề chứa mã hex — tránh hardcode màu rải rác.
- **(c) Trade-off:** dùng token semantic (như `text`, `card`) thay vì token theo màu (như `purple`, `gray`) giúp đổi theme dễ; nhược điểm là phải đặt tên vai trò cẩn thận.

> Lưu ý: `white: '#FFFFFF'` cố tình giữ trắng ở cả hai theme — dùng cho chữ trên nút primary (luôn nền tím đậm) nên luôn cần trắng.

---

## 6. src/context/ThemeContext.js — custom ThemeContext

```js
const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState('light');
  const isDark = themeMode === 'dark';

  const value = useMemo(() => ({
    themeMode,
    isDark,
    colors: isDark ? darkColors : lightColors,
    toggleTheme: () => setThemeMode((current) => (current === 'light' ? 'dark' : 'light')),
  }), [isDark, themeMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider.');
  return context;
}
```

**Vai trò:** đây chính là **custom ThemeContext** mà đề yêu cầu — nơi lưu trạng thái light/dark và phát ra toàn app.

**Lướt import:** `createContext` (tạo context), `useContext` (đọc context), `useMemo` (memo hóa giá trị), `useState` (giữ state); `darkColors`/`lightColors` từ file token.

**Giải thích từng phần:**

- `const ThemeContext = createContext(undefined);`
  - **(a) LÀM GÌ:** tạo một "kênh" Context, giá trị mặc định `undefined`.
  - **(b) TẠI SAO mặc định `undefined`:** để hook `useTheme()` phát hiện trường hợp dùng *ngoài* provider (lúc đó `useContext` trả về `undefined`) và ném lỗi rõ ràng. Đây là kỹ thuật "fail fast".
  - **(c) KHÁI NIỆM — Context API:** cơ chế React truyền dữ liệu xuống cây con mà không cần truyền props qua từng tầng.

- `const [themeMode, setThemeMode] = useState('light');`
  - **(a) LÀM GÌ:** giữ chế độ theme dưới dạng chuỗi `'light'`/`'dark'`, khởi đầu `'light'`.
  - **(b) TẠI SAO dùng `useState`:** đề yêu cầu quản lý theme bằng state; khi state đổi, React tự render lại các consumer.
  - **(c) KHÁI NIỆM — useState:** hook trả về `[giá trị, hàm cập nhật]`. Gọi hàm cập nhật sẽ lên lịch re-render.

- `const isDark = themeMode === 'dark';`
  - **(a) LÀM GÌ:** biến dẫn xuất (derived value) — không phải state riêng.
  - **(b) TẠI SAO không tạo `useState` cho `isDark`:** `isDark` luôn suy ra được từ `themeMode`. Tạo state thứ hai sẽ có nguy cơ hai state lệch nhau. Nguyên tắc: **không lưu cái có thể tính ra.**

- `toggleTheme` dùng **functional update** `setThemeMode((current) => ...)`
  - **(a) LÀM GÌ:** đảo `'light' ↔ 'dark'` dựa trên giá trị hiện tại.
  - **(b) TẠI SAO dùng dạng `(current) => ...`:** đảm bảo luôn lật trên giá trị mới nhất, an toàn nếu có nhiều cập nhật liên tiếp — không phụ thuộc biến ngoài có thể cũ (stale closure).

- `const value = useMemo(() => ({...}), [isDark, themeMode]);`
  - **(a) LÀM GÌ:** đóng gói `themeMode`, `isDark`, `colors`, `toggleTheme` thành object phát qua Context.
  - **(b) TẠI SAO dùng `useMemo`:** mỗi lần `ThemeProvider` render, nếu tạo object `value` mới thì **mọi** consumer đều render lại do *identity* của object đổi. `useMemo` chỉ tạo object mới khi `themeMode`/`isDark` thực sự đổi → tránh render thừa.
  - **(c) KHÁI NIỆM — useMemo & referential identity:** React so sánh context value theo tham chiếu; giữ nguyên tham chiếu khi dữ liệu không đổi giúp tối ưu.

- Hook `useTheme()` + kiểm tra `if (!context) throw`
  - **(a) LÀM GÌ:** bọc `useContext(ThemeContext)` và chặn việc dùng ngoài provider.
  - **(b) TẠI SAO viết custom hook:** (1) gọn — component chỉ `const { colors } = useTheme()`; (2) báo lỗi sớm và dễ hiểu nếu dùng sai vị trí; (3) giấu chi tiết `ThemeContext` để dễ refactor sau này.
  - **(c) KHÁI NIỆM — custom hook:** một hàm bắt đầu bằng `use`, có thể gọi các hook khác và được tái sử dụng.

**Câu hỏi giảng viên có thể hỏi & gợi ý trả lời:**
- *Đây có phải "custom ThemeContext" như đề yêu cầu không?* → Đúng. `createContext` + `ThemeProvider` + hook `useTheme` tự viết chính là custom ThemeContext.
- *Vì sao toàn app đổi màu cùng lúc?* → Mọi component đọc `colors` từ **cùng một** context. Khi `value` đổi, React render lại tất cả consumer với palette mới.
- *`useMemo` ở đây để làm gì?* → Tránh tạo object `value` mới mỗi render, qua đó hạn chế re-render dây chuyền của consumer.
- *Nếu để theme trong `useState` ở `SettingsScreen` thì sao?* → Các screen khác không biết theme đổi; phải nâng state lên Context mới chia sẻ được.

---

## 7. src/context/ProfileContext.js — profile state

```js
const ProfileContext = createContext(undefined);

const initialProfile = {
  name: 'Nguyen Van A',
  bio: 'React Native learner building clean mobile apps.',
  avatar: null,
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(initialProfile);

  const value = useMemo(() => ({
    profile,
    updateProfile: (updates) => setProfile((current) => ({ ...current, ...updates })),
  }), [profile]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() { /* ... giống useTheme ... */ }
```

**Vai trò:** lưu **profile state tạm thời** (đề yêu cầu *"Use `useState` for temporary local profile info"*) và phát cho mọi screen.

**Giải thích:**

- `const [profile, setProfile] = useState(initialProfile);`
  - **(a) LÀM GÌ:** giữ object `{ name, bio, avatar }` trong state.
  - **(b) TẠI SAO đặt ở Context chứ không trong screen:** **cả** `ProfileScreen` (đọc để hiển thị) **và** `EditProfileScreen` (ghi để cập nhật) cần cùng một dữ liệu. Nâng state lên Context = "single source of truth". Bản chất vẫn là `useState` đúng như đề, chỉ là đặt ở cấp app.
  - **Đáp ứng đề:** đây là chỗ thể hiện `useState` cho "temporary local profile info" — *temporary* vì chỉ nằm trong RAM, mất khi reload.

- `updateProfile: (updates) => setProfile((current) => ({ ...current, ...updates }))`
  - **(a) LÀM GÌ:** trộn (merge) các field mới vào profile cũ.
  - **(b) TẠI SAO dùng spread `{ ...current, ...updates }`:**
    - State trong React phải được cập nhật **bất biến (immutable)** — tạo object **mới**, không sửa trực tiếp object cũ. Nếu `current.name = ...` thì tham chiếu không đổi, React có thể không render lại.
    - `...current` giữ field không sửa (ví dụ `avatar`), `...updates` ghi đè field gửi lên (`name`, `bio`). Nhờ đó gọi `updateProfile({ name, bio })` **không** làm mất `avatar`.
  - **(c) KHÁI NIỆM — immutable state update:** luôn trả về object/array mới thay vì mutate tại chỗ.

- `useProfile()`: custom hook, giống `useTheme()` về mục đích.

**Câu hỏi giảng viên có thể hỏi & gợi ý trả lời:**
- *`ProfileContext` có còn là "local state" không?* → Có. Context chỉ là cơ chế **phân phối**; dữ liệu vẫn nằm trong `useState`. Không có server/DB nào tham gia.
- *Vì sao `ProfileScreen` tự cập nhật sau khi save?* → Nó là consumer của context (gọi `useProfile()`). Khi `profile` đổi, React render lại nó với dữ liệu mới — không cần gọi API hay refresh tay.
- *Reload app thì dữ liệu thế nào?* → Quay về `initialProfile`, vì `useState(initialProfile)` chạy lại. Muốn giữ phải thêm AsyncStorage/DB (ngoài phạm vi đề).

---

## 8. src/navigation/AppNavigator.js — Stack Navigator

```js
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { colors, isDark } = useTheme();
  const navigationTheme = useMemo(() => ({ dark: isDark, colors: { ... }, fonts: { ... } }), [colors, isDark]);

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ animation: 'slide_from_right', contentStyle: { backgroundColor: colors.background }, headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

**Vai trò:** cấu hình **Stack Navigator** — đáp ứng trực tiếp yêu cầu *"Navigation between all screens using Stack Navigator"*.

**Lướt import:** `useMemo`; `NavigationContainer` (gốc của hệ navigation); `createNativeStackNavigator` (tạo stack chạy bằng native screen); `useTheme`; 4 screen.

**Giải thích:**

- `const Stack = createNativeStackNavigator();`
  - **(a) LÀM GÌ:** tạo cặp `Stack.Navigator` + `Stack.Screen`.
  - **(b) TẠI SAO dùng Native Stack:** luồng app có quan hệ **trước/sau** rõ ràng (Home → Profile → Edit/Settings → back). Stack quản lý màn hình theo **ngăn xếp (LIFO)**: `navigate` đẩy lên, `goBack` lấy ra. Bản "native-stack" dùng API điều hướng gốc của iOS/Android nên chuyển cảnh mượt, hiệu năng tốt.
  - **(c) KHÁI NIỆM — Stack Navigator:** chồng màn hình; màn mới nằm trên, quay lại sẽ pop màn trên cùng.

- `initialRouteName="Home"`
  - **(a) LÀM GÌ:** chọn Home là màn đầu tiên trong stack. Đúng yêu cầu *HomeScreen welcome the user*.

- 4 `Stack.Screen` với `name` `Home`/`Profile`/`EditProfile`/`Settings`
  - **(b) TẠI SAO `name` quan trọng:** `navigation.navigate('Profile')` ở screen khác phải khớp **chính xác** chuỗi này. Sai chính tả = lỗi route. Đúng 4 route = đúng phạm vi đề (không có screen thứ 5, không Search).

- `screenOptions={{ headerShown: false, ... }}`
  - **(a) LÀM GÌ:** ẩn header mặc định của navigation.
  - **(b) TẠI SAO ẩn:** app tự vẽ header bằng `AppHeader` để kiểm soát hoàn toàn tiêu đề, back button và màu theo theme. `contentStyle.backgroundColor` đặt nền theo theme để tránh "nháy trắng" khi chuyển màn. `animation: 'slide_from_right'` cho hiệu ứng trượt quen thuộc.

- `navigationTheme` + `<NavigationContainer theme={...}>` bọc trong `useMemo`
  - **(a) LÀM GÌ:** đưa màu theme của app vào *theme của chính React Navigation* (nền container, màu primary, border...).
  - **(b) TẠI SAO:** để cả những phần do navigation tự vẽ cũng đổi màu theo light/dark, tránh viền trắng lạc tông trong dark mode. `useMemo([colors, isDark])` tạo lại object theme chỉ khi theme đổi.

**Câu hỏi giảng viên có thể hỏi & gợi ý trả lời:**
- *Vì sao Stack mà không Bottom Tabs?* → Edit/Settings là màn **con** của Profile theo luồng tuần tự, không phải các khu vực song song; Stack đúng ngữ nghĩa hơn và đề không yêu cầu Tabs.
- *`navigation` ở đâu ra?* → React Navigation **tự** truyền prop `navigation` cho mỗi component đăng ký là `Stack.Screen` (xem `HomeScreen({ navigation })`).
- *`goBack()` khác `navigate()`?* → `navigate('X')` tới route tên X; `goBack()` pop màn hiện tại, quay lại đúng instance màn trước trong stack (không tạo mới).

---

## 9. src/screens/HomeScreen.js

```js
export default function HomeScreen({ navigation }) {
  const { profile } = useProfile();
  const { colors } = useTheme();

  return (
    <SafeAreaView edges={[...]} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Profile App" />
      <ScrollView bounces={false} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.centerArea}>
          <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <ProfileCard compact profile={profile} />
            <AppButton title="View My Profile" onPress={() => navigation.navigate('Profile')} style={styles.cardButton} />
          </View>
        </View>
        <Text style={[styles.footer, { color: colors.textSecondary }]}>Assignment 1 • React Native</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
```

**Vai trò:** màn hình đầu — chào người dùng và điều hướng sang Profile. Đáp ứng *"HomeScreen: Welcome the user and navigate to their profile."*

**Giải thích:**

- `export default function HomeScreen({ navigation })`
  - **(a) LÀM GÌ:** nhận prop `navigation` từ Stack.
  - **(c) KHÁI NIỆM — props:** dữ liệu component nhận từ "cha"; ở đây navigation do navigator cấp.

- `const { profile } = useProfile();` / `const { colors } = useTheme();`
  - **(a) LÀM GÌ:** lấy profile và bảng màu hiện tại qua custom hook.
  - **(b) TẠI SAO Home cần `profile`:** truyền vào `ProfileCard` để hiển thị avatar trong welcome card.

- `<SafeAreaView edges={['top','right','bottom','left']} style={[styles.safeArea, { backgroundColor: colors.background }]}>`
  - **(a) LÀM GÌ:** chèn padding để nội dung không bị status bar/notch/home indicator che; nền theo theme.
  - **(b) TẠI SAO style là một **mảng** `[styles.safeArea, { backgroundColor }]`:** RN cho phép gộp nhiều style; tách phần **tĩnh** (trong `StyleSheet`) khỏi phần **động theo theme** (màu nền). Đây là pattern lặp lại ở mọi screen.
  - **(c) KHÁI NIỆM — StyleSheet:** `StyleSheet.create({...})` khai báo style một lần, tối ưu hơn object inline rải rác; nhưng màu phụ thuộc theme vẫn phải truyền inline vì đổi lúc runtime.

- `<ScrollView bounces={false} contentContainerStyle={styles.scrollContent}>`
  - **(a) LÀM GÌ:** cho phép cuộn nếu màn nhỏ/ font lớn; `contentContainerStyle` style cho **nội dung bên trong**, không phải khung ScrollView.
  - **(b) TẠI SAO:** đảm bảo nút và footer vẫn truy cập được trên thiết bị nhỏ → phục vụ yêu cầu responsive.

- `<AppButton title="View My Profile" onPress={() => navigation.navigate('Profile')} />`
  - **(a) LÀM GÌ:** bấm nút → điều hướng sang route `Profile`.
  - **(b) TẠI SAO bọc trong arrow function `() => navigation.navigate(...)`:** để `navigate` chỉ chạy **khi nhấn**, không chạy ngay lúc render. Nếu viết `onPress={navigation.navigate('Profile')}` (gọi luôn) sẽ điều hướng sai thời điểm.

- **Style responsive:** `scrollContent` có `flexGrow: 1`, `maxWidth: 600`, `alignSelf: 'center'`; `centerArea` có `flex: 1, justifyContent: 'center'`.
  - **(b) TẠI SAO:** `flexGrow: 1` cho nội dung giãn đầy chiều cao để căn giữa theo trục dọc; `maxWidth: 600 + alignSelf: center` giúp trên màn rộng (tablet/web) card không kéo dài quá khổ. Đây là **Flexbox responsive**.
  - **(c) KHÁI NIỆM — Flexbox:** hệ thống dàn layout của RN. `flex`, `flexGrow`, `justifyContent`, `alignItems`, `flexDirection` quyết định cách con chiếm và căn không gian. RN mặc định `flexDirection: 'column'`.

**Câu hỏi giảng viên có thể hỏi & gợi ý trả lời:**
- *App responsive bằng cách nào?* → Flexbox (`flex/flexGrow`), `maxWidth` + `alignSelf: center`, padding theo %, `ScrollView`; không hardcode chiều cao thiết bị.
- *`SafeAreaView` để làm gì?* → Tránh nội dung bị che bởi tai thỏ/status bar/home indicator.

---

## 10. src/screens/ProfileScreen.js

```js
export default function ProfileScreen({ navigation }) {
  const { profile } = useProfile();
  const { colors } = useTheme();
  return (
    <SafeAreaView ...>
      <AppHeader title="My Profile" />
      <ScrollView ...>
        <View style={[styles.card, ...]}>
          <ProfileCard profile={profile} />
        </View>
        <AppButton icon="create-outline" title="Edit Profile" onPress={() => navigation.navigate('EditProfile')} ... />
        <AppButton icon="settings-outline" title="Settings" variant="secondary" onPress={() => navigation.navigate('Settings')} ... />
      </ScrollView>
    </SafeAreaView>
  );
}
```

**Vai trò:** hiển thị **name, avatar, bio** và **nút Edit** — đáp ứng *"ProfileScreen: Display user's name, avatar, short bio, and 'Edit' button."* Ngoài ra có thêm nút Settings.

**Giải thích:**
- `const { profile } = useProfile();` → lấy dữ liệu để hiển thị.
- `<ProfileCard profile={profile} />` (không có `compact`)
  - **(a) LÀM GÌ:** render card **đầy đủ**: avatar lớn, name, bio, các tag.
  - **(b) TẠI SAO truyền cả object `profile` thay vì từng field:** gọn, và `ProfileCard` tự quyết hiển thị; nếu thêm field sau này không phải sửa chữ ký props.
- Hai `AppButton`:
  - Edit Profile dùng mặc định (`variant="primary"`), Settings dùng `variant="secondary"`.
  - **(b) TẠI SAO khác variant:** phân cấp thị giác — hành động chính (Edit) nổi bật, hành động phụ (Settings) nhẹ hơn. `icon="create-outline"` / `"settings-outline"` là tên icon Ionicons.

**Đáp ứng đề:** "Edit" button có mặt và dẫn tới `EditProfile`. Avatar hiển thị (qua `ProfileCard` → `Avatar`).

**Câu hỏi giảng viên có thể hỏi & gợi ý trả lời:**
- *Avatar lấy từ đâu?* → Từ `profile.avatar`. Hiện mặc định `null` nên `Avatar` hiển thị **icon person** làm fallback (xem mục 18). App chưa gắn ảnh thật.
- *Vì sao Home và Profile dùng chung `ProfileCard`?* → Tái sử dụng UI; khác nhau chỉ ở prop `compact`.

---

## 11. src/screens/EditProfileScreen.js — Formik + Yup

Đây là màn hình **trọng tâm** về state form & validation. Đáp ứng *"EditProfileScreen: editing of name and bio using controlled inputs"* + *"Validating Forms with Formik and Yup"*.

### 11.1 Yup schema

```js
const profileSchema = Yup.object({
  name: Yup.string()
    .test('name-required', 'Name is required.', (value) => Boolean(value?.trim().length))
    .test('name-min-length', 'Name must be at least 2 characters.',
      (value) => !value?.trim().length || value.trim().length >= 2),
  bio: Yup.string().test('bio-required', 'Bio is required.',
    (value) => Boolean(value?.trim().length)),
});
```

- **(a) LÀM GÌ:** khai báo luật: `name` bắt buộc và ≥ 2 ký tự *sau khi trim*; `bio` bắt buộc *sau khi trim*.
- **(b) TẠI SAO dùng `.test()` với `value.trim()` thay vì `.required().min(2)` chuẩn của Yup:**
  - `.required()` mặc định coi chuỗi chỉ gồm khoảng trắng (`"   "`) là "có giá trị" (truthy) và `.min(2)` đếm cả khoảng trắng. Vậy `"  "` sẽ **lọt** qua validate.
  - Dùng `.test()` đọc `value.trim().length` để **loại** chuỗi chỉ-khoảng-trắng và đếm độ dài **thực**. Đây là lý do kỹ thuật chính.
  - `value?.trim()` dùng optional chaining để an toàn khi `value` là `undefined`.
  - Điều kiện min: `!value?.trim().length || value.trim().length >= 2` — nếu rỗng thì **bỏ qua** test min (để test required báo lỗi, tránh hiện 2 lỗi cùng lúc).
- **(c) KHÁI NIỆM — schema validation:** tách luật kiểm tra ra khỏi UI; Formik nhận schema và tự ánh xạ lỗi về đúng field `name`/`bio`.

> Lưu ý trung thực: `name` **không** giới hạn độ dài tối đa trong schema; chỉ `bio` bị giới hạn ở tầng input bằng `maxLength={220}` (xem dưới). Không bắt buộc theo đề, nhưng nên biết.

### 11.2 Formik

```js
<Formik
  initialValues={{ name: profile.name, bio: profile.bio }}
  validateOnBlur
  validateOnChange={false}
  validationSchema={profileSchema}
  onSubmit={(values, { setSubmitting }) => {
    updateProfile({ name: values.name.trim(), bio: values.bio.trim() });
    setSubmitting(false);
    navigation.goBack();
  }}
>
  {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => ( ... )}
</Formik>
```

- `initialValues={{ name: profile.name, bio: profile.bio }}`
  - **(a) LÀM GÌ:** nạp profile hiện tại làm giá trị khởi đầu cho form.
  - **(b) TẠI SAO:** người dùng thấy dữ liệu cũ để chỉnh, không phải gõ lại từ đầu.

- `validateOnChange={false}` + `validateOnBlur`
  - **(a) LÀM GÌ:** **không** validate sau mỗi ký tự; chỉ validate khi input **mất focus (blur)** và khi **submit**.
  - **(b) TẠI SAO — rất quan trọng cho tiếng Việt:** bộ gõ tiếng Việt ghép dấu qua nhiều bước (composition). Nếu validate/biến đổi liên tục theo từng phím, trải nghiệm gõ dấu dễ lỗi. Hoãn validate tới blur/submit cho phép gõ xong rồi mới kiểm.

- `onSubmit` chạy khi form **hợp lệ**:
  1. `updateProfile({ name: values.name.trim(), bio: values.bio.trim() })` — lưu vào ProfileContext, **trim** hai đầu.
  2. `setSubmitting(false)` — kết thúc trạng thái đang submit.
  3. `navigation.goBack()` — quay lại Profile.
  - **(b) TẠI SAO trim ở **submit** mà không phải lúc gõ:** lúc submit người dùng đã gõ xong, trim chỉ dọn khoảng trắng thừa hai đầu, **không** can thiệp vào quá trình ghép dấu. Trim trong `onChangeText` mới là cái gây lỗi gõ tiếng Việt — code cố tình tránh.

- **Render props** `{({ ... }) => (<JSX/>)}`
  - **(c) KHÁI NIỆM — render prop:** Formik truyền các công cụ (`values`, `errors`, `touched`, `handleChange`, `handleBlur`, `handleSubmit`, `isSubmitting`) qua một **hàm con**, để JSX bên trong dùng. Nhờ đó screen không phải tự tạo `useState` cho từng field.

### 11.3 Controlled inputs

```js
<FormInput
  error={touched.name ? errors.name : undefined}
  label="Name"
  onBlur={handleBlur('name')}
  onChangeText={handleChange('name')}
  value={values.name}
  ...
/>
```

- `value={values.name}` + `onChangeText={handleChange('name')}`
  - **(c) KHÁI NIỆM — controlled input:** giá trị hiển thị của `TextInput` đến từ **state** (`values.name` của Formik), và mỗi thay đổi đi qua handler để cập nhật state. UI luôn = state. Đây chính là yêu cầu *"controlled inputs"* của đề.
  - **(b) TẠI SAO `handleChange('name')`:** Formik tạo sẵn handler ghi đúng vào field `name`, đỡ viết tay.

- `error={touched.name ? errors.name : undefined}`
  - **(a) LÀM GÌ:** chỉ truyền lỗi xuống khi field đã **touched** (đã từng focus rồi rời).
  - **(b) TẠI SAO:** tránh "mắng" người dùng lỗi ngay khi chưa kịp gõ. `touched` cho biết người dùng đã tương tác field hay chưa.

- Bio có thêm `multiline` và `maxLength={220}`
  - **(b) TẠI SAO:** bio dài nhiều dòng; `maxLength` chặn cứng độ dài ở tầng nhập để bio không quá khổ.

### 11.4 KeyboardAvoidingView + ScrollView

```js
<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardArea}>
  ...
  <ScrollView keyboardShouldPersistTaps="handled" ...>
```

- **(a) LÀM GÌ:** trên iOS đẩy nội dung lên khi bàn phím mở để input không bị che; `keyboardShouldPersistTaps="handled"` cho phép bấm nút trong khi bàn phím đang hiện.
- **(b) TẠI SAO `behavior` khác nhau theo `Platform.OS`:** Android tự xử lý insets bàn phím khác iOS; đặt `'padding'` cho iOS, `undefined` cho Android là cấu hình phổ biến để tránh layout giật.

### 11.5 Hai nút Save / Cancel

```js
<AppButton loading={isSubmitting} title="Save Changes" onPress={handleSubmit} />
<AppButton title="Cancel" variant="secondary" onPress={navigation.goBack} ... />
```

- `onPress={handleSubmit}` → kích hoạt validate → nếu hợp lệ chạy `onSubmit`.
- `loading={isSubmitting}` → hiện spinner và khóa nút khi đang submit (chặn double submit).
- Cancel gọi thẳng `navigation.goBack` (không lưu).

**Câu hỏi giảng viên có thể hỏi & gợi ý trả lời:**
- *Vì sao dùng Formik thay vì nhiều `useState`?* → Formik gom values/touched/errors/submit về một chỗ, giảm boilerplate; vẫn là local state.
- *Yup validate khi nào?* → Khi blur và submit (do `validateOnChange={false}`), không phải mỗi ký tự.
- *Vì sao `.test()` chứ không `.required().min(2)`?* → Để loại chuỗi chỉ-khoảng-trắng và đếm độ dài sau `trim`; `.required()`/`.min()` mặc định không trim.
- *Controlled input là gì trong file này?* → `value` lấy từ `values.name`, đổi qua `handleChange`; UI luôn đồng bộ state.
- *Khi nhập tiếng Việt có mất dấu không?* → Không, vì không trim/normalize trong `onChangeText` và `validateOnChange={false}`.

---

## 12. src/screens/SettingsScreen.js

**Vai trò:** màn hình **Theme toggle (Light/Dark)** — đáp ứng *"SettingsScreen: Theme toggle (Light/Dark)"*. Gồm hai phần: APPEARANCE (chứa `ThemeToggleSwitch`) và THEME PREVIEW.

**Giải thích đáng chú ý:**

- `const { colors, isDark } = useTheme();` → đọc theme để vẽ preview.
- `<ThemeToggleSwitch />` — component đảm nhiệm việc bật/tắt (mục 14). Screen **không** tự xử lý logic toggle → tách trách nhiệm.
- Theme Preview:
  - `Ionicons name={isDark ? 'moon' : 'sunny'}` — icon đổi theo theme.
  - Text `{isDark ? 'Dark Mode' : 'Light Mode'}` — nhãn động.
- **Swatches (dải màu mẫu):**
  ```js
  {[colors.primary, colors.primaryLight, colors.background, colors.border].map((color, index) => (
    <View key={`${color}-${index}`} style={[styles.swatch, { backgroundColor: color, borderColor: colors.border }]} />
  ))}
  ```
  - **(a) LÀM GÌ:** render 4 ô màu của palette hiện tại.
  - **(b) TẠI SAO `.map(...)` + `key`:** render danh sách động từ mảng. **`key`** giúp React nhận diện từng phần tử khi cập nhật, tránh vẽ lại sai. Vì giá trị màu có thể trùng giữa các theme nên key dùng `color + index` cho ổn định.
  - **(c) KHÁI NIỆM — render list bằng map + key:** cách chuẩn để biến mảng dữ liệu thành nhiều element.
- **Minh chứng theme là toàn cục:** dòng "This preview updates instantly across every screen" + footer "Theme managed with Context API" — preview đổi tức thì cùng cả app vì cùng đọc một Context.

**Câu hỏi giảng viên có thể hỏi & gợi ý trả lời:**
- *Toggle ở đây ảnh hưởng tới đâu?* → Toàn app: nền, card, text, button, border, NavigationContainer, StatusBar, và chính preview này — vì tất cả đọc `colors` từ ThemeContext.
- *Vì sao cần `key` trong `.map`?* → Để React diff danh sách chính xác và tránh cảnh báo/bug khi list thay đổi.

---

## 13. src/components/ProfileCard.js — **reusable component (đề yêu cầu đích danh)**

```js
const tags = ['Student', 'Mobile App', 'Dark Mode Ready'];

export default function ProfileCard({ profile, compact = false }) {
  const { colors } = useTheme();
  if (compact) {
    return ( <View style={styles.compactContent}> <Avatar source={profile.avatar} size={108} subtle /> ...Welcome... </View> );
  }
  return ( <View style={styles.profileContent}> <Avatar source={profile.avatar} size={132} /> {profile.name} {profile.bio} ...tags... </View> );
}
```

**Vai trò:** **`ProfileCard`** — đúng tên đề liệt kê làm ví dụ reusable component.

**Giải thích:**
- `function ProfileCard({ profile, compact = false })`
  - **(a) LÀM GÌ:** nhận `profile` và cờ `compact` (mặc định `false`).
  - **(c) KHÁI NIỆM — default props value:** `compact = false` đặt giá trị mặc định ngay khi destructuring props.
- **Hai nhánh render theo `compact`:**
  - `compact === true` (Home): avatar 108, tiêu đề "Welcome Back!" + mô tả → welcome card.
  - `compact === false` (Profile): avatar 132, `profile.name`, `profile.bio`, và 3 tag.
  - **(b) TẠI SAO một component hai chế độ thay vì hai component:** Home và Profile cùng "khái niệm hiển thị hồ sơ" nhưng bố cục hơi khác. Gộp vào một component + cờ `compact` giúp **tái sử dụng**, giữ style đồng nhất, tránh copy JSX. Đây là minh chứng cụ thể cho tiêu chí *reusable components*.
  - **(c) KHÁI NIỆM — conditional rendering:** trả về JSX khác nhau tùy điều kiện.
- **Tags bằng `.map`:** danh sách tĩnh `tags`, mỗi tag một "pill" màu `primaryLight`. `key={tag}` vì các tag là duy nhất.

> Lưu ý trung thực: 3 tag (`Student`, `Mobile App`, `Dark Mode Ready`) là **chuỗi tĩnh trang trí**, không lấy từ profile. Đây là nội dung UI, không phải dữ liệu người dùng — nên không cần (và không có) trong model profile.

**Câu hỏi giảng viên có thể hỏi & gợi ý trả lời:**
- *`ProfileCard` tái sử dụng ở đâu?* → Home (`compact`) và Profile (đầy đủ).
- *Vì sao truyền `profile` thay vì `name`, `bio` riêng?* → Gọn và dễ mở rộng; component tự lấy field cần.

---

## 14. src/components/ThemeToggleSwitch.js — **reusable component (đề yêu cầu đích danh)**

```js
export default function ThemeToggleSwitch() {
  const { colors, isDark, toggleTheme } = useTheme();
  return (
    <View style={styles.row}>
      <View style={[styles.iconBox, ...]}><Ionicons name={isDark ? 'moon' : 'sunny'} .../></View>
      <View style={styles.copy}><Text>Dark Mode</Text><Text>{isDark ? 'Dark theme is active' : 'Use a darker color palette'}</Text></View>
      <Switch onValueChange={toggleTheme} value={isDark} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.white} .../>
    </View>
  );
}
```

**Vai trò:** **`ThemeToggleSwitch`** — đúng tên đề liệt kê. Đóng gói toàn bộ UI + hành vi bật/tắt theme.

**Giải thích:**
- Component **không nhận props** — tự lấy `isDark`, `colors`, `toggleTheme` từ `useTheme()`.
  - **(b) TẠI SAO tự đọc context thay vì nhận props từ Settings:** giúp `SettingsScreen` chỉ cần `<ThemeToggleSwitch />`, không phải biết chi tiết logic theme. Đóng gói (encapsulation) tốt.
- `<Switch value={isDark} onValueChange={toggleTheme} />`
  - **(a) LÀM GÌ:** `value={isDark}` cho switch phản ánh trạng thái hiện tại; gạt switch gọi `onValueChange={toggleTheme}` để lật theme.
  - **(c) KHÁI NIỆM — `Switch` là controlled component:** trạng thái bật/tắt do `value` (state) quyết định, không tự giữ trạng thái nội bộ.
- `trackColor`, `thumbColor`, `ios_backgroundColor` lấy từ theme → switch cũng đổi màu theo light/dark.

**Câu hỏi giảng viên có thể hỏi & gợi ý trả lời:**
- *Vì sao toggle nằm trong component riêng?* → Reusable + tách trách nhiệm khỏi screen; nếu cần đặt toggle ở chỗ khác, chỉ việc gắn lại component.
- *Switch lấy trạng thái từ đâu?* → `value={isDark}` từ ThemeContext, là controlled component.

---

## 15. src/components/FormInput.js

```js
export default function FormInput({ label, error, multiline = false, ...inputProps }) {
  const { colors } = useTheme();
  const hasError = Boolean(error);
  return (
    <View style={styles.field}>
      <Text style={[styles.label, ...]}>{label}</Text>
      <View style={[styles.inputShell, multiline && styles.multilineShell, { borderColor: hasError ? colors.error : colors.border, ... }]}>
        <TextInput {...inputProps} autoCapitalize="none" autoCorrect={false} multiline={multiline} ... />
        {hasError && !multiline ? <Ionicons name="alert-circle-outline" .../> : null}
      </View>
      {hasError ? <Text style={[styles.error, ...]}>{error}</Text> : null}
    </View>
  );
}
```

**Vai trò:** reusable input — gói label + TextInput + viền + icon lỗi + dòng lỗi. Dùng cho cả Name và Bio.

**Giải thích quan trọng:**
- `function FormInput({ label, error, multiline = false, ...inputProps })`
  - **(c) KHÁI NIỆM — rest props (`...inputProps`):** gom **mọi** prop còn lại (như `value`, `onChangeText`, `onBlur`, `placeholder`, `maxLength`, `returnKeyType`) vào một object rồi rải xuống `<TextInput {...inputProps} />`.
  - **(b) TẠI SAO làm vậy:** `FormInput` không cần biết trước từng prop của TextInput; nó "trong suốt" chuyển các prop Formik (value/onChangeText/onBlur) xuống. Đây là điều giúp nó hoạt động như **controlled input**.
- **Không trim/normalize trong khi gõ:** file chỉ chuyển `onChangeText` thẳng từ Formik, **không** chèn regex/replace/trim.
  - **(b) TẠI SAO:** giữ nguyên chuỗi từ bàn phím để **không phá ghép dấu tiếng Việt** và không nhảy con trỏ. (Liên hệ với `validateOnChange={false}` ở Edit Profile.)
- `autoCorrect={false}`, `autoCapitalize="none"`
  - **(b) TẠI SAO:** tránh hệ điều hành tự sửa/viết hoa làm sai tên/bio người dùng nhập.
- `borderColor: hasError ? colors.error : colors.border`
  - **(a) LÀM GÌ:** viền đỏ khi có lỗi → phản hồi trực quan.
- Icon lỗi chỉ hiện khi `hasError && !multiline`
  - **(b) TẠI SAO loại multiline:** ô bio cao nhiều dòng, đặt icon cảnh báo bên cạnh dễ chồng chữ; nên bio chỉ hiện **dòng lỗi** bên dưới, không hiện icon. (Chi tiết thiết kế có chủ đích.)
- `{hasError ? <Text>{error}</Text> : null}`
  - **(c) KHÁI NIỆM — conditional rendering với `? :` và `null`:** trả `null` để **không render gì** khi không có lỗi.

**Câu hỏi giảng viên có thể hỏi & gợi ý trả lời:**
- *`...inputProps` để làm gì?* → Chuyển toàn bộ props Formik (value/onChangeText/onBlur...) xuống TextInput mà không liệt kê từng cái.
- *Vì sao không xử lý chuỗi khi gõ?* → Bảo toàn ghép dấu tiếng Việt và vị trí con trỏ.

---

## 16. src/components/AppButton.js

```js
export default function AppButton({ title, onPress, variant = 'primary', icon, disabled = false, loading = false, style }) {
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} disabled={disabled || loading} onPress={onPress}
      style={({ pressed }) => [ styles.button, { backgroundColor: isPrimary ? colors.primary : colors.primaryLight, opacity: disabled ? 0.55 : pressed ? 0.86 : 1 }, style ]}>
      {loading ? <ActivityIndicator .../> : (<> {icon ? <Ionicons .../> : null} <Text>{title}</Text> </>)}
    </Pressable>
  );
}
```

**Vai trò:** nút chuẩn hóa toàn app: hai `variant`, icon, trạng thái `disabled`/`loading`/`pressed`, màu theo theme.

**Giải thích:**
- `<Pressable>` thay vì `Button`/`TouchableOpacity`
  - **(b) TẠI SAO:** `Pressable` cho phép style theo trạng thái nhấn qua hàm `style={({ pressed }) => [...]}` (đổi `opacity` khi đang nhấn), linh hoạt hơn `Button` mặc định vốn khó tùy biến.
- `disabled={disabled || loading}`
  - **(b) TẠI SAO gộp:** khi đang loading cũng phải khóa nút để tránh nhấn nhiều lần (double submit) — đúng với nút Save ở Edit Profile.
- `{loading ? <ActivityIndicator/> : (<>icon + text</>)}`
  - **(a) LÀM GÌ:** đang loading thì hiện spinner thay cho nội dung.
- `accessibilityRole="button"`, `accessibilityLabel={title}`
  - **(b) TẠI SAO:** hỗ trợ screen reader → app dễ tiếp cận hơn (accessibility).
- Prop `style` cuối mảng style
  - **(b) TẠI SAO đặt cuối:** cho phép screen ghi đè/đắp thêm (ví dụ `marginTop`) mà không phá style gốc — thứ tự sau thắng.

**Câu hỏi giảng viên có thể hỏi & gợi ý trả lời:**
- *Vì sao tách `AppButton`?* → Sửa một nơi, mọi nút đổi theo; giữ giao diện nhất quán; giảm lặp.
- *`variant` để làm gì?* → Phân biệt hành động chính/phụ mà không viết lại style.

---

## 17. src/components/AppHeader.js

```js
export default function AppHeader({ title, onBack }) {
  const { colors } = useTheme();
  return (
    <View style={styles.header}>
      <View style={styles.side}>{onBack ? <Pressable onPress={onBack} ...><Ionicons name="arrow-back" .../></Pressable> : null}</View>
      <Text numberOfLines={1} style={[styles.title, ...]}>{title}</Text>
      <View style={styles.side} />
    </View>
  );
}
```

**Vai trò:** header tự thiết kế cho cả 4 screen (vì `headerShown: false`). Hiển thị tiêu đề ở giữa và back button tùy chọn.

**Giải thích:**
- `onBack` là **prop tùy chọn**:
  - Home không truyền → không có nút back (đúng, Home là gốc stack).
  - Edit/Settings truyền `onBack={navigation.goBack}` → hiện mũi tên, nhấn để pop.
  - **(b) TẠI SAO điều kiện `onBack ? ... : null`:** một component header dùng cho cả màn có và không có back.
- **Layout 3 cột bằng Flexbox:** hai `View style={styles.side}` (rộng 44) hai bên + `Text` ở giữa `flex: 1, textAlign: 'center'`.
  - **(b) TẠI SAO có một `side` trống bên phải:** để tiêu đề căn **chính giữa** đối xứng — cột trái (back) và cột phải (trống) cùng rộng 44, nên title không bị lệch khi có back button. Đây là tiểu xảo layout cân đối.
- `numberOfLines={1}` trên title → tiêu đề dài không xuống dòng, bị cắt gọn.

**Câu hỏi giảng viên có thể hỏi & gợi ý trả lời:**
- *Back button xử lý thế nào?* → Screen truyền `navigation.goBack` qua `onBack`; có prop thì render mũi tên và gọi callback.
- *Vì sao tự vẽ header?* → `headerShown: false` để kiểm soát hoàn toàn style và đồng bộ theme.

---

## 18. src/components/Avatar.js

```js
export default function Avatar({ source, size = 116, subtle = false }) {
  const { colors } = useTheme();
  const borderWidth = subtle ? 4 : 5;
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, borderWidth, borderColor: subtle ? colors.primaryLight : colors.primary, backgroundColor: colors.primaryLight }]}>
      {source ? <Image source={source} resizeMode="cover" style={styles.image} /> : <Ionicons name="person" size={size * 0.64} color={colors.primary} />}
    </View>
  );
}
```

**Vai trò:** hiển thị avatar tròn; có ảnh thì render `Image`, chưa có thì render icon `person` làm **fallback**. Dùng ở Home, Profile, Edit Profile.

**Giải thích:**
- `borderRadius: size / 2` → bo tròn hoàn hảo bất kể `size`.
  - **(c) KHÁI NIỆM — bo tròn:** `borderRadius` bằng nửa cạnh của hình vuông tạo hình tròn.
- `{source ? <Image .../> : <Ionicons name="person" .../>}`
  - **(a) LÀM GÌ:** chọn ảnh thật hay icon mặc định.
  - **(b) TẠI SAO cần fallback:** `profile.avatar` hiện là `null`, nên luôn rơi vào nhánh icon. Có fallback giúp UI không vỡ khi chưa có ảnh; nếu sau này gán `source` hợp lệ, component tự render ảnh — **mở rộng được**.
- `size={size * 0.64}` cho icon → icon co giãn theo kích thước avatar (tỉ lệ nhất quán).
- `subtle` đổi độ dày/màu viền → biến thể nhẹ dùng ở welcome card và Edit Profile.

> **Lưu ý trung thực (quan trọng):** vì `avatar` luôn `null`, app **chưa bao giờ hiển thị ảnh thật** — luôn là icon person. Đề yêu cầu *"Display user's avatar"*; app đáp ứng ở mức **placeholder/fallback**, chưa có ảnh người dùng và không có chức năng đổi ảnh (đề chỉ cho sửa Name/Bio). Xem mục Điểm yếu.

**Câu hỏi giảng viên có thể hỏi & gợi ý trả lời:**
- *Avatar hiện là gì?* → Icon `person` (fallback) vì chưa gán ảnh; code đã sẵn sàng render `Image` nếu có `source`.
- *Vì sao không cho đổi avatar?* → Đề chỉ yêu cầu chỉnh Name và Bio.

---

## 19. Bảng map tiêu chí chấm điểm

| Yêu cầu của đề | Đáp ứng ở đâu | Bằng cách nào |
| --- | --- | --- |
| **HomeScreen**: welcome + điều hướng tới profile | [HomeScreen.js](src/screens/HomeScreen.js) | Welcome card (`ProfileCard compact`) + `AppButton` gọi `navigation.navigate('Profile')` |
| **ProfileScreen**: name, avatar, bio, nút Edit | [ProfileScreen.js](src/screens/ProfileScreen.js) + [ProfileCard.js](src/components/ProfileCard.js) | `ProfileCard` hiển thị `profile.name`/`bio` + `Avatar`; `AppButton` "Edit Profile" |
| **EditProfileScreen**: sửa name/bio bằng controlled inputs | [EditProfileScreen.js](src/screens/EditProfileScreen.js) | `FormInput` với `value={values.x}` + `onChangeText={handleChange('x')}` |
| **SettingsScreen**: toggle Light/Dark | [SettingsScreen.js](src/screens/SettingsScreen.js) + [ThemeToggleSwitch.js](src/components/ThemeToggleSwitch.js) | `Switch` gọi `toggleTheme()` |
| **Stack Navigator** + điều hướng giữa 4 screen | [AppNavigator.js](src/navigation/AppNavigator.js) | `createNativeStackNavigator`, 4 `Stack.Screen`, `navigate`/`goBack` |
| **useState** cho local profile (temporary) | [ProfileContext.js](src/context/ProfileContext.js) | `useState(initialProfile)`; chỉ trong RAM |
| **Context API** | [ProfileContext.js](src/context/ProfileContext.js), [ThemeContext.js](src/context/ThemeContext.js) | `createContext` + `Provider` + `useContext` |
| **custom ThemeContext** (light/dark) | [ThemeContext.js](src/context/ThemeContext.js) | `ThemeProvider` giữ `themeMode`, phát `colors`/`toggleTheme` |
| **Styling** bằng StyleSheet hoặc Styled-Components | tất cả screen/component | **`StyleSheet.create`** (không dùng styled-components — đề cho phép "hoặc") |
| **Validation** Formik + Yup | [EditProfileScreen.js](src/screens/EditProfileScreen.js) | `<Formik validationSchema={profileSchema}>` + `Yup.object({...})` |
| **Reusable components** (ProfileCard, ThemeToggleSwitch) | [components/](src/components/) | `ProfileCard`, `ThemeToggleSwitch` (+ `AppButton`, `AppHeader`, `FormInput`, `Avatar`) |
| **Different color themes app-wide** | [colors.js](src/theme/colors.js) + ThemeContext | mọi component đọc `colors` qua `useTheme()`; NavigationContainer + StatusBar cũng đổi |
| **Responsive layout** bằng Flexbox | tất cả screen | `flex`, `flexGrow`, `flexDirection`, `maxWidth`, `alignSelf`, `ScrollView`, `KeyboardAvoidingView` |

**Kết luận:** **tất cả** yêu cầu chức năng và UX/UI của đề đều có chỗ đáp ứng trong code.

---

## 20. Điểm yếu & hạn chế (trung thực)

Những điểm dưới đây **không sai theo đề**, nhưng nên biết để bảo vệ bài và để giảng viên thấy em hiểu giới hạn:

1. **Avatar luôn là icon fallback, không có ảnh thật.** `profile.avatar = null` cố định và không có chức năng chọn ảnh. Yêu cầu "display user's avatar" được đáp ứng ở mức **placeholder**. → Nếu muốn mạnh hơn: thêm một ảnh trong `src/assets/images` và set `avatar: require(...)`, hoặc dùng `expo-image-picker`.

2. **Không persistence — dữ liệu mất khi reload.** State chỉ trong RAM. Đúng phạm vi đề (chỉ yêu cầu local state), nhưng là giới hạn thực tế. → Nâng cấp: `AsyncStorage`.

3. **Styling chỉ dùng `StyleSheet`, không dùng Styled-Components.** Đề ghi "StyleSheet *hoặc* Styled-Components" nên hợp lệ; chỉ cần nói rõ là **lựa chọn có chủ đích** (gọn, không thêm dependency).

4. **`name` không có giới hạn độ dài tối đa** (chỉ `bio` có `maxLength={220}`). Không bắt buộc, nhưng nếu bị hỏi "name dài vô hạn được không" thì đây là sự thật.

5. **Validation chỉ ở một form (Edit Profile).** Đó cũng là form duy nhất của app, nên không thiếu — nhưng cần nói rõ phạm vi.

6. **Theme không lưu và không theo hệ điều hành.** Toggle reset về `light` sau reload (do `useState('light')`), và không đọc `useColorScheme()` của thiết bị. Đề không yêu cầu, nhưng là điểm có thể nâng cấp.

7. **`SettingsScreen` được điều hướng từ Profile** (không phải mục đề liệt kê tường minh trong "Screens" ngoài 4 screen). Thực ra Settings **là** 1 trong 4 screen đề yêu cầu, nên điều này đúng — chỉ lưu ý luồng là Profile → Settings.

> Nếu giảng viên hỏi "điểm yếu của bài?", trả lời mục 1 và 2 trước (avatar placeholder, không persistence) là trung thực và thể hiện hiểu bài.

---

## 21. 5 điểm cần nắm chắc nhất

1. **Luồng khởi động & vì sao tách `AppContent`.** `index.js → App → SafeAreaProvider → ThemeProvider → ProfileProvider → AppNavigator`. `AppContent` phải nằm **trong** `ThemeProvider` thì `useTheme()` mới chạy — component render ra provider thì ở ngoài, không đọc được context của chính nó.

2. **Context API + custom ThemeContext giải quyết prop drilling.** State đặt **trên** navigator nên mọi screen chia sẻ; component đọc qua `useTheme()`/`useProfile()`. Khi context value đổi (dùng `useMemo` để tránh đổi thừa), React render lại mọi consumer → cả app đổi màu/đổi profile cùng lúc.

3. **Profile = `useState` trong Context, cập nhật bất biến.** `updateProfile` dùng `setProfile((cur) => ({ ...cur, ...updates }))` — tạo object mới, giữ field cũ (avatar), ghi đè field mới (name/bio). Dữ liệu temporary, mất khi reload.

4. **Form: Formik giữ values + Yup validate; controlled inputs.** `value={values.x}` + `onChangeText={handleChange('x')}`. `validateOnChange={false}` + không trim khi gõ → bảo toàn gõ tiếng Việt; chỉ **trim khi submit**. Yup dùng `.test()` với `value.trim()` để loại chuỗi chỉ-khoảng-trắng (lý do không dùng `.required()/.min()` mặc định).

5. **Stack Navigator + reusable components + Flexbox responsive.** `createNativeStackNavigator`, 4 route, `navigate`/`goBack`. UI tách thành `ProfileCard`, `ThemeToggleSwitch`, `AppButton`, `AppHeader`, `FormInput`, `Avatar`. Responsive bằng `flex/flexGrow`, `maxWidth + alignSelf: center`, `ScrollView`, `KeyboardAvoidingView` — không hardcode kích thước thiết bị.
```
