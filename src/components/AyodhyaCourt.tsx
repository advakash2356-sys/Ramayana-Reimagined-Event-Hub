/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronRight, ShieldCheck, Landmark, Zap, Flame, Award, Waves, Play, CheckCircle2, AlertTriangle } from 'lucide-react';
import { UserProfile, DivinePass } from '../types';
import { divineSynth } from '../audio';
import { MandalaSVG } from './MandalaSVG';

interface AyodhyaCourtProps {
  userProfile: UserProfile;
  passes: DivinePass[];
  onPurchasePass: (passId: string, cost: number) => void;
  onSetAvatar: (avatarName: string, title: string) => void;
}

interface StoneBrickProps {
  index: number;
  onTapped?: () => void;
}

const StoneBrick: React.FC<StoneBrickProps> = ({ index, onTapped }) => {
  const [lit, setLit] = useState(false);

  const handleStoneTap = () => {
    divineSynth.playTempleBell();
    setLit(true);
    if (onTapped) onTapped();
    setTimeout(() => setLit(false), 2500);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1, translateY: -4 }}
      onClick={handleStoneTap}
      className={`cursor-pointer w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex flex-col items-center justify-center font-bold text-center border-2 transition-all shadow-lg select-none relative ${
        lit
          ? 'bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600 border-amber-200 ring-4 ring-amber-400/50 scale-110 shadow-[0_0_20px_rgba(245,158,11,0.6)]'
          : 'bg-gradient-to-b from-[#1E293B] to-[#0F172A] border-amber-500/40 text-amber-200 hover:border-amber-400'
      }`}
    >
      <span className="text-[8px] font-mono leading-none block text-amber-400/80">Brick #{index + 1}</span>
      <span className="text-xs font-yatra mt-0.5 leading-none block text-amber-100">
        श्री राम
      </span>
      {lit && (
        <motion.span
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{ opacity: 1, y: -24, scale: 1.2 }}
          exit={{ opacity: 0 }}
          className="absolute text-xs text-yellow-300 pointer-events-none font-semibold font-yatra drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
        >
          🚩 विजय
        </motion.span>
      )}
    </motion.div>
  );
};

