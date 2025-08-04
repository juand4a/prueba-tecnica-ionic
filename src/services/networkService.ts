import { Network } from '@capacitor/network';

export const isOnline = async (): Promise<boolean> => {
  const status = await Network.getStatus();
  return status.connected;
};
