# Getting Started with ABC Summit 2025

## 🎉 Week 1 Complete!

You've successfully built the foundation for the ABC Summit 2025 conference app. Here's what's been created and how to get started.

---

## ✅ What's Been Built

### 1. **Database Foundation** (Supabase)
- ✅ Complete PostgreSQL schema (6 tables)
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ Automated triggers
- ✅ Roommate pairing constraints

**Tables:**
- `profiles` - User information
- `events` - Conference events
- `registrations` - Event registrations with travel/hotel data
- `roommate_selections` - User roommate preferences (3 choices)
- `roommate_matches` - Final roommate assignments
- `cancellation_requests` - Registration cancellations

### 2. **Registration System** (Next.js Web)
- ✅ Multi-step form (6 steps)
- ✅ Dynamic flow based on selections
- ✅ Role-based roommate selection (11 job titles)
- ✅ Form validation with Zod
- ✅ Responsive design

**Steps:**
1. Basic Info
2. RSVP
3. Travel Information
4. Hotel & Roommate Selection
5. Personal Preferences
6. Review & Submit

### 3. **Data Export System** (TOP PRIORITY ✨)
- ✅ 6 comprehensive export types
- ✅ CSV format with proper headers
- ✅ No data truncation
- ✅ Export history tracking

**Export Types:**
1. Full Registration Data (all fields)
2. Roommate Selections (original choices)
3. Roommate Matches (final assignments)
4. Flight Data (airline booking format)
5. Hotel Data (room assignments)
6. Catering Data (meal preferences with counts)

### 4. **Admin Dashboard**
- ✅ Overview with statistics
- ✅ Sidebar navigation
- ✅ Quick actions
- ✅ Activity feed
- ✅ Professional UI

### 5. **Mobile App** (Expo/React Native)
- ✅ Tab navigation
- ✅ Travel Hub screen
- ✅ Profile screen (QR code ready)
- ✅ Schedule screen
- ✅ NativeWind styling

### 6. **Shared Package**
- ✅ TypeScript types
- ✅ Roommate pairing rules
- ✅ Form constants
- ✅ Cross-platform utilities

---

## 🚀 Getting Started

### Prerequisites
```bash
# Node.js 18+
node --version

# npm 9+
npm --version
```

### Installation

1. **Clone the repository** (if not already)
```bash
git clone <repo-url>
cd actionbehavior_claude
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**

a. Create a Supabase project at https://supabase.com
b. Copy your project URL and anon key
c. Set up environment variables:

```bash
# Web app
cp apps/web/.env.example apps/web/.env.local
# Edit apps/web/.env.local and add your Supabase credentials

# Mobile app
cp apps/mobile/.env.example apps/mobile/.env.local
# Edit apps/mobile/.env.local and add your Supabase credentials
```

d. Run the database migration:
```bash
# In Supabase SQL Editor, run:
supabase/migrations/20241118000000_initial_schema.sql
```

### Running the Apps

**Web App (Next.js):**
```bash
npm run web
# Opens at http://localhost:3000
```

**Mobile App (Expo):**
```bash
npm run mobile
# Follow Expo instructions to open on device/simulator
```

---

## 📂 Project Structure

```
actionbehavior_claude/
├── apps/
│   ├── web/                    # Next.js web app
│   │   ├── app/
│   │   │   ├── (public)/      # Public routes
│   │   │   │   └── register/  # Registration form
│   │   │   ├── (admin)/       # Admin routes
│   │   │   │   ├── dashboard/ # Admin dashboard
│   │   │   │   └── exports/   # Data exports
│   │   ├── components/        # React components
│   │   └── lib/               # Utilities
│   │
│   └── mobile/                 # Expo mobile app
│       ├── app/
│       │   └── (tabs)/        # Tab navigation
│       └── lib/               # Utilities
│
├── packages/
│   └── shared/                 # Shared code
│       ├── types/             # TypeScript types
│       └── constants/         # Shared constants
│
└── supabase/
    └── migrations/            # Database migrations
```

---

## 🎯 Key Features Demonstrated

### Roommate Pairing Rules
The app implements sophisticated role-based pairing:

```typescript
// Example: BCBAs can only room with BCBAs, Sr. BCBAs, ACDs, or HQ
'BCBA': ['BCBA', 'Sr. BCBA', 'ACD', 'HQ']
```

11 job titles supported with proper compatibility rules.

### Data Exports
The export system ensures NO data loss:
- All fields included
- Proper CSV formatting
- Handles 2,400+ records
- Optimized for different use cases

### Multi-Step Form
Dynamic flow that adapts to user selections:
- Skip travel step if not needed
- Skip hotel step if not needed
- Jump to review if RSVP is "No"

---

## 🔧 Development Workflow

### Adding New Features

1. **Database changes:** Edit migration file in `supabase/migrations/`
2. **Shared types:** Add to `packages/shared/types/`
3. **Web components:** Add to `apps/web/components/`
4. **Mobile screens:** Add to `apps/mobile/app/`

### Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 📋 Next Steps (Week 2)

1. **Roommate Pairing Algorithm**
   - Implement matching algorithm
   - Consider mutual preferences
   - Handle edge cases (odd numbers)
   - Admin override capability

2. **Admin Content Management**
   - Event creation/editing
   - User management
   - Schedule management
   - Speaker management

3. **Push Notifications**
   - Expo push notification setup
   - Notification composer
   - Targeted messaging

4. **QR Code Generation**
   - Generate unique QR codes
   - Barcode scanner for check-in
   - Keep screen awake mode

5. **Shanky Integration**
   - Employee data sync
   - Authentication flow
   - Role assignment

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
# Clear and reinstall
rm -rf node_modules apps/*/node_modules
npm install
```

### Supabase connection issues
- Verify `.env.local` files have correct credentials
- Check Supabase project is active
- Verify RLS policies are applied

### Build errors
```bash
# Web
cd apps/web && npm run build

# Mobile
cd apps/mobile && npx expo doctor
```

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Expo Documentation](https://docs.expo.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🎨 Design System

### Colors
- **Primary:** `#1a1a1a` (Dark)
- **Secondary:** `#f5f5f5` (Light Gray)
- **Accent:** Use Tailwind utility classes

### Components
Using shadcn/ui for web components:
- Buttons
- Forms
- Cards
- Dialogs

---

## 📞 Support

For questions or issues:
1. Check this guide
2. Review code comments
3. Check Supabase logs
4. Review browser/Expo console

---

**Great job on Week 1! You're right on track for the December 1 launch! 🚀**
