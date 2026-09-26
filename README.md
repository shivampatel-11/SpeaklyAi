# Speakly AI — English Speaking Practice Partner

Speakly AI is a mobile-first AI speaking companion engineered to help language learners build conversational fluency, natural phrasing, and confidence through real-time spoken dialogues and instant linguistic feedback.

---

## Architecture Overview

Speakly AI enforces strict boundary separation across every tier of the application:

```
[ Frontend: React 19 + TypeScript + Tailwind CSS ]
  │
  ▼
[ UI Layer ]
  ├── Pages (HomeScreen, PracticePage, ProgressPage, ProfilePage)
  └── Components (Shadcn-style primitives + Free Aceternity background)
  │
  ▼
[ Feature Logic & Client Services ]
  ├── conversationService.ts  (State synchronization & fallback engine)
  ├── speechService.ts        (Web Speech STT/TTS & audio capture)
  ├── authService.ts          (Session token lifecycle)
  └── progressService.ts      (Streak & consistency tracking)
  │
  ▼
[ Vite Reverse Proxy (/api/*) ]
  │
  ▼
[ Backend: Node.js + Express + TypeScript ]
  ├── Routes (/api/auth, /api/conversations, /api/progress)
  ├── Controllers (Input validation & status code mapping)
  ├── Services
  │     ├── AI Provider Registry (Gemini, OpenAI, Fallback)
  │     ├── Subscription Service (Future monetization abstractions)
  │     └── Speech Service (Transcription / synthesis adapters)
  ├── Repositories (IUserRepository, IConversationRepository, ISubscriptionRepository)
  └── Storage (In-memory store with clean interfaces for PostgreSQL / SQLite)
```

---

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── common/             # Header, MobileNav, EmptyState, ErrorState, LoadingState
│   │   └── ui/                 # Button, Card, Modal, Badge, AceternityBackground
│   ├── config/
│   │   └── modes.ts            # Practice scenarios & prompts
│   ├── features/
│   │   ├── auth/               # AuthModal (Sign In / Create Account)
│   │   └── practice/           # ModeSelector, ActiveConversationView, SessionFeedbackView
│   ├── hooks/                  # Custom React hooks (useSpeechPractice)
│   ├── layouts/
│   │   └── AppLayout.tsx       # Responsive mobile shell & bottom navigation
│   ├── pages/                  # Lazy-loaded screens (Home, Practice, Progress, Profile)
│   ├── services/               # Client-side API clients & services
│   ├── types/                  # Global domain types & subscription contracts
│   └── App.tsx                 # Root application with Suspense code-splitting
├── server/
│   ├── src/
│   │   ├── config/             # Environment variable loader & defaults
│   │   ├── controllers/        # Request handlers (auth, conversation, progress)
│   │   ├── database/           # Repository interfaces & storage adapters
│   │   ├── middleware/         # Auth verification & error handling
│   │   ├── routes/             # Express API routers
│   │   ├── services/
│   │   │     ├── ai/           # Pluggable AI registry, Gemini provider, fallback provider
│   │   │     └── subscriptionService.ts # Future billing & entitlement service
│   │   └── types/              # Server-side TypeScript interfaces & contracts
│   └── tsconfig.json
├── .env.example                # Documented configuration template
├── package.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### 1. Environment Configuration
Copy the configuration template:
```bash
cp .env.example .env
```
Open `.env` and add your Google Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```
*(If no API key is specified, Speakly AI automatically engages its intelligent built-in linguistic fallback provider, allowing seamless offline development).*

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### 3. Run the Development Environment

Start the backend API server (runs on port 3001):
```bash
cd server
npm run dev
```

In a separate terminal, start the Vite frontend (runs on port 5173):
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## AI Provider Setup & Extensibility

Speakly AI decouples conversation UI from specific LLM vendors using a **Provider Registry Pattern** located at `server/src/services/ai/`:

- **Google Gemini Provider (`geminiProvider.ts`):** Default real-time conversational partner running on `gemini-2.5-flash`.
- **Intelligent Linguistic Fallback (`fallbackProvider.ts`):** Deterministic NLP rules engine providing instant grammar correction and conversational replies when offline or if API quotas are exceeded.
- **Plugging in Future Providers:** To add Provider B (e.g., OpenAI GPT-4o) or Provider C (Anthropic Claude), implement the `AIService` interface (`server/src/services/ai/aiService.interface.ts`) and register it in `aiRegistry`:
  ```ts
  aiRegistry.register('openai', new OpenAIProvider(apiKey, model));
  aiRegistry.setActive('openai');
  ```
  Zero frontend changes are required.

---

## Future Payment & Monetization Readiness

While Speakly AI is currently 100% free with unlimited access for all learners, clean architectural hooks exist for future monetization without requiring rewrites:

### Conceptual Data Model
- **`Plan` (`server/src/types/index.ts`):** Defines billing tiers (`free`, `pro`, `unlimited`), monthly spoken minutes, and features.
- **`Subscription`:** Links a student `userId` to a `planId`, expiration date, and billing status (`active`, `canceled`).
- **`UsageRecord`:** Logs spoken minutes per session for usage tracking.
- **`Entitlement`:** Expresses access rights (`canAccessPractice`, `remainingSeconds`, `isUnlimited`).

### Where to Integrate Payment Gateways (Stripe, LemonSqueezy, RevenueCat):
1. **Webhook Handler:** Add a new router at `server/src/routes/billing.routes.ts` listening for `customer.subscription.created` and `invoice.payment_succeeded`.
2. **Subscription Repository:** Wire `server/src/database/store.ts` (`subscriptionRepository.createOrUpdate`) to update the user's active plan.
3. **Entitlement Enforcement:** Add middleware in `server/src/middleware/entitlementMiddleware.ts` calling `subscriptionService.getEntitlement(userId)` before starting new practice sessions.
4. **No UI Changes Needed Today:** The default free plan provides unlimited minutes (`isUnlimited: true`), ensuring zero interruption for existing users.

---

## Quality & Production Checks

### Building Frontend
```bash
npm run build
```
*(Runs TypeScript project reference checks and builds optimized chunks with code-splitting).*

### Building Backend
```bash
cd server && npm run build
```

### Linting
```bash
npm run lint
```
*(Runs Oxlint with 0 errors and 0 warnings).*

---

## Mobile UX Standards
- Responsive across mobile screens: `360px`, `375px`, `390px`, and `430px`.
- Thumb-friendly touch targets (min `44px` height on buttons and interactive chips).
- Single-tap microphone interaction with active audio waveform feedback.
- Graceful degradation with fallback text modal (`"Type instead"`) for noisy environments or denied mic permissions.
