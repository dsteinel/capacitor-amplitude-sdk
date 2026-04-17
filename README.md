# capacitor-sdk-amplitude

Amplitude Analytics Capacitor plugin for iOS and Android. Wraps the native Amplitude Swift SDK (iOS) and Amplitude Kotlin/Android SDK (Android) behind a unified Capacitor bridge.

**Platform support:**

- iOS 16+
- Android API 24+
- Web: intentionally not implemented — use `@amplitude/analytics-browser` directly in the app

---

## Installation

```bash
npm install capacitor-sdk-amplitude
npx cap sync
```

---

## iOS Setup

The `Package.swift` file at the root of this plugin pulls in `AmplitudeSwift` via Swift Package Manager automatically when Capacitor resolves the plugin.

If you use CocoaPods instead, the `CapacitorSdkAmplitude.podspec` declares the dependency on `AmplitudeSwift ~> 1.0`.

**Requirements:** iOS deployment target 16.0 or higher. Ensure your Xcode project's minimum deployment target is set accordingly.

---

## Android Setup

The Amplitude Kotlin SDK (`com.amplitude:analytics-android:1.+`) is declared in `android/build.gradle` and resolved from `mavenCentral()` automatically during the Gradle build.

The app's `AndroidManifest.xml` must include the INTERNET permission (Capacitor projects include this by default):

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

---

## API Reference

### `init(options: InitOptions): Promise<void>`

Initialize the Amplitude SDK. Must be called before any other method. Subsequent calls are no-ops (safe to call multiple times).

| Option       | Type                                              | Required | Description                              |
| ------------ | ------------------------------------------------- | -------- | ---------------------------------------- |
| `apiKey`     | `string`                                          | Yes      | Your Amplitude project API key           |
| `serverZone` | `'EU' \| 'US'`                                    | No       | Data residency zone. Defaults to `'US'`  |
| `logLevel`   | `'OFF' \| 'ERROR' \| 'WARN' \| 'INFO' \| 'DEBUG'` | No       | SDK log verbosity. Defaults to `'ERROR'` |

### `setUserId(options: SetUserIdOptions): Promise<void>`

Associate a user ID with all subsequent events. Pass `{ userId: null }` to clear the user (e.g. on logout).

| Option   | Type             | Required | Description                        |
| -------- | ---------------- | -------- | ---------------------------------- |
| `userId` | `string \| null` | Yes      | User identifier or `null` to clear |

### `track(options: TrackOptions): Promise<void>`

Track a custom event with optional properties.

| Option            | Type                      | Required | Description                                |
| ----------------- | ------------------------- | -------- | ------------------------------------------ |
| `eventType`       | `string`                  | Yes      | The event name                             |
| `eventProperties` | `Record<string, unknown>` | No       | Key-value properties attached to the event |

### `reset(): Promise<void>`

Reset the SDK: clears the user ID and generates a new device ID. Call this on logout to prevent events from being attributed to the previous user.

---

## Usage in bsdex-retail-ionic

### `src/shared/helpers/amplitude.ts`

The helper module uses an `isApp` guard to route calls to this plugin on native platforms and to `@amplitude/analytics-browser` on web:

```typescript
import { Capacitor } from '@capacitor/core'
import { AmplitudeAnalytics } from 'capacitor-sdk-amplitude'
import * as amplitudeBrowser from '@amplitude/analytics-browser'

const isApp = Capacitor.isNativePlatform()

export async function initAmplitude(apiKey: string) {
  if (isApp) {
    await AmplitudeAnalytics.init({ apiKey, serverZone: 'EU' })
  } else {
    await amplitudeBrowser.init(apiKey, { serverZone: 'EU' }).promise
  }
}

export async function trackEvent(
  eventType: string,
  eventProperties?: Record<string, unknown>,
) {
  if (isApp) {
    await AmplitudeAnalytics.track({ eventType, eventProperties })
  } else {
    amplitudeBrowser.track(eventType, eventProperties)
  }
}

export async function setUserId(userId: string | null) {
  if (isApp) {
    await AmplitudeAnalytics.setUserId({ userId })
  } else {
    amplitudeBrowser.setUserId(userId ?? undefined)
  }
}

export async function resetAmplitude() {
  if (isApp) {
    await AmplitudeAnalytics.reset()
  } else {
    amplitudeBrowser.reset()
  }
}
```

### `src/shared/hooks/integration.ts`

The `useAmplitude` hook wires up init and user identification:

```typescript
import { useEffect } from 'react'
import { useAppSelector } from '@hooks/storeHooks'
import { selectUser } from '@features/user/userSlice'
import { initAmplitude, setUserId } from '@helpers/amplitude'

export function useAmplitude() {
  const user = useAppSelector(selectUser)

  useEffect(() => {
    initAmplitude(import.meta.env.VITE_AMPLITUDE_API_KEY)
  }, [])

  useEffect(() => {
    setUserId(user?.id ?? null)
  }, [user?.id])
}
```

---

## EU Data Residency

Pass `serverZone: 'EU'` to `init()` to route all event data to Amplitude's EU servers. This is required for GDPR-compliant deployments. The BSDEX app always uses the EU zone.

---

## Reset on Logout

Call `reset()` (or `resetAmplitude()` via the helper) in the logout flow, after clearing auth tokens. This ensures:

1. The user ID is cleared so future anonymous events are not attributed to the previous user.
2. A new device ID is generated, breaking the session continuity.

---

## Development

### Build the plugin

```bash
npm install
npm run build
```

The TypeScript source in `src/` is compiled to `dist/esm/`.

### Run the example app

```bash
cd example
npm install
npm run start         # Vite web dev server
npm run start:ios     # iOS simulator (builds + syncs automatically)
npm run start:android # Android emulator (builds + syncs automatically)
```

> **Note:** If you run `npx cap sync` manually, you must run `npm run build` first to generate the `dist/` directory. The `start:ios` and `start:android` scripts handle this automatically.

---

## Note on Web

The web implementation intentionally throws `unimplemented()` for all methods. This is by design: `bsdex-retail-ionic` already integrates `@amplitude/analytics-browser` for the web/PWA platform. Routing web calls through this plugin would cause double-initialisation and duplicate events. The `isApp` guard in `src/shared/helpers/amplitude.ts` ensures the correct SDK is used on each platform.
