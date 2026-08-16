import { useAppStore } from '../../store/useAppStore';
import { ModalContainer } from '../ui/ModalContainer';
import { ModalHeader } from '../ui/ModalHeader';
import { WorldObject, WorldTheme, BackgroundPreset, GraphicsQuality } from '../../types';

const THEMES: WorldTheme[] = ['Nature', 'Ocean', 'Mountain', 'Fantasy', 'Minimal', 'Night', 'Sunrise', 'Garden', 'Space', 'Dream'];
const OBJECTS: WorldObject[] = ['Bonsai', 'Flower', 'Cactus', 'Mountain', 'Ocean', 'Island', 'Planet', 'Lantern', 'Crystal'];

const BACKGROUND_PRESETS: { name: BackgroundPreset; color: string }[] = [
  { name: 'Deep Night', color: '#050510' },
  { name: 'Midnight Blue', color: '#0a192f' },
  { name: 'Forest', color: '#0d1a10' },
  { name: 'Ocean', color: '#09151e' },
  { name: 'Lavender', color: '#161224' },
  { name: 'Sunset', color: '#2a1111' },
  { name: 'Warm Sand', color: '#26201a' },
  { name: 'Dawn', color: '#1a1a24' },
  { name: 'Dream', color: '#151020' },
  { name: 'Custom', color: '#000000' } // Placeholder for custom
];

const QUALITIES: GraphicsQuality[] = ['Auto', 'Low', 'Medium', 'High'];

