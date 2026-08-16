import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';

export function GrowthToast() {
  const { growthMessage, clearGrowthMessage, growth } = useAppStore();

  useEffect(() => {
    if (growthMessage) {
      const timer = setTimeout(() => {
        clearGrowthMessage();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [growthMessage, clearGrowthMessage]);

  const getLevelName = (progress: number) => {
    if (progress <= 10) return 'Beginning';
    if (progress <= 25) return 'Awakening';
    if (progress <= 45) return 'Growing';
    if (progress <= 65) return 'Blooming';
    if (progress <= 85) return 'Flourishing';
    return 'Your World';
  };

  return (
    <AnimatePresence>
      {growthMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.05)] flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
            <div>
              <p className="text-white/90 text-sm tracking-widest">{growthMessage}</p>
              <p className="text-white/50 text-[10px] tracking-widest uppercase mt-0.5">
                Level: {getLevelName(growth.progress)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
