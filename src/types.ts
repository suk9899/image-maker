export type FeatureMode =
  | 'composite'
  | 'restore'
  | 'bg_remove'
  | 'text_poster'
  | 'passport'
  | 'studio'
  | 'skin_retouch'
  | 'style_transfer'
  | 'life_album';

export type AspectRatioOption = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface UploadedImage {
  id: string;
  dataUrl: string;
  mimeType: string;
  name: string;
  size: number;
  label: '원본 (Base)' | '참조 1 (Ref 1)' | '참조 2 (Ref 2)';
}

export interface GeneratedResult {
  id: string;
  imageUrl: string;
  originalImageUrl?: string;
  mode: FeatureMode;
  modeName: string;
  prompt: string;
  timestamp: string;
  aspectRatio: AspectRatioOption;
  extraSettings?: Record<string, any>;
}

export interface ControlSettings {
  aspectRatio: AspectRatioOption;
  count: number;
  // Extra mode specific settings
  colorize: boolean; // For restore mode
  posterText: string; // For text_poster mode
  textStyle: string; // For text_poster mode
  clothing: string; // For passport mode
  studioTheme: string; // For studio mode
  retouchStrength: string; // For skin_retouch mode
  targetStyle: string; // For style_transfer mode
  targetAge: string; // For life_album mode
  ageValue: number; // For life_album age slider
}
