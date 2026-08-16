import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';

type ChatMode = 'TALK' | 'UNDERSTAND' | 'SOLVE' | 'PRACTICE' | 'PLAN';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export function TalkModal() {
  const { isTalkOpen, setTalkOpen, addGrowth } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ChatMode>('TALK');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTalkOpen) {
        setTalkOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isTalkOpen, setTalkOpen]);

  if (!isTalkOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/gemini/talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage, 
          mode,
          history: messages 
        })
      });

      if (!response.ok) {
        throw new Error('Something interrupted the conversation.');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', text: data.text }]);
      
      // Trigger growth occasionally (e.g. after a message exchange)
      if (Math.random() > 0.5) {
         addGrowth(2, 'completedPracticeSessions');
      }

    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Something interrupted the conversation. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col p-4 md:p-8 pointer-events-none">
        
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setTalkOpen(false)}
          className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md pointer-events-auto"
        />

        {/* Chat Interface */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="relative flex-1 w-[95vw] max-w-5xl mx-auto flex flex-col bg-neutral-900/50 border border-white/10 rounded-3xl overflow-hidden pointer-events-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex justify-between items-start bg-neutral-900/80 backdrop-blur-md z-10 shrink-0">
            <div>
              <h2 className="text-xl font-light tracking-[0.2em] text-white/90">TALK</h2>
              <p className="text-neutral-500 text-xs tracking-widest uppercase mt-1">You can start anywhere.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-[10px] tracking-widest text-neutral-500 uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                Private Session
              </div>
              <button 
                onClick={() => setMessages([])}
                className="text-[10px] tracking-widest text-neutral-500 uppercase hover:text-white transition-colors"
              >
                Clear
              </button>
              <button 
                onClick={() => setTalkOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors ml-4 text-2xl font-light leading-none"
              >
                ×
              </button>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="px-6 py-3 border-b border-white/5 bg-neutral-900/50 shrink-0 overflow-x-auto hide-scrollbar">
            <div className="flex gap-4">
              {(['TALK', 'UNDERSTAND', 'SOLVE', 'PRACTICE', 'PLAN'] as ChatMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`text-[10px] tracking-widest uppercase py-1.5 px-4 rounded-full transition-all border whitespace-nowrap
                    ${mode === m 
                      ? 'bg-white/10 border-white/20 text-white' 
                      : 'border-transparent text-neutral-500 hover:text-neutral-300 hover:bg-white/5'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth hide-scrollbar">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-8">
                <div className="text-center space-y-4">
                  <p className="tracking-wide font-light">
                    I am here to help you navigate your thoughts.<br/>
                    What is on your mind?
                  </p>
                  <div className="flex justify-center gap-4 opacity-50">
                     <button onClick={() => setInput("I'm feeling overwhelmed.")} className="text-xs border border-white/10 px-4 py-2 rounded-full hover:bg-white/5 hover:text-white transition-colors">Overwhelmed</button>
                     <button onClick={() => setInput("I just want to vent.")} className="text-xs border border-white/10 px-4 py-2 rounded-full hover:bg-white/5 hover:text-white transition-colors">Vent</button>
                  </div>
                </div>

                <div className="w-full max-w-sm mt-8">
                  <p className="text-[10px] tracking-widest uppercase text-neutral-600 mb-4 text-center">Practical Tools</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button onClick={() => { setMode('PLAN'); setInput("I need help planning a simple goal."); }} className="text-xs border border-white/5 bg-white/[0.02] px-4 py-3 rounded-xl hover:bg-white/5 hover:text-neutral-300 transition-colors text-left text-neutral-400">Goal Planner</button>
                    <button onClick={() => { setMode('PRACTICE'); setInput("I need to practice a difficult conversation."); }} className="text-xs border border-white/5 bg-white/[0.02] px-4 py-3 rounded-xl hover:bg-white/5 hover:text-neutral-300 transition-colors text-left text-neutral-400">Conversation Practice</button>
                    <button onClick={() => { setMode('SOLVE'); setInput("I have a tough decision to make."); }} className="text-xs border border-white/5 bg-white/[0.02] px-4 py-3 rounded-xl hover:bg-white/5 hover:text-neutral-300 transition-colors text-left text-neutral-400">Decision Helper</button>
                    <button onClick={() => { setMode('UNDERSTAND'); setInput("I need help organizing my thoughts."); }} className="text-xs border border-white/5 bg-white/[0.02] px-4 py-3 rounded-xl hover:bg-white/5 hover:text-neutral-300 transition-colors text-left text-neutral-400">Thought Organizer</button>
                  </div>
                </div>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <div 
                  className={`px-5 py-4 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-white/10 text-white/90 rounded-br-sm' 
                      : 'bg-transparent border border-white/10 text-neutral-300 rounded-bl-sm'
                  } text-sm tracking-wide leading-relaxed font-light`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex max-w-[85%] mr-auto items-start">
                <div className="px-5 py-4 rounded-2xl bg-transparent border border-white/10 text-neutral-500 rounded-bl-sm text-sm tracking-wide font-light flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-neutral-900/80 backdrop-blur-md border-t border-white/10 shrink-0">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-black/40 border border-white/10 rounded-full pl-6 pr-14 py-4 text-white/90 placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors tracking-wide text-sm font-light"
                disabled={isTyping}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:hover:bg-white/10"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </form>
            <p className="text-center mt-3 text-[9px] tracking-widest text-neutral-600 uppercase">
              All processing happens securely. Your thoughts remain your own.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
