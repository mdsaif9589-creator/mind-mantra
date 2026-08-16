import { useAppStore } from '../../store/useAppStore';
import { WorldTheme } from '../../types';
import { ModalContainer } from '../ui/ModalContainer';
import { ModalHeader } from '../ui/ModalHeader';

const THEMES: WorldTheme[] = [
  'Nature', 'Ocean', 'Mountain', 'Fantasy', 'Minimal', 
  'Night', 'Sunrise', 'Garden', 'Space', 'Dream'
];

export function DevPanel() {
  const { 
    isDevPanelOpen, setDevPanelOpen, 
    addGrowth, resetGrowth, 
    profile, updateProfile 
  } = useAppStore();

  return (
    <ModalContainer isOpen={isDevPanelOpen} onClose={() => setDevPanelOpen(false)}>
      <ModalHeader title="Dev Test Panel" onClose={() => setDevPanelOpen(false)} />

      <div className="space-y-6">
        {/* Growth Testing */}
        <div className="space-y-3">
          <label className="text-[10px] uppercase tracking-widest text-white/40">Growth triggers</label>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => addGrowth(5, 'completedReflectionSessions')} className="bg-white/10 hover:bg-white/20 p-3 rounded-xl border border-white/5 text-xs transition">+5 Growth</button>
            <button onClick={() => addGrowth(10, 'completedGoals')} className="bg-white/10 hover:bg-white/20 p-3 rounded-xl border border-white/5 text-xs transition">+10 Growth</button>
            <button onClick={() => resetGrowth()} className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs transition col-span-2">Reset Progress</button>
          </div>
        </div>

        {/* Theme Testing */}
        <div className="space-y-3">
          <label className="text-[10px] uppercase tracking-widest text-white/40">World Theme</label>
          <select 
            value={profile.theme}
            onChange={(e) => updateProfile({ theme: e.target.value as WorldTheme })}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none cursor-pointer"
          >
            {THEMES.map(t => <option key={t} value={t} className="bg-neutral-900">{t}</option>)}
          </select>
        </div>
      </div>
    </ModalContainer>
  );
}
