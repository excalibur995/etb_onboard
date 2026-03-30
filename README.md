This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

---

# App Flow — Journey API to End Journey

## Overview

ETB Onboard is a **backend-driven onboarding system**. All journeys and screen UIs are fetched from a Strapi CMS at runtime, allowing screens and flows to be updated without shipping a new app release.

```
App Start
  └── SplashScreen
        └── LoginScreen
              └── JourneyLauncher        ← Journey API called here
                    └── ETBOnboardCCRegisterJourney (Navigator)
                          └── DynamicScreenZone  ← Screen API called here (per screen)
                                └── [repeat for each step]
                                      └── End Journey → Reset to LoginScreen
```

---

## Step 1 — App Start & Splash

**Files:** `App.tsx`, `src/screens/SplashScreen.tsx`, `src/navigation/MainNavigator.tsx`

1. App boots into `MainNavigator`, which wraps navigation inside a `QueryClientProvider`.
2. `SplashScreen` plays a 2.2s animation and preloads language/translation data.
3. After the splash, the user lands on `LoginScreen`.

---

## Step 2 — Login & Journey Selection

**File:** `src/screens/LoginScreen.tsx`

The user taps a button (e.g., "Existing Customer"), which navigates to `JourneyLauncher` with a `journeyId` parameter:

```
journeyId = 'PLAT_AUTH_ONBOARDING'
```

---

## Step 3 — Journey API Call

**Files:** `src/screens/JourneyLauncher.tsx`, `src/utils/api/journey.ts`, `src/utils/queries/journeyQueries.ts`

`JourneyLauncher` calls the Journey API to fetch journey configuration.

### API Endpoint

```
GET /api/journeys/{journeyId}
```

### What It Returns

| Field | Description |
|---|---|
| `journeyId` | Unique identifier (e.g., `PLAT_AUTH_ONBOARDING`) |
| `navigator` | Navigator component to use (e.g., `ETBOnboardCCRegisterJourney`) |
| `screens[]` | Ordered list of screen IDs in the journey |
| `steps[]` | Workflow steps — either `user` (user-driven) or `system` (auto API calls) |
| `initialState` | Default values for journey state |
| `onExit` | Action to run when the user exits mid-journey |
| `preInitiateScreen` | Screen to return to when the journey finishes |

### Caching & Fallback

- Uses **React Query** with `staleTime: 0` (always re-fetches on focus).
- If the API is unreachable, falls back to bundled journey config in `src/utils/config/fallbackJourney.ts`.

### After Journey Fetch

`JourneyLauncher` initializes a **session** in the Zustand store:

```json
{
  "currentScreenIndex": 0,
  "journeyState": {}
}
```

This session is also persisted to **MMKV** local storage so it survives app restarts.

Then, navigation resets to the journey navigator (`ETBOnboardCCRegisterJourney`).

---

## Step 4 — Screen API Call (per screen)

**Files:** `src/components/core/DynamicScreenZone.tsx`, `src/utils/api/journey.ts`

The journey navigator renders `DynamicScreenZone` for the current screen in `journey.screens[]`.

### API Endpoint

```
GET /api/screens/{screenId}?locale={language}
```

### What It Returns (Server-Driven UI)

Each screen is fully described by the API — no hardcoded layout per screen.

| Zone | Contents |
|---|---|
| `meta` | Title, subtitle, show/hide back button, show/hide close button |
| `header[]` | Components rendered at the top (e.g., hero images) |
| `body[]` | Main scrollable content (text, inputs, checkboxes, etc.) |
| `footer[]` | Buttons and actions anchored at the bottom |

Every component has a `__component` field that maps to a registered React Native widget:

```
"ui.button"        → ButtonWidget
"ui.text-input"    → TextInputWidget
"ui.checkbox-list" → CheckboxListWidget
"ui.radio-group"   → RadioGroupWidget
... and 20+ more
```

Component registry: `src/components/registry/ComponentRegistry.ts`

### State Binding

Widgets bind their value to `journeyState` via a `binding` field:

```json
{
  "binding": {
    "scope": "journeyState",
    "path": "username"
  }
}
```

When the user fills in a field, the value is written into `journeyState.username` in the session store.

### Validation

