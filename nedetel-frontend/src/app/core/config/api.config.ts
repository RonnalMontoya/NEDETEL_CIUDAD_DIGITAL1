import { environment } from 'src/environments/environment';
import { Capacitor } from '@capacitor/core';

export function getApiBaseUrl(): string {
  // Web (ionic serve)
  if (!Capacitor.isNativePlatform()) return environment.apiUrl;

  // Emulador Android (localhost de la PC)
  return environment.apiUrl.includes('localhost')
    ? environment.apiUrl.replace('localhost', '10.0.2.2')
    : environment.apiUrl;
}