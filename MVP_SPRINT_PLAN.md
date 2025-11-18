# 🚨 ABC Summit 2025 - 13-DAY MVP SPRINT PLAN

**Launch Date:** December 1, 2025 (13 days from today)
**Event Date:** February 27-28, 2026
**Strategy:** Ship working MVP, polish after launch before event

---

## 📋 MVP SCOPE (What We MUST Ship by Dec 1)

### ✅ MUST HAVE (Non-Negotiable)
1. **Registration Form** - Users can register for event
2. **Roommate Selection** - Users select 3 roommates (dropdowns)
3. **Data Exports** - Admin can export ALL data to CSV (6 types) ⭐ **TOP PRIORITY**
4. **Admin Dashboard** - View registrations, manual roommate assignment
5. **Mobile App Shell** - View event info, travel details
6. **Authentication** - Google Sign-In for access control
7. **Deployed** - Web on Vercel, Mobile on TestFlight

### ❌ DEFER TO POST-LAUNCH (Before Feb 2026 Event)
- Automated roommate pairing algorithm (manual assignment for now)
- Shanky integration (manual CSV import for MVP)
- QR code check-in (add before event)
- Interactive floor plans (static images for MVP)
- Advanced push notifications (basic Expo push if time allows)
- Real-time features (not critical for MVP)

---

## 📅 DAY-BY-DAY SPRINT PLAN

### **DAY 1: Monday Nov 18** ✅ DONE
**Focus:** Foundation & Database

- [x] Update to production tech stack (Next.js 16, React 19, Expo SDK 51)
- [x] Database schema designed and ready
- [x] Project structure created
- [x] Package.json files configured

**Deliverable:** Project initialized with correct versions

---

### **DAY 2: Tuesday Nov 19**
**Focus:** Authentication & Setup

**Morning (4 hours):**
- [ ] Set up Supabase project
- [ ] Run database migration
- [ ] Configure Supabase Auth (Google Sign-In)
- [ ] Create auth helpers

**Afternoon (4 hours):**
- [ ] Web: Login page
- [ ] Web: Middleware to protect /admin routes
- [ ] Mobile: Login screen
- [ ] Test: Sign in/out works

**Files to Create:**
- `apps/web/app/(auth)/login/page.tsx`
- `apps/web/middleware.ts`
- `apps/web/lib/auth/auth-helpers.ts`
- `apps/mobile/app/(auth)/login.tsx`

**Evening Checkpoint:** Can sign in with Google on both web and mobile

---

### **DAY 3: Wednesday Nov 20**
**Focus:** Registration Form (Simplified for MVP)

**Morning (4 hours):**
- [ ] Simplify form to 3 steps (not 6):
  1. Basic Info + RSVP
  2. Travel + Hotel needs
  3. Roommate selection + Personal preferences
- [ ] Remove complex conditional logic
- [ ] Focus on getting data into database

**Afternoon (4 hours):**
- [ ] Build roommate selector (simple dropdowns)
- [ ] Remove role-based filtering for MVP (too complex)
- [ ] Just show all users, let them pick 3
- [ ] Form submission to Supabase

**Files to Update:**
- Simplify `apps/web/components/registration/RegistrationForm.tsx`
- Simplify step components
- Update `RoommateSelector.tsx` to be basic

**Evening Checkpoint:** Can complete registration end-to-end

---

### **DAY 4: Thursday Nov 21**
**Focus:** Data Exports (TOP PRIORITY ⭐)

**All Day (8 hours):**
- [ ] Test export functions with real data
- [ ] Create 50-100 test registrations
- [ ] Export all 6 types:
  1. Full registration data
  2. Roommate selections
  3. Roommate matches (empty for now, manual later)
  4. Flight data
  5. Hotel data
  6. Catering data
- [ ] Verify CSV opens in Excel correctly
- [ ] Ensure NO data truncation
- [ ] Add error handling
- [ ] Test with 500+ records (simulate scale)

