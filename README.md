# ABC Summit 2025 Conference App

**Tech Stack:** React Native (Expo SDK 51) + Next.js 16 + Supabase
**Launch Date:** December 1, 2025 (13 days)
**Status:** 🚀 Active Development - MVP Sprint

## 🚀 Quick Start

### Prerequisites
- **Node.js 20.9+** (REQUIRED for Next.js 16)
- **npm 10+** (REQUIRED)
- Expo CLI
- Supabase account

### Verify Your Environment
```bash
node --version   # Must show >= 20.9.0
npm --version    # Must show >= 10.0.0
```

### Critical Note
This project uses **Next.js 16** and **React 19**, which require Node.js 20.9+. Older Node versions will fail.

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env.local
```

### Development

```bash
# Run web app (Next.js)
npm run web

# Run mobile app (Expo)
npm run mobile
```

## 📁 Project Structure

```
abc-summit-2025/
├── apps/
│   ├── web/          # Next.js admin + registration website
│   └── mobile/       # React Native (Expo) mobile app
├── packages/
│   └── shared/       # Shared types, utilities, constants
└── supabase/
    └── migrations/   # Database migrations
```

## 🎯 Key Features

### Priority 1: Data Export System
- Comprehensive CSV exports for all registration data
- Travel data export for airline booking
- Roommate analysis (original selections + final matches)
- Catering data with meal preferences

### Core Features
- Event registration with RSVP
- Travel and hotel booking management
- Roommate selection with role-based pairing rules
- Automated roommate matching algorithm
- Admin dashboard for full control
- Mobile app with QR code check-in
- Travel Hub (consolidated travel info)
- Push notifications

## 🏗️ Development Timeline

**MVP Launch:** December 1, 2025 (13 days from Nov 18)
**Event Date:** February 27-28, 2026

### Sprint Plan (13 Days)
- **Days 1-2:** Setup + Authentication ✅
- **Days 3-5:** Registration + Data Exports ⭐
- **Days 6-7:** Mobile App MVP
- **Days 8-9:** Testing + Polish
- **Days 10-11:** Deployment
- **Days 12-13:** Final Testing + Launch 🚀

See `MVP_SPRINT_PLAN.md` for detailed day-by-day breakdown.

### Post-Launch (Dec 2 - Feb 27)
- Automated roommate pairing algorithm
- QR code check-in
- Shanky integration
- Interactive floor plans
- Advanced features

## 📊 Database Schema

See `supabase/migrations/` for complete schema.

Key tables:
- `profiles` - User information
- `events` - Conference events
- `registrations` - Event registrations with travel/hotel data
- `roommate_selections` - User roommate preferences
- `roommate_matches` - Final roommate assignments

## 🔧 Tech Stack (Production)

### Web (Next.js 16)
- **Next.js:** 16.0.3 (Latest LTS)
- **React:** 19.2.0 (Required by Next.js 16)
- **TypeScript:** 5.1+
- **Tailwind CSS:** 3.4.x
- **Forms:** React Hook Form + Zod
- **State:** TanStack Query + Zustand

### Mobile (Expo SDK 51)
- **Expo:** SDK 51 (Proven stable)
- **React Native:** 0.74.5
- **React:** 18.2.0 (Mobile uses React 18)
- **Styling:** NativeWind 4.0
- **Navigation:** Expo Router

### Backend (Supabase)
- **Database:** PostgreSQL 15
- **Auth:** Supabase Auth (Google Sign-In)
- **Storage:** Supabase Storage
- **Security:** Row Level Security (RLS)

**Note:** Web uses React 19, Mobile uses React 18 (different ecosystems)

See `TECH_STACK.md` for complete details and compatibility matrix.

## 📝 License

Proprietary - ABC Company
