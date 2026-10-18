/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Landmark, ArrowRight, ShieldCheck, QrCode } from 'lucide-react';
import { divineSynth } from '../audio';

interface UpiRechargeProps {
  onClose: () => void;
  onAddCoins: (amt: number) => void;
  onWithdrawCoins: (amt: number) => boolean;
  currentBalance: number;
}

export const UpiRecharge: React.FC<UpiRechargeProps> = ({
  onClose,
  onAddCoins,
  onWithdrawCoins,
  currentBalance,
}) => {
  const [activeTab, setActiveTab] = useState<'recharge' | 'withdraw'>('recharge');
  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [upiId, setUpiId] = useState<string>('shriram@suryavanshi');
  const [withdrawAddress, setWithdrawAddress] = useState<string>('hanuman@kishkindha');

  const handleSelectAmount = (amt: number) => {
    divineSynth.playCelestialChime();
    setAmount(amt);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setAmount(num);
    }
  };

  const handleProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    divineSynth.playTempleBell();
    setStatus('processing');

    setTimeout(() => {
      if (activeTab === 'recharge') {
        onAddCoins(amount);
        setStatus('success');
        divineSynth.playVictoryChome();
      } else {
        const ok = onWithdrawCoins(amount);
        if (ok) {
          setStatus('success');
          divineSynth.playVictoryChome();
        } else {
          setStatus('failed');
          divineSynth.playBuzzer();
        }
      }
    }, 2000);
  };

  const resetState = () => {
    setStatus('idle');
    setCustomAmount('');
    setAmount(500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-amber-50 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border-4 border-amber-600 relative"
      >
        {/* Intricate Indian Traditional Style Header Overlay */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-yellow-500" />
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-b from-amber-600 to-amber-700 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Landmark className="w-6 h-6 text-yellow-300" />
            <div>
              <h2 className="font-semibold text-lg tracking-tight font-sans">
                {activeTab === 'recharge' ? 'Sacred Devotional Flow' : 'Celestial Withdrawal Gateway'}
              </h2>
              <p className="text-xs text-amber-100 font-mono">Lanka Treasury Alliance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-amber-800 rounded-full transition-colors text-amber-100 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simulation disclaimer */}
        <div className="px-4 py-2 bg-yellow-100 border-b border-yellow-300 text-[11px] text-yellow-900 font-semibold text-center">
          DEMO ONLY: play-money coins. No real money, UPI payment or bank transfer happens here.
        </div>

        {/* Tab Select */}
        {status === 'idle' && (
          <div className="flex border-b border-amber-200">
            <button
              onClick={() => { divineSynth.playCelestialChime(); setActiveTab('recharge'); resetState(); }}
              className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
                activeTab === 'recharge'
                  ? 'bg-amber-100 text-amber-900 border-b-2 border-amber-600'
                  : 'text-amber-700 hover:bg-amber-100/50'
              }`}
            >
              Initiate Devotional Recharge
            </button>
            <button
              onClick={() => { divineSynth.playCelestialChime(); setActiveTab('withdraw'); resetState(); }}
              className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
                activeTab === 'withdraw'
                  ? 'bg-amber-100 text-amber-900 border-b-2 border-amber-600'
                  : 'text-amber-700 hover:bg-amber-100/50'
              }`}
            >
              Redeem of Gold
            </button>
          </div>
        )}

        <div className="p-6">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleProcess}
                className="space-y-5"
              >
                {/* Visual Balance Card */}
                <div className="bg-amber-100/60 rounded-xl p-4 border border-amber-300/40 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-amber-800 font-semibold uppercase tracking-wider block">
                      Current Celestial Vault
                    </span>
                    <span className="text-2xl font-bold font-mono text-amber-900">
                      🪙 {currentBalance.toLocaleString()}
                    </span>
                  </div>
                  <Trophy className="w-8 h-8 text-amber-500 opacity-60" />
                </div>

                {/* Amount Selection */}
                <div>
                  <label className="text-sm font-semibold text-amber-900 block mb-2">
                    Select Divine Offering Amount
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[100, 500, 1000, 5000].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => handleSelectAmount(amt)}
                        className={`py-2 text-center rounded-lg border text-sm font-mono font-bold transition-all ${
                          amount === amt && !customAmount
                            ? 'bg-amber-600 border-amber-700 text-white shadow-md'
                            : 'bg-white border-amber-200 text-amber-800 hover:bg-amber-50'
                        }`}
                      >
                        🪙{amt}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3">
                    <input
                      type="number"
                      placeholder="Or enter custom offering"
                      value={customAmount}
                      onChange={handleCustomChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-amber-900"
                    />
                  </div>
                </div>

                {/* Account Details */}
                {activeTab === 'recharge' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold text-amber-900 block mb-1">
                        Select Celestial App (Mock UPI)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['SaffronPay', 'AyodhyaUPI', 'HanumanGada'].map((provider) => (
                          <div
                            key={provider}
                            className="p-2.5 bg-white border border-amber-200 rounded-lg text-xs font-bold text-center text-amber-800 shadow-sm"
                          >
                            🕉️ {provider}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-amber-900 block mb-1">
                        Your Celestial UPI Address
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-amber-200 bg-white focus:outline-none font-mono text-xs text-amber-800"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold text-amber-900 block mb-1">
                        Dharmapath Redemption ID
                      </label>
                      <input
                        type="text"
                        value={withdrawAddress}
                        onChange={(e) => setWithdrawAddress(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-amber-200 bg-white focus:outline-none font-mono text-xs text-amber-800"
                        placeholder="e.g. laxman@ayodhya"
                      />
                      <p className="text-[11px] text-amber-700 italic mt-1">
                        *Coins are converted directly into spiritual gold bullion and dispatched via Vanar Courier Service.
                      </p>
                    </div>
                  </div>
                )}

                {/* Action button */}
                <button
                  type="submit"
                  disabled={amount <= 0 || (activeTab === 'withdraw' && amount > currentBalance)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <span>
                    {activeTab === 'recharge' ? 'Sacrifice Devotion' : 'Request Deliverance of Gold'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-amber-700 font-mono opacity-80">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Protected by the Divine Shield of Sugriva Alliance</span>
                </div>
              </motion.form>
            )}

            {status === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                {/* Traditional Looking Spinner using SVG shapes */}
                <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-4 border-amber-600 border-t-transparent border-b-transparent"
                  />
                  <span className="text-3xl">🕉️</span>
                </div>
                <h3 className="text-lg font-bold text-amber-900 font-sans">
                  Summoning Divine Devotion...
                </h3>
                <p className="text-xs text-amber-700 font-mono mt-1">
                  Connecting to the Celestial Vault of Ayodhya
                </p>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 border-2 border-emerald-500 shadow-md">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-800">Sacred Bond Complete!</h3>
                  <p className="text-sm text-emerald-900 mt-2 font-medium">
                    The Divine Order has been sealed by Sage Valmiki.
                  </p>
                  <p className="text-2xl font-mono font-bold text-amber-900 mt-4 bg-amber-100 inline-block px-4 py-1.5 rounded-lg border border-amber-200">
                    {activeTab === 'recharge' ? '+' : '-'} 🪙{amount.toLocaleString()} Coins
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow-md transition-all mt-4"
                >
                  Return to Court
                </button>
              </motion.div>
            )}

            {status === 'failed' && (
              <motion.div
                key="failed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 border-2 border-red-500 shadow-md">
                  <X className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-800">Deliverance Interrupted!</h3>
                  <p className="text-sm text-red-900 mt-2 font-medium">
                    The Celestial Vault has insufficient offerings.
                  </p>
                  <p className="text-xs text-red-700 font-mono mt-1">
                    Try sacrificing a smaller amount or complete Kishkindha tasks to gather coins.
                  </p>
                </div>
                <div className="space-x-3 mt-4">
                  <button
                    onClick={resetState}
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow-md"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2 bg-red-100 hover:bg-red-200 text-red-800 border border-red-200 rounded-lg font-semibold"
                  >
                    Close Portal
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
export default UpiRecharge;
