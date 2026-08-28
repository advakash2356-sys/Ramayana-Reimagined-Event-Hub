/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Shield, HelpCircle, History, Sparkles, Volume2, Compass, Zap, Play, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AstraType, BattleResult } from '../types';
import { divineSynth } from '../audio';
import { MandalaSVG } from './MandalaSVG';

interface AstraPredictionProps {
  userCoins: number;
  onUpdateCoins: (amount: number, description: string) => void;
  onAddTransaction: (type: 'bet_place' | 'bet_win', amount: number, desc: string) => void;
}

export const AstraPrediction: React.FC<AstraPredictionProps> = ({
  userCoins,
  onUpdateCoins,
  onAddTransaction,
}) => {
  const [timer, setTimer] = useState<number>(30); // 30-sec round countdown
  const [roundId, setRoundId] = useState<number>(2026101);
  const [gameStatus, setGameStatus] = useState<'betting' | 'drawing' | 'announced'>('betting');
  const [warningText, setWarningText] = useState<string | null>(null);
  
  // Placement State
  const [selectedAstra, setSelectedAstra] = useState<AstraType | null>(null);
  const [betAmount, setBetAmount] = useState<number>(100);
  const [activeBets, setActiveBets] = useState<{ [key in AstraType]?: number }>({});
  
  // Sandbox / Test Flight Mode
  const [sandboxMode, setSandboxMode] = useState<boolean>(false);
  const [sandboxSimulating, setSandboxSimulating] = useState<boolean>(false);
  const [sandboxWinner, setSandboxWinner] = useState<AstraType | null>(null);
  const [sandboxChosenAstra, setSandboxChosenAstra] = useState<AstraType>('suryastra');
  const [sandboxClashPhase, setSandboxClashPhase] = useState<string>('');

  // Past draws lists
  const [drawHistory, setDrawHistory] = useState<BattleResult[]>([
    { roundId: '2026100', winningAstra: 'suryastra', winningNumber: 3, timestamp: Date.now() - 120000, totalPool: 12500 },
    { roundId: '2026099', winningAstra: 'varunastra', winningNumber: 7, timestamp: Date.now() - 240000, totalPool: 18450 },
    { roundId: '2026098', winningAstra: 'brahmastra', winningNumber: 0, timestamp: Date.now() - 360000, totalPool: 45000 },
    { roundId: '2026097', winningAstra: 'suryastra', winningNumber: 5, timestamp: Date.now() - 480000, totalPool: 9800 },
    { roundId: '2026096', winningAstra: 'varunastra', winningNumber: 2, timestamp: Date.now() - 600000, totalPool: 14200 },
  ]);

  // Animated draw banner overlay
  const [drawnWinner, setDrawnWinner] = useState<AstraType | null>(null);
  const [fightText, setFightText] = useState<string>('');

  const timerRef = useRef<number | null>(null);

  // Run countdown loop
  useEffect(() => {
    if (gameStatus !== 'betting') return;

    timerRef.current = window.setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [roundId, gameStatus]);

  useEffect(() => {
    if (timer === 0 && gameStatus === 'betting') {
      if (timerRef.current) clearInterval(timerRef.current);
      triggerDrawSequence();
    }
  }, [timer, gameStatus]);

  const triggerDrawSequence = () => {
    setGameStatus('drawing');
    setSelectedAstra(null);
    divineSynth.playBowTwang();

    const scriptTexts = [
      "Lord Rama draws his golden Kodanda bow...",
      "Ravana summons his dark Lanka Astra shields...",
      "The celestial winds gather over Mount Dronagiri...",
      "An intense explosion flares through the clouds..."
    ];

    let step = 0;
    setFightText(scriptTexts[0]);

    const storyInterval = setInterval(() => {
      step += 1;
      if (step < scriptTexts.length) {
        setFightText(scriptTexts[step]);
        divineSynth.playCelestialChime();
      } else {
        clearInterval(storyInterval);
        resolveRoundDraw();
      }
    }, 1200);
  };

  const resolveRoundDraw = () => {
    // Choose winner random weight: Suryastra 45%, Varunastra 45%, Brahmastra 10%
    const rand = Math.random();
    let winningAstra: AstraType = 'suryastra';
    if (rand > 0.45 && rand <= 0.90) {
      winningAstra = 'varunastra';
    } else if (rand > 0.90) {
      winningAstra = 'brahmastra';
    }

    const luckyNumber = Math.floor(Math.random() * 10);
    setDrawnWinner(winningAstra);
    setGameStatus('announced');
    divineSynth.playTempleBell();

    // Check user forecast pledge winnings
    const userBetOnWinner = activeBets[winningAstra] || 0;
    if (userBetOnWinner > 0) {
      // Multiply
      const multiplier = winningAstra === 'brahmastra' ? 5.5 : 2;
      const earnings = Math.round(userBetOnWinner * multiplier);
      
      setTimeout(() => {
        divineSynth.playVictoryChome();
        onUpdateCoins(earnings, `Triumphant forecast on ${winningAstra.toUpperCase()} (+${earnings} Bhakti Points 🌸)`);
        onAddTransaction('bet_win', earnings, `Round #${roundId} prediction win on ${winningAstra.toUpperCase()}`);
      }, 500);
    } else {
      setTimeout(() => {
        divineSynth.playBuzzer();
      }, 500);
    }

    // append history
    const result: BattleResult = {
      roundId: roundId.toString(),
      winningAstra,
      winningNumber: luckyNumber,
      timestamp: Date.now(),
      totalPool: 15400 + Math.floor(Math.random() * 30000)
    };
    setDrawHistory((prev) => [result, ...prev]);

    // Cleanup and reset next round after 5 seconds overlay
    setTimeout(() => {
      setActiveBets({});
      setRoundId((prev) => prev + 1);
      setTimer(30);
      setDrawnWinner(null);
      setGameStatus('betting');
    }, 5500);
  };

  const handlePlaceBet = (astra: AstraType) => {
    if (gameStatus !== 'betting') return;
    if (userCoins < betAmount) {
      divineSynth.playBuzzer();
      setWarningText("Your Bhakti Point balance is insufficient. Complete Quests or invoke blessings first!");
      setTimeout(() => setWarningText(null), 4000);
      return;
    }

    divineSynth.playBowTwang();
    
    // Deduct Bhakti points
    onUpdateCoins(-betAmount, `Forecast pledge placed on ${astra.toUpperCase()} (-${betAmount} Bhakti Points 🌸)`);
    onAddTransaction('bet_place', betAmount, `Pledged forecast offering on ${astra.toUpperCase()} for Round #${roundId}`);

    // Update active pledges state
    setActiveBets((prev) => ({
      ...prev,
      [astra]: (prev[astra] || 0) + betAmount
    }));
  };

  // Trigger Instant Sandbox Test Flight Simulation
  const handleRunSandboxClash = () => {
    if (sandboxSimulating) return;
    setSandboxSimulating(true);
    setSandboxWinner(null);
    divineSynth.playBowTwang();

    const phases = [
      "⚔️ Invocations initiated: Aligning celestial vectors...",
      "🌌 Suryastra solar flare clashing with Varunastra tidal storm...",
      "🔱 Cosmic Brahmastra resonance sweeping the battlefield...",
      "✨ Resolution emerging from the sacred aether!"
    ];

    let pIndex = 0;
    setSandboxClashPhase(phases[0]);

    const interval = setInterval(() => {
      pIndex += 1;
      if (pIndex < phases.length) {
        setSandboxClashPhase(phases[pIndex]);
        divineSynth.playCelestialChime();
      } else {
        clearInterval(interval);
        // Random sandbox outcome
        const r = Math.random();
        const outcome: AstraType = r < 0.45 ? 'suryastra' : r < 0.9 ? 'varunastra' : 'brahmastra';
        setSandboxWinner(outcome);
        setSandboxSimulating(false);
        if (outcome === sandboxChosenAstra) {
          divineSynth.playVictoryChome();
        } else {
          divineSynth.playTempleBell();
        }
      }
    }, 900);
  };

  // Preset chips selection values
  const chipsList = [10, 50, 100, 500, 1000];

  // Circular timer progress calculation (30s max)
  const timerRadius = 38;
  const timerCircumference = 2 * Math.PI * timerRadius;
  const timerStrokeDashoffset = timerCircumference - (timer / 30) * timerCircumference;
  
  // Timer color shifting
  const timerColor = timer > 15 
    ? '#00E5FF' // Cyan
    : timer > 5 
    ? '#FFD700' // Gold
    : '#FF3366'; // Ruby Alert

  return (
    <div className="max-w-6xl mx-auto px-4 mt-2 space-y-6">
      
      {/* Sandbox Toggle & Zero-Monetary Legal Notice Header */}
      <div className="bg-[#0D1527]/90 border border-amber-500/30 rounded-2xl p-4 shadow-[0_0_25px_rgba(245,158,11,0.1)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-white shadow-md">
            <Compass className="w-5 h-5 animate-spin-slow text-cyan-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black font-epic text-amber-200 uppercase tracking-wider">
                Astra Forecast Arena
              </h3>
              <span className="text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                Round #{roundId}
              </span>
            </div>
            <p className="text-[11px] text-amber-100/70 font-sans">
              Predict the celestial weapon strike every 30 seconds using virtual <strong>Bhakti Points (भक्ति)</strong>.
            </p>
          </div>
        </div>

        {/* Sandbox Test Flight Toggle Button */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => { divineSynth.playCelestialChime(); setSandboxMode(!sandboxMode); }}
            className={`px-4 py-2 rounded-xl text-xs font-black font-mono uppercase tracking-wider border transition-all flex items-center gap-2 cursor-pointer ${
              sandboxMode 
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.4)]' 
                : 'bg-[#050811] text-amber-300 border-amber-500/40 hover:border-amber-400 hover:text-white'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${sandboxMode ? 'text-yellow-300 animate-bounce' : 'text-amber-400'}`} />
            <span>{sandboxMode ? '🔮 Sandbox: Active' : '🔮 Test Flight Sandbox'}</span>
          </button>
        </div>
      </div>

      {/* Warning Notification */}
      <AnimatePresence>
        {warningText && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs font-mono text-red-200 flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{warningText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Sandbox Modal / Drawer when enabled */}
      <AnimatePresence>
        {sandboxMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#0F172A] border-2 border-cyan-500/50 rounded-3xl p-5 shadow-[0_0_30px_rgba(0,229,255,0.2)] relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔮</span>
                <div>
                  <h4 className="text-sm font-black font-epic text-cyan-200 uppercase tracking-wider">
                    Interactive Sandbox • Zero-Cost Simulator
                  </h4>
                  <p className="text-[11px] text-cyan-100/70">
                    Test the Astra Clash algorithm risk-free. No Bhakti Points deducted!
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                SANDBOX_ENVIRONMENT_LIVE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Select simulated astra */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold block">
                  Select Simulated Prediction
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { divineSynth.playCelestialChime(); setSandboxChosenAstra('suryastra'); }}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold font-epic transition-all cursor-pointer ${
                      sandboxChosenAstra === 'suryastra'
                        ? 'bg-amber-500/30 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                        : 'bg-black/40 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    🌅 Suryastra
                  </button>
                  <button
                    onClick={() => { divineSynth.playCelestialChime(); setSandboxChosenAstra('varunastra'); }}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold font-epic transition-all cursor-pointer ${
                      sandboxChosenAstra === 'varunastra'
                        ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                        : 'bg-black/40 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    🌊 Varunastra
                  </button>
                  <button
                    onClick={() => { divineSynth.playCelestialChime(); setSandboxChosenAstra('brahmastra'); }}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold font-epic transition-all cursor-pointer ${
                      sandboxChosenAstra === 'brahmastra'
                        ? 'bg-purple-500/30 border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                        : 'bg-black/40 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    🔱 Brahmastra
                  </button>
                </div>
              </div>

              {/* Clash Canvas visual */}
              <div className="bg-black/60 border border-cyan-500/30 rounded-2xl p-4 min-h-[90px] flex flex-col items-center justify-center text-center relative overflow-hidden">
                {sandboxSimulating ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 bg-amber-400 rounded-full animate-ping" />
                      <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-ping" />
                    </div>
                    <p className="text-[11px] font-mono text-cyan-200 font-semibold">{sandboxClashPhase}</p>
                  </div>
                ) : sandboxWinner ? (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Clash Victor Result</span>
                    <h5 className="text-base font-black font-epic text-amber-300">
                      {sandboxWinner === 'suryastra' ? '🌅 Suryastra Victorious' :
                       sandboxWinner === 'varunastra' ? '🌊 Varunastra Victorious' :
                       '🔱 Cosmic Brahmastra Unleashed!'}
                    </h5>
                    <p className="text-[11px] font-mono font-bold">
                      {sandboxWinner === sandboxChosenAstra ? (
                        <span className="text-emerald-400">✨ Predicted Correctly! (+{sandboxWinner === 'brahmastra' ? '5.5x' : '2.0x'} Simulated Yield)</span>
                      ) : (
                        <span className="text-amber-400/80">Try another simulated flight!</span>
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs text-cyan-200/80 font-sans">Ready for live simulated vector resolution.</p>
                    <span className="text-[10px] text-cyan-400 font-mono">Select a weapon and click Simulate.</span>
                  </div>
                )}
              </div>

              {/* Action button */}
              <div>
                <button
                  onClick={handleRunSandboxClash}
                  disabled={sandboxSimulating}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 text-cyan-200" />
                  <span>{sandboxSimulating ? 'Clashing Vectors...' : 'Trigger Simulated Clash'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Prediction Arena Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        
        {/* Left 2 Columns: Live Forecast Arena */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Live Countdown & Visual Battle Stage Card */}
          <div className="bg-gradient-to-b from-[#0D1527] via-[#10182E] to-[#0A0F1D] rounded-3xl p-6 border-2 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden">
            
            {/* Background Mandala Watermark */}
            <div className="absolute right-0 top-0 opacity-5 pointer-events-none translate-x-12 -translate-y-12">
              <MandalaSVG size={280} color="#FFD700" />
            </div>

            {/* Top Stage Bar */}
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/30">
                  ROUND #{roundId}
                </span>
                <span className="text-[11px] text-amber-100/70 font-sans">
                  Status: <strong className="text-amber-300 uppercase">{gameStatus}</strong>
                </span>
              </div>

              {/* Dynamic Circular SVG Timer Ring */}
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r={timerRadius}
                      stroke="rgba(245, 158, 11, 0.15)"
                      strokeWidth="5"
                      fill="transparent"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r={timerRadius}
                      stroke={timerColor}
                      strokeWidth="5"
                      strokeDasharray={timerCircumference}
                      strokeDashoffset={timerStrokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <span className={`absolute text-base font-black font-mono ${timer <= 5 ? 'text-rose-400 animate-ping' : 'text-amber-200'}`}>
                    {timer}s
                  </span>
                </div>
              </div>
            </div>

            {/* Arena Visualizer Stage */}
            <div className="relative min-h-[190px] bg-[#050811] rounded-2xl border border-amber-500/30 p-6 flex flex-col items-center justify-center text-center overflow-hidden shadow-inner">
              
              <AnimatePresence mode="wait">
                {gameStatus === 'drawing' ? (
                  <motion.div
                    key="drawing"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="space-y-3 z-10"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <motion.span
                        animate={{ rotate: [0, 180, 360] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="text-3xl"
                      >
                        🏹
                      </motion.span>
                      <span className="text-2xl animate-pulse">⚡</span>
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="text-3xl"
                      >
                        🔱
                      </motion.span>
                    </div>
                    <p className="text-sm font-sans font-bold text-amber-200 animate-pulse">
                      {fightText}
                    </p>
                    <div className="w-48 mx-auto bg-amber-950/60 rounded-full h-1.5 overflow-hidden border border-amber-500/30">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 4.8, ease: "easeInOut" }}
                        className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-300"
                      />
                    </div>
                  </motion.div>
                ) : gameStatus === 'announced' ? (
                  <motion.div
                    key="announced"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2 z-10"
                  >
                    <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-widest">
                      Victor Element Declared
                    </span>
                    <h3 className="text-3xl font-black font-epic text-amber-200 flex items-center justify-center gap-2">
                      <span>{drawnWinner === 'suryastra' ? '🌅 Suryastra (Sun Flare)' : drawnWinner === 'varunastra' ? '🌊 Varunastra (Ocean Surge)' : '🔱 Brahmastra (Cosmic Trident)'}</span>
                    </h3>
                    <p className="text-xs text-amber-100/80 font-sans">
                      {activeBets[drawnWinner!] ? (
                        <span className="text-emerald-400 font-bold">✨ Devotional blessing successfully multiplied!</span>
                      ) : (
                        <span>Next cosmic round beginning shortly...</span>
                      )}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="betting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2 z-10"
                  >
                    <div className="flex items-center justify-center gap-2 text-amber-400">
                      <Sparkles className="w-4 h-4 animate-spin-slow" />
                      <span className="text-xs font-mono font-bold uppercase tracking-widest">
                        Pledge Invocations Open
                      </span>
                      <Sparkles className="w-4 h-4 animate-spin-slow" />
                    </div>
                    <p className="text-sm font-sans font-medium text-amber-100/90 max-w-md">
                      Pledge your Bhakti Points on the destined Astra. Kodanda arrows release at 0s!
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-1 text-[11px] font-mono text-amber-300/80">
                      <span>🌅 Suryastra: 2.0x</span>
                      <span>•</span>
                      <span>🌊 Varunastra: 2.0x</span>
                      <span>•</span>
                      <span>🔱 Brahmastra: 5.5x</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Weapon Selection Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              
              {/* Suryastra Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePlaceBet('suryastra')}
                className={`p-4.5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                  activeBets.suryastra
                    ? 'bg-amber-950/60 border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                    : 'bg-[#050811]/90 border-amber-500/30 hover:border-amber-400/70 hover:bg-[#0D1527]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🌅</span>
                  <span className="text-[10px] font-mono font-black text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                    2.0x MULTIPLIER
                  </span>
                </div>
                <h4 className="text-base font-black font-epic text-amber-200">Suryastra</h4>
                <p className="text-[11px] text-amber-100/70 font-sans mt-0.5">Solar radiance bow of King Surya.</p>
                
                {activeBets.suryastra && (
                  <div className="mt-3 pt-2 border-t border-amber-500/30 flex items-center justify-between text-[11px] font-mono text-amber-300 font-bold">
                    <span>Pledged:</span>
                    <span>🌸 {activeBets.suryastra} Pts</span>
                  </div>
                )}
              </motion.div>

              {/* Varunastra Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePlaceBet('varunastra')}
                className={`p-4.5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                  activeBets.varunastra
                    ? 'bg-blue-950/60 border-cyan-400 ring-2 ring-cyan-400/50 shadow-[0_0_20px_rgba(0,229,255,0.3)]'
                    : 'bg-[#050811]/90 border-cyan-500/30 hover:border-cyan-400/70 hover:bg-[#0D1527]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🌊</span>
                  <span className="text-[10px] font-mono font-black text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    2.0x MULTIPLIER
                  </span>
                </div>
                <h4 className="text-base font-black font-epic text-cyan-200">Varunastra</h4>
                <p className="text-[11px] text-cyan-100/70 font-sans mt-0.5">Tidal storm arrow of Ocean Deity.</p>
                
                {activeBets.varunastra && (
                  <div className="mt-3 pt-2 border-t border-cyan-500/30 flex items-center justify-between text-[11px] font-mono text-cyan-300 font-bold">
                    <span>Pledged:</span>
                    <span>🌸 {activeBets.varunastra} Pts</span>
                  </div>
                )}
              </motion.div>

              {/* Brahmastra Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePlaceBet('brahmastra')}
                className={`p-4.5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                  activeBets.brahmastra
                    ? 'bg-purple-950/60 border-purple-400 ring-2 ring-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                    : 'bg-[#050811]/90 border-purple-500/30 hover:border-purple-400/70 hover:bg-[#0D1527]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🔱</span>
                  <span className="text-[10px] font-mono font-black text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">
                    5.5x MULTIPLIER
                  </span>
                </div>
                <h4 className="text-base font-black font-epic text-purple-200">Brahmastra</h4>
                <p className="text-[11px] text-purple-100/70 font-sans mt-0.5">Supreme cosmic creation lance.</p>
                
                {activeBets.brahmastra && (
                  <div className="mt-3 pt-2 border-t border-purple-500/30 flex items-center justify-between text-[11px] font-mono text-purple-300 font-bold">
                    <span>Pledged:</span>
                    <span>🌸 {activeBets.brahmastra} Pts</span>
                  </div>
                )}
              </motion.div>

            </div>

            {/* Chip Selection Toolbar */}
            <div className="mt-6 pt-4 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-mono text-amber-300/80 uppercase font-semibold">
                Pledge Chip Amount:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {chipsList.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => { divineSynth.playCelestialChime(); setBetAmount(chip); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      betAmount === chip
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-[0_0_10px_rgba(245,158,11,0.4)] border border-amber-300'
                        : 'bg-[#050811] text-amber-200/80 hover:text-white border border-amber-500/20'
                    }`}
                  >
                    🌸 {chip}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Past Draws & Audit History */}
        <div className="space-y-4">
          <div className="bg-[#0D1527]/90 rounded-3xl p-5 border-2 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)] flex flex-col max-h-[500px]">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3 mb-3">
              <h4 className="text-xs font-black font-epic uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
                <History className="w-4 h-4 text-amber-400" />
                <span>Celestial History Ledger</span>
              </h4>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified</span>
              </span>
            </div>

            <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
              {drawHistory.map((item) => (
                <div
                  key={item.roundId}
                  className="bg-[#050811] p-3 rounded-xl border border-amber-500/20 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-slate-400 block">Round #{item.roundId}</span>
                    <span className="font-epic font-bold text-amber-200 flex items-center gap-1">
                      {item.winningAstra === 'suryastra' ? '🌅 Suryastra' : item.winningAstra === 'varunastra' ? '🌊 Varunastra' : '🔱 Brahmastra'}
                    </span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-amber-400 block">Offerings Pool</span>
                    <span className="text-xs font-bold text-amber-100">🌸 {item.totalPool.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Zero monetary legal notice footer in sidebar */}
            <div className="mt-4 pt-3 border-t border-amber-500/20 text-[10px] text-amber-300/70 font-sans leading-tight">
              ⚠️ In-game devotional simulator only. Bhakti Points cannot be exchanged for cash.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
export default AstraPrediction;
