import { registerPlugin } from '@capacitor/core';
import type { AmplitudeAnalyticsPlugin } from './definitions';

const AmplitudeAnalytics = registerPlugin<AmplitudeAnalyticsPlugin>('AmplitudeAnalytics', {
  web: () => import('./web').then(m => new m.AmplitudeAnalyticsWeb()),
});

export * from './definitions';
export { AmplitudeAnalytics };
