# Week 2 Development Roadmap

## 🎯 Goals for Week 2

Build on the solid foundation from Week 1 by adding:
1. Roommate pairing algorithm
2. Admin content management
3. Advanced features (QR codes, notifications)
4. Authentication flow

---

## Day 8-9: Roommate Pairing Algorithm

### The Challenge
Match 2,400 attendees based on:
- 3 ranked preferences per person
- Role-based compatibility rules
- Mutual preference scoring
- Handle odd numbers

### Implementation Plan

**File:** `apps/web/lib/roommate-algorithm/matcher.ts`

```typescript
// Algorithm pseudo-code:

1. Load all roommate selections
2. Calculate match scores for all pairs:
   - Mutual 1st choice: 100 points
   - One-way 1st choice: 50 points
   - Mutual 2nd choice: 70 points
   - One-way 2nd choice: 35 points
   - Mutual 3rd choice: 40 points
   - One-way 3rd choice: 20 points
3. Sort pairs by score (highest first)
4. Match pairs greedily:
   - Take highest score pair
   - Mark both as matched
   - Remove from pool
   - Repeat
5. Handle unmatched (admin assignment needed)
```

**Claude Prompt:**
```
Implement a stable marriage roommate matching algorithm for ABC Summit.

Requirements:
- Input: roommate_selections table (user_id, 3 choices)
- Output: roommate_matches table (user_1_id, user_2_id, score)
- Consider mutual preferences (higher score)
- Handle one-way preferences
- Role-based compatibility already enforced by selection
- Report unmatched users for admin review

Use TypeScript, Supabase client.
Generate complete matching function with tests.
```

---

## Day 10-11: Admin Content Management

### Features to Build

**1. Event Management**
- Create/edit events
- Set registration deadlines
- Upload event images
- Publish/unpublish events

**File:** `apps/web/app/(admin)/events/page.tsx`

**2. User Management**
- View all users
- Edit user profiles
- Assign roles (admin/attendee)
- Manual user creation
- Import from CSV

**File:** `apps/web/app/(admin)/users/page.tsx`

**3. Schedule Management**
- Add sessions to events
- Set session times/locations
- Assign speakers
- Track capacity

**File:** `apps/web/app/(admin)/schedule/page.tsx`

### Claude Prompts

**Event Management:**
```
Create event management page for admin.

Features:
- List all events (table with status badges)
- Create new event (modal form)
- Edit event (inline or modal)
- Delete event (with confirmation)
- Upload event image (Supabase storage)
- Publish/unpublish toggle

UI: shadcn/ui Table, Dialog, Form components
Data: Supabase events table
```

**User Management:**
```
Create user management page with search/filter.

Features:
- Search by name/email
- Filter by role, job title
- Edit user inline
- Assign admin role
- View user registrations
- Manual add user (not from Shanky)

UI: shadcn/ui Table with filters
Data: Supabase profiles table
```

---

## Day 12-13: QR Code & Check-in System

### Mobile App (QR Display)

**File:** `apps/mobile/app/(tabs)/profile.tsx`

```typescript
// Add QR code generation
import QRCode from 'react-native-qrcode-svg';

// Generate QR from user ID
<QRCode
  value={user.id}
  size={200}
  backgroundColor="white"
  color="black"
/>

// Keep screen awake while displaying
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
```

**Claude Prompt:**
```
Enhance profile screen with QR code for check-in.

Features:
- Large, centered QR code (200x200)
- Generate from user ID
- High contrast for easy scanning
- Keep screen awake when QR visible
- Display user info above QR
- "Ready for Check-in" status indicator

Tech: react-native-qrcode-svg, expo-keep-awake
Show complete profile screen with QR integration.
```

### Web App (Scanner)

**File:** `apps/web/app/(admin)/checkin/page.tsx`

```typescript
// Barcode scanner for check-in
// Or manual ID entry

Features:
- Scan QR code
- Look up user
- Mark as checked in
- Display confirmation
- Play success sound/haptic
```

---

## Day 14: Push Notifications

### Setup Expo Push Notifications

**File:** `apps/mobile/lib/notifications.ts`

```typescript
import * as Notifications from 'expo-notifications';

// Register for push notifications
// Store token in Supabase
// Handle incoming notifications
```

### Admin Notification Composer

**File:** `apps/web/app/(admin)/notifications/page.tsx`

Features:
- Compose message
- Select recipients (all, by role, by event)
- Schedule send time
- Preview notification
- Send test notification

