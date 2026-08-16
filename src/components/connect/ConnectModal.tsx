import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import { Connection, ChatMessage } from '../../types';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc, collection, query, where, getDocs, addDoc, onSnapshot, orderBy, updateDoc, arrayUnion } from 'firebase/firestore';

export function ConnectModal() {
  const { isConnectOpen, setConnectOpen, anonymousProfile, updateAnonymousProfile, connections, addConnection, updateConnection, removeConnection, addMessageToConnection } = useAppStore();
  
  const [view, setView] = useState<'dashboard' | 'setup' | 'searching' | 'chat'>('dashboard');
  const [activeConnectionId, setActiveConnectionId] = useState<string | null>(null);

  // Reset view when opening
  useEffect(() => {
    if (isConnectOpen) {
      if (!anonymousProfile.isSetup) {
        setView('setup');
      } else {
        setView('dashboard');
      }
      setActiveConnectionId(null);
    }
  }, [isConnectOpen, anonymousProfile.isSetup]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isConnectOpen) {
        if (view === 'chat' || view === 'searching') {
          setView('dashboard');
        } else {
          setConnectOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isConnectOpen, view, setConnectOpen]);

  if (!isConnectOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col p-4 md:p-8 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setConnectOpen(false)}
          className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md pointer-events-auto"
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="relative flex-1 w-full max-w-3xl mx-auto flex flex-col bg-neutral-900/50 border border-white/10 rounded-3xl overflow-hidden pointer-events-auto shadow-2xl"
        >
          {view === 'setup' && (
            <SetupView onComplete={() => setView('dashboard')} />
          )}
          {view === 'dashboard' && (
            <DashboardView 
              onFindSomeone={() => setView('searching')} 
              onOpenChat={(id) => { setActiveConnectionId(id); setView('chat'); }} 
            />
          )}
          {view === 'searching' && (
            <SearchingView 
              onFound={(conn) => { 
                addConnection(conn); 
                setActiveConnectionId(conn.id); 
                setView('chat'); 
              }} 
              onCancel={() => setView('dashboard')}
            />
          )}
          {view === 'chat' && activeConnectionId && (
            <ChatView 
              connectionId={activeConnectionId} 
              onBack={() => setView('dashboard')} 
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function SetupView({ onComplete }: { onComplete: () => void }) {
  const { anonymousProfile, updateAnonymousProfile } = useAppStore();
  const [name, setName] = useState(anonymousProfile.displayName || '');
  const [bio, setBio] = useState(anonymousProfile.bio || '');

  const handleSave = async () => {
    if (!name.trim()) return;
    
    updateAnonymousProfile({ displayName: name, bio, isSetup: true });
    
    // Save to Firestore
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'anonymous_profiles', auth.currentUser.uid), {
          displayName: name,
          bio,
          isSetup: true,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Error saving anonymous profile", err);
      }
    }
    
    onComplete();
  };

  return (
    <div className="flex-1 flex flex-col p-8 items-center justify-center text-center">
      <h2 className="text-2xl font-light tracking-[0.2em] text-white/90 mb-4">ANONYMOUS CONNECTION</h2>
      <p className="text-neutral-400 mb-8 max-w-md font-light leading-relaxed">
        To connect with others, choose a display name. Your real identity, email, and personal sanctuary remain completely hidden.
      </p>
      
      <div className="w-full max-w-sm space-y-4">
        <div className="text-left">
          <label className="text-[10px] tracking-widest text-neutral-500 uppercase ml-4 mb-2 block">Display Name</label>
          <input 
            type="text" 
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Wandering Spirit"
            className="w-full bg-black/40 border border-white/10 rounded-full px-6 py-4 text-white/90 placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors tracking-wide text-sm"
          />
        </div>
        <div className="text-left">
          <label className="text-[10px] tracking-widest text-neutral-500 uppercase ml-4 mb-2 block">Short Bio (Optional)</label>
          <input 
            type="text" 
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="e.g. Looking for quiet conversations."
            className="w-full bg-black/40 border border-white/10 rounded-full px-6 py-4 text-white/90 placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors tracking-wide text-sm"
          />
        </div>
        <button 
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white tracking-widest uppercase text-xs py-4 rounded-full transition-colors disabled:opacity-50"
        >
          Enter Connection
        </button>
      </div>
    </div>
  );
}

function DashboardView({ onFindSomeone, onOpenChat }: { onFindSomeone: () => void, onOpenChat: (id: string) => void }) {
  const { setConnectOpen, connections } = useAppStore();
  const savedConnections = connections.filter(c => c.isSaved);

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-neutral-900/80 backdrop-blur-md shrink-0">
        <div>
          <h2 className="text-xl font-light tracking-[0.2em] text-white/90">CONNECT</h2>
          <p className="text-neutral-500 text-xs tracking-widest uppercase mt-1">Shared Solitude</p>
        </div>
        <button 
          onClick={() => setConnectOpen(false)}
          className="text-neutral-500 hover:text-white transition-colors text-2xl font-light leading-none"
        >
          ×
        </button>
      </div>

      <div className="flex-1 p-6 md:p-10 flex flex-col lg:flex-row gap-10 overflow-y-auto">
        <div className="flex-1 flex flex-col items-center justify-center border border-white/5 rounded-3xl bg-black/20 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/50">
              <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/>
              <path d="M12 8v4l3 3"/>
            </svg>
          </div>
          <h3 className="text-lg text-white/90 tracking-wider font-light mb-2">Find a Connection</h3>
          <p className="text-neutral-500 text-sm mb-8 font-light max-w-xs">
            Connect anonymously with someone else currently in their sanctuary.
          </p>
          <button 
            onClick={onFindSomeone}
            className="bg-white/10 hover:bg-white/20 border border-white/10 text-white tracking-widest uppercase text-xs py-4 px-8 rounded-full transition-all"
          >
            Find Someone
          </button>
        </div>

        <div className="flex-1 flex flex-col">
          <h3 className="text-xs tracking-widest uppercase text-neutral-500 mb-6">Saved Connections</h3>
          {savedConnections.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-neutral-600 font-light text-sm text-center px-4">
              You have no saved connections. <br/>When you have a meaningful conversation, you can choose to keep the connection.
            </div>
          ) : (
            <div className="space-y-2 flex-1 overflow-y-auto pr-2">
              {savedConnections.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => onOpenChat(c.id)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-colors text-left"
                >
                  <div>
                    <div className="text-white/90 tracking-wide mb-1">{c.displayName}</div>
                    <div className="text-neutral-500 text-xs tracking-wide">
                      {c.messages.length > 0 ? c.messages[c.messages.length - 1].text.substring(0, 40) + '...' : 'No messages yet.'}
                    </div>
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-neutral-600">
                    {new Date(c.lastActive).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchingView({ onFound, onCancel }: { onFound: (c: Connection) => void, onCancel: () => void }) {
  useEffect(() => {
    let timeoutId: any;
    
    const findMatch = async () => {
      if (!auth.currentUser) return;
      
      try {
        // Find a random anonymous profile that isn't us
        const profilesRef = collection(db, 'anonymous_profiles');
        const q = query(profilesRef, where('isSetup', '==', true));
        const snapshot = await getDocs(q);
        
        const otherProfiles = snapshot.docs.filter(d => d.id !== auth.currentUser!.uid);
        
        let partnerId = 'mock-partner-123';
        let partnerName = 'Gentle Stream';
        
        if (otherProfiles.length > 0) {
          const randomPartner = otherProfiles[Math.floor(Math.random() * otherProfiles.length)];
          partnerId = randomPartner.id;
          partnerName = randomPartner.data().displayName;
        }

        // Create a connection document
        const connRef = await addDoc(collection(db, 'connections'), {
          participants: [auth.currentUser.uid, partnerId],
          isSavedBy: [],
          lastActive: new Date().toISOString(),
          createdAt: new Date().toISOString()
        });

        const newConnection: Connection = {
          id: connRef.id,
          displayName: partnerName,
          lastActive: Date.now(),
          isSaved: false,
          messages: []
        };
        
        timeoutId = setTimeout(() => {
          onFound(newConnection);
        }, 2000);
        
      } catch (err) {
        console.error("Matchmaking error:", err);
        // Fallback
        timeoutId = setTimeout(() => {
          onFound({
            id: Date.now().toString(),
            displayName: 'Gentle Stream (Offline)',
            lastActive: Date.now(),
            isSaved: false,
            messages: []
          });
        }, 2000);
      }
    };

    findMatch();
    
    return () => clearTimeout(timeoutId);
  }, [onFound]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
      <div className="relative w-24 h-24 mb-8">
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border border-white/20"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.2, 0.8] }}
          transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-2 rounded-full border border-white/40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        </div>
      </div>
      <h3 className="text-lg text-white/90 tracking-wider font-light mb-2">Seeking Connection...</h3>
      <p className="text-neutral-500 text-sm mb-12 font-light">Looking for a matching resonance.</p>
      
      <button 
        onClick={onCancel}
        className="text-neutral-500 hover:text-white transition-colors text-xs tracking-widest uppercase"
      >
        Cancel
      </button>
    </div>
  );
}

function ChatView({ connectionId, onBack }: { connectionId: string, onBack: () => void }) {
  const { connections, addMessageToConnection, updateConnection, removeConnection } = useAppStore();
  const connection = connections.find(c => c.id === connectionId);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [keepRequested, setKeepRequested] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => scrollToBottom(), [connection?.messages, isTyping]);

  // Firestore listener
  useEffect(() => {
    if (!auth.currentUser || !connectionId || connectionId.includes('mock')) return;
    
    const messagesRef = collection(db, `connections/${connectionId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          // Avoid duplicating local state messages if possible, but for simplicity we can just rely on Firestore
          // We will update the store
          const msgExists = useAppStore.getState().connections.find(c => c.id === connectionId)?.messages.some(m => m.id === change.doc.id);
          
          if (!msgExists) {
            addMessageToConnection(connectionId, {
              id: change.doc.id,
              senderId: data.senderId,
              text: data.text,
              timestamp: data.timestamp
            });
          }
        }
      });
    });
    
    return () => unsubscribe();
  }, [connectionId]);

  if (!connection) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !auth.currentUser) return;

    const messageText = input.trim();
    setInput('');
    setIsTyping(true);

    try {
      if (!connectionId.includes('mock')) {
        await addDoc(collection(db, `connections/${connectionId}/messages`), {
          senderId: auth.currentUser.uid,
          text: messageText,
          timestamp: Date.now()
        });
        await updateDoc(doc(db, 'connections', connectionId), {
          lastActive: new Date().toISOString()
        });
      } else {
        // Fallback for mock
        addMessageToConnection(connectionId, {
          id: Date.now().toString(),
          senderId: auth.currentUser.uid,
          text: messageText,
          timestamp: Date.now()
        });
      }

      // Simulate partner response
      setTimeout(() => {
        setIsTyping(false);
        if (connectionId.includes('mock')) {
          const responses = [
            "I understand exactly what you mean.",
            "That's a beautiful way to look at it.",
            "I've been feeling similarly lately.",
            "Thank you for sharing that with me. It helps to know I'm not alone.",
            "It's peaceful here in the sanctuary, isn't it?",
            "Take your time, there is no rush here."
          ];
          addMessageToConnection(connectionId, {
            id: Date.now().toString(),
            senderId: connectionId,
            text: responses[Math.floor(Math.random() * responses.length)],
            timestamp: Date.now()
          });
          updateConnection(connectionId, { lastActive: Date.now() });
        }
      }, 2500 + Math.random() * 2000);
      
    } catch (err) {
      console.error("Error sending message", err);
      setIsTyping(false);
    }
  };

  const handleKeepConnection = async () => {
    setKeepRequested(true);
    if (!connectionId.includes('mock') && auth.currentUser) {
      await updateDoc(doc(db, 'connections', connectionId), {
        isSavedBy: arrayUnion(auth.currentUser.uid)
      });
    }
    // Simulate mutual accept after a delay
    setTimeout(() => {
      updateConnection(connectionId, { isSaved: true });
    }, 2000);
  };

  const handleBlock = () => {
    removeConnection(connectionId);
    onBack();
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center bg-neutral-900/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-neutral-500 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <div>
            <h2 className="text-sm font-medium tracking-wide text-white/90">{connection.displayName}</h2>
            <p className="text-neutral-500 text-[10px] tracking-widest uppercase mt-0.5">Anonymous Connection</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {!connection.isSaved && !keepRequested && (
            <button 
              onClick={handleKeepConnection}
              className="text-[10px] tracking-widest text-neutral-400 uppercase border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors"
            >
              Keep Connection
            </button>
          )}
          {keepRequested && !connection.isSaved && (
            <span className="text-[10px] tracking-widest text-neutral-500 uppercase px-3 py-1.5">Waiting...</span>
          )}
          {connection.isSaved && (
            <span className="text-[10px] tracking-widest text-white/50 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/50" /> Saved
            </span>
          )}
          <div className="relative group">
            <button className="text-neutral-500 hover:text-white transition-colors p-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="12" cy="5" r="1"/>
                <circle cx="12" cy="19" r="1"/>
              </svg>
            </button>
            <div className="absolute right-0 top-full mt-2 w-32 bg-neutral-800 border border-white/10 rounded-xl shadow-xl overflow-hidden opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
              <button onClick={handleBlock} className="w-full text-left px-4 py-3 text-xs tracking-wide text-red-400 hover:bg-white/5 transition-colors">Block & Remove</button>
              <button onClick={handleBlock} className="w-full text-left px-4 py-3 text-xs tracking-wide text-neutral-400 hover:bg-white/5 transition-colors">Report User</button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth hide-scrollbar bg-neutral-950/30">
        {connection.messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-4">
            <p className="tracking-wide font-light text-center text-sm">
              You are now connected with {connection.displayName}.<br/>
              Say hello.
            </p>
          </div>
        )}
        
        {connection.messages.map(msg => (
          <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.senderId === auth.currentUser?.uid ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
            <div className={`px-5 py-3.5 rounded-2xl ${msg.senderId === auth.currentUser?.uid ? 'bg-white/10 text-white/90 rounded-br-sm' : 'bg-transparent border border-white/10 text-neutral-300 rounded-bl-sm'} text-sm tracking-wide leading-relaxed font-light`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex max-w-[80%] mr-auto items-start">
            <div className="px-5 py-4 rounded-2xl bg-transparent border border-white/10 text-neutral-500 rounded-bl-sm text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 md:p-6 bg-neutral-900/80 backdrop-blur-md border-t border-white/10 shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-black/40 border border-white/10 rounded-full pl-6 pr-14 py-3.5 text-white/90 placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors tracking-wide text-sm font-light"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:hover:bg-white/10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
