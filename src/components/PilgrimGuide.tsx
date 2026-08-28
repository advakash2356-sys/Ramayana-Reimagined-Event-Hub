/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, Compass, Flame, Shield, Coins, CheckCircle2, Award } from 'lucide-react';
import { divineSynth } from '../audio';
import { MandalaSVG } from './MandalaSVG';

interface PilgrimGuideProps {
  userCoins: number;
  activePassId: string | null;
  onRewardCoins: (amount: number, description: string) => void;
}

export const PilgrimGuide: React.FC<PilgrimGuideProps> = ({
  userCoins,
  activePassId,
  onRewardCoins,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true); // Open by default for first-time clarity!
  
  // Local states to track beginner checklist progression
  const [checklist, setChecklist] = useState({
    readManual: false,
    explorePasses: false,
    understandStakes: false,
  });

  const handleCompleteStep = (step: 'readManual' | 'explorePasses' | 'understandStakes') => {
    if (checklist[step]) return; // already completed
    
    divineSynth.playTempleBell();
    setChecklist((prev) => ({ ...prev, [step]: true }));
    
    // Reward player 50 coins to give immediate feedback and teach them the game loop!
    const reward = 50;
    onRewardCoins(reward, `Completed Pilgrim Guide task: ${step.toUpperCase()} (+${reward} 🪙)`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mt-2">
      <div className="bg-gradient-to-r from-saffron-50 to-amber-100/50 border-2 border-saffron-500/20 rounded-3xl p-5 shadow-md relative overflow-hidden">
        
        {/* Absolute Background Mandala for aesthetic heritage feel */}
        <div className="absolute right-4 bottom-4 opacity-[0.04] pointer-events-none">
          <MandalaSVG size={140} color="#ff6a00" />
        </div>

        {/* Accordion header bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-saffron-600 to-amber-600 rounded-full flex items-center justify-center text-white shadow-sm ring-4 ring-saffron-100">
              <HelpCircle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black font-epic text-saffron-950 uppercase tracking-wider flex items-center gap-1.5">
                Pilgrim's Path Guide • How It Works
              </h3>
              <p className="text-[11px] text-saffron-800 font-sans font-medium">
                New to RamSetu? Clean, simple rules to master our prediction arena, passes passive rewards & tasks!
              </p>
            </div>
          </div>

          <button
            onClick={() => { divineSynth.playCelestialChime(); setIsOpen(!isOpen); }}
            className={`w-full sm:w-auto px-4 py-2 border rounded-xl text-xs font-black font-sans uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isOpen
                ? 'bg-amber-600 border-amber-700 text-white shadow-inner'
                : 'bg-white border-saffron-300/40 text-saffron-700 hover:bg-saffron-50'
            }`}
          >
            <span>{isOpen ? 'Minimize Manual' : 'Expand Manual Guide'}</span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Sliding body content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              {/* Informational columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 mt-4 border-t border-saffron-500/10">
                
                {/* 1. Core Purpose */}
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-saffron-200/40 space-y-2 relative">
                  <div className="flex items-center gap-2 text-saffron-850 font-black text-xs uppercase tracking-wider font-epic">
                    <span className="text-base text-yellow-500">🌅</span>
                    <span>1. What is RamSetu?</span>
                  </div>
                  <p className="text-[11px] text-saffron-950 leading-relaxed font-sans">
                    Inspired by Sugriva's cooperative covenant in the epic Ramayana, RamSetu is an intuitive, premium gaming platform. You participate in celestial trials using <strong className="text-saffron-600">Devotional Coins</strong>.
                  </p>
                  <p className="text-[10px] text-saffron-800 leading-relaxed font-sans italic">
                    💡 Start with 1,000 complimentary coins granted directly from Sage Valmiki's blessing!
                  </p>
                </div>

                {/* 2. Celestial Prediction */}
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-saffron-200/40 space-y-2">
                  <div className="flex items-center gap-2 text-saffron-850 font-black text-xs uppercase tracking-wider font-epic">
                    <Compass className="w-4 h-4 text-saffron-600 animate-spin-slow" />
                    <span>2. Astra Forecast (Color Game)</span>
                  </div>
                  <p className="text-[11px] text-saffron-950 leading-relaxed font-sans">
                    Predict which epic Astra weapon Lord Rama launches each round under the 30-second countdown.
                  </p>
                  <ul className="text-[10px] text-saffron-900 space-y-1 pl-4 list-disc font-sans font-medium">
                    <li><strong className="text-orange-600">Suryastra 🌅 (Gold)</strong>: 2.0x multiplier yield.</li>
                    <li><strong className="text-blue-600">Varunastra 🌊 (Blue)</strong>: 2.0x multiplier yield.</li>
                    <li><strong className="text-yellow-600">Brahmastra 🔱 (Special)</strong>: Rare, paying a massive 5.5x yield!</li>
                  </ul>
                </div>

                {/* 3. Passive Harvesting & Quests */}
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-saffron-200/40 space-y-2">
                  <div className="flex items-center gap-2 text-saffron-850 font-black text-xs uppercase tracking-wider font-epic">
                    <Flame className="w-4 h-4 text-saffron-600" />
                    <span>3. Passive Income & Tasks</span>
                  </div>
                  <p className="text-[11px] text-saffron-950 leading-relaxed font-sans">
                    Don't want to predict? Acquire active **Divine Passes** in the Court. Once equipped, they **generate free gold bullion passively into your wallet every 10 seconds**!
                  </p>
                  <p className="text-[11px] text-saffron-950 leading-relaxed font-sans">
                    You can also play mini-quizzes, clickers, or scribe tasks inside **Kishkindha Quests** to boost your coffers!
                  </p>
                </div>

              </div>

              {/* Onboarding Interactive Beginner Checklist */}
              <div className="mt-5 p-4 bg-gradient-to-r from-saffron-100 to-amber-200/30 rounded-2xl border border-saffron-300/40">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <h4 className="text-xs font-black font-epic text-saffron-950 uppercase tracking-widest flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-yellow-600" />
                    <span>Pilgrim's Initiation: Quick tasks to claim 150 free coins!</span>
                  </h4>
                  <span className="text-[9px] font-mono font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded border border-amber-300">
                    Rewards claimable once
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Task 1 */}
                  <div 
                    onClick={() => handleCompleteStep('readManual')}
                    className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                      checklist.readManual 
                        ? 'bg-emerald-50 border-emerald-300/60 text-emerald-950'
                        : 'bg-white border-saffron-200 hover:border-saffron-400 text-saffron-950 hover:shadow-xs'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono tracking-widest uppercase opacity-75 block">Task #1</span>
                      <span className="text-xs font-bold font-sans">Read how platform works</span>
                    </div>
                    {checklist.readManual ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-xs font-mono font-extrabold text-saffron-600 bg-saffron-100 px-2.5 py-1 rounded-lg shrink-0">
                        Claim +50
                      </span>
                    )}
                  </div>

                  {/* Task 2 */}
                  <div 
                    onClick={() => handleCompleteStep('explorePasses')}
                    className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                      checklist.explorePasses 
                        ? 'bg-emerald-50 border-emerald-300/60 text-emerald-950'
                        : 'bg-white border-saffron-200 hover:border-saffron-400 text-saffron-950 hover:shadow-xs'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono tracking-widest uppercase opacity-75 block">Task #2</span>
                      <span className="text-xs font-bold font-sans">Acknowledge Divine Passes</span>
                    </div>
                    {checklist.explorePasses ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-xs font-mono font-extrabold text-saffron-600 bg-saffron-100 px-2.5 py-1 rounded-lg shrink-0">
                        Claim +50
                      </span>
                    )}
                  </div>

                  {/* Task 3 */}
                  <div 
                    onClick={() => handleCompleteStep('understandStakes')}
                    className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                      checklist.understandStakes 
                        ? 'bg-emerald-50 border-emerald-300/60 text-emerald-950'
                        : 'bg-white border-saffron-200 hover:border-saffron-400 text-saffron-950 hover:shadow-xs'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono tracking-widest uppercase opacity-75 block">Task #3</span>
                      <span className="text-xs font-bold font-sans">Equip holy predictive wisdom</span>
                    </div>
                    {checklist.understandStakes ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-xs font-mono font-extrabold text-saffron-600 bg-saffron-100 px-2.5 py-1 rounded-lg shrink-0">
                        Claim +50
                      </span>
                    )}
                  </div>

                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
export default PilgrimGuide;
