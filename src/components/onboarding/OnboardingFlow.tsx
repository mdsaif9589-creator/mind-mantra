import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import { WorldObject } from '../../types';

const COUNTRIES = ['India', 'Japan', 'South Korea', 'China', 'USA', 'UK', 'France', 'Italy', 'Canada', 'Australia', 'Germany', 'Brazil'];
const LANGUAGES = ['English', 'Hindi', 'Hinglish', 'Bengali', 'Urdu', 'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Chinese', 'Portuguese', 'Arabic'];
const WORLD_OBJECTS: WorldObject[] = ['Bonsai', 'Flower', 'Cactus', 'Mountain', 'Ocean', 'Island', 'Planet', 'Lantern', 'Crystal'];

export function OnboardingFlow() {
  const { onboardingStep, setOnboardingStep, profile, updateProfile, setAppState } = useAppStore();

  const handleNext = (nextStep: typeof onboardingStep) => {
    setOnboardingStep(nextStep);
  };

  const handleComplete = () => {
    setAppState('sanctuary');
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center text-neutral-200 overflow-y-auto relative selection:bg-neutral-800">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_80%)] pointer-events-none" />
      
      <div className="w-full max-w-2xl px-6 py-12 md:py-24 z-10 flex flex-col my-auto">
        <AnimatePresence mode="wait">
          {onboardingStep === 'name' && (
            <NameStep key="name" onNext={() => handleNext('country')} />
          )}
          {onboardingStep === 'country' && (
            <CountryStep key="country" onNext={() => handleNext('language')} />
          )}
          {onboardingStep === 'language' && (
            <LanguageStep key="language" onNext={() => handleNext('object')} />
          )}
          {onboardingStep === 'object' && (
            <ObjectStep key="object" onComplete={handleComplete} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function NameStep({ onNext }: { onNext: () => void }) {
  const { profile, updateProfile } = useAppStore();
  const [name, setName] = useState(profile.displayName || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      updateProfile({ displayName: name.trim() });
      onNext();
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onSubmit={handleSubmit}
      className="flex-1 flex flex-col justify-center items-center text-center space-y-12"
    >
      <h2 className="text-3xl font-light tracking-wide text-white/90">What should we call you?</h2>
      <input 
        type="text" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full max-w-sm bg-transparent border-b border-white/20 px-4 py-3 text-center text-xl text-white/90 placeholder:text-neutral-700 focus:outline-none focus:border-white/50 transition-colors tracking-wide"
        autoFocus
      />
      <button 
        type="submit"
        disabled={!name.trim()}
        className="py-3 px-8 rounded-full text-neutral-400 hover:text-white transition-colors tracking-widest text-sm disabled:opacity-50 disabled:hover:text-neutral-400"
      >
        CONTINUE
      </button>
    </motion.form>
  );
}

function CountryStep({ onNext }: { onNext: () => void }) {
  const { profile, updateProfile } = useAppStore();
  const [search, setSearch] = useState('');
  
  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter(c => c.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full flex flex-col"
    >
      <div className="text-center mb-8 shrink-0">
        <h2 className="text-3xl font-light tracking-wide text-white/90 mb-4">Where are you from?</h2>
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search countries..."
          className="w-full max-w-sm mx-auto block bg-transparent border-b border-white/20 px-4 py-3 text-center text-white/80 placeholder:text-neutral-700 focus:outline-none focus:border-white/50 transition-colors"
        />
      </div>

      <div className="w-full pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
          {filteredCountries.map(country => (
            <button
              key={country}
              onClick={() => {
                updateProfile({ country });
                onNext();
              }}
              className={`py-4 px-4 rounded-xl border transition-all duration-300 text-sm tracking-wide
                ${profile.country === country 
                  ? 'bg-white/10 border-white/30 text-white' 
                  : 'border-white/5 text-neutral-400 hover:border-white/20 hover:text-neutral-200'}`}
            >
              {country}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function LanguageStep({ onNext }: { onNext: () => void }) {
  const { profile, updateProfile } = useAppStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full flex flex-col"
    >
      <div className="text-center mb-8 shrink-0">
        <h2 className="text-3xl font-light tracking-wide text-white/90">Preferred Language</h2>
      </div>

      <div className="w-full pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
          {LANGUAGES.map(lang => (
            <button
              key={lang}
              onClick={() => {
                updateProfile({ language: lang });
                onNext();
              }}
              className={`py-4 px-4 rounded-xl border transition-all duration-300 text-sm tracking-wide
                ${profile.language === lang 
                  ? 'bg-white/10 border-white/30 text-white' 
                  : 'border-white/5 text-neutral-400 hover:border-white/20 hover:text-neutral-200'}`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ObjectStep({ onComplete }: { onComplete: () => void }) {
  const { profile, updateProfile } = useAppStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full flex flex-col"
    >
      <div className="text-center mb-8 shrink-0">
        <h2 className="text-3xl font-light tracking-wide text-white/90 mb-2">Choose what represents you.</h2>
        <p className="text-neutral-500 text-sm">Your personal world object</p>
      </div>

      <div className="w-full pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pb-12">
          {WORLD_OBJECTS.map(obj => (
            <button
              key={obj}
              onClick={() => updateProfile({ selectedObject: obj })}
              className={`group relative overflow-hidden aspect-square rounded-2xl border transition-all duration-500 flex flex-col items-center justify-center p-4
                ${profile.selectedObject === obj 
                  ? 'bg-white/10 border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.05)]' 
                  : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'}`}
            >
              {/* Placeholder for 3D miniature, using text/styling for now */}
              <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center transition-transform duration-700 group-hover:scale-110 
                ${profile.selectedObject === obj ? 'bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'bg-white/5'}`}>
                <span className="text-white/40 text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">3D</span>
              </div>
              <span className={`text-sm tracking-widest transition-colors duration-300 ${profile.selectedObject === obj ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'}`}>
                {obj}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="pt-4 text-center shrink-0">
        <button 
          onClick={onComplete}
          disabled={!profile.selectedObject}
          className="py-4 px-12 border border-white/10 rounded-full bg-white/5 hover:bg-white/10 text-white/90 tracking-widest text-sm transition-all duration-500 ease-out backdrop-blur-md disabled:opacity-30 disabled:hover:bg-white/5"
        >
          ENTER YOUR WORLD
        </button>
      </div>
    </motion.div>
  );
}
