import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import { ModalContainer } from '../ui/ModalContainer';
import { ModalHeader } from '../ui/ModalHeader';

const EMOTION_OPTIONS = [
  'Calm', 'Sad', 'Stressed', 'Angry', 'Lonely', 
  'Confused', 'Motivated', 'Tired', 'Overwhelmed', "I don't know"
];

export function ReflectionModal() {
  const { isReflectionOpen, setReflectionOpen, addGrowth, setTalkOpen } = useAppStore();
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  useEffect(() => {
    if (!isReflectionOpen && selectedEmotion) {
      setSelectedEmotion(null);
    }
  }, [isReflectionOpen, selectedEmotion]);

  const handleAction = (action: string) => {
    addGrowth(5, 'completedReflectionSessions');
    setReflectionOpen(false);
    if (action === 'Understand') {
      setTalkOpen(true);
    }
  };

  return (
    <ModalContainer isOpen={isReflectionOpen} onClose={() => setReflectionOpen(false)}>
      <ModalHeader 
        title="Reflection" 
        onClose={() => setReflectionOpen(false)} 
        onBack={selectedEmotion ? () => setSelectedEmotion(null) : undefined}
      />
      
      {!selectedEmotion ? (
        <>
          <h2 className="text-xl font-light text-white/90 tracking-wide mb-8 text-center">
            What feels strongest right now?
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {EMOTION_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedEmotion(option)}
                className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 text-neutral-300 hover:text-white transition-all duration-300 text-sm tracking-wide"
              >
                {option}
              </button>
            ))}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h2 className="text-xl font-light text-white/90 tracking-wide mb-2">
            You are feeling {selectedEmotion.toLowerCase()}.
          </h2>
          <p className="text-neutral-500 text-sm mb-8">What would you like to do next?</p>
          
          <div className="space-y-3">
            <button
              onClick={() => handleAction('Understand')}
              className="w-full p-4 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all duration-300 text-sm tracking-widest uppercase"
            >
              Understand It
            </button>
            <button
              onClick={() => handleAction('Calm')}
              className="w-full p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-neutral-300 transition-all duration-300 text-sm tracking-widest uppercase"
            >
              Calm Down
            </button>
            <button
              onClick={() => handleAction('Act')}
              className="w-full p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-neutral-300 transition-all duration-300 text-sm tracking-widest uppercase"
            >
              Take Action
            </button>
          </div>
        </motion.div>
      )}
    </ModalContainer>
  );
}