export const AyodhyaCourt: React.FC<AyodhyaCourtProps> = ({
  userProfile,
  passes,
  onPurchasePass,
  onSetAvatar,
}) => {
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [bridgeCompletionCount, setBridgeCompletionCount] = useState<number>(12);
  const [simulatedParticleFloats, setSimulatedParticleFloats] = useState<{ id: number; text: string }[]>([]);
  const [passSimulatorActive, setPassSimulatorActive] = useState<boolean>(true);

  const avatarsList = [
    { name: '🐒 Hanuman', value: 'hanuman', title: 'Sanjeevani Scout', description: 'Grace of speed & devotion' },
    { name: '🏹 Rama', value: 'rama', title: 'Suryavanshi Prince', description: 'Unshakeable righteousness' },
    { name: '⚡ Laxmana', value: 'laxman', title: 'Ayodhya Vanguard', description: 'Protective vigilance' },
    { name: '👑 Sugriva', value: 'sugriva', title: 'Vanar Chieftain', description: 'Sacred alliance covenant' },
    { name: '🔱 Ravana', value: 'ravana', title: 'Golden Lanka Scholar', description: 'Cosmic mastery' },
  ];

  const handleAvatarChange = (avatarValue: string, title: string) => {
    divineSynth.playTempleBell();
    onSetAvatar(avatarValue, title);
    setShowAvatarSelector(false);
  };

  const getPassIcon = (tier: string) => {
    switch (tier) {
      case 'scout': return '🐒';
      case 'guardian': return '⚡';
      case 'emperor': return '🏹';
      case 'overlord': return '🔱';
      default: return '🛡️';
    }
  };

  // Real-time interactive pass simulator effect
  useEffect(() => {
    if (!passSimulatorActive) return;
    const interval = setInterval(() => {
      const activePass = passes.find(p => p.id === userProfile.activePassId);
      const rate = activePass ? activePass.passiveRate : 5;
      const newParticle = { id: Date.now(), text: `+${rate} 🌸` };
      
      setSimulatedParticleFloats(prev => [...prev.slice(-4), newParticle]);
    }, 4000);

    return () => clearInterval(interval);
  }, [passSimulatorActive, userProfile.activePassId, passes]);

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-6 mt-2">
      
      {/* Welcome Pilgrim Banner Card */}
      <div className="relative bg-gradient-to-br from-[#0D1527] via-[#131B2E] to-[#1C0E1E] p-6 rounded-3xl border-2 border-amber-500/40 flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_0_30px_rgba(245,158,11,0.15)] overflow-hidden">
        
        {/* Decorative Background Mandala */}
        <div className="absolute right-4 top-4 opacity-10 pointer-events-none scale-125">
          <MandalaSVG size={180} color="#FFD700" />
        </div>
        
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 via-orange-600 to-amber-700 rounded-full flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(245,158,11,0.4)] border-4 border-amber-300 relative group">
            <span className="filter drop-shadow">
              {userProfile.avatar === 'hanuman' ? '🐒' :
               userProfile.avatar === 'rama' ? '🏹' :
               userProfile.avatar === 'laxman' ? '⚡' :
               userProfile.avatar === 'sugriva' ? '👑' : '🔱'}
            </span>
            <button
              onClick={() => { divineSynth.playCelestialChime(); setShowAvatarSelector(!showAvatarSelector); }}
              className="absolute -bottom-1 -right-1 bg-amber-600 hover:bg-amber-500 text-white rounded-full p-1.5 border-2 border-amber-200 hover:scale-110 transition-all cursor-pointer shadow-md"
              title="Change Pilgrim Avatar & Title"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black font-epic text-amber-200">
                {userProfile.avatar === 'rama' ? 'Shriram' : userProfile.avatar === 'hanuman' ? 'Bajrangi' : 'Seeker'} {userProfile.username}
              </h2>
              <span className="text-[10px] uppercase font-mono font-black bg-gradient-to-r from-amber-500 to-orange-600 text-white px-2.5 py-0.5 rounded-full border border-amber-300/40 shadow-sm">
                Lvl {userProfile.level}
              </span>
            </div>
            <p className="text-xs text-amber-300/80 font-medium font-sans">
              Enlisted to construct the holy cause as <strong className="text-amber-100 underline decoration-amber-400 decoration-2">{userProfile.title}</strong>
            </p>

            {/* Experience progression tube */}
            <div className="mt-3.5 w-60 sm:w-64">
              <div className="flex justify-between items-center text-[10px] text-amber-300/80 font-mono mb-1">
                <span className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400 animate-spin-slow" />
                  <span>Covenant Progression</span>
                </span>
                <span className="font-bold">{userProfile.experience % 100}/100 XP</span>
              </div>
              <div className="w-full bg-[#050811] rounded-full h-2 overflow-hidden border border-amber-500/30">
                <div
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 h-full transition-all duration-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                  style={{ width: `${userProfile.experience % 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Totals */}
        <div className="flex gap-4 relative z-10 w-full md:w-auto">
          <div className="bg-[#050811]/90 backdrop-blur p-4 px-6 rounded-2xl border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)] text-center flex-1 md:flex-initial relative overflow-hidden">
            {/* Live floating particle simulator overlay */}
            <div className="absolute top-1 right-2 pointer-events-none">
              {simulatedParticleFloats.map(p => (
                <motion.span
                  key={p.id}
                  initial={{ opacity: 1, y: 0, scale: 0.8 }}
                  animate={{ opacity: 0, y: -20, scale: 1.1 }}
                  transition={{ duration: 1.8 }}
                  className="text-[10px] font-mono font-bold text-amber-300 block"
                >
                  {p.text}
                </motion.span>
              ))}
            </div>

            <span className="text-[10px] text-amber-300/70 font-mono uppercase font-bold block">Bhakti Balance</span>
            <span className="text-2xl font-black font-mono text-amber-200 flex items-center justify-center gap-1.5">
              <span>🌸</span>
              <span>{userProfile.coins.toLocaleString()}</span>
            </span>
          </div>
          <div className="bg-[#050811]/90 backdrop-blur p-4 px-6 rounded-2xl border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)] text-center flex-1 md:flex-initial">
            <span className="text-[10px] text-amber-300/70 font-mono uppercase font-bold block">Active Covenant</span>
            <span className="text-lg font-bold font-epic text-amber-300">
              {userProfile.activePassId ? passes.find(p => p.id === userProfile.activePassId)?.name.split(" ")[0] : 'Vanguard'}
            </span>
          </div>
        </div>

      </div>

      {/* Avatar Selection Modal / Drawer */}
      <AnimatePresence>
        {showAvatarSelector && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#0D1527] p-5 rounded-2xl border-2 border-amber-500/40 shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3 border-b border-amber-500/20 pb-2">
              <h3 className="text-xs font-black font-epic text-amber-200 uppercase tracking-wider">
                Select Your Divine Pilgrim Archetype
              </h3>
              <button
                onClick={() => setShowAvatarSelector(false)}
                className="text-xs font-mono text-amber-400 hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {avatarsList.map((av) => (
                <button
                  key={av.value}
                  onClick={() => handleAvatarChange(av.value, av.title)}
                  className={`p-3 rounded-xl border transition-all text-left flex flex-col items-center text-center cursor-pointer ${
                    userProfile.avatar === av.value
                      ? 'bg-amber-950/60 border-amber-400 ring-2 ring-amber-400/40 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      : 'bg-[#050811] border-amber-500/20 text-amber-200/80 hover:border-amber-400/60 hover:text-white'
                  }`}
                >
                  <span className="text-3xl mb-1">{av.name.split(' ')[0]}</span>
                  <span className="text-xs font-bold font-epic text-amber-200">{av.name.split(' ')[1]}</span>
                  <span className="text-[10px] font-mono text-amber-400/80 leading-tight mt-0.5">{av.title}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sacred RamSetu Construction Stage — Interactive Floating Bridge Canvas */}
      <div className="relative bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#0A0F1D] text-amber-50 rounded-3xl p-6 md:p-8 border-2 border-amber-500/40 shadow-[0_0_35px_rgba(245,158,11,0.15)] overflow-hidden min-h-[360px] flex flex-col justify-between">
        
        {/* Ambient Oceanic Ripples and Starry Horizon */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
        <div className="absolute -left-12 -top-12 opacity-10 pointer-events-none animate-spin-slow">
          <MandalaSVG size={260} color="#FFD700" />
        </div>

        {/* Stage Header */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌊</span>
              <h3 className="text-lg font-black font-epic text-amber-200 uppercase tracking-wider">
                The Sacred Ram Setu Bridge Construction
              </h3>
            </div>
            <p className="text-xs text-amber-300/80 font-sans mt-0.5">
              Tap the floating stones inscribed with Lord Rama's name to emit sacred ripples and reinforce the pathway to Lanka!
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#050811]/90 px-3.5 py-1.5 rounded-xl border border-amber-500/30 text-xs font-mono text-amber-300">
            <Waves className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Bridge Span: <strong>{bridgeCompletionCount}/20 Stones</strong></span>
          </div>
        </div>

        {/* Interactive Floating Ram Stone Grid */}
        <div className="relative z-10 py-6 my-2">
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {Array.from({ length: 14 }).map((_, idx) => (
              <StoneBrick
                key={idx}
                index={idx}
                onTapped={() => setBridgeCompletionCount(c => Math.min(20, c + 1))}
              />
            ))}
          </div>
        </div>

        {/* Stage Footer */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-amber-500/20 text-xs text-amber-300/80 font-mono">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Vanara Army Collective Labor • Inscriptions Float Unsinkable</span>
          </span>
          <span className="text-[10px] text-amber-400/60">
            Consecrated under the blessings of Nal & Neel
          </span>
        </div>
      </div>

      {/* Divine Weapon Passes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
          <div>
            <h3 className="text-base font-black font-epic text-amber-200 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Divine Weapon Passes (Continuous Blessings)</span>
            </h3>
            <p className="text-xs text-amber-300/80 font-sans">
              Equip legendary Passes to unlock continuous Bhakti Point flows every 10 seconds and amplify quest rewards.
            </p>
          </div>

          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
            ZERO_MONETARY_VALUE_VIRTUAL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {passes.map((pass) => {
            const isEquipped = userProfile.activePassId === pass.id;

            return (
              <div
                key={pass.id}
                className={`rounded-2xl p-5 border-2 transition-all flex flex-col justify-between relative overflow-hidden ${
                  isEquipped
                    ? 'bg-gradient-to-b from-[#1C0E1E] to-[#0D1527] border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)] ring-2 ring-amber-400/40'
                    : 'bg-[#0D1527]/90 border-amber-500/30 hover:border-amber-400/70 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                }`}
              >
                {/* Active pass particle shine */}
                {isEquipped && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-orange-500 text-slate-950 text-[9px] font-mono font-black uppercase tracking-widest px-3 py-0.5 rounded-bl-xl shadow-md">
                    ACTIVE
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{getPassIcon(pass.tier)}</span>
                    <div>
                      <h4 className="text-sm font-black font-epic text-amber-200 leading-snug">
                        {pass.name}
                      </h4>
                      <span className="text-[10px] font-mono font-bold text-amber-400 block uppercase">
                        Tier: {pass.tier}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-amber-100/70 font-sans leading-relaxed">
                    {pass.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-2 border-t border-amber-500/20">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-amber-300/80">Blessing Flow:</span>
                      <span className="font-bold text-emerald-400">+{pass.passiveRate} Pts / 10s</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-amber-300/80">Quest Multiplier:</span>
                      <span className="font-bold text-amber-300">{pass.multiplier}x Boost</span>
                    </div>
                  </div>
                </div>

                {/* Purchase / Equip CTA button */}
                <div className="mt-4 pt-3 border-t border-amber-500/20">
                  {isEquipped ? (
                    <div className="w-full py-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs rounded-xl text-center flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Equipped & Flowing</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => { divineSynth.playTempleBell(); onPurchasePass(pass.id, pass.cost); }}
                      className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>Consecrate (🌸 {pass.cost})</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
export default AyodhyaCourt;
