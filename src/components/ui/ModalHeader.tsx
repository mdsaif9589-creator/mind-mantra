import React from 'react';

interface ModalHeaderProps {
  title: string;
  onClose?: () => void;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function ModalHeader({ title, onClose, onBack, rightAction }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8 shrink-0">
      <div className="flex items-center gap-4">
        {onBack && (
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white/90 hover:bg-white/10 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
        )}
        <h2 className="text-xl font-light tracking-wide text-white/90">{title}</h2>
      </div>
      
      <div className="flex items-center gap-3">
        {rightAction}
        
        {onClose && (
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white/90 hover:bg-white/10 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
