# ABC Summit 2025 - Production Tech Stack

**Status:** ✅ Locked and Verified Compatible
**Last Updated:** November 18, 2025
**Launch Date:** December 1, 2025 (13 days)

---

## 📦 Exact Versions (Production)

### Core Framework
```json
{
  "next": "16.0.3",              // Web framework (Latest LTS)
  "react": "19.2.0",              // Required by Next.js 16
  "react-dom": "19.2.0",          // Required by Next.js 16
  "expo": "~51.0.0",              // Mobile framework (SDK 51)
  "react-native": "0.74.5"        // Required by Expo SDK 51
}
```

**Note:** Web uses React 19, Mobile uses React 18 (different ecosystems)

### Backend & Database
```json
{
  "@supabase/supabase-js": "^2.45.0",  // Supabase client
  "@supabase/ssr": "^0.5.0"             // Next.js SSR support
}
```

**Database:** PostgreSQL 15 (via Supabase)

### State Management
```json
{
  "@tanstack/react-query": "^5.60.0",  // Server state
  "zustand": "^4.5.0"                   // Client state
}
```

### Forms & Validation
```json
{
  "react-hook-form": "^7.53.0",   // Form handling
  "zod": "^3.23.0"                // Schema validation
}
```

### Styling
```json
{
  "tailwindcss": "^3.4.0",        // CSS framework
  "nativewind": "^4.0.0"          // Tailwind for React Native
}
```

### Development
```json
{
  "typescript": "^5.1.0",         // Language
  "turbo": "^1.13.0"              // Monorepo build system
}
```

### Node.js Requirements
```json
{
  "node": ">=20.9.0",             // REQUIRED
  "npm": ">=10.0.0"               // REQUIRED
}
```

---

## 🏗️ Architecture

### Monorepo Structure
```
abc-summit-2025/
├── apps/
│   ├── web/              # Next.js 16 + React 19
│   └── mobile/           # Expo SDK 51 + React 18
├── packages/
│   └── shared/           # Shared types & constants
└── supabase/
    └── migrations/       # Database schema
```

### Tech Stack Diagram
```
┌─────────────────────────────────────────┐
│           FRONTEND                      │
├─────────────────────────────────────────┤
│  Web (Next.js 16 + React 19)           │
│  - Admin Dashboard                      │
│  - Registration Form                    │
│  - Data Exports                         │
├─────────────────────────────────────────┤
│  Mobile (Expo SDK 51 + React 18)       │
│  - Event Info                           │
│  - Travel Hub                           │
│  - Profile & QR Code                    │
└─────────────────────────────────────────┘
                  ↕
┌─────────────────────────────────────────┐
│         BACKEND (Supabase)              │
├─────────────────────────────────────────┤
│  PostgreSQL 15                          │
│  - Row Level Security (RLS)             │
│  - Indexes for performance              │
├─────────────────────────────────────────┤
│  Supabase Auth                          │
│  - Google Sign-In                       │
│  - Email-based access                   │
├─────────────────────────────────────────┤
│  Supabase Storage                       │
│  - Images                               │
│  - PDFs                                 │
└─────────────────────────────────────────┘
```

---

## ✅ Compatibility Matrix

| Technology | Web | Mobile | Supabase | Status |
|-----------|-----|--------|----------|--------|
| Next.js 16.0.3 | ✅ | N/A | ✅ | Stable |
| React 19.2 | ✅ | N/A | ✅ | Stable |
| React 18.2 | N/A | ✅ | ✅ | Stable |
| Expo SDK 51 | N/A | ✅ | ✅ | Stable |
| React Native 0.74.5 | N/A | ✅ | ✅ | Stable |
| Supabase Client 2.45+ | ✅ | ✅ | ✅ | Stable |
| TanStack Query 5.60+ | ✅ | ✅ | ✅ | Stable |
| Tailwind CSS 3.4 | ✅ | N/A | N/A | Stable |
| NativeWind 4.0 | N/A | ✅ | N/A | Stable |
| TypeScript 5.1+ | ✅ | ✅ | ✅ | Stable |
| Node.js 20.9+ | ✅ | ✅ | ✅ | LTS |

