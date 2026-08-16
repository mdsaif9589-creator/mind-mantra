import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ModalContainer } from '../ui/ModalContainer';
import { ModalHeader } from '../ui/ModalHeader';

const SOUND_CATEGORIES = [
  {
    category: 'Meditation',
    items: [
      { id: 'lXGvNdV02aQ', name: 'Keep You', artist: 'Rameses B' }
    ]
  },
  {
    category: 'Sleep',
    items: [
      { id: 'ihPTNp7370s', name: 'apart', artist: 'sumu' }
    ]
  },
  {
    category: 'Focus',
    items: [
      { id: '_zvzWG9tKzI', name: 'Driver Seat', artist: 'C1W' }
    ]
  },
  {
    category: 'Relax',
    items: [
      { id: 'I7germ7A-mc', name: 'Redemption (Acoustic)', artist: 'Riell' }
    ]
  },
  {
    category: 'Dream',
    items: [
      { id: 'xwgmycH8Yhk', name: 'With You', artist: 'OBLVYN x RIELL' }
    ]
  },
  {
    category: 'Calm',
    items: [
      { id: 'ZpsV5SGa5R4', name: 'Need You', artist: 'Lost Sky' }
    ]
  },
  {
    category: 'Morning',
    items: [
      { id: 'x7fA-hNxpx8', name: 'Would You Be Waiting', artist: 'Aeden' }
    ]
  },
  {
    category: 'Chill',
    items: [
      { id: 'nVzo-IJP2lc', name: 'Are You With Me', artist: 'PLVTO' }
    ]
  },
  {
    category: 'Acoustic',
    items: [
      { id: 'PQW-ayi1POc', name: 'Moments (Acoustic)', artist: '' }
    ]
  },
  {
    category: 'Night',
    items: [
      { id: '37NmKsHv7fM', name: '18:28 OUTBOUND', artist: 'Sam Day' }
    ]
  },
  {
    category: 'Long Sessions',
    items: [
      { id: 'a98zkXRKeCs', name: 'Inner Peace (Zen/Meditation)', artist: '1 Hour' },
      { id: '5PIBMLvcAzc', name: 'Stress Relief Meditation', artist: '1 Hour' },
      { id: 'I3OJUwILelU', name: 'Mind, Body & Soul', artist: '1.5 Hours' },
      { id: 'FuVXVCxnS8A', name: 'Healing Therapy (No Loops)', artist: '2 Hours' },
      { id: '-ryikSh2vjM', name: 'Peace of Mind Soothing', artist: '2 Hours' },
      { id: 'e2AzIZFLoy8', name: 'Deep Relaxation (Delta Waves)', artist: '2 Hours' }
    ]
  }
];

const CATEGORY_NAMES = SOUND_CATEGORIES.map(c => c.category);

export function SoundGallery() {
  const { isSoundGalleryOpen, setSoundGalleryOpen, audio, updateAudio } = useAppStore();
  const [activeTab, setActiveTab] = useState('Meditation');

  const activeCategory = SOUND_CATEGORIES.find(c => c.category === activeTab);

  const toggleSound = (trackId: string, trackName: string) => {
    updateAudio({ hasError: false, errorMessage: null });
    
    if (audio.currentTrack === trackId || audio.pendingTrack === trackId) {
      // Toggle play/pause if it's the current track
      updateAudio({ isPlaying: !audio.isPlaying });
    } else {
      // Change track
      if (audio.playerReady) {
        updateAudio({ currentTrack: trackId, currentTrackName: trackName, isPlaying: true });
      } else {
        updateAudio({ pendingTrack: trackId, currentTrackName: trackName, isPlaying: true });
      }
    }
  };

  const handleRetry = () => {
    updateAudio({ hasError: false, errorMessage: null, isPlaying: true });
  };

  return (
    <ModalContainer isOpen={isSoundGalleryOpen} onClose={() => setSoundGalleryOpen(false)} className="max-w-2xl w-[95vw] sm:w-[85vw]">
      <ModalHeader title="Sound Gallery" onBack={() => setSoundGalleryOpen(false)} onClose={() => setSoundGalleryOpen(false)} />
      
      <div className="flex flex-col">
        <div className="mb-4 shrink-0">
          <p className="text-sm text-neutral-400 mb-4">Choose your atmosphere</p>
          <div className="flex flex-wrap gap-2 pb-2">
            {CATEGORY_NAMES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-full text-xs tracking-widest uppercase whitespace-nowrap transition-colors ${
                  activeTab === cat 
                    ? 'bg-white/10 text-white border border-white/20' 
                    : 'text-neutral-500 border border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pb-4 pr-2 max-h-[40vh] overflow-y-auto no-scrollbar">
          {activeCategory?.items.map(track => {
            const active = (audio.currentTrack === track.id || audio.pendingTrack === track.id);

            return (
              <div 
                key={track.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  active 
                    ? 'bg-white/5 border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                    : 'bg-transparent border-white/5 text-neutral-400 hover:border-white/20 hover:bg-white/[0.02]'
                }`}
              >
                <div>
                  <div className="text-sm font-medium text-white/90 mb-1">{track.name}</div>
                  <div className="text-xs text-neutral-500">{track.artist}</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSound(track.id, track.name)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      active && audio.isPlaying ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {active && audio.isPlaying ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="shrink-0 pt-6 mt-2 border-t border-white/10 space-y-4 pb-2">
          {audio.hasError && (
            <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4">
              <span>{audio.errorMessage || 'Unable to play this sound.'}</span>
              <button 
                onClick={handleRetry}
                className="px-4 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-full text-xs transition-colors tracking-widest uppercase"
              >
                Retry
              </button>
            </div>
          )}

          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => {
                if (audio.currentTrack || audio.pendingTrack) {
                  updateAudio({ hasError: false, errorMessage: null, isPlaying: !audio.isPlaying });
                }
              }}
              className="w-12 h-12 shrink-0 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors disabled:opacity-50"
              disabled={!audio.currentTrack && !audio.pendingTrack}
            >
              {audio.isPlaying ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
            
            <div className="min-w-0 flex-1">
              <div className="text-xs text-white/80 uppercase tracking-widest mb-1 flex items-center gap-2">
                Now Playing
                {audio.isPlaying && (
                  <span className="flex gap-0.5 h-3 items-end">
                    <span className="w-0.5 bg-white/60 h-2 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-0.5 bg-white/60 h-3 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 bg-white/60 h-1.5 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                )}
              </div>
              <div className="text-sm text-white truncate font-light">
                {audio.currentTrackName || 'No sound playing'}
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => updateAudio({ muted: !audio.muted })}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${audio.muted ? 'text-red-400 bg-red-400/10' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
                title={audio.muted ? "Unmute" : "Mute"}
              >
                {audio.muted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                )}
              </button>

              <input 
                type="range" 
                min="0" 
                max="100" 
                step="1" 
                value={audio.volume ?? 65}
                onChange={(e) => updateAudio({ volume: parseInt(e.target.value) })}
                className="flex-1 accent-white/50 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
              />
              <div className="w-10 text-right text-xs text-neutral-500">{audio.volume ?? 65}%</div>
            </div>
          </div>
        </div>

      </div>
    </ModalContainer>
  );
}
