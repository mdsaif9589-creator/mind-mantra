export type AppState = 'welcome' | 'auth' | 'onboarding' | 'sanctuary';

export type OnboardingStep = 'name' | 'country' | 'language' | 'object';

export type WorldObject = 
  | 'Bonsai' | 'Flower' | 'Cactus' 
  | 'Mountain' | 'Ocean' | 'Island' | 'Planet' 
  | 'Lantern' | 'Crystal';

export type WorldTheme = 
  | 'Nature' | 'Ocean' | 'Mountain' | 'Fantasy' | 'Minimal' 
  | 'Night' | 'Sunrise' | 'Garden' | 'Space' | 'Dream';

export type BackgroundPreset = 'Deep Night' | 'Midnight Blue' | 'Forest' | 'Ocean' | 'Lavender' | 'Sunset' | 'Warm Sand' | 'Dawn' | 'Dream' | 'Custom';
export type GraphicsQuality = 'Auto' | 'Low' | 'Medium' | 'High';

export interface AnonymousProfile {
  displayName: string;
  bio: string;
  isSetup: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface Connection {
  id: string;
  displayName: string;
  lastActive: number;
  isSaved: boolean;
  messages: ChatMessage[];
}

export interface UserProfile {
  displayName: string;
  country: string;
  language: string;
  selectedObject: WorldObject;
  theme: WorldTheme;
  backgroundPreset: BackgroundPreset;
  backgroundColor: string;
  graphicsQuality: GraphicsQuality;
}

export interface GrowthState {
  progress: number; // 0 - 100
  completedGoals: number;
  completedPracticeSessions: number;
  completedReflectionSessions: number;
  completedRealLifeActions: number;
}

export interface PrivacyPreferences {
  profileVisibility: 'public' | 'private' | 'anonymous';
  accountPrivacy: 'strict' | 'standard';
}

export interface AudioState {
  currentTrack: string | null;
  currentTrackName: string | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  playerReady: boolean;
  pendingTrack: string | null;
  hasError: boolean;
  errorMessage: string | null;
}

