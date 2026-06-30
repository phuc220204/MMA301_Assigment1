# Agent Rules - Profile App Assignment

## Project Type

React Native Expo SDK 54 mobile app.

## Main Goal

Build a multi-screen personal profile app with theme support and local state management.

## Must Follow

* Use JavaScript only.
* Do not use TypeScript.
* Do not use Expo Router.
* Do not use Bottom Tabs.
* Use React Navigation Native Stack only.
* Keep the app simple and assignment-focused.
* Do not add extra screens or features outside the assignment.

## Required Screens

1. HomeScreen
2. ProfileScreen
3. EditProfileScreen
4. SettingsScreen

## Navigation Rules

* HomeScreen navigates to ProfileScreen.
* ProfileScreen navigates to EditProfileScreen.
* ProfileScreen navigates to SettingsScreen.
* EditProfileScreen has a back button.
* SettingsScreen has a back button.

## State Rules

* Profile data must be stored in app state or ProfileContext.
* Theme state must be stored in ThemeContext.
* Theme must affect all screens.

## Form Rules

* EditProfileScreen must use Formik and Yup.
* Editable fields: name and bio only.
* Do not add email input.
* Show validation errors under inputs.
* Save only when form is valid.

## UI Rules

* Match the provided screenshots closely.
* Use purple as the primary color.
* Use rounded cards, large buttons, clean spacing.
* Use SafeAreaView.
* Use ScrollView where content may overflow.
* Avoid hard-coded screen height.
* Use Flexbox for responsive layout.

## Forbidden

* No Search screen.
* No Bottom Tab Navigation.
* No Expo Router.
* No unnecessary API/backend.
* No AsyncStorage unless explicitly requested.
* No complex animation.
