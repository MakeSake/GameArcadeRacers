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
  const videoIndex = Math.floor(Math.random() * 3) + 1;
  
  if (device === 'laptop') {
    // Use wide format for laptop: wide_1.mp4, wide_2.mp4, etc.
    return `/videos/wide_${videoIndex}.mp4`;
  } else {
    // Use mobile format for mobile: win1.mp4, win2.mp4, etc.
    return `/videos/win${videoIndex}.mp4`;
  }
};
