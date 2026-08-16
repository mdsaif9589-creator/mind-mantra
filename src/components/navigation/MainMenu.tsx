import { motion } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';

const NAV_ITEMS = [
  { id: 'talk', label: 'Talk', placeholder: false },
  { id: 'connect', label: 'Connect', placeholder: false },
  { id: 'world', label: 'World', placeholder: false },
  { id: 'practice', label: 'Practice', placeholder: true },
  { id: 'profile', label: 'Profile', placeholder: false }, // Profile handles "Grow" and settings
];

export function MainMenu() {
  const { setProfileOpen, setTalkOpen, setConnectOpen } = useAppStore();

  return (
    <motion.nav 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1 }}
      className="w-full p-8 flex justify-center pointer-events-auto"
    >
      <div className="flex items-center gap-8 md:gap-12 backdrop-blur-md bg-white/5 px-8 py-4 rounded-full border border-white/10">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === 'profile') setProfileOpen(true);
              if (item.id === 'talk') setTalkOpen(true);
              if (item.id === 'connect') setConnectOpen(true);
            }}
            className={`text-xs md:text-sm tracking-widest transition-all duration-300 relative group
              ${item.id === 'world' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}
            `}
          >
            {item.label}
            {item.id === 'world' && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/80" />
            )}
            
            {/* Hover tooltip for placeholders */}
            {item.placeholder && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-neutral-900 text-white/60 text-[10px] py-1 px-3 rounded tracking-wider whitespace-nowrap border border-white/10">
                  Coming Soon
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </motion.nav>
  );
}
