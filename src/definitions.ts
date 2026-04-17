export interface InitOptions {
  /** Your Amplitude API key. */
  apiKey: string;
  /** Server zone. Defaults to 'US'. Use 'EU' for EU data residency. */
  serverZone?: 'EU' | 'US';
  /** Log level. Defaults to 'ERROR'. */
  logLevel?: 'OFF' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
}

export interface TrackOptions {
  /** The event type name. */
  eventType: string;
  /** Optional key-value properties attached to the event. */
  eventProperties?: Record<string, unknown>;
}

export interface SetUserIdOptions {
  /** The user ID to associate with future events. Pass null to clear. */
  userId: string | null;
}

export interface AmplitudeAnalyticsPlugin {
  /**
   * Initialize the Amplitude SDK. Must be called before any other method.
   * Safe to call multiple times — subsequent calls are no-ops.
   * @since 0.1.0
   */
  init(options: InitOptions): Promise<void>;

  /**
   * Set the user ID for subsequent events.
   * Pass `{ userId: null }` to clear the user (e.g. on logout).
   * @since 0.1.0
   */
  setUserId(options: SetUserIdOptions): Promise<void>;

  /**
   * Track a custom event with optional properties.
   * @since 0.1.0
   */
  track(options: TrackOptions): Promise<void>;

  /**
   * Reset the SDK — clears the user ID and generates a new device ID.
   * Call on logout.
   * @since 0.1.0
   */
  reset(): Promise<void>;
}
