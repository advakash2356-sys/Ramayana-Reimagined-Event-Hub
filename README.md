# Ramayana-Reimagined-Event-Hub

Ramayana Reimagined: Event Hub

## Features

- **Ayodhya Court**: Interactive devotional platform featuring divine passes, avatar selection, and interactive stone-brick tapping animations.
- **Astra Prediction**: Round-based prediction forecast module with countdown timers, bet amounts, and sandbox simulation mode.
- **Kishkindha Quests**: Devotional task quests module.
- **Sugriva Alliance**: Referral covenant and alliance tracking module.
- **Sacred Vault & UPI Recharge**: Coin balance management, transaction history, and UPI recharge interface.
- **Devotional Audio Synthesizer**: Web Audio API integration (`DivineSynthesizer`) generating sacred sounds such as temple bells.
- **Authentication & Compliance**: Sign-in and sign-up modal (`AuthModal`), user walkthrough guide (`WalkthroughModal`), pilgrim guide (`PilgrimGuide`), and IP compliance verification (`ComplianceVerificationModal`).

## Tech Stack

- **Framework & Runtime**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, `@tailwindcss/vite`
- **Animation**: Motion (`motion/react`)
- **Icons**: Lucide React
- **AI & Server**: `@google/genai`, Express, `dotenv`

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables using the reference template:
   ```bash
   cp .env.example .env
   ```
   *(Ensure any required variables defined in `.env.example` are populated)*

## Usage

- Start the development server (runs on `http://0.0.0.0:3000`):
  ```bash
  npm run dev
  ```
- Build the production bundle:
  ```bash
  npm run build
  ```
- Preview the production build:
  ```bash
  npm run preview
  ```
- Run type checking:
  ```bash
  npm run lint
  ```
- Clean build artifacts:
  ```bash
  npm run clean
  ```

## Project Structure

```
Ramayana-Reimagined-Event-Hub/
├── assets/
│   └── .aistudio/
│       └── .gitignore
├── src/
│   ├── components/
│   │   ├── AstraPrediction.tsx
│   │   ├── AuthModal.tsx
│   │   ├── AyodhyaCourt.tsx
│   │   ├── ComplianceVerificationModal.tsx
│   │   ├── KishkindhaQuests.tsx
│   │   ├── MandalaSVG.tsx
│   │   ├── PilgrimGuide.tsx
│   │   ├── SacredVault.tsx
│   │   ├── SugrivaAlliance.tsx
│   │   ├── UpiRecharge.tsx
│   │   └── WalkthroughModal.tsx
│   ├── App.tsx
│   ├── audio.ts
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
└── vite.config.ts
