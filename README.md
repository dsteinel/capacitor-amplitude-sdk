<p align="center">
  <img src="./logo.svg" alt="capacitor-sdk-amplitude" height="130">
</p>

<h1 align="center">capacitor-sdk-amplitude</h1>

<p align="center">
  <img src="https://img.shields.io/npm/v/capacitor-sdk-amplitude" alt="npm version">
  <img src="https://img.shields.io/npm/l/capacitor-sdk-amplitude" alt="license">
  <img src="https://img.shields.io/badge/capacitor-8%2B-blue" alt="capacitor">
</p>

<p align="center">
  Amplitude Analytics plugin for Capacitor — wraps the native iOS and Android SDKs behind a unified TypeScript bridge.
</p>

<div align="center">
  <a href="#install">Install</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="#usage">Usage</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="#api-reference">API</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://github.com/dsteinel/capacitor-amplitude-sdk/issues">Issues</a>
</div>

---

## Platform support

- iOS 16+
- Android API 24+
- Web: not implemented — use [`@amplitude/analytics-browser`](https://www.npmjs.com/package/@amplitude/analytics-browser) directly

---

## Install

```bash
npm install capacitor-sdk-amplitude
npx cap sync
```

**iOS** — `AmplitudeSwift ~> 1.0` is pulled in automatically via CocoaPods or Swift Package Manager. No extra steps.

**Android** — `com.amplitude:analytics-android:1.+` is resolved from `mavenCentral()` automatically on sync. Ensure your app's `AndroidManifest.xml` includes the INTERNET permission (Capacitor projects include this by default).

---

## Usage

```ts
import { AmplitudeAnalytics } from 'capacitor-sdk-amplitude';

// 1. Initialize once on app start
await AmplitudeAnalytics.init({
  apiKey: 'YOUR_AMPLITUDE_API_KEY',
  serverZone: 'EU', // or 'US' (default)
});

// 2. Identify the user after login
await AmplitudeAnalytics.setUserId({ userId: 'user-uuid' });

// 3. Track events
await AmplitudeAnalytics.track({
  eventType: 'button_tapped',
  eventProperties: { screen: 'home' },
});

// 4. Reset on logout
await AmplitudeAnalytics.reset();
```

---

## Cross-platform Usage

Use `Capacitor.isNativePlatform()` to route calls to this plugin on native and to `@amplitude/analytics-browser` on web:

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

---

## API Reference

### `init(options: InitOptions): Promise<void>`

Initialize the Amplitude SDK. Must be called before any other method. Subsequent calls are no-ops.

| Option       | Type                                              | Required | Description                              |
| ------------ | ------------------------------------------------- | -------- | ---------------------------------------- |
| `apiKey`     | `string`                                          | Yes      | Your Amplitude project API key           |
| `serverZone` | `'EU' \| 'US'`                                    | No       | Data residency zone. Defaults to `'US'`  |
| `logLevel`   | `'OFF' \| 'ERROR' \| 'WARN' \| 'INFO' \| 'DEBUG'` | No       | SDK log verbosity. Defaults to `'ERROR'` |

### `setUserId(options: SetUserIdOptions): Promise<void>`

Associate a user ID with all subsequent events. Pass `{ userId: null }` to clear (e.g. on logout).

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

Reset the SDK: clears the user ID and generates a new device ID. Call on logout to prevent events from being attributed to the previous user.

---

## EU Data Residency

Pass `serverZone: 'EU'` to `init()` to route all event data to Amplitude's EU servers. Required for GDPR-compliant deployments.

---

## Reset on Logout

Call `reset()` in the logout flow after clearing auth tokens. This ensures:

1. The user ID is cleared so future anonymous events are not attributed to the previous user.
2. A new device ID is generated, breaking session continuity.

---

## Development

```bash
npm install
npm run build
```

### Run the example app

```bash
cd example
npm install
npm run start           # Vite web dev server
npm run start:ios       # iOS simulator
npm run start:android   # Android emulator
```

---

## Note on Web

The web implementation intentionally throws `unimplemented()` for all methods. Use `@amplitude/analytics-browser` for web/PWA and guard calls with `Capacitor.isNativePlatform()` as shown above.

---

## License

MIT
