import { motion } from 'motion/react';
import { ThreeScene } from './ThreeScene';
import { MainMenu } from '../navigation/MainMenu';
import { SoundGallery } from '../audio/SoundGallery';
import { ReflectionModal } from './ReflectionModal';
import { DevPanel } from './DevPanel';
import { GrowthToast } from './GrowthToast';
import { TalkModal } from '../talk/TalkModal';
import { ConnectModal } from '../connect/ConnectModal';
import { WorldSettingsModal } from './WorldSettingsModal';
import { useAppStore } from '../../store/useAppStore';

export function Sanctuary() {
  const { setSoundGalleryOpen, isCalmMode, setCalmMode, setReflectionOpen, setDevPanelOpen, setWorldSettingsOpen } = useAppStore();

  return (
    <div className="w-full h-screen bg-[#050505] relative overflow-hidden transition-colors duration-1000">
      
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0 cursor-move">
        <ThreeScene />
      </div>

      {/* Vignette Overlay for cinematic feel */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(5,5,5,0.85)_100%)] pointer-events-none transition-opacity duration-1000" />

      {/* UI Layer */}
      <div className={`relative z-10 w-full h-full flex flex-col pointer-events-none transition-opacity duration-1000 ${isCalmMode ? 'opacity-30' : 'opacity-100'}`}>
        
        {/* Top Bar */}
        <header className="w-full p-6 flex justify-between items-start pointer-events-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-col gap-1"
          >
            <span className="text-white/40 tracking-widest text-xs">MIND MANTRA</span>
            <button 
              onClick={() => setDevPanelOpen(true)}
              className="text-white/20 text-[10px] uppercase tracking-widest hover:text-white/60 text-left transition-colors w-fit"
            >
              Dev Panel
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex gap-4"
          >
            <button
              onClick={() => setReflectionOpen(true)}
              className="px-4 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white/90 hover:bg-white/10 transition-all backdrop-blur-md text-xs tracking-widest"
            >
              REFLECT
            </button>

            <button
              onClick={() => setCalmMode(!isCalmMode)}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all backdrop-blur-md
                ${isCalmMode ? 'bg-white/20 border-white/40 text-white' : 'bg-white/5 border-white/10 text-white/60 hover:text-white/90 hover:bg-white/10'}`}
              title="Calm Mode"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 12h4l3-9 5 18 3-9h5"/>
              </svg>
            </button>

            <button
              onClick={() => setWorldSettingsOpen(true)}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all backdrop-blur-md bg-white/5 border-white/10 text-white/60 hover:text-white/90 hover:bg-white/10`}
              title="World Settings"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>

            <button
              onClick={() => setSoundGalleryOpen(true)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white/90 hover:bg-white/10 transition-all backdrop-blur-md"
              title="Sound Gallery"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </button>
          </motion.div>
        </header>

        {/* Main Content Area (Flexible space) */}
        <div className="flex-1 flex items-center justify-center">
           {/* Modals or specific active feature UI would go here */}
        </div>

        {/* Bottom Navigation */}
        <MainMenu />
      </div>

      <SoundGallery />
      <ReflectionModal />
      <TalkModal />
      <ConnectModal />
      <WorldSettingsModal />
      <DevPanel />
      <GrowthToast />
    </div>
  );
}
