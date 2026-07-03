/**
 * index.js — Điểm vào (entry point) của app Expo.
 * Vai trò: nạp gesture-handler (phải import đầu tiên) rồi đăng ký App làm component gốc.
 */
import 'react-native-gesture-handler';

import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent: gắn App vào AppRegistry và lo phần khởi động dù chạy Expo Go hay native build.
registerRootComponent(App);
