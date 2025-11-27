export type DeviceType = 'laptop' | 'mobile';

export const detectDevice = (): DeviceType => {
  if (typeof window === 'undefined') return 'laptop';
  return window.innerWidth >= 1024 ? 'laptop' : 'mobile';
};

export const isWidescreen = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.innerWidth >= 1024 && window.innerHeight <= window.innerWidth;
};

export const getVideoForWin = (wideVideos: string[], mobileVideos: string[]): string => {
  const device = detectDevice();
  if (device === 'laptop') {
    return wideVideos[Math.floor(Math.random() * wideVideos.length)] || '';
  } else {
    return mobileVideos[Math.floor(Math.random() * mobileVideos.length)] || '';
  }
};
