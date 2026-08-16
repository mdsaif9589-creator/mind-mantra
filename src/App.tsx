import { useEffect } from 'react';
import { Welcome } from './components/auth/Welcome';
import { AuthFlow } from './components/auth/AuthFlow';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { Sanctuary } from './components/world/Sanctuary';
import { ProfileModal } from './components/profile/ProfileModal';
import { PrivacyCenter } from './components/profile/PrivacyCenter';
import { AudioSystem } from './components/audio/AudioSystem';
import { useAppStore } from './store/useAppStore';

export default function App() {
  const { appState } = useAppStore();

  return (
    <>
      <AudioSystem />
      {appState === 'welcome' && <Welcome />}
      {appState === 'auth' && <AuthFlow />}
      {appState === 'onboarding' && <OnboardingFlow />}
      {appState === 'sanctuary' && (
        <>
          <Sanctuary />
          <ProfileModal />
          <PrivacyCenter />
        </>
      )}
    </>
  );
}
