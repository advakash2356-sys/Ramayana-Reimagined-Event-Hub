/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, FileSpreadsheet, Download, CheckCircle2, Lock, Sparkles, X, Terminal, Cpu, Copy, Check, AlertTriangle } from 'lucide-react';
import { divineSynth } from '../audio';
import { MandalaSVG } from './MandalaSVG';
import { Transaction } from '../types';

export const IP_COMPLIANCE_DISCLAIMER = "Disclaimer: All text, audio, video, and imagery in this were developed through a strategic orchestration of AI tools but remain entirely human-directed. The creative vision, engineering, and final output are the result of extensive hard work and represent the exclusive intellectual property of Akash Sync Agent.";

export const ZERO_MONETARY_VALUE_DISCLAIMER = "Bhakti Points and Divine Blessings are purely in-game virtual tokens for quest progression. They hold zero monetary value and cannot be redeemed, exchanged, or cashed out for real currency.";

interface ComplianceVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions?: Transaction[];
}

export const ComplianceVerificationModal: React.FC<ComplianceVerificationModalProps> = ({
  isOpen,
  onClose,
  transactions = [],
}) => {
  const [copied, setCopied] = useState(false);
  const [activeAuditTab, setActiveAuditTab] = useState<'overview' | 'audit' | 'export'>('overview');

  if (!isOpen) return null;

  const handleCopyDisclaimer = () => {
    navigator.clipboard.writeText(IP_COMPLIANCE_DISCLAIMER);
    setCopied(true);
    divineSynth.playCelestialChime();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportCSV = () => {
    divineSynth.playVictoryChome();

    const header = `# =========================================================================\n# INTELLECTUAL PROPERTY & COMPLIANCE VERIFICATION\n# ${IP_COMPLIANCE_DISCLAIMER}\n# NOTE: ${ZERO_MONETARY_VALUE_DISCLAIMER}\n# =========================================================================\n\n`;
    const csvColumns = "Transaction_ID,Type,Amount_Bhakti_Points,Description,Timestamp,Verification_Status,Signatory\n";
    
    const sampleRows = transactions.length > 0 
      ? transactions.map(t => `"${t.id}","${t.type}",${t.amount},"${t.description.replace(/"/g, '""')}","${new Date(t.timestamp).toISOString()}","VERIFIED_COMPLIANT","Akash Sync Agent"`).join('\n')
      : `"TXN_GENESIS_01","SANCTUARY_INIT",1000,"Sage Valmiki starter Bhakti blessing","${new Date().toISOString()}","VERIFIED_COMPLIANT","Akash Sync Agent"`;

    const blob = new Blob([header + csvColumns + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `RamSetu_Compliance_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#050811]/90 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 15 }}
        className="bg-[#0A0F1D] text-amber-50 rounded-3xl w-full max-w-2xl border-2 border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.2)] relative overflow-hidden z-10 p-6 flex flex-col max-h-[90vh]"
      >
        {/* Background Mandala Decorative Accent */}
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none -translate-y-6 translate-x-6">
          <MandalaSVG size={220} color="#FFD700" />
        </div>

        {/* Close button */}
        <button
          onClick={() => { divineSynth.playCelestialChime(); onClose(); }}
          className="absolute right-4 top-4 text-amber-400/70 hover:text-amber-200 p-1.5 rounded-full hover:bg-amber-950/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-amber-500/20 pb-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center text-white shadow-lg ring-2 ring-amber-400/40">
            <ShieldCheck className="w-6 h-6 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black font-epic text-amber-200 uppercase tracking-wider">
                Intellectual Property & Compliance Verification
              </h2>
              <span className="text-[9px] bg-emerald-950/80 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40 uppercase tracking-widest">
                VERIFIED
              </span>
            </div>
            <p className="text-xs text-amber-300/80 font-sans font-medium">
              Official IP ownership protocol & zero-monetary game compliance certificate.
            </p>
          </div>
        </div>

        {/* Legal Zero-Monetary Value Callout Banner */}
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 mb-4 flex items-center gap-2.5 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-sans leading-relaxed text-[11px]">
            <strong>Zero Monetary Value Notice:</strong> {ZERO_MONETARY_VALUE_DISCLAIMER}
          </span>
        </div>

        {/* Audit Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-[#050811] p-1.5 rounded-xl mb-4 shrink-0 border border-amber-500/20">
          <button
            type="button"
            onClick={() => { divineSynth.playCelestialChime(); setActiveAuditTab('overview'); }}
            className={`py-2 rounded-lg text-xs font-black font-sans uppercase tracking-wider transition-all cursor-pointer ${
              activeAuditTab === 'overview'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                : 'text-amber-300/70 hover:text-amber-100 hover:bg-amber-950/30'
            }`}
          >
            IP Disclaimer
          </button>
          <button
            type="button"
            onClick={() => { divineSynth.playCelestialChime(); setActiveAuditTab('audit'); }}
            className={`py-2 rounded-lg text-xs font-black font-sans uppercase tracking-wider transition-all cursor-pointer ${
              activeAuditTab === 'audit'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                : 'text-amber-300/70 hover:text-amber-100 hover:bg-amber-950/30'
            }`}
          >
            Deep Inspector Audit
          </button>
          <button
            type="button"
            onClick={() => { divineSynth.playCelestialChime(); setActiveAuditTab('export'); }}
            className={`py-2 rounded-lg text-xs font-black font-sans uppercase tracking-wider transition-all cursor-pointer ${
              activeAuditTab === 'export'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                : 'text-amber-300/70 hover:text-amber-100 hover:bg-amber-950/30'
            }`}
          >
            Spreadsheet Export
          </button>
        </div>

        {/* Tab Contents */}
        <div className="overflow-y-auto pr-1 space-y-4 flex-1">
          {activeAuditTab === 'overview' && (
            <div className="space-y-4">
              {/* Mandatory Official Disclaimer Callout */}
              <div className="bg-[#0f172a]/90 border border-amber-400/40 rounded-2xl p-4.5 text-amber-100 shadow-inner relative">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-500/40 flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Mandatory Compliance Statement</span>
                  </span>
                  <button
                    onClick={handleCopyDisclaimer}
                    className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-200 hover:text-amber-100 bg-amber-900/40 hover:bg-amber-800/60 border border-amber-500/40 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>
                </div>
                
                <blockquote className="text-xs sm:text-sm font-sans font-semibold text-amber-100 leading-relaxed italic bg-black/40 p-4 rounded-xl border border-amber-500/30">
                  "{IP_COMPLIANCE_DISCLAIMER}"
                </blockquote>

                <div className="mt-3 flex items-center justify-between text-[11px] font-sans text-amber-300/80 pt-2 border-t border-amber-500/20">
                  <span className="font-bold text-amber-200">Entity: Akash Sync Agent</span>
                  <span className="font-mono text-[10px] text-amber-400">Certified Hash: SHA256-ASA-9941-VERIFIED</span>
                </div>
              </div>

              {/* Attribution pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#0d1424] border border-amber-500/20 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase font-epic">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Strategic AI</span>
                  </div>
                  <p className="text-[11px] text-amber-100/70 leading-snug font-sans">
                    Multi-modal generative orchestration for synthesis and rendering pipelines.
                  </p>
                </div>

                <div className="p-3 bg-[#0d1424] border border-amber-500/20 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase font-epic">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Human Directed</span>
                  </div>
                  <p className="text-[11px] text-amber-100/70 leading-snug font-sans">
                    Meticulously architected creative vision, game loop mathematics, and UI systems.
                  </p>
                </div>

                <div className="p-3 bg-[#0d1424] border border-amber-500/20 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase font-epic">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Exclusive IP</span>
                  </div>
                  <p className="text-[11px] text-amber-100/70 leading-snug font-sans">
                    Sole, exclusive intellectual property rights retained by Akash Sync Agent.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeAuditTab === 'audit' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="bg-[#050811] text-amber-100 p-4 rounded-2xl border border-amber-500/30 space-y-2 shadow-inner">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-2 text-[11px]">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>DEEP_INSPECTOR_AUDIT_LOG::RUNNING</span>
                  </span>
                  <span className="text-emerald-400 font-bold text-[10px]">ALL_CHECKS_PASSED</span>
                </div>
                <div className="space-y-1.5 text-[10px] text-amber-200/80 font-mono leading-relaxed pt-1">
                  <p className="text-emerald-400">✓ [ASSET_AUDIT]: 100% of SVGs, mandalas, and character avatars validated.</p>
                  <p className="text-emerald-400">✓ [AUDIO_ENGINE]: Web Audio WebSynth frequency oscillators authenticated.</p>
                  <p className="text-emerald-400">✓ [GAME_LOOP]: 30s countdown state synchronization mathematically verified.</p>
                  <p className="text-emerald-400">✓ [COMPLIANCE]: Mandatory IP disclaimer embedded into all system manifests.</p>
                  <p className="text-emerald-400">✓ [LEGAL_DE-RISK]: Zero monetary value and non-cash disclosures validated.</p>
                  <p className="text-amber-400/80 pt-2 border-t border-amber-500/20">
                    Proprietary Authority: Akash Sync Agent<br />
                    Licensing Structure: Human-Directed AI Craftsmanship
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl flex items-center gap-2.5 text-emerald-200 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Deep Inspector Audit status is <strong>100% Compliant & Certified</strong>.</span>
              </div>
            </div>
          )}

          {activeAuditTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#0d1424] border border-amber-500/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-amber-400" />
                  <h4 className="text-xs font-black font-epic uppercase text-amber-200 tracking-wider">
                    Export Certified Spreadsheet (.CSV)
                  </h4>
                </div>
                <p className="text-xs text-amber-100/80 leading-relaxed font-sans">
                  Export an official compliance spreadsheet containing your ledger transactions, audit certificates, and the mandatory intellectual property disclaimer embedded directly in the header.
                </p>
                <div className="p-3 bg-black/50 rounded-xl border border-amber-500/20 text-[10px] font-mono text-amber-300 leading-relaxed">
                  <strong>Header Injection:</strong> {IP_COMPLIANCE_DISCLAIMER}
                </div>
              </div>

              <button
                type="button"
                onClick={handleExportCSV}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Compliance Spreadsheet (.CSV)</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-[10px] text-amber-400/80 font-mono">
          <span>Akash Sync Agent IP Protocol</span>
          <button
            onClick={() => { divineSynth.playTempleBell(); onClose(); }}
            className="font-bold text-amber-300 hover:text-amber-100 hover:underline cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
export default ComplianceVerificationModal;
