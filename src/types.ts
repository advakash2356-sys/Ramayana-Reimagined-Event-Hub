/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  username: string;
  avatar: string; // 'hanuman', 'rama', 'laxman', 'sugriva', 'ravana'
  title: string; // 'Vanar Scout', 'Ayodhya Guardian', 'Lanka Overlord', etc.
  coins: number; // Bhakti Points (भक्ति)
  gems: number; // Sacred Gems
  activePassId: string | null;
  experience: number;
  level: number;
}

export type PassTier = 'scout' | 'guardian' | 'emperor' | 'overlord';

export interface DivinePass {
  id: string;
  name: string;
  tier: PassTier;
  cost: number; // Bhakti Points
  multiplier: number; // Blessing Multiplier
  passiveRate: number; // Bhakti Points generated per 10-second blessing flow
  description: string;
  benefits: string[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  vibe: string;
  reward: number; // Bhakti Points
  cooldown: number; // in seconds
  lastCompleted: number | null;
}

export type AstraType = 'suryastra' | 'varunastra' | 'brahmastra';

export interface AstraBet {
  astra: AstraType;
  amount: number;
  timestamp: number;
}

export interface BattleResult {
  roundId: string;
  winningAstra: AstraType;
  winningNumber: number; // 0-9
  timestamp: number;
  totalPool: number; // Total Dharmic Offerings
}

export interface AllianceMember {
  id: string;
  name: string;
  contribution: number;
  rank: string;
  joinedAt: string;
}

export interface Transaction {
  id: string;
  type: 'quest' | 'bet_place' | 'bet_win' | 'recharge' | 'withdraw' | 'pass_buy' | 'passive_claim';
  amount: number;
  description: string;
  timestamp: number;
}
