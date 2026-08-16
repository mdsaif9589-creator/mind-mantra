import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, AudioState, GrowthState, OnboardingStep, PrivacyPreferences, UserProfile, WorldObject, WorldTheme, AnonymousProfile, Connection, ChatMessage } from '../types';

interface AppStore {
  // Navigation State
  appState: AppState;
  setAppState: (state: AppState) => void;
  
  // Auth State (Mock)
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;

  // Onboarding State
  onboardingStep: OnboardingStep;
  setOnboardingStep: (step: OnboardingStep) => void;

  // User Profile
  profile: Partial<UserProfile>;
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Growth State
  growth: GrowthState;
  addGrowth: (amount: number, source: keyof Omit<GrowthState, 'progress'>) => void;
  growthMessage: string | null;
  clearGrowthMessage: () => void;
  resetGrowth: () => void;

  // Environment State
  isCalmMode: boolean;
  setCalmMode: (isCalm: boolean) => void;

  // Privacy
  privacy: PrivacyPreferences;
  updatePrivacy: (updates: Partial<PrivacyPreferences>) => void;

  // Audio
  audio: AudioState;
  updateAudio: (updates: Partial<AudioState>) => void;

  // UI Modals & Panels
  isProfileOpen: boolean;
  setProfileOpen: (isOpen: boolean) => void;
  isPrivacyOpen: boolean;
  setPrivacyOpen: (isOpen: boolean) => void;
  isSoundGalleryOpen: boolean;
  setSoundGalleryOpen: (isOpen: boolean) => void;
  isReflectionOpen: boolean;
  setReflectionOpen: (isOpen: boolean) => void;
  isTalkOpen: boolean;
  setTalkOpen: (isOpen: boolean) => void;
  isDevPanelOpen: boolean;
  setDevPanelOpen: (isOpen: boolean) => void;
  isWorldSettingsOpen: boolean;
  setWorldSettingsOpen: (isOpen: boolean) => void;

  // Connect State
  isConnectOpen: boolean;
  setConnectOpen: (isOpen: boolean) => void;
  anonymousProfile: AnonymousProfile;
  updateAnonymousProfile: (updates: Partial<AnonymousProfile>) => void;
  connections: Connection[];
  addConnection: (connection: Connection) => void;
  updateConnection: (id: string, updates: Partial<Connection>) => void;
  removeConnection: (id: string) => void;
  addMessageToConnection: (connectionId: string, message: ChatMessage) => void;
}

const initialGrowthState: GrowthState = {
  progress: 0,
  completedGoals: 0,
  completedPracticeSessions: 0,
  completedReflectionSessions: 0,
  completedRealLifeActions: 0,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      appState: 'welcome',
      setAppState: (state) => set({ appState: state }),

      isAuthenticated: false,
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false, appState: 'welcome', profile: {} }),

      onboardingStep: 'name',
      setOnboardingStep: (step) => set({ onboardingStep: step }),

      profile: {
        theme: 'Nature',
        backgroundPreset: 'Midnight Blue',
        backgroundColor: '#0a192f',
        graphicsQuality: 'Auto'
      },
      updateProfile: (updates) => set((state) => ({ profile: { ...state.profile, ...updates } })),

      growth: initialGrowthState,
      growthMessage: null,
      addGrowth: (amount, source) => set((state) => {
        const newProgress = Math.min(100, state.growth.progress + amount);
        const hasGrown = newProgress > state.growth.progress;
        
        return {
          growth: {
            ...state.growth,
            progress: newProgress,
            [source]: state.growth[source] + 1
          },
          growthMessage: hasGrown ? "A little growth today." : null
        };
      }),
      clearGrowthMessage: () => set({ growthMessage: null }),
      resetGrowth: () => set({ growth: initialGrowthState }),

      isCalmMode: false,
      setCalmMode: (isCalm) => set({ isCalmMode: isCalm }),

      privacy: {
        profileVisibility: 'private',
        accountPrivacy: 'strict',
      },
      updatePrivacy: (updates) => set((state) => ({ privacy: { ...state.privacy, ...updates } })),

      audio: {
        currentTrack: null,
        currentTrackName: null,
        isPlaying: false,
        volume: 65, // default 65 as in example
        muted: false,
        playerReady: false,
        pendingTrack: null,
        hasError: false,
        errorMessage: null,
      },
      updateAudio: (updates) => set((state) => ({ audio: { ...state.audio, ...updates } })),

      isProfileOpen: false,
      setProfileOpen: (isOpen) => set({ isProfileOpen: isOpen }),
      isPrivacyOpen: false,
      setPrivacyOpen: (isOpen) => set({ isPrivacyOpen: isOpen }),
      isSoundGalleryOpen: false,
      setSoundGalleryOpen: (isOpen) => set({ isSoundGalleryOpen: isOpen }),
      isReflectionOpen: false,
      setReflectionOpen: (isOpen) => set({ isReflectionOpen: isOpen }),
      isTalkOpen: false,
      setTalkOpen: (isOpen) => set({ isTalkOpen: isOpen }),
      isDevPanelOpen: false,
      setDevPanelOpen: (isOpen) => set({ isDevPanelOpen: isOpen }),
      isWorldSettingsOpen: false,
      setWorldSettingsOpen: (isOpen) => set({ isWorldSettingsOpen: isOpen }),

      isConnectOpen: false,
      setConnectOpen: (isOpen) => set({ isConnectOpen: isOpen }),
      anonymousProfile: { displayName: '', bio: '', isSetup: false },
      updateAnonymousProfile: (updates) => set((state) => ({ anonymousProfile: { ...state.anonymousProfile, ...updates } })),
      connections: [],
      addConnection: (connection) => set((state) => ({ connections: [...state.connections, connection] })),
      updateConnection: (id, updates) => set((state) => ({
        connections: state.connections.map(c => c.id === id ? { ...c, ...updates } : c)
      })),
      removeConnection: (id) => set((state) => ({
        connections: state.connections.filter(c => c.id !== id)
      })),
      addMessageToConnection: (connectionId, message) => set((state) => ({
        connections: state.connections.map(c => 
          c.id === connectionId 
            ? { ...c, messages: [...c.messages, message] } 
            : c
        )
      })),
    }),
    {
      name: 'mind-mantra-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        profile: state.profile,
        privacy: state.privacy,
        audio: state.audio,
        growth: state.growth,
        anonymousProfile: state.anonymousProfile,
        connections: state.connections,
        appState: state.isAuthenticated && state.profile.selectedObject ? 'sanctuary' : state.appState
      }),
    }
  )
);
