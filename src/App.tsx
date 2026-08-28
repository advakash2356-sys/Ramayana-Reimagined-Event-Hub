/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Landmark,
  Compass,
  Flame,
  Shield,
  HelpCircle,
  Trophy,
  Volume2,
  VolumeX,
  Coins,
  History,
  Coins as WalletIcon,
  ChevronRight,
  Sparkles,
  Award,
  LogIn,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';

import { UserProfile, DivinePass, Transaction, AllianceMember } from './types';
import { divineSynth } from './audio';
import { MandalaSVG } from './components/MandalaSVG';
import { PilgrimGuide } from './components/PilgrimGuide';
import { WalkthroughModal } from './components/WalkthroughModal';
import { AuthModal } from './components/AuthModal';
import { ComplianceVerificationModal, IP_COMPLIANCE_DISCLAIMER } from './components/ComplianceVerificationModal';

// Dynamic sub-modules
import AyodhyaCourt from './components/AyodhyaCourt';
import AstraPrediction from './components/AstraPrediction';
import KishkindhaQuests from './components/KishkindhaQuests';
import SugrivaAlliance from './components/SugrivaAlliance';
import SacredVault from './components/SacredVault';
import UpiRecharge from './components/UpiRecharge';

export default function App() {
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'court' | 'prediction' | 'quests' | 'alliance' | 'vault'>('court');
  const [rechargeModalOpen, setRechargeModalOpen] = useState<boolean>(false);
  const [passiveFlowText, setPassiveFlowText] = useState<string>('');
  const [walkthroughOpen, setWalkthroughOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [complianceModalOpen, setComplianceModalOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('ramsetu_is_logged_in') === 'true';
  });

  // Trigger modal on first load if not seen
  useEffect(() => {
    const hasSeen = localStorage.getItem('ramsetu_walkthrough_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setWalkthroughOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  // Initial user setup
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const savedName = localStorage.getItem('ramsetu_username') || 'Dharma_Seeker';
    const savedCoins = localStorage.getItem('ramsetu_coins');
    return {
      username: savedName,
      avatar: 'hanuman',
      title: 'Vanar Scout',
      coins: savedCoins ? parseInt(savedCoins, 10) : 1000, // starting wealth gift from Sage Valmiki
      gems: 5,
      activePassId: null,
      experience: 25,
      level: 1,
    };
  });

  // Keep coins in localStorage for easy demo persistence!
  useEffect(() => {
    localStorage.setItem('ramsetu_coins', userProfile.coins.toString());
  }, [userProfile.coins]);

  // Dynamic alliance list
  const [allianceMembers, setAllianceMembers] = useState<AllianceMember[]>([
    { id: '1', name: 'Nila_Commander', contribution: 150, rank: 'Vanar Scout', joinedAt: '2026-06-20' },
    { id: '2', name: 'Nala_Architect', contribution: 150, rank: 'Bridge Commander', joinedAt: '2026-06-22' }
  ]);

  // Transaction Ledger records
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'tx_init',
      type: 'quest',
      amount: 1000,
      description: 'Blessings of Sage Valmiki: initiation starting capital granted',
      timestamp: Date.now() - 3600000
    }
  ]);

  // Referral / Join invitation code
  const referralCode = 'RAM-SETU-COVENANT-777';

  // Configured Divine Passes
  const passes: DivinePass[] = [
    {
      id: 'pass_gada',
      name: "Hanuman's Golden Gada Pass",
      tier: 'scout',
      cost: 150,
      multiplier: 1.25,
      passiveRate: 5,
      description: "Harness the kinetic power and dedication of Bajrang Bali.",
      benefits: [
        "Increases daily quest rewards by 1.25",
        "Generates +5 coins passively every 10 seconds",
        "Unlocks special SanjeevaniClicker swift speeds",
      ]
    },
    {
      id: 'pass_how',
      name: "Laxman's Lightning Bow Pass",
      tier: 'guardian',
      cost: 500,
      multiplier: 1.5,
      passiveRate: 15,
      description: "Guard the battlegrounds with unshakeable courage and swift archer skills.",
      benefits: [
        "Boosts quest winnings by 1.50x",
        "Harvests +15 coins passively every 10 seconds",
        "Unlocks exclusive warrior badging in global logs",
      ]
    },
    {
      id: 'pass_kodanda',
      name: "Lord Rama's Kodanda Pass",
      tier: 'emperor',
      cost: 1000,
      multiplier: 2.0,
      passiveRate: 40,
      description: "Walk the path of supreme righteousness with Shriram's ultimate bow.",
      benefits: [
        "Unlocks massive 2.00x quest multipliers on all deeds",
        "Generates +40 coins passively every 10 seconds",
        "Shields 10% of prediction stakes from loss during draws",
      ]
    },
    {
      id: 'pass_throne',
      name: "Dasanan Ravana Pass",
      tier: 'overlord',
      cost: 2500,
      multiplier: 3.5,
      passiveRate: 120,
      description: "Reclaim the absolute material wealth representing the pristine gold architecture of Lanka.",
      benefits: [
        "Increases all daily deeds outputs by 3.50x",
        "Gathers +120 coins passively every 10 seconds",
        "Unlocks high-stakes Brahmastra prediction arenas",
      ]
    }
  ];

  // Sound toggler wrapper
  const handleToggleSound = () => {
    const isNowEnabled = divineSynth.toggle();
    setSoundOn(isNowEnabled);
    if (isNowEnabled) {
      divineSynth.playTempleBell();
    }
  };

  // Upgrades pass state
  const handlePurchasePass = (passId: string, cost: number) => {
    if (userProfile.coins < cost) {
      divineSynth.playBuzzer();
      return;
    }

    const boughtPass = passes.find(p => p.id === passId);
    if (!boughtPass) return;

    setUserProfile((prev) => ({
      ...prev,
      coins: prev.coins - cost,
      activePassId: passId,
      experience: prev.experience + 50,
      level: prev.experience + 50 >= 100 ? prev.level + 1 : prev.level
    }));

    const newTx: Transaction = {
      id: `tx_buy_${Date.now()}`,
      type: 'pass_buy',
      amount: cost,
      description: `Bought ${boughtPass.name} holding multiplier of ${boughtPass.multiplier}x`,
      timestamp: Date.now()
    };
    setTransactions((prev) => [...prev, newTx]);
    divineSynth.playTempleBell();
  };

  // Avatar and Title switching
  const handleSetAvatar = (avatarValue: string, titleName: string) => {
    setUserProfile((prev) => ({
      ...prev,
      avatar: avatarValue,
      title: titleName
    }));
  };

  // Coin updating mechanism for sub-components
  const handleUpdateCoins = (amount: number, description: string) => {
    setUserProfile((prev) => {
      const nextCoins = Math.max(0, prev.coins + amount);
      const nextXp = amount > 0 ? prev.experience + 10 : prev.experience;
      return {
        ...prev,
        coins: nextCoins,
        experience: nextXp,
        level: nextXp >= 100 ? prev.level + Math.floor(nextXp / 100) : prev.level,
        experienceProgress: nextXp % 100
      };
    });
  };

  // Adding transaction ledger entries
  const handleAddTransaction = (
    type: Transaction['type'],
    amount: number,
    description: string
  ) => {
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type,
      amount,
      description,
      timestamp: Date.now()
    };
    setTransactions((prev) => [...prev, newTx]);
  };

  // Enlisting referred members
  const handleAddMember = (member: AllianceMember) => {
    setAllianceMembers((prev) => [member, ...prev]);
    // Alliance commission direct credit
    handleUpdateCoins(member.contribution, `Recruitment commissions of ${member.name} (+${member.contribution} 🪙)`);
    handleAddTransaction('quest', member.contribution, `Recruited virtual alliance ally ${member.name}`);
  };

  // Simulated Recharge (plus)
  const handleRechargeCoins = (amount: number) => {
    handleUpdateCoins(amount, `Deposited offerings into the Celestial Vault (+${amount} 🪙)`);
    handleAddTransaction('recharge', amount, `Recharged/Deposited sacred offerings into Treasury`);
  };

  // Simulated Withdrawal (minus)
  const handleWithdrawCoins = (amount: number): boolean => {
    if (userProfile.coins < amount) {
      return false;
    }
    handleUpdateCoins(-amount, `Withdrew Gold bullions to personal temple realm (-${amount} 🪙)`);
    handleAddTransaction('withdraw', amount, `Withdrew/Dispatched gold bullions via Vanar Couriers`);
    return true;
  };

  // Handle successful login or registration
  const handleAuthSuccess = (username: string, email: string) => {
    localStorage.setItem('ramsetu_username', username);
    localStorage.setItem('ramsetu_is_logged_in', 'true');
    setIsLoggedIn(true);

    setUserProfile((prev) => {
      // Award premium enlisting bonus of 100 coins
      const bonus = 100;
      const nextCoins = prev.coins + bonus;
      return {
        ...prev,
        username,
        coins: nextCoins,
      };
    });

    handleAddTransaction('quest', 100, `Sacred enlisting welcome bounty credited to ${username}`);
    setPassiveFlowText(`🕉️ Auth Synced! Welcome to RamSetu, ${username}`);
    setTimeout(() => setPassiveFlowText(''), 4000);
  };

  // Log Out / purge credentials
  const handleLogout = () => {
    localStorage.removeItem('ramsetu_username');
    localStorage.removeItem('ramsetu_is_logged_in');
    setIsLoggedIn(false);
    setUserProfile((prev) => ({
      ...prev,
      username: 'Dharma_Seeker',
    }));
    setPassiveFlowText(`🚩 Logout successful. Disengaged vessel connection.`);
    setTimeout(() => setPassiveFlowText(''), 4000);
  };

  // Passive Gold generation routine based on current active passes
  useEffect(() => {
    const passiveInterval = setInterval(() => {
      if (!userProfile.activePassId) return;
      const activePass = passes.find(p => p.id === userProfile.activePassId);
      if (!activePass || activePass.passiveRate <= 0) return;

      const rate = activePass.passiveRate;
      
      // Credit passive coinage
      setUserProfile((prev) => ({
        ...prev,
        coins: prev.coins + rate
      }));

      // Trigger floating overlay text notify
      setPassiveFlowText(`+🪙${rate} Passive harvest from ${activePass.name.split(' ')[1]}`);
      setTimeout(() => setPassiveFlowText(''), 3000);
    }, 10000); // ticks every 10 seconds

    return () => clearInterval(passiveInterval);
  }, [userProfile.activePassId]);

  const activePass = passes.find(p => p.id === userProfile.activePassId);
  const questMultiplier = activePass ? activePass.multiplier : 1.0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans select-none pb-6">
      
      {/* Floating alert for passive gold harvesting ticks */}
      <AnimatePresence>
        {passiveFlowText && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 py-3 px-5 bg-gradient-to-r from-yellow-500 to-amber-600 border border-yellow-400 text-white text-xs font-mono font-black rounded-full shadow-2xl flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" />
            <span>{passiveFlowText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Celestial Banner Menu Header */}
      <header className="bg-gradient-to-r from-saffron-700 via-saffron-600 to-saffron-800 text-white shadow-xl relative overflow-hidden border-b-4 border-amber-400">
        {/* Sacred Slowly Rotating Background Mandalas */}
        <div className="absolute -right-16 -top-16 opacity-15 pointer-events-none animate-spin-slow">
          <MandalaSVG size={260} color="#FFD700" />
        </div>
        <div className="absolute -left-12 -bottom-12 opacity-10 pointer-events-none">
          <MandalaSVG size={180} color="#FFD700" />
        </div>
        
        {/* Subtle Devanagari holy graphics background pattern */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
        
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-center relative z-10 gap-3">
          
          {/* Logo Name & Concept */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center">
              <MandalaSVG size={54} className="animate-spin-slow text-yellow-300 drop-shadow-md" />
              <span className="absolute text-2xl filter drop-shadow font-yatra select-none text-yellow-300">राम</span>
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                <h1 className="text-2xl font-black tracking-tight font-epic bg-gradient-to-r from-yellow-300 via-white to-yellow-250 bg-clip-text text-transparent">
                  RamSetu
                </h1>
                <span className="text-[10px] bg-red-600 font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-red-500 shadow-sm font-sans shrink-0">
                  The Professional Bridge
                </span>
              </div>
              <p className="text-[10px] text-amber-100 font-mono italic tracking-wide mt-0.5">
                Connecting Devotion, Alliances & Milestones • "यतो धर्मस्ततो जयः" 🔱
              </p>
            </div>
          </div>

          {/* Wallet counter and Control bar */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap justify-end w-full sm:w-auto">
            
            {/* Wallet summary button */}
            <button
              onClick={() => { divineSynth.playTempleBell(); setRechargeModalOpen(true); }}
              className="flex items-center gap-2.5 sm:gap-3 bg-saffron-950/50 hover:bg-saffron-950/70 border-2 border-amber-400/40 px-3.5 sm:px-4.5 py-1.5 sm:py-2 rounded-2xl transition-all shadow-md cursor-pointer group"
            >
              <div className="relative">
                <WalletIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 text-[8px] bg-red-600 text-white rounded-full w-2.5 h-2.5 flex items-center justify-center animate-ping" />
              </div>
              <div className="text-left font-mono leading-none">
                <span className="text-[9px] text-amber-200 block font-semibold mb-0.5">VAULT TREASURY</span>
                <span className="text-sm sm:text-base font-black text-yellow-300 filter drop-shadow">🪙{userProfile.coins.toLocaleString()}</span>
              </div>
            </button>

            {/* Walkthrough manually triggered */}
            <button
              onClick={() => { divineSynth.playCelestialChime(); setWalkthroughOpen(true); }}
              className="p-2 sm:p-3 bg-saffron-950/40 hover:bg-saffron-950/60 border border-amber-400/20 rounded-xl transition-all text-amber-100 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
              title="Launch Platform Guide Walkthrough"
            >
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-200 animate-pulse" />
              <span className="hidden md:inline text-[10px] font-black uppercase tracking-wider font-mono">Walkthrough</span>
            </button>

            {/* IP & Compliance Verification Badge Button */}
            <button
              onClick={() => { divineSynth.playCelestialChime(); setComplianceModalOpen(true); }}
              className="p-2 sm:p-3 bg-saffron-950/40 hover:bg-saffron-950/60 border border-emerald-400/40 hover:border-emerald-400/70 rounded-xl transition-all text-emerald-200 hover:text-emerald-100 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              title="Intellectual Property & Compliance Verification Audit"
            >
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
              <span className="hidden xl:inline text-[10px] font-black uppercase tracking-wider font-mono">IP Verified</span>
            </button>

            {/* Audio Toggle bell */}
            <button
              onClick={handleToggleSound}
              className="p-2 sm:p-3 bg-saffron-950/40 hover:bg-saffron-950/60 border border-amber-400/20 rounded-xl transition-all text-amber-100 hover:text-white cursor-pointer"
              title="Toggle Celestial Sound Effects"
            >
              {soundOn ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 opacity-75" />}
            </button>

            {/* Account Pilgrim Authentication Section */}
            {!isLoggedIn ? (
              <button
                onClick={() => { divineSynth.playCelestialChime(); setAuthModalOpen(true); }}
                className="flex items-center gap-1.5 px-3.5 py-2 sm:py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest border border-amber-400/50 shadow-md cursor-pointer transition-all animate-pulse"
                title="Authenticate Pilgrim Vessel"
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-200" />
                <span>Sign In</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-saffron-950/50 border-2 border-amber-400/40 rounded-xl p-1 sm:p-1.5 max-h-[46px]">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 text-saffron-950 flex items-center justify-center font-black text-xs sm:text-sm shadow-sm select-none">
                  {userProfile.username.substring(0, 2).toUpperCase()}
                </div>
                <div className="hidden lg:flex flex-col text-left font-mono pl-0.5 leading-none">
                  <span className="text-white font-black text-[10px] sm:text-[11px] truncate max-w-[80px]">{userProfile.username}</span>
                  <span className="text-amber-200 text-[8px] uppercase tracking-wider font-semibold opacity-90 mt-0.5">Lv.{userProfile.level} {userProfile.title.split(' ')[0]}</span>
                </div>
                <button
                  onClick={() => { divineSynth.playCelestialChime(); handleLogout(); }}
                  className="p-1 sm:p-1.5 hover:bg-red-950/50 text-red-100 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                  title="Logout Vessel"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Tab Navigation links */}
        <div className="max-w-7xl mx-auto px-4 border-t border-saffron-500/20 bg-saffron-850/20">
          <nav className="flex justify-start items-center gap-1.5 overflow-x-auto py-1 pr-1">
            {[
              { id: 'court', title: "Ayodhya Court", icon: <Landmark className="w-4 h-4" /> },
              { id: 'prediction', title: "Astra Forecast", icon: <Compass className="w-4 h-4 animate-spin-slow" /> },
              { id: 'quests', title: "Kishkindha Quests", icon: <Flame className="w-4 h-4 text-orange-200" /> },
              { id: 'alliance', title: "Sugriva Alliance", icon: <Shield className="w-4 h-4" /> },
              { id: 'vault', title: "Lanka Ledger", icon: <History className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { divineSynth.playTempleBell(); setActiveTab(tab.id as any); }}
                className={`flex items-center gap-2 py-3 px-4.5 text-xs uppercase tracking-wider font-extrabold transition-all border-b-2 font-sans ${
                  activeTab === tab.id
                    ? 'border-white text-white bg-amber-800/40 rounded-t-lg'
                    : 'border-transparent text-amber-150 hover:text-white hover:bg-amber-800/15'
                }`}
              >
                {tab.icon}
                <span>{tab.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Interactive how-it-works onboarding guide */}
      <PilgrimGuide 
        userCoins={userProfile.coins}
        activePassId={userProfile.activePassId}
        onRewardCoins={(amount, description) => {
          handleUpdateCoins(amount, description);
          handleAddTransaction('quest', amount, description);
        }}
      />

      {/* Main Dashboard Panel workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full py-6 pr-1 pl-1">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {activeTab === 'court' && (
              <AyodhyaCourt
                userProfile={userProfile}
                passes={passes}
                onPurchasePass={handlePurchasePass}
                onSetAvatar={handleSetAvatar}
              />
            )}

            {activeTab === 'prediction' && (
              <AstraPrediction
                userCoins={userProfile.coins}
                onUpdateCoins={handleUpdateCoins}
                onAddTransaction={handleAddTransaction}
              />
            )}

            {activeTab === 'quests' && (
              <KishkindhaQuests
                onAwardCoins={handleUpdateCoins}
                questMultiplier={questMultiplier}
              />
            )}

            {activeTab === 'alliance' && (
              <SugrivaAlliance
                allianceMembers={allianceMembers}
                onAddMember={handleAddMember}
                referralCode={referralCode}
              />
            )}

            {activeTab === 'vault' && (
              <SacredVault
                transactions={transactions}
                currentUserBalance={userProfile.coins}
              />
            )}
          </motion.div>
        </AnimatePresence>

      </main>

      {/* Persistent Indian Scripture Quote footer & IP Compliance */}
      <footer className="text-center py-8 text-xs text-saffron-800 font-mono opacity-90 space-y-4 max-w-2xl mx-auto border-t border-saffron-200/50 mt-8 relative px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4">
          <MandalaSVG size={36} color="#ff8c00" className="animate-spin-slow" />
        </div>
        <p className="font-yatra text-lg tracking-wider text-saffron-700 font-bold">"यतो धर्मस्ततो जयः" 🔱</p>
        <p className="font-sans leading-relaxed text-saffron-900 font-medium">Where there is Righteousness, there has to be complete Victory.</p>
        
        {/* Intellectual Property & Compliance Verification Banner */}
        <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 text-left shadow-xs space-y-2">
          <div className="flex items-center justify-between gap-2 border-b border-amber-200/70 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase font-epic text-saffron-950">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Intellectual Property & Compliance Verification</span>
            </div>
            <button
              onClick={() => { divineSynth.playCelestialChime(); setComplianceModalOpen(true); }}
              className="text-[10px] font-bold text-saffron-900 hover:text-saffron-950 bg-amber-200/60 hover:bg-amber-300/60 px-2.5 py-1 rounded-lg transition-colors border border-amber-300 cursor-pointer"
            >
              Deep Inspector Audit
            </button>
          </div>
          <p className="text-[11px] font-sans text-amber-950 leading-relaxed italic">
            "{IP_COMPLIANCE_DISCLAIMER}"
          </p>
        </div>

        <p className="text-[10px] opacity-75 pt-1">Verified Celestial Node v2.0.0 • RamSetu Protection Covenant • Protected under Ayodhya Shield</p>
      </footer>

      {/* Interactive Modals */}
      <AnimatePresence>
        {rechargeModalOpen && (
          <UpiRecharge
            onClose={() => setRechargeModalOpen(false)}
            onAddCoins={handleRechargeCoins}
            onWithdrawCoins={handleWithdrawCoins}
            currentBalance={userProfile.coins}
          />
        )}

        {walkthroughOpen && (
          <WalkthroughModal
            isOpen={walkthroughOpen}
            onClose={() => {
              divineSynth.playTempleBell();
              setWalkthroughOpen(false);
              localStorage.setItem('ramsetu_walkthrough_seen', 'true');
            }}
            onSelectTab={(tabId) => setActiveTab(tabId)}
            onRewardCoins={(amount, description) => {
              handleUpdateCoins(amount, description);
              handleAddTransaction('quest', amount, description);
            }}
          />
        )}

        {authModalOpen && (
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {complianceModalOpen && (
          <ComplianceVerificationModal
            isOpen={complianceModalOpen}
            onClose={() => setComplianceModalOpen(false)}
            transactions={transactions}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
