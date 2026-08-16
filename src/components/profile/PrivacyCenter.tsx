import { useAppStore } from '../../store/useAppStore';
import { auth, db } from '../../lib/firebase';
import { deleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { ModalContainer } from '../ui/ModalContainer';
import { ModalHeader } from '../ui/ModalHeader';

export function PrivacyCenter() {
  const { isPrivacyOpen, setPrivacyOpen, privacy, updatePrivacy, logout, setProfileOpen } = useAppStore();

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete your account and all data?");
    if (!confirmDelete) return;

    if (auth.currentUser) {
      try {
        const uid = auth.currentUser.uid;
        // Delete Firestore documents
        await deleteDoc(doc(db, 'users', uid));
        await deleteDoc(doc(db, 'user_state', uid));
        await deleteDoc(doc(db, 'anonymous_profiles', uid));
        
        // Delete the auth user
        await deleteUser(auth.currentUser);
        
        // Clear local state
        logout();
        setPrivacyOpen(false);
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. You may need to sign in again to perform this action.");
      }
    }
  };

  return (
    <ModalContainer isOpen={isPrivacyOpen} onClose={() => setPrivacyOpen(false)}>
      <ModalHeader 
        title="Privacy Center" 
        onClose={() => setPrivacyOpen(false)}
        onBack={() => {
          setPrivacyOpen(false);
          setProfileOpen(true);
        }}
      />
      
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-xs tracking-widest text-neutral-500 uppercase">Profile Visibility</label>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => updatePrivacy({ profileVisibility: 'private' })}
              className={`p-3 rounded-xl border text-sm transition-colors ${privacy.profileVisibility === 'private' ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-neutral-400 hover:bg-white/5'}`}
            >
              Private
            </button>
            <button 
              onClick={() => updatePrivacy({ profileVisibility: 'anonymous' })}
              className={`p-3 rounded-xl border text-sm transition-colors ${privacy.profileVisibility === 'anonymous' ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-neutral-400 hover:bg-white/5'}`}
            >
              Anonymous
            </button>
          </div>
          <p className="text-[11px] text-neutral-600 tracking-wide leading-relaxed">
            {privacy.profileVisibility === 'private' 
              ? 'Your profile is visible only to you. No one can see your information.' 
              : 'Your profile will be shown anonymously when connecting with others.'}
          </p>
        </div>

        <div className="pt-6 border-t border-white/5 space-y-3">
          <label className="text-xs tracking-widest text-neutral-500 uppercase">Data Control</label>
          <button className="w-full text-left p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors text-sm">
            Manage Saved Information
          </button>
          <button onClick={handleDeleteAccount} className="w-full text-left p-4 rounded-xl border border-red-500/10 bg-red-500/5 hover:bg-red-500/10 text-red-400/80 transition-colors text-sm">
            Request Account Deletion
          </button>
          <p className="text-[11px] text-neutral-600 tracking-wide mt-2">
            All data is stored securely. Deleting your account will remove your data permanently.
          </p>
        </div>
      </div>
    </ModalContainer>
  );
}
