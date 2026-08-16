import { useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import { auth, db } from '../../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export function AuthFlow() {
  const { login, setAppState } = useAppStore();
  const [isLogin, setIsLogin] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (val: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) return 'Email is required';
    if (!emailRegex.test(val)) return 'Invalid email address format';
    return null;
  };

  const validatePassword = (val: string, checkingLogin: boolean) => {
    if (!val) return 'Password is required';
    if (!checkingLogin && val.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (emailError) setEmailError(validateEmail(val));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (passwordError) setPasswordError(validatePassword(val, isLogin));
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    
    const emErr = validateEmail(email);
    setEmailError(emErr);
    if (emErr) return;

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMsg('Recovery link sent to your email.');
    } catch (err: any) {
      let errorMessage = 'Failed to send recovery link.';
      if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const emErr = validateEmail(email);
    const pwErr = validatePassword(password, isLogin);
    
    setEmailError(emErr);
    setPasswordError(pwErr);

    if (emErr || pwErr) return;

    setIsLoading(true);

    // Bypassing Firebase Authentication as requested by user
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      login();
      
      if (isLogin) {
        setAppState('sanctuary'); 
      } else {
        setAppState('onboarding');
      }
    } catch (err: any) {
      setError('An error occurred while bypassing authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-neutral-200 relative">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_100%)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full max-w-md p-8 md:p-12"
      >
        <div className="text-center mb-12">
          <h2 className="text-2xl font-light tracking-[0.15em] text-white/90 mb-2">
            {isForgotPassword ? 'RESET PASSWORD' : (isLogin ? 'WELCOME BACK' : 'CREATE SANCTUARY')}
          </h2>
          <p className="text-neutral-500 text-sm tracking-wide">
            {isForgotPassword ? 'Receive a recovery link' : (isLogin ? 'Enter your quiet place' : 'Begin your journey')}
          </p>
        </div>

        <form onSubmit={isForgotPassword ? handleResetPassword : handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <input 
              type="email" 
              placeholder="Email"
              required
              value={email}
              onChange={handleEmailChange}
              onBlur={() => setEmailError(validateEmail(email))}
              className={`w-full bg-transparent border-b ${emailError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white/30'} px-4 py-3 text-white/80 placeholder:text-neutral-600 focus:outline-none transition-colors tracking-wide`}
            />
            {emailError && <div className="text-red-400 text-[10px] tracking-wide px-4">{emailError}</div>}
          </div>
          {!isForgotPassword && (
            <div className="space-y-1">
              <input 
                type="password" 
                placeholder="Password"
                required
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => { if (!isForgotPassword) setPasswordError(validatePassword(password, isLogin)); }}
                className={`w-full bg-transparent border-b ${passwordError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white/30'} px-4 py-3 text-white/80 placeholder:text-neutral-600 focus:outline-none transition-colors tracking-wide`}
              />
              {passwordError && <div className="text-red-400 text-[10px] tracking-wide px-4">{passwordError}</div>}
            </div>
          )}

          {!isForgotPassword && isLogin && (
            <div className="flex justify-end pt-2">
              <button 
                type="button"
                onClick={() => { setError(null); setSuccessMsg(null); setEmailError(null); setPasswordError(null); setIsForgotPassword(true); }}
                className="text-neutral-500 hover:text-neutral-300 transition-colors text-[10px] tracking-widest uppercase"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {error && (
            <div className="text-red-400 text-xs tracking-wide text-center">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="text-green-400 text-xs tracking-wide text-center">
              {successMsg}
            </div>
          )}

          <div className="pt-8">
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-8 border border-white/10 rounded-full bg-white/5 hover:bg-white/10 text-white/90 tracking-widest text-sm transition-all duration-500 ease-out disabled:opacity-50"
            >
              {isLoading ? 'PROCESSING...' : (isForgotPassword ? 'SEND LINK' : (isLogin ? 'ENTER' : 'CONTINUE'))}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center flex flex-col gap-4">
          {isForgotPassword ? (
            <button 
              type="button"
              onClick={() => { setError(null); setSuccessMsg(null); setEmailError(null); setPasswordError(null); setIsForgotPassword(false); }}
              className="text-neutral-500 hover:text-neutral-300 transition-colors text-xs tracking-wider"
            >
              RETURN TO LOGIN
            </button>
          ) : (
            <button 
              type="button"
              onClick={() => { setError(null); setSuccessMsg(null); setEmailError(null); setPasswordError(null); setIsLogin(!isLogin); }}
              className="text-neutral-500 hover:text-neutral-300 transition-colors text-xs tracking-wider"
            >
              {isLogin ? 'I DO NOT HAVE AN ACCOUNT' : 'I ALREADY HAVE AN ACCOUNT'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