Footer buttons check validation rules against `journeyState` before allowing forward navigation. If validation fails, navigation is blocked and an error is shown inline.

---

## Step 5 — Navigation Between Screens

**File:** `src/hooks/useJourneyNavigation.ts`

When the user taps a button, a navigation action fires with a direction:

| Direction | Behavior |
|---|---|
| `NEXT` | Move to the next screen in `journey.screens[]` |
| `BACK` | Move to the previous screen |
| `JUMP` | Jump to a specific screen by `screenId` |
| `FINISH` | End the journey |

### User Steps vs System Steps

Each screen maps to a `step` in `journey.steps[]`:

- **`user` step** — waits for user interaction. On button press, resolves the action to a direction and navigates.
- **`system` step** — automatically calls a backend service (e.g., `identity-service.verifyCreditCard`). On success/failure, follows the configured next direction.

System step execution: `src/utils/stepExecutor.ts`

---

## Step 6 — Repeat Per Screen

For each screen in the journey:

1. `DynamicScreenZone` calls `useScreen(screenId)` → fetches screen SDUI from API.
2. Screen is rendered using the component registry.
3. User interacts (fills inputs, makes selections) → values written to `journeyState`.
4. User taps footer button → validation runs.
5. Navigation hook resolves the next direction.
6. Session updated: `currentScreenIndex` increments, `journeyState` is merged.
7. Next screen is rendered.

---

## Step 7 — End Journey

**Files:** `src/hooks/useJourneyNavigation.ts`, `src/store/useJourneyStore.ts`

When a step resolves to direction `FINISH`:

1. **Session is cleared:**
   - Removed from MMKV storage (key: `journey-session::{journeyId}`)
   - Removed from Zustand in-memory store

2. **Navigation resets** to the `preInitiateScreen` (typically `LoginScreen`), or a specific target screen if defined in the FINISH action. The stack is fully cleared — the user cannot navigate back into the journey.

---

## Complete Flow Summary

```
1.  App starts → SplashScreen (animation + language preload)
2.  Navigate to LoginScreen
3.  User taps "Existing Customer"
4.  JourneyLauncher fetches journey:
        GET /api/journeys/PLAT_AUTH_ONBOARDING
5.  Session initialized: { currentScreenIndex: 0, journeyState: {} }
6.  Navigate into ETBOnboardCCRegisterJourney
7.  DynamicScreenZone fetches first screen:
        GET /api/screens/PLAT_AUTH_CONSENT
8.  Screen rendered: header + body (text, checkbox) + footer (button)
9.  User accepts consent → journeyState.consentAccepted = true
10. User taps "Next" → validation passes → navigate(NEXT)
11. Session updated: currentScreenIndex = 1
12. DynamicScreenZone fetches next screen:
        GET /api/screens/PLAT_AUTH_LOGIN_USERNAME
13. [Repeat steps 8–12 for each screen in journey.screens[]]
14. Last step resolves direction = FINISH
15. clearSession('PLAT_AUTH_ONBOARDING')
16. navigation.reset → back to LoginScreen
```

---

## Key Files Reference

| Purpose | File |
|---|---|
| App entry | `App.tsx` |
| Navigation setup | `src/navigation/MainNavigator.tsx` |
| Splash screen | `src/screens/SplashScreen.tsx` |
| Login / journey entry | `src/screens/LoginScreen.tsx` |
| Journey initialization | `src/screens/JourneyLauncher.tsx` |
| Journey navigator | `src/navigation/ETBOnboardCCRegisterJourney.tsx` |
| Screen renderer | `src/components/core/DynamicScreenZone.tsx` |
| Component zone renderer | `src/components/core/DynamicZoneRenderer.tsx` |
| Journey & Screen API calls | `src/utils/api/journey.ts` |
| HTTP client (ETag caching) | `src/utils/api/client.ts` |
| React Query hooks | `src/utils/queries/journeyQueries.ts` |
| Navigation logic | `src/hooks/useJourneyNavigation.ts` |
| System step executor | `src/utils/stepExecutor.ts` |
| Session & state store | `src/store/useJourneyStore.ts` |
| Component registry | `src/components/registry/ComponentRegistry.ts` |
| Offline fallback config | `src/utils/config/fallbackJourney.ts` |
| TypeScript types | `src/types/api.ts` |
