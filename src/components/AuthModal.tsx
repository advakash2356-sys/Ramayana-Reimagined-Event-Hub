/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Lock, Sparkles, X, ShieldAlert, CheckCircle2, ChevronRight, Bookmark } from 'lucide-react';
import { divineSynth } from '../audio';
import { MandalaSVG } from './MandalaSVG';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (username: string, email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [vowCheck, setVowCheck] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Valdidations
    if (!email) {
      divineSynth.playBuzzer();
      setErrorMessage("Sacred scroll registration requires a valid Email address!");
      return;
    }
    if (activeTab === 'signup' && !username) {
      divineSynth.playBuzzer();
      setErrorMessage("Please identify yourself with a valid Pilgrim Username!");
      return;
    }
    if (password.length < 5) {
      divineSynth.playBuzzer();
      setErrorMessage("Holy password key must be at least 5 spiritual characters long!");
      return;
    }
    if (activeTab === 'signup' && password !== confirmPassword) {
      divineSynth.playBuzzer();
      setErrorMessage("Covenant passwords do not match or align!");
      return;
    }
    if (activeTab === 'signup' && !vowCheck) {
      divineSynth.playBuzzer();
      setErrorMessage("You must accept the Virtuous Covenant oath to enter!");
      return;
    }

    setLoading(true);
    divineSynth.playCelestialChime();

    setTimeout(() => {
      setLoading(false);
      divineSynth.playTempleBell();
      
      const finalUsername = activeTab === 'signup' ? username : email.split('@')[0];
      setSuccessMessage(activeTab === 'signup' 
        ? "🕉️ Covenant Sealed! Welcome to Lord Rama's Vanguard." 
        : "🕉️ Auspicious Entry Granted! Blessed path retrieved."
      );

      setTimeout(() => {
        onAuthSuccess(finalUsername, email);
        onClose();
        // Reset state
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setSuccessMessage(null);
      }, 1500);

    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 15 }}
        className="bg-white rounded-3xl w-full max-w-md border-4 border-saffron-500 shadow-2xl relative overflow-hidden z-10 p-6 flex flex-col justify-between"
      >
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 opacity-[0.03] pointer-events-none -translate-y-4 translate-x-4">
          <MandalaSVG size={180} color="#ff6a00" />
        </div>

        {/* Modal Close */}
        <button
          onClick={() => { divineSynth.playCelestialChime(); onClose(); }}
          className="absolute right-4 top-4 text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Temple style heading */}
        <div className="text-center space-y-1 mb-6 mt-2">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-saffron-600 to-amber-500 rounded-full flex items-center justify-center text-white shadow-md">
            <Bookmark className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-black font-epic text-saffron-950 uppercase tracking-widest mt-2">
            Celestial Vanguard Portal
          </h2>
          <p className="text-[11px] text-saffron-800 font-sans font-medium">
            Authenticate to sync your sacred gold ledger and save battle records.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 gap-2 bg-saffron-100/40 p-1 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => { divineSynth.playCelestialChime(); setActiveTab('signin'); setErrorMessage(null); }}
            className={`py-2 rounded-lg text-xs font-black font-sans uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'signin'
                ? 'bg-gradient-to-r from-saffron-600 to-amber-500 text-white shadow-xs'
                : 'text-saffron-950 hover:bg-saffron-100/60'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { divineSynth.playCelestialChime(); setActiveTab('signup'); setErrorMessage(null); }}
            className={`py-2 rounded-lg text-xs font-black font-sans uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-gradient-to-r from-saffron-600 to-amber-500 text-white shadow-xs'
                : 'text-saffron-950 hover:bg-saffron-100/60'
            }`}
          >
            Register Vessel
          </button>
        </div>

        {/* Notifications */}
        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="bg-red-50 border border-red-300 text-red-950 px-3 py-2 rounded-xl text-[11px] font-bold font-sans flex items-center gap-2 mb-4"
            >
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="bg-emerald-50 border border-emerald-300 text-emerald-950 px-3 py-2 rounded-xl text-[11px] font-extrabold font-sans flex items-center gap-2 mb-4"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth core form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {activeTab === 'signup' && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-saffron-950 uppercase tracking-widest block font-sans">
                Sacred Username (Your Warrior Alias)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-saffron-600">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="e.g. Maruti_Hero"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border-2 border-saffron-100 focus:border-saffron-550 focus:outline-none rounded-xl font-sans"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-saffron-950 uppercase tracking-widest block font-sans">
              Celestial Email (For safe recovery)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-saffron-600">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="e.g. seeker@ramayana.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border-2 border-saffron-100 focus:border-saffron-550 focus:outline-none rounded-xl font-sans"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-saffron-950 uppercase tracking-widest block font-sans">
              Pass-Key Secret
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-saffron-600">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border-2 border-saffron-100 focus:border-saffron-550 focus:outline-none rounded-xl font-sans"
              />
            </div>
          </div>

          {activeTab === 'signup' && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-saffron-950 uppercase tracking-widest block font-sans">
                Align Pass-Key Secret
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-saffron-600">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border-2 border-saffron-100 focus:border-saffron-550 focus:outline-none rounded-xl font-sans"
                />
              </div>
            </div>
          )}

          {activeTab === 'signup' && (
            <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={vowCheck}
                onChange={() => setVowCheck(!vowCheck)}
                className="mt-0.5 rounded text-saffron-600 accent-saffron-600"
              />
              <span className="text-[10px] text-saffron-900 leading-snug font-sans">
                I solemnly promise to follow the paths of pure Dharma (righteousness) and absolute loyalty to the Vanar sena. 🚩
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-saffron-600 to-amber-500 hover:from-saffron-700 hover:to-amber-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <span>{loading ? 'Consulting Deities...' : activeTab === 'signup' ? 'Seal & Enter' : 'Auspicious Entry'}</span>
            {!loading && <ChevronRight className="w-4 h-4" />}
          </button>

          {activeTab === 'signup' && (
            <div className="bg-yellow-50 text-amber-800 text-[10px] p-2.5 rounded-xl border border-yellow-200 text-center flex items-center gap-1 justify-center leading-none">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-spin" />
              <span>Bonus: Enlisting grants <strong>+100 Devotional Coins</strong> instantly!</span>
            </div>
          )}

        </form>
      </motion.div>
    </div>
  );
};
export default AuthModal;
