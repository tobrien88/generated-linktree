# Linktree AI Onboarding — Expo Mobile Prototype

## Project Overview
A Figma-style interactive mobile prototype of an AI-powered Linktree onboarding redesign. Features a fully pre-populated fake creator persona "Nova Reyes" (@novaonthemove, lifestyle/travel) to simulate AI profile generation.

## Architecture
- **Framework**: Expo SDK 54 + Expo Router (file-based routing)
- **Language**: TypeScript
- **State**: React Context (OnboardingContext)
- **Navigation**: Stack navigator, no tabs
- **Font**: Inter (400, 500, 600, 700)

## Monorepo Structure
```
artifacts/mobile/          ← Main Expo app
  app/                     ← Expo Router screens
    _layout.tsx            ← Root layout (OnboardingProvider + QueryClient)
    index.tsx              ← Landing screen
    username.tsx           ← Username step
    email.tsx              ← Email/OAuth step
    social-platforms.tsx   ← Platform picker (tap to select + handle input)
    ai-loading.tsx         ← AI analysis loading (dark, animated orbiting icons)
    ai-preview.tsx         ← AI-generated Linktree preview + rationale
    modify-theme.tsx       ← Theme selector grid
    edit-bio.tsx           ← Bio/name editor with AI regenerate
    monetization.tsx       ← Tier selection (Free/Starter/Pro/Premium)
    payment-review.tsx     ← Payment checkout with virtual card
    admin.tsx              ← Admin dashboard + share bottom sheet
  context/
    OnboardingContext.tsx  ← Shared state (username, email, platforms, tier)
  constants/
    colors.ts              ← Linktree brand colors
  assets/images/
    nova-avatar.png        ← AI-generated Nova Reyes avatar
    icon.png               ← App icon
    splash-icon.png        ← Splash screen image
```

## Design System
| Token | Value |
|-------|-------|
| Lime green (primary CTA) | `#C5E84F` |
| Dark green | `#1D3C34` |
| Purple (AI / paid features) | `#7B3FE4` |
| Nova's terracotta theme | `#C9614A` |
| Background | `#FFFFFF` / `#F8F7F5` |

## Screen Flow
Landing → Username → Email → Social Platforms → AI Loading → AI Preview ↔ Modify Theme / Edit Bio → Monetization → Payment Review → Admin Dashboard (with Share Bottom Sheet)

## Tier System
- **Free** ($0): Unlimited links, basic analytics, standard themes
- **Starter** ($6/mo): Custom color palettes, removes branding
- **Pro** ($12/mo): Full AI-personalized Linktree, logo, full-screen visuals (AI recommended)
- **Premium** ($30/mo): 0% fees, concierge setup, white-label

## Nova Reyes — Pre-populated Persona
- Handle: @novaonthemove
- Platforms: Instagram, TikTok, YouTube, Spotify, Website (all selected)
- Theme: Warm terracotta (AI-generated)
- Links: SE Asia Travel Guide, TikTok, Lightroom Presets, YouTube vlogs, website
- Tier: Pro (default selected)

## Key Packages
- expo-linear-gradient: gradient backgrounds
- expo-image: optimized image rendering
- expo-haptics: tactile feedback
- react-native-reanimated: animations (AI loading orbits, bottom sheet)
- react-native-gesture-handler: gesture support
- @expo/vector-icons: Feather, FontAwesome5, MaterialCommunityIcons
