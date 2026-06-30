# Implementation Plan

## Step 1: Clean Project

* Confirm package.json main is index.js.
* Remove or ignore Expo Router app folder.
* Ensure App.js is the root component.

## Step 2: Install Dependencies

Required packages:

* @react-navigation/native
* @react-navigation/native-stack
* react-native-screens
* react-native-safe-area-context
* formik
* yup
* @expo/vector-icons

## Step 3: Create Folder Structure

Create:

* src/components
* src/context
* src/navigation
* src/screens
* src/theme
* src/assets/images

## Step 4: Create Theme System

Create ThemeContext:

* themeMode: light/dark
* isDark
* toggleTheme
* colors

Create colors.js:

* lightColors
* darkColors

## Step 5: Create Profile State

Create ProfileContext:

* profile: name, bio, avatar
* updateProfile function

Default profile:

* name: Nguyen Van A
* bio: React Native learner building clean mobile apps.

## Step 6: Create Navigation

Create AppNavigator using Native Stack:

* Home
* Profile
* EditProfile
* Settings

Hide default stack header and use custom AppHeader.

## Step 7: Build Reusable Components

Create:

* AppHeader
* AppButton
* ProfileCard
* FormInput
* ThemeToggleSwitch

## Step 8: Build Screens

HomeScreen:

* title Profile App
* welcome card
* avatar
* View My Profile button
* assignment footer

ProfileScreen:

* title My Profile
* profile card
* Edit Profile button
* Settings button

EditProfileScreen:

* back button
* update information card
* Formik form
* Yup validation
* Save Changes button
* Cancel button

SettingsScreen:

* dark background when dark mode
* Appearance card
* Dark Mode toggle
* Theme Preview card
* Context API footer text

## Step 9: Final Check

* Run npm start.
* Test navigation.
* Test edit profile.
* Test validation.
* Test dark mode.
* Check UI on small screen.
