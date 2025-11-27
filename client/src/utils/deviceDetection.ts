export type DeviceType = 'laptop' | 'mobile';

export const detectDevice = (): DeviceType => {
  if (typeof window === 'undefined') return 'laptop';
  return window.innerWidth >= 1024 ? 'laptop' : 'mobile';
};

export const isWidescreen = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.innerWidth >= 1024;
};

export const getWinVideo = (): string => {
  const device = detectDevice();
  // Use wide videos (1-7) for both laptop and mobile
  const videoIndex = Math.floor(Math.random() * 7) + 1;
  return `/videos/wide_${videoIndex}.mp4`;
};
