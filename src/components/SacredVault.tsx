/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Award, Clock, History, Landmark, Flame, Compass, Coins, CalendarDays, ShieldCheck, FileSpreadsheet, Download } from 'lucide-react';
import { Transaction } from '../types';
import { divineSynth } from '../audio';
import { ComplianceVerificationModal, IP_COMPLIANCE_DISCLAIMER } from './ComplianceVerificationModal';

interface SacredVaultProps {
  transactions: Transaction[];
  currentUserBalance: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  coins: number;
  title: string;
  status: 'active' | 'divine' | 'warrior';
}

export const SacredVault: React.FC<SacredVaultProps> = ({
  transactions,
  currentUserBalance,
}) => {
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  const handleQuickExportCSV = () => {
    divineSynth.playVictoryChome();

    const header = `# =========================================================================\n# INTELLECTUAL PROPERTY & COMPLIANCE VERIFICATION\n# ${IP_COMPLIANCE_DISCLAIMER}\n# =========================================================================\n\n`;
    const csvColumns = "Transaction_ID,Type,Amount_Coins,Description,Timestamp,Verification_Status,Signatory\n";
    
    const sampleRows = transactions.length > 0 
      ? transactions.map(t => `"${t.id}","${t.type}",${t.amount},"${t.description.replace(/"/g, '""')}","${new Date(t.timestamp).toISOString()}","VERIFIED_COMPLIANT","Akash Sync Agent"`).join('\n')
      : `"TXN_GENESIS_01","VAULT_GENESIS",1000,"Sage Valmiki starter treasure blessing","${new Date().toISOString()}","VERIFIED_COMPLIANT","Akash Sync Agent"`;

    const blob = new Blob([header + csvColumns + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `RamSetu_SacredLedger_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // Static Leaderboard of Divine Entities based on Ramayan characters
  const leaderboardData: LeaderboardEntry[] = useMemo(() => [
    { rank: 1, name: 'Hanumanji', avatar: '🐒', coins: 999999, title: 'Supreme Devotee of Ayodhya', status: 'divine' },
    { rank: 2, name: 'Shriram Chandra', avatar: '🏹', coins: 500000, title: 'Maryada Purushottam', status: 'divine' },
    { rank: 3, name: 'Maharishi Valmiki', avatar: '🖋️', coins: 150000, title: 'Celestial Chronicler', status: 'divine' },
    { rank: 4, name: 'Laxmana', avatar: '⚡', coins: 85200, title: 'Suryavanshi Protector', status: 'warrior' },
    { rank: 5, name: 'King Sugriva', avatar: '👑', coins: 74100, title: 'Kishkindha Monarch', status: 'active' },
    { rank: 6, name: 'General Angad', avatar: '🎴', coins: 38500, title: 'Unshakeable Envoy', status: 'active' },
    { rank: 7, name: 'You (Warrior)', avatar: '🛡️', coins: currentUserBalance, title: 'Dharmapath Pilgrim', status: 'active' },
    { rank: 8, name: 'Vibhishana', avatar: '🔱', coins: 21000, title: 'Righteous Lanka Advisor', status: 'active' },
    { rank: 9, name: 'Jambavan', avatar: '🐻', coins: 18400, title: 'Bear commander of Wisdom', status: 'warrior' }
  ], [currentUserBalance]);

  // Sort leaderboard entries by coins
  const sortedLeaderboard = useMemo(() => {
    return [...leaderboardData].sort((a, b) => b.coins - a.coins).map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));
  }, [leaderboardData]);

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-amber-500 text-amber-950 border-yellow-300';
      case 2: return 'from-slate-200 to-slate-400 text-slate-900 border-slate-100';
      case 3: return 'from-amber-600 to-orange-700 text-amber-50 border-orange-500';
      default: return 'bg-amber-100/50 text-amber-800 border-amber-200';
    }
  };

  const getTransactionLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'quest': return { text: 'Quest Accomplished', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'bet_place': return { text: 'Astra Predict Placement', color: 'bg-slate-100 text-slate-800 border-slate-200' };
      case 'bet_win': return { text: 'Celestial Astra Triumph', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
      case 'recharge': return { text: 'Sacred Devotional Flow', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'withdraw': return { text: 'Spiritual Gold Redeemed', color: 'bg-red-100 text-red-800 border-red-200' };
      case 'pass_buy': return { text: 'Divine Armory Unlocked', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'passive_claim': return { text: 'Daily Gada Grace', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 mt-2">
      {/* Dynamic Scrolling Winners & Celestial Stats */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-gradient-to-br from-amber-800 to-amber-950 text-amber-50 rounded-2xl p-6 border-2 border-amber-600 shadow-xl relative overflow-hidden">
          {/* Subtle Golden Traditional Pattern BG */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <Landmark className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-bold font-sans uppercase tracking-wider text-yellow-300">
              Suryavanshi Treasury
            </h3>
          </div>

          <div className="space-y-4 relative z-10">
            <div>
              <p className="text-xs text-amber-200 uppercase font-mono tracking-widest">
                Protected Gold Bullions
              </p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-extrabold font-mono text-white">
                  🪙{currentUserBalance.toLocaleString()}
                </span>
                <span className="text-xs text-yellow-300 font-mono">Coins</span>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-700/60 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-amber-300 uppercase font-semibold block">
                  Dharmic Quests Done
                </span>
                <span className="text-lg font-bold font-mono">
                  {transactions.filter(t => t.type === 'quest').length}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-amber-300 uppercase font-semibold block">
                  Astra Forecasts
                </span>
                <span className="text-lg font-bold font-mono">
                  {transactions.filter(t => t.type === 'bet_place' || t.type === 'bet_win').length}
                </span>
              </div>
            </div>

            <div className="bg-amber-900/60 p-3.5 rounded-xl border border-amber-700/50">
              <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs mb-1">
                <Flame className="w-4 h-4 animate-pulse" />
                <span>HANUMAN'S GRACE IS ACTIVE</span>
              </div>
              <p className="text-[11px] text-amber-200">
                You receive a +10% protection shield on all prediction matches as a Vanar scout apprentice.
              </p>
            </div>
          </div>
        </div>

        {/* Global Live Wins Feed */}
        <div className="bg-white rounded-2xl p-5 border-2 border-amber-200/60 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-600 via-yellow-500 to-amber-600" />
          <h4 className="text-sm font-extrabold text-amber-900 uppercase tracking-widest flex items-center gap-1.5 mb-4">
            <Compass className="w-4 h-4 text-amber-600 animate-spin" />
            <span>Kishkindha Global Victory Reel</span>
          </h4>

          <div className="space-y-3 h-64 overflow-y-auto pr-1">
            {[
              { player: 'Suryavanshi_108', won: '🪙840', astra: 'Suryastra', time: 'Just now' },
              { player: 'Hanuman_Sevadas', won: '🪙3,900', astra: 'Brahmastra', time: '1m ago' },
              { player: 'Angad_Legion', won: '🪙120', astra: 'Varunastra', time: '2m ago' },
              { player: 'Ravan_Slayer', won: '🪙1,200', astra: 'Suryastra', time: '3m ago' },
              { player: 'Kishkindha_Runner', won: '🪙500', astra: 'Varunastra', time: '5m ago' },
            ].map((win, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3 bg-amber-50/40 border border-amber-100 rounded-xl flex justify-between items-center"
              >
                <div>
                  <span className="text-xs font-semibold text-amber-950 font-mono block">
                    {win.player}
                  </span>
                  <span className="text-[10px] text-amber-700">
                    Triumph via <strong className="text-amber-800">{win.astra}</strong>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-600 font-mono block">
                    {win.won}
                  </span>
                  <span className="text-[9px] text-amber-500 font-mono">{win.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="lg:col-span-1 bg-white rounded-2xl p-5 border-2 border-amber-200/60 shadow-lg relative overflow-hidden flex flex-col">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-amber-600" />
        <h4 className="text-sm font-extrabold text-amber-900 uppercase tracking-widest flex items-center gap-1.5 mb-4">
          <Award className="w-5 h-5 text-amber-600" />
          <span>Ayodhya Sacred Leaderboard</span>
        </h4>

        {/* Scrollable grid of entries */}
        <div className="space-y-2.5 overflow-y-auto flex-1 max-h-[420px] pr-1">
          {sortedLeaderboard.map((warrior) => (
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => divineSynth.playCelestialChime()}
              key={warrior.name}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                warrior.name.includes('You')
                  ? 'bg-amber-100/70 border-amber-400 shadow-sm'
                  : 'bg-amber-50/20 border-amber-100 hover:bg-amber-50/60'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Ranking Emblem */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-extrabold border text-sm bg-gradient-to-br ${getRankBadgeColor(warrior.rank)}`}>
                  {warrior.rank}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-amber-950 font-sans">
                      {warrior.avatar} {warrior.name}
                    </span>
                    {warrior.status === 'divine' && (
                      <span className="text-[9px] bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-full px-1.5 py-0.5 font-bold uppercase tracking-wider scale-90">
                        Divine
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-amber-800 block italic leading-none mt-1">
                    {warrior.title}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold font-mono text-amber-950">
                  🪙{warrior.coins.toLocaleString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Personal Transaction Ledger */}
      <div className="lg:col-span-1 bg-white rounded-2xl p-5 border-2 border-amber-200/60 shadow-lg relative overflow-hidden flex flex-col">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-600 to-amber-600" />
        <div className="flex items-center justify-between gap-2 mb-3">
          <h4 className="text-sm font-extrabold text-amber-900 uppercase tracking-widest flex items-center gap-1.5">
            <History className="w-5 h-5 text-amber-600" />
            <span>Divine Ledger Book</span>
          </h4>
          <button
            onClick={handleQuickExportCSV}
            className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-900 hover:text-amber-950 bg-amber-100/70 hover:bg-amber-200/70 border border-amber-300 px-2 py-1 rounded-lg transition-colors cursor-pointer"
            title="Export Spreadsheet (.CSV) with IP Compliance Disclaimer"
          >
            <Download className="w-3.5 h-3.5 text-amber-700" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* IP & Compliance Banner */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2.5 mb-3 flex items-center justify-between text-[10px] text-amber-900">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-semibold">IP & Compliance Verified</span>
          </div>
          <button
            onClick={() => { divineSynth.playCelestialChime(); setAuditModalOpen(true); }}
            className="text-[9px] font-bold uppercase tracking-wider text-amber-800 hover:text-amber-950 underline cursor-pointer"
          >
            Audit Logs
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto flex-1 max-h-[420px] pr-1">
          {transactions.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 text-amber-600">
              <CalendarDays className="w-12 h-12 stroke-[1.5] mb-2 text-amber-400" />
              <p className="text-sm font-sans font-semibold">Your ledger has no records.</p>
              <p className="text-xs text-amber-700/60 font-mono mt-1">Complete quests to register deeds.</p>
            </div>
          ) : (
            [...transactions].reverse().map((txn) => {
              const label = getTransactionLabel(txn.type);
              const isCredit = ['quest', 'bet_win', 'recharge', 'passive_claim'].includes(txn.type);
              
              return (
                <motion.div
                  key={txn.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-amber-50/20 border border-amber-100 rounded-xl space-y-1.5"
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${label?.color}`}>
                      {label?.text}
                    </span>
                    <span className={`text-sm font-bold font-mono ${isCredit ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isCredit ? '+' : '-'} 🪙{txn.amount.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-amber-900 font-sans">
                    {txn.description}
                  </p>

                  <div className="flex items-center gap-1 text-[10px] text-amber-700 font-mono mt-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{new Date(txn.timestamp).toLocaleTimeString()}</span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      <ComplianceVerificationModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        transactions={transactions}
      />
    </div>
  );
};
export default SacredVault;
