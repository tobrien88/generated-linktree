# Linktree AI-Native Onboarding — Interactive Prototype

> **Strategic context:** This prototype demonstrates the "Acquisition: Generated Linktree" pillar of the broader AI-native vision detailed in the [product strategy document](https://docs.google.com/document/d/1gBaxQ0UAWKcGUPGstcWyWhMDaI5KpBN1ZvTRmtf4yAs/edit?usp=sharing) (Taylor O'Brien, March 2026).

---

## Why This Exists

Linktree's current onboarding is manual — 10 tedious steps before the user sees any value, and a paywall before they understand the product. The prototype answers a single question: **what if Linktree built itself in under 30 seconds, using only the creator's existing social presence?**

The goal is to compress and invert the onboarding funnel:

- Capture minimal input (username + social handles)
- Use AI to generate a personalized Linktree (theme, bio, profile pic, prioritized links) in real time
- Show the user exactly what each paid tier unlocks for *them specifically* before asking for payment
- Drive activation rate improvement targeting a 25% lift (generated username → publish) with time-to-value under one minute

---

## The Three-Pillar Product Vision

The full strategy (linked above) organizes around three compounding pillars:

| Pillar | What it does | MVP scope |
|---|---|---|
| **Acquisition: Generated Linktree** | AI generates a personalized profile from social data at onboarding | ✅ This prototype |
| **Retention: Automated Upkeep** | Continuously reorders links and swaps CTAs based on content performance | Suggestion cards (Q4 2026) |
| **Monetization: Insights to Action** | Social intelligence layer advising on cross-platform content strategy | Agent mode (post-MVP) |

Each pillar feeds a **data flywheel**: AI-generated Linktrees create training data to improve the next one; automated reorders build models of "what good looks like" by creator archetype; insight-card acceptances inform eventual autonomous behavior.

---

## Demo Persona

All screens are built around **Nova Reyes** (`@novaonthemove`) — a lifestyle/travel creator with 284K followers across Instagram, TikTok, and YouTube. Her persona demonstrates the AI's ability to infer:

- A Southeast Asia travel aesthetic (photo background, warm palette)
- High-engagement TikTok as a featured link
- A free travel guide as a top CTA
- Bio voice, pronoun line, and emoji usage from real post patterns

---

## UX Design Choices

### Flow Architecture

The onboarding is structured in two phases — **value creation first, monetization second**:

```
Landing → Username → Email → Social Platforms → AI Loading → AI Preview
                                                                    ↓
                                                          Monetization (plan select)
                                                                    ↓
                                                          Payment / Free Trial
                                                                    ↓
                                                            Admin Dashboard
```

The paywall appears only *after* the user has seen their personalized profile — a deliberate inversion of the current flow.

### Key UX Decisions

**AI Loading as trust-building moment**
The loading screen (orbiting platform icons + progress steps) makes the AI analysis feel real and considered, not instant. This primes the user to value the output.

**AI Preview as the core value demonstration**
The preview shows a live-rendered Linktree card using Nova's actual photo background, bio, and links. "Edit theme" and "Edit bio/links" buttons let the user customize before committing.

**Monetization: tier-specific personalization**
Each plan tab shows a different version of Nova's profile — Free/Starter use clean rectangular cards; Pro/Premium show a photo background with TikTok thumbnail links. The AI pick badge ("AI PICK") is pinned to the recommended Pro tier. The page copy connects each feature directly to Nova's social signals ("Your SE Asia landscape, ready to go").

**Plan selection flow**
The primary path skips the Review page — tapping a plan CTA goes directly to payment. Users who want to compare features tap the "Compare plan features" link, which opens a full feature breakdown with a plan switcher (Starter / Pro / Premium) and Monthly/Annual billing toggle.

**Payment page**
Pre-filled card form simulates a frictionless checkout. Free 7-day trial is front-and-center ("$0 due today"). CTA labels are tier-specific: "Confirm purchase" (Starter), "Start your free trial" (Pro), "Try free for 7 days" (Premium).

**Admin Dashboard**
Post-onboarding state shows the completed profile alongside a "Finish your setup" checklist with a live SVG progress ring (5/6 steps done — Share your Linktree is the only remaining step). A floating badge at the bottom left mirrors the ring and persists while scrolling.

### Typography & Color System

| Context | Font | Notes |
|---|---|---|
| Landing screen | DM Sans | Friendly, brand-aligned |
| Onboarding screens | Inter | Readable, system-native feel |
| Pro/Premium preview handles | Quicksand | Softer, lifestyle-creator aesthetic |

| Role | Color |
|---|---|
| Primary brand / CTAs | `#7B3FE4` (purple) |
| Pro tier accent | `#7B3FE4` |
| Starter accent | `#C9614A` (terracotta) |
| Premium accent | `#B8860B` (gold) |
| Progress fill | `#C5E84F` (lime green) |
| AI badge | `#C5E84F` |

---

## Screen-by-Screen Flow

| # | Screen | File | Key behavior |
|---|---|---|---|
| 1 | Landing | `index.tsx` | Billboard poster image, "Claim your Linktree" CTA |
| 2 | Username | `username.tsx` | Validates handle availability in real time |
| 3 | Email | `email.tsx` | Email input + OAuth options |
| 4 | Social Platforms | `social-platforms.tsx` | Multi-select platform grid; pre-populates Nova's handles |
| 5 | AI Loading | `ai-loading.tsx` | Animated orbiting platform icons + step-by-step progress |
| 6 | AI Preview | `ai-preview.tsx` | Live-rendered Linktree card + rationale section + edit buttons |
| 7 | Modify Theme | `modify-theme.tsx` | Theme palette picker |
| 8 | Edit Bio/Links | `edit-bio.tsx` | Bio text + link management |
| 9 | Monetization | `monetization.tsx` | Tier tabs (Free/Starter/Pro/Premium) with live preview, AI PICK badge, "Compare plan features" link |
| 10 | Payment Review | `payment-review.tsx` | Plan switcher, Monthly/Annual toggle, full feature breakdown |
| 11 | Payment | `payment.tsx` | Card form, Google Pay, PayPal; purple CTA; trial summary |
| 12 | Admin Dashboard | `admin.tsx` | Setup checklist, SVG progress ring, link cards, share sheet |

---

## Technical Architecture

### Monorepo Structure

```
workspace/
├── artifacts/
│   ├── mobile/          # Expo React Native app (this prototype)
│   ├── api-server/      # Express backend
│   └── mockup-sandbox/  # Vite component preview server
├── lib/
│   ├── api-client-react/  # Orval-generated React Query hooks
│   ├── api-spec/          # OpenAPI specs
│   ├── api-zod/           # Zod schemas from spec
│   └── db/                # Drizzle ORM schema + PostgreSQL
```

### Mobile App Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 54, React Native |
| Routing | Expo Router (file-based, `app/` directory) |
| Styling | NativeWind (Tailwind CSS for RN) + StyleSheet |
| Animation | React Native Reanimated v3 |
| SVG | react-native-svg |
| Video | expo-video |
| Fonts | @expo-google-fonts (Inter, DM Sans, Quicksand) |
| Icons | @expo/vector-icons (Feather, FontAwesome5, MaterialCommunityIcons) |
| State | React Context (`OnboardingContext`) |
| Server state | TanStack Query (React Query) |
| Validation | Zod |

### Backend Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js, Express |
| Database | PostgreSQL + Drizzle ORM |
| Logging | Pino |
| API contract | OpenAPI spec → Orval codegen |

---

## Components Built (Prototype)

### Screens
All screens in `artifacts/mobile/app/` — see table above.

### Reusable Components

| Component | Location | Purpose |
|---|---|---|
| `OnboardingContext` | `context/OnboardingContext.tsx` | Global state for selected tier, platforms, username across the flow |
| `PlatformIcon` | `components/PlatformIcon.tsx` | Renders correct brand icons per platform |
| `AutoVideo` / `AutoVideo.web.tsx` | `components/` | Cross-platform video autoplay for demo loops |
| `KeyboardAwareScrollViewCompat` | `components/` | Handles input keyboard behavior across iOS/web |
| `ErrorBoundary` / `ErrorFallback` | `components/` | Standard error handling wrappers |
| `ProgressRing` | Inline in `admin.tsx` | SVG ring using `stroke-dasharray` to render accurate arc progress |
| `ShareBottomSheet` | Inline in `admin.tsx` | Animated spring-driven share drawer |

---

## Backend Components Required for Production

The prototype uses hardcoded data for Nova Reyes. Production requires the following backend services:

### 1. Social Scraping Service
- **Input:** Social handles (Instagram, TikTok, YouTube, Spotify, X, etc.)
- **Output:** Public profile data — bio, avatar, follower count, recent post titles, engagement rates, top-performing content
- **Notes:** Must handle platform-specific APIs/scraping; explore first-party data collection, browser extension strategy, and platform partnership data pipes (Linktree has existing integrations with TikTok, YouTube, Spotify) to mitigate API restriction risk

### 2. AI Profile Generation API
- **Input:** Scraped social data + user archetype (creator / business / personal)
- **Output:** Structured Linktree config — bio text, recommended theme/palette, ordered link list with titles, profile image URL, AI rationale for each choice
- **Model:** LLM (e.g., Claude or GPT-4o) with a structured output schema; fine-tune on Linktree's 70M user corpus over time
- **Latency target:** Under 30 seconds end-to-end (shown on loading screen)

### 3. Tier Recommendation Engine
- **Input:** Creator archetype, follower counts, engagement rates, platform mix
- **Output:** Recommended tier (Free / Starter / Pro / Premium) with per-feature personalization copy
- **Notes:** Powers the AI PICK badge and feature callout copy on the monetization screen

### 4. Username Availability Service
- **Input:** Proposed username string
- **Output:** Available / taken / suggestions
- **Notes:** Real-time validation as the user types (currently mocked with a fixed "novaonthemove" response)

### 5. Authentication & User Service
- **Input:** Email / OAuth token
- **Output:** User session, JWT
- **Notes:** Existing Linktree auth; the prototype skips this step

### 6. Payments & Subscription Service
- **Input:** Payment method (card / Google Pay / PayPal), selected tier + billing cycle
- **Output:** Subscription created, trial start date
- **Notes:** Integrate with Stripe; surface trial end date on payment confirmation; send reminder email 2 days before trial ends (mentioned in payment page copy)

### 7. Analytics & Training Data Pipeline
- **Purpose:** Capture every AI-generated profile + user edit + link click to feed the data flywheel
- **Key signals:** Which AI suggestions were accepted vs. edited, link click-through rates by position, share events, tier conversion from each AI recommendation
- **Long-term:** Powers unsupervised clustering by creator archetype and improves generation quality over successive cohorts

---

## North Star Metric

**Activation rate** (generated username → publish), targeting a **25% lift** against a holdout group, with **time to first value under one minute**.

Secondary metrics: trial-to-paid conversion rate; AI recommendation acceptance rate (bio, theme, links); share event rate from admin dashboard.

---

## Running the Prototype

```bash
# Install dependencies
pnpm install

# Start all services
pnpm --filter @workspace/mobile run dev        # Expo app
pnpm --filter @workspace/api-server run dev    # API server
```

The Expo app runs on web at the configured Replit preview URL. Navigate directly to any screen by appending the route (e.g., `/monetization`, `/admin`).
