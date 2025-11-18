# ABC Summit 2025 Conference App

**Tech Stack:** React Native (Expo) + Next.js + Supabase

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Expo CLI
- Supabase account

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

- **Week 1:** Project setup, registration form, data exports, mobile shell
- **Week 2:** Roommate pairing algorithm, admin content management
- **Week 3-4:** Polish UI, push notifications, Shanky integration
- **Ongoing:** Testing, refinement, deployment prep

## 📊 Database Schema

See `supabase/migrations/` for complete schema.

Key tables:
- `profiles` - User information
- `events` - Conference events
- `registrations` - Event registrations with travel/hotel data
- `roommate_selections` - User roommate preferences
- `roommate_matches` - Final roommate assignments

## 🔧 Tech Details

### Web (Next.js)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Hook Form + Zod
- Supabase SSR

### Mobile (React Native)
- Expo Router
- NativeWind (Tailwind)
- React Query
- QR Code generation
- Push notifications

### Backend (Supabase)
- PostgreSQL database
- Row Level Security (RLS)
- Real-time subscriptions
- Authentication
- Storage

## 📝 License

Proprietary - ABC Company
