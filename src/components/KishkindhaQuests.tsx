/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Flame, HelpCircle, Eye, RefreshCw, Feather, CheckCircle2, Award, Volume2, Timer } from 'lucide-react';
import { divineSynth } from '../audio';
import { MandalaSVG } from './MandalaSVG';

interface KishkindhaQuestsProps {
  onAwardCoins: (amount: number, description: string) => void;
  questMultiplier: number;
}

export const KishkindhaQuests: React.FC<KishkindhaQuestsProps> = ({
  onAwardCoins,
  questMultiplier,
}) => {
  const [activeMiniGame, setActiveMiniGame] = useState<'setu' | 'sanjeevani' | 'scroll' | 'chalisa' | 'none'>('none');

  // Multiplier-adjusted reward calculator
  const calcReward = (base: number) => Math.round(base * questMultiplier);

  // --- 1. Ram Setu Bridge-Builder State ---
  const [bridgeScore, setBridgeScore] = useState<number>(0);
  const [bridgeStones, setBridgeStones] = useState<number[]>([]);
  const [stonePosition, setStonePosition] = useState<number>(50);
  const [isStoneDirRight, setIsStoneDirRight] = useState<boolean>(true);
  const [isDropActive, setIsDropActive] = useState<boolean>(false);
  const [droppedY, setDroppedY] = useState<number>(0);
  const setuIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (activeMiniGame === 'setu') {
      setuIntervalRef.current = window.setInterval(() => {
        setStonePosition((prev) => {
          if (prev >= 85) {
            setIsStoneDirRight(false);
            return 84;
          }
          if (prev <= 15) {
            setIsStoneDirRight(true);
            return 16;
          }
          return isStoneDirRight ? prev + 4 : prev - 4;
        });
      }, 50);
    } else {
      if (setuIntervalRef.current) {
        clearInterval(setuIntervalRef.current);
      }
    }
    return () => {
      if (setuIntervalRef.current) clearInterval(setuIntervalRef.current);
    };
  }, [activeMiniGame, isStoneDirRight]);

  const handleDropStone = () => {
    if (isDropActive) return;
    divineSynth.playBowTwang();
    setIsDropActive(true);
    setDroppedY(220);

    setTimeout(() => {
      const targetPos = bridgeStones.length > 0 ? bridgeStones[bridgeStones.length - 1] : 50;
      const deviation = Math.abs(stonePosition - targetPos);

      if (deviation <= 16) {
        divineSynth.playTempleBell();
        setBridgeScore((prev) => prev + 1);
        setBridgeStones((prev) => [...prev, stonePosition]);
        
        const baseAward = 30;
        const reward = calcReward(baseAward);
        onAwardCoins(reward, `Aligned Ram Setu bridge stone successfully (+${reward} Bhakti Points 🌸)`);
      } else {
        divineSynth.playBuzzer();
      }
      
      setIsDropActive(false);
      setDroppedY(0);
    }, 600);
  };

  const resetSetu = () => {
    divineSynth.playCelestialChime();
    setBridgeScore(0);
    setBridgeStones([]);
  };

  // --- 2. Sanjeevani Herbal Clicker ---
  const [sanjeevaniScore, setSanjeevaniScore] = useState<number>(0);
  interface HerbNode {
    id: number;
    x: number;
    y: number;
    scale: number;
  }
  const [herbs, setHerbs] = useState<HerbNode[]>([]);
  const clickerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (activeMiniGame === 'sanjeevani') {
      clickerIntervalRef.current = window.setInterval(() => {
        const newHerb: HerbNode = {
          id: Date.now() + Math.random(),
          x: 15 + Math.random() * 70,
          y: -10,
          scale: 0.8 + Math.random() * 0.5
        };
        setHerbs((prev) => [...prev, newHerb]);

        setHerbs((prev) =>
          prev
            .map((h) => ({ ...h, y: h.y + 15 }))
            .filter((h) => h.y < 320)
        );
      }, 700);
    } else {
      if (clickerIntervalRef.current) {
        clearInterval(clickerIntervalRef.current);
      }
      setHerbs([]);
    }
    return () => {
      if (clickerIntervalRef.current) clearInterval(clickerIntervalRef.current);
    };
  }, [activeMiniGame]);

  const handleCatchHerb = (id: number) => {
    divineSynth.playCelestialChime();
    setSanjeevaniScore((prev) => prev + 1);
    setHerbs((prev) => prev.filter((h) => h.id !== id));

    const baseAward = 15;
    const reward = calcReward(baseAward);
    onAwardCoins(reward, `Harvested sacred Sanjeevani leaf (+${reward} Bhakti Points 🌸)`);
  };

  // --- 3. Devotional Scribe Typing Test ---
  const mantras = [
    "श्री राम जय राम जय जय राम",
    "मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम्",
    "रघुपति राघव राजाराम पतित पावन सीताराम",
    "ॐ हनुमते नमः संकट मोचन कृपा निधान",
  ];
  const [currentMantraIndex, setCurrentMantraIndex] = useState(0);
  const [typedInput, setTypedInput] = useState('');
  const [scribeCompleted, setScribeCompleted] = useState(false);

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTypedInput(val);

    const target = mantras[currentMantraIndex];
    if (val.trim() === target.trim()) {
      divineSynth.playVictoryChome();
      setScribeCompleted(true);
      
      const baseAward = 80;
      const reward = calcReward(baseAward);
      onAwardCoins(reward, `Inscribed sacred Vedic mantra with devotion (+${reward} Bhakti Points 🌸)`);

      setTimeout(() => {
        setTypedInput('');
        setScribeCompleted(false);
        setCurrentMantraIndex((prev) => (prev + 1) % mantras.length);
      }, 1500);
    }
  };

  // --- 4. Hanuman Chalisa Meditation Timer ---
  const [meditationSeconds, setMeditationSeconds] = useState(0);
  const [isMeditating, setIsMeditating] = useState(false);
  const meditationIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isMeditating) {
      meditationIntervalRef.current = window.setInterval(() => {
        setMeditationSeconds((prev) => {
          const next = prev + 1;
          if (next % 10 === 0) {
            divineSynth.playTempleBell();
            const reward = calcReward(20);
            onAwardCoins(reward, `10s Hanuman Chalisa meditation blessing (+${reward} Bhakti Points 🌸)`);
          }
          return next;
        });
      }, 1000);
    } else {
      if (meditationIntervalRef.current) {
        clearInterval(meditationIntervalRef.current);
      }
    }
    return () => {
      if (meditationIntervalRef.current) clearInterval(meditationIntervalRef.current);
    };
  }, [isMeditating]);

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-6 mt-2">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1C0E1E] via-[#0D1527] to-[#0A0F1D] rounded-3xl p-6 border-2 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.15)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black font-epic text-amber-200 uppercase tracking-wider">
              Kishkindha Quests • Interactive Deeds
            </h2>
          </div>
          <p className="text-xs text-amber-300/80 font-sans">
            Engage in high-reward devotional mini-quests to build the bridge and amass virtual <strong>Bhakti Points (भक्ति)</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#050811] px-4 py-2 rounded-2xl border border-amber-500/30">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono text-amber-300 font-bold">
            Blessing Multiplier: <strong className="text-emerald-400 text-sm">{questMultiplier}x</strong>
          </span>
        </div>
      </div>

      {/* Mini Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Quest 1: Setu Builder */}
        <div
          onClick={() => { divineSynth.playCelestialChime(); setActiveMiniGame('setu'); }}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            activeMiniGame === 'setu'
              ? 'bg-amber-950/60 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] ring-2 ring-amber-400/40'
              : 'bg-[#0D1527]/90 border-amber-500/30 hover:border-amber-400/70 hover:bg-[#10182E]'
          }`}
        >
          <div className="space-y-2">
            <div className="text-3xl">🧱</div>
            <h3 className="text-sm font-black font-epic text-amber-200">Ram Setu Stone Align</h3>
            <p className="text-[11px] text-amber-100/70 font-sans">
              Precision timing test: drop stones into the floating bridge stack.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs font-mono">
            <span className="text-amber-400">Reward:</span>
            <span className="font-bold text-emerald-400">+{calcReward(30)} Pts / Stone</span>
          </div>
        </div>

        {/* Quest 2: Sanjeevani Clicker */}
        <div
          onClick={() => { divineSynth.playCelestialChime(); setActiveMiniGame('sanjeevani'); }}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            activeMiniGame === 'sanjeevani'
              ? 'bg-amber-950/60 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] ring-2 ring-amber-400/40'
              : 'bg-[#0D1527]/90 border-amber-500/30 hover:border-amber-400/70 hover:bg-[#10182E]'
          }`}
        >
          <div className="space-y-2">
            <div className="text-3xl">🌿</div>
            <h3 className="text-sm font-black font-epic text-amber-200">Sanjeevani Harvest</h3>
            <p className="text-[11px] text-amber-100/70 font-sans">
              Swift reflexes: catch divine healing leaves as they drift from Dronagiri.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs font-mono">
            <span className="text-amber-400">Reward:</span>
            <span className="font-bold text-emerald-400">+{calcReward(15)} Pts / Leaf</span>
          </div>
        </div>

        {/* Quest 3: Vedic Scribe */}
        <div
          onClick={() => { divineSynth.playCelestialChime(); setActiveMiniGame('scroll'); }}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            activeMiniGame === 'scroll'
              ? 'bg-amber-950/60 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] ring-2 ring-amber-400/40'
              : 'bg-[#0D1527]/90 border-amber-500/30 hover:border-amber-400/70 hover:bg-[#10182E]'
          }`}
        >
          <div className="space-y-2">
            <div className="text-3xl">📜</div>
            <h3 className="text-sm font-black font-epic text-amber-200">Scribe of Sacred Mantras</h3>
            <p className="text-[11px] text-amber-100/70 font-sans">
              Demonstrate devotion and focus by typing holy Devanagari verses.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs font-mono">
            <span className="text-amber-400">Reward:</span>
            <span className="font-bold text-emerald-400">+{calcReward(80)} Pts / Mantra</span>
          </div>
        </div>

        {/* Quest 4: Chalisa Meditation */}
        <div
          onClick={() => { divineSynth.playCelestialChime(); setActiveMiniGame('chalisa'); }}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            activeMiniGame === 'chalisa'
              ? 'bg-amber-950/60 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] ring-2 ring-amber-400/40'
              : 'bg-[#0D1527]/90 border-amber-500/30 hover:border-amber-400/70 hover:bg-[#10182E]'
          }`}
        >
          <div className="space-y-2">
            <div className="text-3xl">🕉️</div>
            <h3 className="text-sm font-black font-epic text-amber-200">Chalisa Meditation</h3>
            <p className="text-[11px] text-amber-100/70 font-sans">
              Immerse in silent contemplation with rhythmic temple chimes every 10s.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs font-mono">
            <span className="text-amber-400">Reward:</span>
            <span className="font-bold text-emerald-400">+{calcReward(20)} Pts / 10s</span>
          </div>
        </div>

      </div>

      {/* Active Quest Interactive Play Stage */}
      <div className="bg-gradient-to-b from-[#0D1527] to-[#050811] rounded-3xl p-6 border-2 border-amber-500/40 shadow-[0_0_35px_rgba(245,158,11,0.15)] min-h-[360px] flex flex-col justify-between relative overflow-hidden">
        
        {/* Background Mandala */}
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none translate-x-10 translate-y-10">
          <MandalaSVG size={280} color="#FFD700" />
        </div>

        {activeMiniGame === 'none' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
            <MandalaSVG size={64} className="text-amber-400 animate-spin-slow" />
            <h3 className="text-lg font-black font-epic text-amber-200">Select a Quest from the Grid Above</h3>
            <p className="text-xs text-amber-300/80 max-w-md font-sans">
              Choose from stone alignment, herb harvesting, sacred typing, or meditation to initiate your interactive trial!
            </p>
          </div>
        )}

        {/* 1. Bridge Align Mini Game */}
        {activeMiniGame === 'setu' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧱</span>
                <h4 className="text-sm font-black font-epic text-amber-200 uppercase">Ram Setu Stone Align</h4>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-amber-300">Stones Stacked: <strong>{bridgeScore}</strong></span>
                <button
                  onClick={resetSetu}
                  className="p-1 px-2.5 bg-amber-900/40 hover:bg-amber-800/60 text-amber-200 border border-amber-500/30 rounded-lg text-xs font-mono"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Swaying Stage */}
            <div className="relative h-64 bg-[#050811] rounded-2xl border border-amber-500/30 overflow-hidden flex flex-col justify-between p-4">
              {/* Target Drop Zone */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cyan-950/40 to-transparent border-t border-cyan-500/30 flex items-center justify-center">
                <span className="text-[10px] font-mono text-cyan-300">🌊 Sacred Ocean Alignment Bed</span>
              </div>

              {/* Moving Stone */}
              <div
                className="absolute top-4 w-20 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 border-2 border-amber-300 flex items-center justify-center text-xs font-yatra font-bold text-white shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all duration-75"
                style={{
                  left: `${stonePosition}%`,
                  transform: `translateX(-50%) translateY(${droppedY}px)`,
                }}
              >
                श्री राम
              </div>
            </div>

            <button
              onClick={handleDropStone}
              disabled={isDropActive}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-white font-black text-xs font-mono uppercase tracking-widest rounded-xl shadow-lg cursor-pointer transition-all"
            >
              {isDropActive ? 'Placing Stone...' : '⚡ DROP STONE NOW'}
            </button>
          </div>
        )}

        {/* 2. Sanjeevani Clicker Game */}
        {activeMiniGame === 'sanjeevani' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌿</span>
                <h4 className="text-sm font-black font-epic text-amber-200 uppercase">Sanjeevani Leaf Catcher</h4>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">Caught: {sanjeevaniScore} Leaves</span>
            </div>

            <div className="relative h-64 bg-[#050811] rounded-2xl border border-amber-500/30 overflow-hidden">
              {herbs.map((herb) => (
                <button
                  key={herb.id}
                  onClick={() => handleCatchHerb(herb.id)}
                  style={{
                    left: `${herb.x}%`,
                    top: `${herb.y}px`,
                    transform: `scale(${herb.scale})`,
                  }}
                  className="absolute p-2 bg-emerald-500/20 hover:bg-emerald-400/40 border border-emerald-400 rounded-full cursor-pointer shadow-[0_0_15px_rgba(52,211,153,0.5)] text-2xl transition-transform active:scale-125"
                >
                  🌿
                </button>
              ))}
              {herbs.length === 0 && (
                <div className="h-full flex items-center justify-center text-xs font-mono text-emerald-300/70">
                  Herbal leaves descending from Mount Dronagiri...
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Devotional Scribe */}
        {activeMiniGame === 'scroll' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📜</span>
                <h4 className="text-sm font-black font-epic text-amber-200 uppercase">Scribe of Sacred Mantras</h4>
              </div>
              <span className="text-xs font-mono text-amber-400">Verse #{currentMantraIndex + 1}/{mantras.length}</span>
            </div>

            <div className="p-5 bg-[#050811] rounded-2xl border border-amber-500/30 text-center space-y-4">
              <p className="text-base sm:text-lg font-yatra text-amber-200 tracking-wide select-none">
                "{mantras[currentMantraIndex]}"
              </p>
              
              <input
                type="text"
                value={typedInput}
                onChange={handleTypeChange}
                placeholder="Type the sacred mantra above..."
                className="w-full max-w-lg mx-auto px-4 py-2.5 bg-[#0D1527] border-2 border-amber-500/40 rounded-xl text-center text-amber-100 font-yatra text-base focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
              />

              {scribeCompleted && (
                <div className="text-emerald-400 font-mono font-bold text-xs animate-bounce">
                  ✨ Mantra Inscribed Perfectly! Reward Credited.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. Hanuman Chalisa Meditation */}
        {activeMiniGame === 'chalisa' && (
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3 text-left">
              <div className="flex items-center gap-2">
                <span className="text-xl">🕉️</span>
                <h4 className="text-sm font-black font-epic text-amber-200 uppercase">Hanuman Chalisa Meditation</h4>
              </div>
              <span className="text-xs font-mono text-amber-400">Time: {meditationSeconds}s</span>
            </div>

            <div className="p-8 bg-[#050811] rounded-2xl border border-amber-500/30 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-orange-700 flex items-center justify-center text-4xl shadow-[0_0_25px_rgba(245,158,11,0.5)]">
                <span className={isMeditating ? 'animate-pulse' : ''}>🕉️</span>
              </div>
              <p className="text-xs text-amber-200/80 font-sans max-w-md mx-auto">
                Breathe in rhythm with the celestial chimes. Every 10 seconds of focused contemplation rewards +{calcReward(20)} Bhakti Points.
              </p>

              <button
                onClick={() => { divineSynth.playTempleBell(); setIsMeditating(!isMeditating); }}
                className={`px-8 py-3 rounded-xl font-black text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  isMeditating
                    ? 'bg-rose-900 text-rose-100 border border-rose-500 shadow-md'
                    : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                }`}
              >
                {isMeditating ? 'Pause Meditation' : 'Begin Sacred Meditation'}
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
export default KishkindhaQuests;
