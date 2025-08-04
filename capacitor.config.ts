import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'My Capacitor App',
  webDir: 'dist',
  android: {
    allowMixedContent: true
  }
};

export default config;