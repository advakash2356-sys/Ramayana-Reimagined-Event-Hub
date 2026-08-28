/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Landmark, Flame, Compass, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, BookOpen, User, HelpCircle, Briefcase, Award } from 'lucide-react';
import { MandalaSVG } from './MandalaSVG';
import { divineSynth } from '../audio';

interface WalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: 'court' | 'prediction' | 'quests' | 'alliance' | 'vault') => void;
  onRewardCoins: (amount: number, description: string) => void;
}

export const WalkthroughModal: React.FC<WalkthroughModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onRewardCoins,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    {
      title: "Welcome to RamSetu!",
      concept: "Gamified Devotional Quest Platform",
      description: "RamSetu is a fun, immersive platform where you participate in the legendary story of the Ramayana. Your goal is to gather Devotional Coins to help build the sacred path across the ocean and establish victory!",
      icon: <MandalaSVG size={100} className="text-yellow-400 animate-spin-slow drop-shadow" />,
      bullets: [
        { label: "1. Start Your Journey", text: "You begin with a 1,000 complimentary coin blessing from Sage Valmiki's vault." },
        { label: "2. Grow Your Wealth", text: "Multiply your gold coins through active predictions, holy quests, or passive harvesting." },
        { label: "3. Expand Your Alliance", text: "Invite virtual Vanara allies to earn instant coin rewards and recruit a supreme army!" }
      ],
      color: "from-saffron-500 via-orange-500 to-amber-700",
      highlightTab: null,
    },
    {
      title: "Explore the 'Ayodhya Court' 🏛️",
      concept: "Your Identity & Passive Wealth Arsenal",
      description: "The Ayodhya Court is where you manage your path. You can customize your avatar and spend coins to equip legendary Divine weapons (Passes).",
      icon: <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-saffron-500 to-amber-600 flex items-center justify-center text-white border-2 border-white shadow-lg animate-bounce">
        <Landmark className="w-8 h-8" />
      </div>,
      bullets: [
        { label: "Equip Holy Avatar Badging", text: "Swap between Shriram, Bajrangi (Hanuman), or Laxman to stand out in active screens." },
        { label: "Earn Passive Gold Bullions", text: "Equipped passes automatically harvest and credit gold into your wallet every 10 seconds!" },
        { label: "Reward Multipliers", text: "Divine passes automatically boost any coins won in active quests by up to 3.50x." }
      ],
      color: "from-amber-600 via-orange-600 to-red-600",
      highlightTab: 'court' as const,
    },
    {
      title: "The 'Astra Forecast' Arena 🏹",
      concept: "Predict the Strike to Multiply Coins",
      description: "Put your focus to the test inside the high-stakes predictive weapon arena. Every 30 seconds, Lord Rama fires a celestial strike under a global timer.",
      icon: <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white border-2 border-white shadow-lg relative">
        <Compass className="w-8 h-8 animate-spin-slow text-yellow-300" />
      </div>,
      bullets: [
        { label: "How to Participate", text: "Tap a chip amount from the screen and select which element will win the strike." },
        { label: "Suryastra 🌅 / Varunastra 🌊", text: "The classic gold and water elements yield an instant 2x payout of your predicted stake." },
        { label: "Brahmastra 🔱 (Special)", text: "The rare cosmic element yields a massive 5.5x payload reward on correct forecasts!" }
      ],
      color: "from-sky-600 via-indigo-600 to-blue-800",
      highlightTab: 'prediction' as const,
    },
    {
      title: "Conquer 'Kishkindha Quests' 🔥",
      concept: "Active Interactive Clicker & Typing Games",
      description: "Jump, click, and write to secure instant gold rewards in active play! This tab lets you play simple, high-reward games to quickly fill your treasury.",
      icon: <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center text-white border-2 border-white shadow-lg animate-pulse">
        <Flame className="w-8 h-8 text-yellow-105" />
      </div>,
      bullets: [
        { label: "Align Bricks (Timing test)", text: "Tap precisely when the indicator lands in the sacred green zone to lay a stone!" },
        { label: "Sanjeevani herbal Clicker", text: "Click as fast as possible to catch shifting herbal assets before they disappear." },
        { label: "Scribe Devotion (Typing)", text: "Demonstrate quick typing precision by recreating the holy mantras shown on screen." }
      ],
      color: "from-red-600 via-rose-600 to-saffron-700",
      highlightTab: 'quests' as const,
    }
  ];

  if (!isOpen) return null;

  const step = steps[currentStep];

  const handleNext = () => {
    divineSynth.playCelestialChime();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Auto-switch to the relevant tab in the background to show the user where it is!
      if (steps[currentStep + 1].highlightTab) {
        onSelectTab(steps[currentStep + 1].highlightTab!);
      }
    } else {
      // Complete walkthrough, offer introductory blessing!
      onRewardCoins(100, "Sage Valmiki's Walkthrough Initiation Blessing (+100 🪙)");
      divineSynth.playTempleBell();
      onClose();
    }
  };

  const handlePrev = () => {
    divineSynth.playCelestialChime();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      if (steps[currentStep - 1].highlightTab) {
        onSelectTab(steps[currentStep - 1].highlightTab!);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Darkened visual backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl w-full max-w-2xl border-4 border-amber-400 shadow-2xl relative overflow-hidden z-10 flex flex-col md:flex-row md:h-[450px]"
      >
        {/* Left column: Epic Saffron Artwork Banner with revolving Mandala */}
        <div className={`md:w-2/5 bg-gradient-to-b ${step.color} p-6 flex flex-col justify-between items-center text-white relative text-center`}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:16px_16px]" />
          
          <div className="absolute -left-10 -bottom-10 opacity-10 pointer-events-none">
            <MandalaSVG size={180} color="#ffffff" />
          </div>

          <div className="relative z-10 py-1 flex items-center justify-center flex-col gap-1">
            <span className="text-[10px] tracking-widest font-mono uppercase bg-red-600/60 border border-red-500 px-3 py-1 rounded-full font-bold">
              Step {currentStep + 1} of {steps.length}
            </span>
            <h4 className="text-sm font-yatra mt-2.5 text-yellow-200">
              रामसेतु
            </h4>
          </div>

          {/* Icon visual slot */}
          <div className="my-auto relative z-10 py-4">
            {step.icon}
          </div>

          <div className="relative z-10 space-y-1">
            <span className="text-[10px] uppercase font-mono block text-amber-200">Current Arena Context</span>
            <span className="text-xs font-bold leading-tight block text-white/90">
              {step.concept}
            </span>
          </div>
        </div>

        {/* Right column: Detailed walkthrough instructions & bullets */}
        <div className="p-6 md:w-3/5 flex flex-col justify-between space-y-5 bg-stone-50">
          
          <div className="space-y-4">
            {/* Header row */}
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="text-lg font-black font-epic text-saffron-950 leading-tight">
                  {step.title}
                </h3>
                <span className="text-[9px] uppercase font-mono bg-saffron-100/80 text-saffron-800 border border-saffron-200 px-2.5 py-0.5 rounded mt-1.5 inline-block font-extrabold tracking-wide">
                  💡 Idiot-Free Explanation
                </span>
              </div>
              
              <button 
                onClick={onClose}
                className="text-stone-400 hover:text-stone-600 transition-colors text-sm font-mono p-1 border border-stone-200 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                Skip ✕
              </button>
            </div>

            {/* Core description text */}
            <p className="text-xs text-stone-700 leading-relaxed font-sans font-medium">
              {step.description}
            </p>

            {/* Action bullets with badges */}
            <div className="space-y-2 pt-2 border-t border-stone-200">
              {step.bullets.map((b, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <div className="mt-1 bg-saffron-100 text-saffron-800 p-0.5 rounded-full shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[11px] leading-tight font-sans">
                    <strong className="text-stone-900 block font-bold">{b.label}</strong>
                    <span className="text-stone-600">{b.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom navigation buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-200/60">
            {currentStep > 0 ? (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 text-slate-600 hover:text-slate-950 text-xs font-black font-sans uppercase tracking-wider cursor-pointer py-1.5 px-3 rounded-lg hover:bg-stone-200 transition-all border border-stone-200 bg-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 bg-gradient-to-r from-saffron-600 to-amber-500 hover:from-saffron-700 hover:to-amber-600 text-white text-xs font-black font-sans uppercase tracking-widest cursor-pointer px-5 py-2.5 rounded-xl shadow-md active:scale-95 transition-all"
            >
              <span>{currentStep === steps.length - 1 ? "Complete & Claim Blessing" : "Next Step"}</span>
              {currentStep === steps.length - 1 ? (
                <Award className="w-4 h-4 text-yellow-300 animate-spin-slow" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>

        </div>

      </motion.div>
    </div>
  );
};

export default WalkthroughModal;