**Claude Prompt:**
```
Create push notification composer for admin.

Features:
- Rich text editor for message
- Title and body
- Recipient selector:
  * All attendees
  * By event registration
  * By job title
  * By RSVP status
- Schedule send (immediate or future)
- Send test to admin device
- Notification history log

UI: shadcn/ui Form, Select, DatePicker
Backend: Expo Push Notifications API
```

---

## Day 15: Authentication & Authorization

### Supabase Auth Setup

**File:** `apps/web/lib/auth/auth-helpers.ts`

```typescript
// Sign in with email
// Sign out
// Get current user
// Check if admin
```

### Protected Routes

**Files:**
- `apps/web/middleware.ts` - Protect admin routes
- `apps/web/app/(public)/login/page.tsx` - Login page
- `apps/mobile/app/(auth)/login.tsx` - Mobile login

**Claude Prompt:**
```
Implement authentication flow with Supabase.

Web:
- Login page with email/password
- Middleware to protect /admin routes
- Redirect to login if not authenticated
- Redirect to dashboard after login
- Admin role check for admin routes

Mobile:
- Login screen
- Persistent session (AsyncStorage)
- Auto-login on app open
- Logout functionality

Use Supabase Auth, proper error handling.
```

---

## Quick Wins for Week 2

These can be done in parallel or as time allows:

### 1. Email Notifications
Set up Supabase email templates for:
- Registration confirmation
- Roommate assignment
- Travel information updates

### 2. Real-time Updates
Add Supabase subscriptions for:
- New registrations (admin dashboard)
- Roommate matches
- Cancellation requests

### 3. File Uploads
Implement event image uploads:
```typescript
// Upload to Supabase Storage
const { data, error } = await supabase
  .storage
  .from('event-images')
  .upload(`${eventId}.jpg`, file);
```

### 4. Data Validation
Add server-side validation:
- Unique email check
- Valid job title check
- Event capacity limits

### 5. Error Handling
Improve error messages:
- User-friendly error display
- Retry logic for failed requests
- Offline handling (mobile)

---

## Testing Strategy

### What to Test

**Registration Flow:**
1. Complete full registration (Yes RSVP)
2. Register with No RSVP
3. Register with travel, no hotel
4. Register with hotel, no travel
5. Select 3 roommates
6. Submit and verify data in Supabase

**Data Exports:**
1. Export with 0 records
2. Export with 1 record
3. Export with 100+ records
4. Verify all fields present
5. Open CSV in Excel/Google Sheets

**Admin Dashboard:**
1. View statistics
2. Navigate all sections
3. Quick actions work
4. Check admin-only access

**Mobile App:**
1. Navigate all tabs
2. View profile
3. Display QR code
4. Travel hub shows data

---

## Performance Optimization

### Week 2 Focus

**Database:**
- Add indexes if queries are slow
- Use `.select()` to limit columns
- Implement pagination for large lists

**Web:**
- Lazy load admin routes
- Optimize images (next/image)
- Minimize bundle size

**Mobile:**
- Cache static data
- Optimize FlatList rendering
- Minimize re-renders

---

## Deployment Prep

### Vercel (Web)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel
```

### Expo EAS (Mobile)
```bash
# Install EAS CLI
npm i -g eas-cli

# Configure
cd apps/mobile
eas build:configure

# Build
eas build --platform ios
eas build --platform android
```

---

## Week 2 Success Criteria

By end of Week 2, you should have:

- [ ] Roommate matching algorithm working
- [ ] Admin can create/edit events
- [ ] Admin can manage users
- [ ] QR codes display on mobile
- [ ] Check-in system functional
- [ ] Push notifications sending
- [ ] Authentication protecting routes
- [ ] All exports tested with real data

---

## Pro Tips

### Vibe Coding with Claude

**When stuck:**
```
I'm implementing [feature]. Here's what I have [paste code].
The issue is [describe problem].
Expected: [what should happen]
Actual: [what's happening]
Error: [paste error if any]

Help me debug and fix this.
```

**For new features:**
```
I need to implement [feature description].
Context: [relevant files/structure]
Requirements: [list requirements]
Tech stack: [mention specific libraries]

Generate complete implementation with:
1. Component structure
2. Type definitions
3. Error handling
4. Loading states
```

### Cursor Composer Tips

- Select multiple related files
- Ask for consistent changes across files
- Use for type updates across codebase

### Time-Saving Tricks

1. **Copy patterns** - Use existing components as templates
2. **Reuse exports** - Export functions are similar, copy and modify
3. **Shared types** - Define once in packages/shared
4. **shadcn/ui** - Install components as needed: `npx shadcn-ui add [component]`

---

**You're doing great! Week 2 will add the "smart" features. Let's go! 🚀**
