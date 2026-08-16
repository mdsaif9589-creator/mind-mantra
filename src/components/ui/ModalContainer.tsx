import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  disableClickOutside?: boolean;
}

export function ModalContainer({ isOpen, onClose, children, className = "max-w-4xl w-[95vw] sm:w-[90vw]", disableClickOutside = false }: ModalContainerProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => { if (!disableClickOutside) onClose(); }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className={`relative w-full ${className} bg-[#0a0a0a] border border-white/10 p-6 sm:p-8 rounded-[2rem] shadow-2xl pointer-events-auto flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar`}
        >
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