export function WorldSettingsModal() {
  const { 
    isWorldSettingsOpen, 
    setWorldSettingsOpen, 
    profile, 
    updateProfile,
    isCalmMode,
    setCalmMode,
  } = useAppStore();

  const handleBackgroundChange = (preset: BackgroundPreset, color: string) => {
    updateProfile({ backgroundPreset: preset });
    if (preset !== 'Custom') {
      updateProfile({ backgroundColor: color });
    }
  };

  const handleThemeChange = (theme: WorldTheme) => {
    let newPreset: BackgroundPreset = 'Midnight Blue';
    let newColor = '#0a192f';
    
    switch (theme) {
      case 'Nature': newPreset = 'Forest'; newColor = '#0d1a10'; break;
      case 'Ocean': newPreset = 'Ocean'; newColor = '#09151e'; break;
      case 'Mountain': newPreset = 'Dawn'; newColor = '#1a1a24'; break;
      case 'Fantasy': newPreset = 'Lavender'; newColor = '#161224'; break;
      case 'Minimal': newPreset = 'Custom'; newColor = '#111111'; break;
      case 'Night': newPreset = 'Deep Night'; newColor = '#050510'; break;
      case 'Sunrise': newPreset = 'Sunset'; newColor = '#2a1111'; break;
      case 'Garden': newPreset = 'Forest'; newColor = '#0d1a10'; break;
      case 'Space': newPreset = 'Deep Night'; newColor = '#020205'; break;
      case 'Dream': newPreset = 'Dream'; newColor = '#151020'; break;
    }

    updateProfile({ 
      theme, 
      backgroundPreset: newPreset, 
      backgroundColor: newColor 
    });
  };

  return (
    <ModalContainer isOpen={isWorldSettingsOpen} onClose={() => setWorldSettingsOpen(false)}>
      <ModalHeader title="World Settings" onClose={() => setWorldSettingsOpen(false)} />
      
      <div className="space-y-8 pb-4">
        
        {/* Environment / Theme */}
        <div className="space-y-3">
          <label className="text-xs tracking-widest text-neutral-500 uppercase">Environment</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 ">
            {THEMES.map(theme => (
              <button
                key={theme}
                onClick={() => handleThemeChange(theme)}
                className={`p-3 rounded-xl border text-sm text-left transition-colors ${
                  profile.theme === theme 
                    ? 'bg-white/10 border-white/30 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                    : 'bg-transparent border-white/5 text-neutral-400 hover:bg-white/5'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* World Object */}
        <div className="space-y-3">
          <label className="text-xs tracking-widest text-neutral-500 uppercase">Sanctuary Object</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 ">
            {OBJECTS.map(obj => (
              <button
                key={obj}
                onClick={() => updateProfile({ selectedObject: obj })}
                className={`p-3 rounded-xl border text-sm text-left transition-colors ${
                  profile.selectedObject === obj 
                    ? 'bg-white/10 border-white/30 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                    : 'bg-transparent border-white/5 text-neutral-400 hover:bg-white/5'
                }`}
              >
                {obj}
              </button>
            ))}
          </div>
        </div>

        {/* Background Customization */}
        <div className="space-y-3">
          <label className="text-xs tracking-widest text-neutral-500 uppercase">Background Atmosphere</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 ">
            {BACKGROUND_PRESETS.map(({ name, color }) => (
              <button
                key={name}
                onClick={() => handleBackgroundChange(name, color)}
                className={`p-3 rounded-xl border text-sm text-left transition-colors flex items-center gap-3 ${
                  profile.backgroundPreset === name 
                    ? 'bg-white/10 border-white/30 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                    : 'bg-transparent border-white/5 text-neutral-400 hover:bg-white/5'
                }`}
              >
                {name !== 'Custom' && (
                  <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: color }} />
                )}
                {name}
              </button>
            ))}
          </div>
          {profile.backgroundPreset === 'Custom' && (
            <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between mt-2">
              <span className="text-sm text-white/80">Custom Color</span>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={profile.backgroundColor || '#000000'}
                  onChange={(e) => updateProfile({ backgroundColor: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-xs text-neutral-500 font-mono uppercase">
                  {profile.backgroundColor}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Depth / Quality */}
        <div className="space-y-3">
          <label className="text-xs tracking-widest text-neutral-500 uppercase">3D Depth & Quality</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {QUALITIES.map(quality => (
              <button
                key={quality}
                onClick={() => updateProfile({ graphicsQuality: quality })}
                className={`p-2 rounded-xl border text-xs text-center transition-colors ${
                  profile.graphicsQuality === quality 
                    ? 'bg-white/10 border-white/30 text-white' 
                    : 'bg-transparent border-white/5 text-neutral-400 hover:bg-white/5'
                }`}
              >
                {quality}
              </button>
            ))}
          </div>
        </div>

        {/* Display explicit categories controlled by theme/calm mode */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-white/90 text-sm mb-1">Particles</div>
            <div className="text-neutral-500 text-[10px] uppercase tracking-widest">{isCalmMode ? 'Reduced' : 'Dynamic'}</div>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-white/90 text-sm mb-1">Animation</div>
            <div className="text-neutral-500 text-[10px] uppercase tracking-widest">{isCalmMode ? 'Slow' : 'Standard Speed'}</div>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-white/90 text-sm mb-1">Lighting</div>
            <div className="text-neutral-500 text-[10px] uppercase tracking-widest">Atmospheric Depth</div>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-white/90 text-sm mb-1">Atmosphere</div>
            <div className="text-neutral-500 text-[10px] uppercase tracking-widest">{profile.backgroundPreset}</div>
          </div>
        </div>

        {/* Sound & Audio */}
        <div className="space-y-3">
          <label className="text-xs tracking-widest text-neutral-500 uppercase">Soundscapes</label>
          <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between">
             <div className="text-white/80 text-sm">Environment Audio</div>
             <button 
               onClick={() => {
                 setWorldSettingsOpen(false);
                 useAppStore.getState().setSoundGalleryOpen(true);
               }}
               className="px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full text-xs text-white uppercase tracking-widest"
             >
               Configure
             </button>
          </div>
        </div>

        {/* Calm Mode */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 cursor-pointer" onClick={() => setCalmMode(!isCalmMode)}>
            <div>
              <div className="text-white/90 text-sm mb-1">Calm Mode</div>
              <div className="text-neutral-500 text-[11px] leading-relaxed pr-4">Automatically adjusts lighting, slows animations, and reduces particle density for a more relaxing atmosphere.</div>
            </div>
            <button className={`w-12 h-6 shrink-0 rounded-full transition-colors relative flex items-center ${isCalmMode ? 'bg-white/30' : 'bg-white/10'}`}>
              <div className={`w-4 h-4 rounded-full bg-white absolute transition-transform ${isCalmMode ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Display categories explicitly requested but currently controlled by theme/calm mode */}
        {!isCalmMode && (
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5 opacity-50 pointer-events-none">
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="text-white/90 text-sm mb-1">Particles</div>
              <div className="text-neutral-500 text-xs">Dynamic</div>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="text-white/90 text-sm mb-1">Animation</div>
              <div className="text-neutral-500 text-xs">Standard Speed</div>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="text-white/90 text-sm mb-1">Lighting</div>
              <div className="text-neutral-500 text-xs">Theme Default</div>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="text-white/90 text-sm mb-1">Atmosphere</div>
              <div className="text-neutral-500 text-xs">Theme Default</div>
            </div>
          </div>
        )}

      </div>
    </ModalContainer>
  );
}