**Result:** ✅ 100% Compatible

---

## 🚀 Deployment

### Web (Vercel)
- **Platform:** Vercel
- **Build Command:** `npm run build --workspace=apps/web`
- **Output Directory:** `apps/web/.next`
- **Node Version:** 20.9+

### Mobile (Expo EAS)
- **iOS:** TestFlight → App Store
- **Android:** Internal Testing → Production
- **Build:** `eas build --platform ios --auto-submit`

### Database (Supabase)
- **Hosting:** Supabase Cloud
- **Region:** US East (or closest to majority of users)
- **Tier:** Pro (for production use)

---

## 📊 Why This Stack?

### ✅ Proven & Stable
- Next.js 16: Active LTS (2+ months in production)
- Expo SDK 51: 6+ months of production use
- Supabase: Battle-tested at scale

### ✅ Perfect for Data Exports (Top Priority)
- PostgreSQL → CSV is trivial
- Complex SQL queries supported
- No data truncation or loss

### ✅ Vibe Coding Optimized
- Claude/Cursor trained heavily on React/TypeScript
- Excellent documentation
- Large community

### ✅ Fast Development
- Same language (TypeScript) across stack
- Code sharing via monorepo
- Quick iteration cycles

### ✅ Scales Easily
- 2,400 users: ✅ Easy
- 10,000 users: ✅ No problem
- Horizontal scaling available

---

## 🎯 MVP Scope (13 Days)

### MUST HAVE
- ✅ Registration form
- ✅ Roommate selection (simple dropdowns)
- ✅ **Data exports** (6 types) ⭐
- ✅ Admin dashboard
- ✅ Mobile app (view-only)
- ✅ Authentication
- ✅ Deployed (Vercel + TestFlight)

### DEFER TO POST-LAUNCH
- ❌ Automated roommate algorithm
- ❌ Shanky integration
- ❌ QR code check-in
- ❌ Interactive floor plans
- ❌ Advanced push notifications

---

## 🔐 Security

### Authentication
- Google Sign-In (Supabase Auth)
- Row Level Security (RLS)
- Admin role checks

### Data Protection
- RLS policies on all tables
- Users can only see their own data
- Admins can see everything

### Environment Variables
```bash
# Web (.env.local)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=  # Server-side only

# Mobile (.env.local)
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

---

## 📈 Performance Targets

### Web
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

### Mobile
- App Launch Time: < 2s
- Screen Transition: < 300ms
- Memory Usage: < 100MB

### Database
- Query Response: < 100ms
- Export Generation: < 5s (for 2,400 records)
- Concurrent Users: 100+

---

## 🛠️ Development Tools

### Required
- Node.js 20.9+
- npm 10+
- Git
- VS Code (recommended)

### Recommended Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript

### CLI Tools
```bash
# Expo
npm install -g eas-cli

# Supabase
npm install -g supabase

# Vercel
npm install -g vercel
```

---

## 📚 Documentation

### Official Docs
- [Next.js 16](https://nextjs.org/docs)
- [React 19](https://react.dev)
- [Expo SDK 51](https://docs.expo.dev)
- [Supabase](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Project Docs
- `README.md` - Project overview
- `GETTING_STARTED.md` - Setup guide
- `MVP_SPRINT_PLAN.md` - 13-day plan
- `TECH_STACK.md` - This file

---

## ✅ Final Checklist

**Before Development:**
- [x] Node.js 20.9+ installed
- [x] npm 10+ installed
- [x] Package.json files configured
- [x] Tech stack locked

**Before Launch:**
- [ ] All tests passing
- [ ] Data exports verified
- [ ] Security reviewed
- [ ] Performance optimized
- [ ] Deployed to production

---

## 🚀 Quick Start

```bash
# Verify Node version
node --version  # Must be >= 20.9.0

# Install dependencies
npm install

# Set up environment
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env.local

# Start development
npm run web      # Web app
npm run mobile   # Mobile app
```

---

**Status:** ✅ Ready for Development
**Timeline:** 13 days to MVP
**Confidence:** High - All components verified compatible
