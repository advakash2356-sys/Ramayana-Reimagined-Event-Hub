/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, UserPlus, Gift, Copy, Check, ShieldCheck, Flame, Network } from 'lucide-react';
import { AllianceMember } from '../types';
import { divineSynth } from '../audio';

interface SugrivaAllianceProps {
  allianceMembers: AllianceMember[];
  onAddMember: (member: AllianceMember) => void;
  referralCode: string;
}

export const SugrivaAlliance: React.FC<SugrivaAllianceProps> = ({
  allianceMembers,
  onAddMember,
  referralCode,
}) => {
  const [copied, setCopied] = useState(false);
  const [invitedName, setInvitedName] = useState('');

  const handleCopyCode = () => {
    divineSynth.playCelestialChime();
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSimulateInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitedName.trim()) return;

    divineSynth.playTempleBell();
    
    const newMember: AllianceMember = {
      id: Math.random().toString(36).substring(7),
      name: invitedName,
      contribution: 150, // standard welcome coins
      rank: 'Vanar Warrior',
      joinedAt: new Date().toLocaleDateString()
    };

    onAddMember(newMember);
    setInvitedName('');
    divineSynth.playVictoryChome();
  };

  const totalCommission = allianceMembers.reduce((sum, member) => sum + member.contribution, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-6 mt-2">
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
        {/* Abstract design elements representation of burning fire of friendship */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold font-mono tracking-widest uppercase">
              <Flame className="w-3.5 h-3.5 text-yellow-300 animate-bounce" />
              <span>The Sugriva Covenant</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black font-sans tracking-tight">
              Forge Alliances, Amass Divine Coins!
            </h2>
            <p className="text-sm text-amber-50 leading-relaxed font-medium">
              Join hands under the sacred pact of Shriram and King Sugriva. Summon your friends into your brigade, and as they progress on their pilgrim walks, gain celestial commissions directly into your vault!
            </p>

            {/* Quick stats columns */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="bg-white/15 p-3 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] text-amber-200 font-mono uppercase block">Total Allies</span>
                <span className="text-xl font-bold font-mono">{allianceMembers.length} Warriors</span>
              </div>
              <div className="bg-white/15 p-3 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] text-amber-200 font-mono uppercase block">Covenant Gold</span>
                <span className="text-xl font-bold font-mono">🪙{totalCommission}</span>
              </div>
              <div className="bg-white/15 p-3 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] text-amber-200 font-mono uppercase block">Bonus Multiplier</span>
                <span className="text-xl font-bold font-mono">+{allianceMembers.length * 2}% Boost</span>
              </div>
            </div>
          </div>

          {/* Invitation code display card */}
          <div className="bg-amber-50 text-amber-950 p-6 rounded-2xl shadow-xl space-y-4 border-2 border-amber-300">
            <h3 className="text-base font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Gift className="w-5 h-5 text-amber-600" />
              <span>Your Covenant Invite</span>
            </h3>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-amber-800 font-semibold block mb-1">
                  Alliance Summoning Code
                </span>
                <div className="flex bg-amber-100 rounded-xl p-3 border border-amber-200/80 justify-between items-center">
                  <span className="font-mono font-bold text-lg text-amber-900 tracking-wider">
                    {referralCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Form to mock recruit */}
              <form onSubmit={handleSimulateInvite} className="pt-2 border-t border-amber-200 space-y-2">
                <span className="text-xs text-amber-800 font-semibold block">
                  Enlist Virtual Warrior (Mock Simulation)
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter Ally Name (e.g. Angada)"
                    value={invitedName}
                    onChange={(e) => setInvitedName(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans text-amber-900"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center gap-1 font-bold text-xs"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Enlist</span>
                  </button>
                </div>
                <p className="text-[10px] text-amber-700 font-mono leading-tight">
                  *Fires an immediate recruitment code and credits 🪙150 directly into your shared alliance budget.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Alliance Hierarchy list */}
      <div className="bg-white rounded-2xl p-6 border-2 border-amber-100 shadow-lg">
        <h3 className="text-base font-extrabold text-amber-950 uppercase tracking-wider flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-amber-600" />
          <span>Active Brigade Cohort ({allianceMembers.length})</span>
        </h3>

        {allianceMembers.length === 0 ? (
          <div className="text-center py-12 text-amber-700/60 font-medium">
            <Network className="w-10 h-10 stroke-[1.25] mx-auto text-amber-400 mb-2" />
            <p className="text-sm font-sans">No allies have reported to your base camp yet.</p>
            <p className="text-xs font-mono mt-1">Use the Recruiter form above to summon virtual commanders!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-sans">
              <thead>
                <tr className="border-b border-amber-100 text-amber-900 font-bold">
                  <th className="pb-3 pl-2">Ally Name</th>
                  <th className="pb-3 text-center">Enlist Rank</th>
                  <th className="pb-3 text-right">Alliance Commission</th>
                  <th className="pb-3 pr-2 text-right">Reporting Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-50/50">
                <AnimatePresence>
                  {allianceMembers.map((member, idx) => (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-amber-50/30 transition-all font-medium text-amber-950"
                    >
                      <td className="py-3 pl-2 flex items-center gap-2">
                        <span className="text-lg">🏕️</span>
                        <span className="font-semibold text-amber-900">{member.name}</span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-[10px] uppercase font-mono font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-amber-800">
                          {member.rank}
                        </span>
                      </td>
                      <td className="py-3 text-right text-emerald-600 font-mono font-bold">
                        +🪙{member.contribution}
                      </td>
                      <td className="py-3 pr-2 text-right text-xs font-mono text-amber-600">
                        {member.joinedAt}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 p-3 bg-amber-50/40 rounded-xl border border-amber-200/40 mt-4 text-[11px] text-amber-800 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Every direct ally brings 🪙150, and 10% of all their predictive wins rolls upwards to you securely.</span>
        </div>
      </div>
    </div>
  );
};
export default SugrivaAlliance;