**Critical Testing:**
- [ ] Export with 0 records (should work)
- [ ] Export with 1 record
- [ ] Export with 100+ records
- [ ] Export with 500+ records
- [ ] Verify all fields present
- [ ] Check for data quality issues

**Evening Checkpoint:** Exports work flawlessly, client can download complete data

---

### **DAY 5: Friday Nov 22**
**Focus:** Admin Dashboard - View & Manage

**Morning (4 hours):**
- [ ] Admin registrations list page
- [ ] Search/filter registrations
- [ ] View individual registration details
- [ ] Export button on admin (link to exports page)

**Afternoon (4 hours):**
- [ ] Manual roommate assignment UI
- [ ] Admin can pair users manually
- [ ] Admin can edit assignments
- [ ] Admin can export roommate matches

**Files to Create:**
- `apps/web/app/(admin)/registrations/page.tsx`
- `apps/web/app/(admin)/roommates/page.tsx`
- `apps/web/components/admin/RegistrationList.tsx`
- `apps/web/components/admin/RoommateAssignment.tsx`

**Evening Checkpoint:** Admin can view all data and manually assign roommates

---

### **DAY 6-7: Weekend Nov 23-24**
**Focus:** Mobile App MVP

**Saturday (8 hours):**
- [ ] Mobile auth flow (Google Sign-In)
- [ ] Home screen with event info
- [ ] Travel Hub screen with user's travel details
- [ ] Profile screen (no QR yet, just info)

**Sunday (8 hours):**
- [ ] Schedule screen (list sessions)
- [ ] Pull registration data from Supabase
- [ ] Display roommate assignment (if assigned)
- [ ] Style and polish UI
- [ ] Test on iOS simulator/device

**Files to Update:**
- `apps/mobile/app/(tabs)/*`
- Add auth flow
- Connect to Supabase

**Weekend Checkpoint:** Mobile app functional with basic features

---

### **DAY 8: Monday Nov 25**
**Focus:** Testing & Bug Fixes

**Morning (4 hours):**
- [ ] End-to-end testing:
  - Register new user
  - Select roommates
  - Admin views registration
  - Admin assigns roommate
  - Export all data
  - User sees assignment on mobile
- [ ] Fix any bugs found

**Afternoon (4 hours):**
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Mobile testing (iOS and Android)
- [ ] Responsive design fixes
- [ ] Error message improvements

**Evening Checkpoint:** Core flow works without errors

---

### **DAY 9: Tuesday Nov 26**
**Focus:** Polish & UX Improvements

**Morning (4 hours):**
- [ ] Improve loading states
- [ ] Add success messages
- [ ] Better error handling
- [ ] Form validation messages
- [ ] Loading spinners

**Afternoon (4 hours):**
- [ ] UI polish (spacing, colors, fonts)
- [ ] Add confirmation dialogs
- [ ] Improve navigation
- [ ] Add help text/tooltips
- [ ] Accessibility basics

**Evening Checkpoint:** App feels polished and professional

---

### **DAY 10: Wednesday Nov 27**
**Focus:** Deployment Prep

**Morning (4 hours):**
- [ ] Set up Vercel project
- [ ] Configure environment variables
- [ ] Test build locally: `npm run build`
- [ ] Fix any build errors
- [ ] Optimize images

**Afternoon (4 hours):**
- [ ] Set up EAS (Expo Application Services)
- [ ] Configure `eas.json`
- [ ] Test mobile build locally
- [ ] Prepare app store assets (screenshots, description)

**Files to Create:**
- `vercel.json` (if needed)
- `eas.json`
- App store copy

**Evening Checkpoint:** Ready to deploy

---

### **DAY 11: Thursday Nov 28** (Thanksgiving)
**Focus:** Deploy Web + Start Mobile Submission

**Morning (4 hours):**
- [ ] Deploy web to Vercel
- [ ] Test production deployment
- [ ] Configure custom domain (if applicable)
- [ ] Smoke test all features in prod

