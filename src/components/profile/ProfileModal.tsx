import { useAppStore } from '../../store/useAppStore';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { ModalContainer } from '../ui/ModalContainer';
import { ModalHeader } from '../ui/ModalHeader';

export function ProfileModal() {
  const { isProfileOpen, setProfileOpen, profile, logout, setPrivacyOpen } = useAppStore();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      logout();
      setProfileOpen(false);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <ModalContainer isOpen={isProfileOpen} onClose={() => setProfileOpen(false)}>
      <ModalHeader title="Profile" onClose={() => setProfileOpen(false)} />
      
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <span className="text-2xl text-white/80 font-light">
            {profile.displayName?.charAt(0).toUpperCase() || '?'}
          </span>
        </div>
        
        <h2 className="text-2xl font-light text-white/90 tracking-wide mb-1">
          {profile.displayName}
        </h2>
        <p className="text-neutral-500 text-sm tracking-widest uppercase mb-8">
          {profile.country} • {profile.language}
        </p>
      </div>

      <div className="space-y-3 w-full">
        <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex justify-between items-center text-sm">
          <span className="text-neutral-400">Sanctuary Object</span>
          <span className="text-white/80 tracking-wide">{profile.selectedObject}</span>
        </div>
        
        <button 
          onClick={() => {
            setProfileOpen(false);
            setPrivacyOpen(true);
          }}
          className="w-full bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-4 flex justify-between items-center text-sm transition-colors text-neutral-400 hover:text-white"
        >
          <span>Privacy & Security</span>
          <span>→</span>
        </button>
      </div>

      <div className="mt-12 pt-6 border-t border-white/5 text-center">
        <button 
          onClick={handleSignOut}
          className="text-neutral-600 hover:text-red-400/80 transition-colors text-xs tracking-widest uppercase"
        >
          Sign Out
        </button>
      </div>
    </ModalContainer>
  );
}
