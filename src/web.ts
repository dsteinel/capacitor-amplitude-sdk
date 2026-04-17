import { WebPlugin } from '@capacitor/core';
import type { AmplitudeAnalyticsPlugin, InitOptions, SetUserIdOptions, TrackOptions } from './definitions';

export class AmplitudeAnalyticsWeb extends WebPlugin implements AmplitudeAnalyticsPlugin {
  async init(_options: InitOptions): Promise<void> {
    throw this.unimplemented('AmplitudeAnalytics.init is not implemented on web. Use @amplitude/analytics-browser directly.');
  }

  async setUserId(_options: SetUserIdOptions): Promise<void> {
    throw this.unimplemented('AmplitudeAnalytics.setUserId is not implemented on web. Use @amplitude/analytics-browser directly.');
  }

  async track(_options: TrackOptions): Promise<void> {
    throw this.unimplemented('AmplitudeAnalytics.track is not implemented on web. Use @amplitude/analytics-browser directly.');
  }

  async reset(): Promise<void> {
    throw this.unimplemented('AmplitudeAnalytics.reset is not implemented on web. Use @amplitude/analytics-browser directly.');
  }
}
