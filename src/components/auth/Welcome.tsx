import { motion } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';

export function Welcome() {
  const { setAppState } = useAppStore();

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-neutral-200 overflow-hidden relative selection:bg-neutral-800">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="z-10 flex flex-col items-center text-center space-y-12"
      >
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] text-white/90">
            MIND MANTRA
          </h1>
          <p className="text-neutral-400 text-lg md:text-xl font-light italic tracking-wide">
            A quiet place for your mind.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-neutral-500 font-light tracking-widest text-sm md:text-base">
            Talk. Connect. Practice. Grow.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex flex-col items-center space-y-6 pt-8 w-full max-w-sm"
        >
          <button 
            onClick={() => setAppState('auth')}
            className="w-full py-4 px-8 border border-white/10 rounded-full bg-white/5 hover:bg-white/10 text-white/90 tracking-widest text-sm transition-all duration-500 ease-out backdrop-blur-md hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          >
            BEGIN
          </button>
          
          <button 
            onClick={() => setAppState('auth')}
            className="text-neutral-500 hover:text-neutral-300 transition-colors text-xs tracking-wider"
          >
            I ALREADY HAVE AN ACCOUNT
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