**Afternoon (4 hours):**
- [ ] Build iOS app: `eas build --platform ios --auto-submit`
- [ ] Build Android app: `eas build --platform android`
- [ ] Submit iOS to TestFlight
- [ ] Submit Android to internal testing

**Evening Checkpoint:** Web live, mobile submitted to app stores

---

### **DAY 12: Friday Nov 29**
**Focus:** App Store Review & Fixes

**All Day:**
- [ ] Monitor TestFlight submission status
- [ ] Fix any app store rejection issues
- [ ] Test deployed apps with real devices
- [ ] Create test user accounts
- [ ] Prepare for client demo

**Critical Tasks:**
- [ ] Ensure iOS app is in TestFlight
- [ ] Ensure Android app is in internal testing
- [ ] Web app accessible via URL
- [ ] All export functions work in production

**Evening Checkpoint:** Apps approved and available for testing

---

### **DAY 13: Saturday Nov 30**
**Focus:** Final Testing & Documentation

**Morning (4 hours):**
- [ ] Complete end-to-end testing in production
- [ ] Test with multiple users simultaneously
- [ ] Verify data exports with production data
- [ ] Check mobile app on physical devices

**Afternoon (4 hours):**
- [ ] Create admin user guide
- [ ] Create attendee user guide
- [ ] Record demo video
- [ ] Prepare handoff documentation

**Files to Create:**
- `ADMIN_GUIDE.md`
- `ATTENDEE_GUIDE.md`
- Demo video

**Evening Checkpoint:** Ready for Dec 1 launch

---

### **DAY 14: Sunday Dec 1** 🚀 LAUNCH DAY
**Focus:** Launch & Monitoring

**Morning:**
- [ ] Final smoke tests
- [ ] Invite first batch of test users
- [ ] Monitor for errors
- [ ] Quick response to any issues

**Afternoon:**
- [ ] Send launch email to all attendees
- [ ] Monitor registration submissions
- [ ] Monitor mobile app downloads
- [ ] Track export usage

**Client Demo:**
- [ ] Show working registration form
- [ ] Demonstrate data exports ⭐
- [ ] Show mobile app
- [ ] Demo admin dashboard

---

## 🎯 SUCCESS METRICS (Dec 1 Launch)

**Critical (Must Work):**
- [x] Users can register for event
- [x] Users can select 3 roommates
- [x] Admin can export ALL data to CSV (all 6 types) ⭐
- [x] Admin can manually assign roommates
- [x] Mobile app shows event info
- [x] Mobile app available on TestFlight
- [x] Web app deployed on Vercel

**Nice to Have (Can Fix After Launch):**
- [ ] Push notifications
- [ ] QR code generation
- [ ] Advanced filtering
- [ ] Real-time updates

---

## 🚨 RISK MITIGATION

### High-Risk Items & Mitigation

**1. App Store Rejection**
- **Mitigation:** Using proven Expo SDK 51, existing app V2 (faster approval)
- **Backup Plan:** Web-only MVP if needed, add mobile in January

**2. Next.js 16 Migration Issues**
- **Mitigation:** Next.js 16 is LTS, 2 months in production
- **Backup Plan:** Can stay on Next.js 14 until Dec 1 if issues arise

**3. Data Export Complexity**
- **Mitigation:** Simple PostgreSQL → CSV, already tested in code
- **Backup Plan:** Manual SQL queries if export functions fail

**4. Timeline Too Tight**
- **Mitigation:** MVP-only scope, defer non-critical features
- **Backup Plan:** Cut roommate selection if needed (admin assigns all)

---

## 📊 POST-LAUNCH ROADMAP (Dec 2 - Feb 27)

**December (3 weeks):**
- Add automated roommate pairing algorithm
- Implement QR code generation
- Add push notifications
- Polish mobile app UI

