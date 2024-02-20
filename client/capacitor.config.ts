import { CapacitorConfig } from '@capacitor/cli';
import { environment } from './src/environments/environment.development';

const config: CapacitorConfig = {
  appId: 'com.aacsargik.app',
  appName: 'AAC SARGIK',
  webDir: '../client/src',
  bundledWebRuntime: false,
  server: {
    url: environment.ANGULAR_SERVER_URL,
    cleartext: true,
  },
};

export default config;
