import { CapacitorConfig } from '@capacitor/cli';
import { environment } from './src/environments/environment.development';

const config: CapacitorConfig = {
  appId: 'com.sargik.angular',
  appName: 'AAC SARGIK',
  webDir: 'dist/client',
  bundledWebRuntime: false,
  server: {
    url: environment.ANGULAR_SERVER_URL,
    cleartext: true,
    androidScheme: 'https',
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      clientId: environment.googleClientId,
      serverClientId: environment.googleClientId, // android -> strings.xml
      androidClientId: environment.googleClientId, // android -> It doesn't matter if you don't need to use it
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