**January (4 weeks):**
- Shanky integration (employee data sync)
- Interactive floor plans
- Advanced admin features
- Real-time updates

**February (3 weeks before event):**
- Final testing with full attendee list
- QR check-in testing
- Performance optimization
- Last-minute polish

---

## 💡 DAILY WORKFLOW

**Each Day:**
1. **Morning Standup** (15 min)
   - What did I accomplish yesterday?
   - What am I doing today?
   - Any blockers?

2. **Focus Work** (6-8 hours)
   - Follow daily plan
   - Use Claude/Cursor for vibe coding
   - Test as you build

3. **Evening Review** (30 min)
   - Did I hit checkpoint?
   - Any tasks to move to tomorrow?
   - Update sprint board

4. **Commit & Push** (Daily)
   - Commit working code daily
   - Push to GitHub
   - Deploy to staging (if set up)

---

## 🎨 SIMPLIFIED MVP FEATURES

### Registration Form (3 Steps, Not 6)
**Step 1: Basic Info + RSVP**
- Name, email
- Yes/No attendance

**Step 2: Travel + Hotel**
- Travel needed? (Y/N) → If yes: government name, DOB, gender
- Hotel needed? (Y/N)

**Step 3: Roommates + Personal**
- Select 3 roommates (simple dropdown, no role filtering)
- Shirt size, meal preference
- Submit

**Why Simplified:**
- Faster to build
- Easier to test
- Less error-prone
- Still captures all data

### Roommate Selection (No Algorithm for MVP)
**MVP Approach:**
- Users select 3 preferences
- Admin manually reviews and assigns
- Admin can see who selected whom
- Export shows original selections

**Why Manual:**
- Algorithm is complex (2-3 days to build + test)
- Manual works fine for 2,400 people
- Can build algorithm after launch
- Reduces launch risk

### Mobile App (View-Only for MVP)
**MVP Features:**
- View event information
- View your registration
- View assigned roommate
- View travel details
- View schedule

**No Interaction Needed:**
- No editing registration (do on web)
- No roommate selection (do on web)
- No QR scanning (add before event)

---

## 🔥 FOCUS AREAS BY DAY

| Day | Primary Focus | Secondary Focus | Checkpoint |
|-----|--------------|-----------------|------------|
| 1 | Setup ✅ | Database ✅ | Initialized |
| 2 | Auth | Setup | Can login |
| 3 | Registration | Forms | Can register |
| 4 | **Data Exports** ⭐ | Testing | Exports work |
| 5 | Admin UI | Management | Can manage |
| 6-7 | Mobile App | Testing | App functional |
| 8 | Testing | Bug fixes | No critical bugs |
| 9 | Polish | UX | Feels good |
| 10 | Deploy prep | Build | Ready to ship |
| 11 | Deploy web | Submit mobile | Web live |
| 12 | App review | Fixes | Apps approved |
| 13 | Final test | Documentation | Ready to launch |
| 14 | **LAUNCH** 🚀 | Monitor | Live! |

---

## ✅ DEFINITION OF DONE

**Feature Complete When:**
- [ ] Code written and tested
- [ ] Works in development
- [ ] Works in production
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Loading states implemented
- [ ] Error handling added
- [ ] User can complete task end-to-end

**Sprint Complete When:**
- [ ] All MUST HAVE features working
- [ ] Data exports tested with 500+ records
- [ ] Web app deployed to Vercel
- [ ] Mobile app on TestFlight
- [ ] Admin can perform all core tasks
- [ ] Zero critical bugs
- [ ] Client demo ready

---

## 🚀 LET'S EXECUTE!

**You have 13 days. Every day counts. Focus on:**
1. **Data exports** (your #1 priority)
2. **Basic functionality** over fancy features
3. **Working code** over perfect code
4. **Shipping** over endless polish

**You can do this! 💪**

The tech stack is solid. The plan is realistic. The scope is achievable.

**Next:** Start Day 2 - Set up Supabase and implement authentication.
