# ABC Summit 2025 - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- Supabase account (free tier OK)
- Git

### 1. Clone & Install
```bash
git clone <your-repo>
cd actionbehavior_claude
npm install
cd apps/web
npm install
```

### 2. Configure Environment
Create `apps/web/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Development Server
```bash
cd apps/web
npm run dev
```

Visit: http://localhost:3000

### 4. Setup Database
1. Go to Supabase dashboard
2. Run the migration in `supabase/migrations/20241118000000_initial_schema.sql`
3. Tables will be created automatically

### 5. Create Admin User
In Supabase dashboard:
1. Go to Authentication > Users
2. Add a user with your email
3. In SQL Editor:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

---

## 📍 Key Pages

### Admin Panel
- **Dashboard**: `/dashboard`
- **Users**: `/users`
- **Registrations**: `/admin/registrations`
- **Roommate Pairing**: `/admin/roommates`
- **Data Exports**: `/exports`

### Public
- **Registration**: `/register`

---

## 🎯 Quick Actions

### Export All Data
1. Go to `/exports`
2. Click "Export Full Registration Data"
3. CSV downloads automatically

### Add a User
1. Go to `/users`
2. Click "Add User"
3. Fill form and save

### Run Roommate Algorithm
1. Go to `/admin/roommates`
2. Review selections in first tab
3. Click "Run Pairing Algorithm"
4. View matches in second tab

### Manage Registrations
1. Go to `/admin/registrations`
2. Use search and filters
3. Update RSVP status via dropdown

---

## 📦 What's Included

✅ **User Management** - CRUD operations
✅ **Registration Management** - View, filter, edit
✅ **Roommate Pairing** - Sophisticated algorithm
✅ **6 CSV Exports** - All data types
✅ **Multi-step Registration** - Public form
✅ **Beautiful UI** - shadcn/ui components
✅ **Type Safety** - Full TypeScript
✅ **Database** - PostgreSQL via Supabase

---

## 🆘 Troubleshooting

### Dev server won't start
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### Database connection error
- Check `.env.local` has correct Supabase URL and key
- Verify Supabase project is running
- Check network/firewall

### Can't see any data
- Make sure you've run the database migration
- Create test data in Supabase dashboard
- Check browser console for errors

### Exports not working
- Verify database has data
- Check browser downloads folder
- Look for errors in browser console

---

## 📚 Full Documentation

See `IMPLEMENTATION_COMPLETE.md` for:
- Complete feature list
- Architecture details
- Code examples
- Best practices
- Event day tips

---

## 🎨 Using shadcn/ui

Add more components as needed:
```bash
cd apps/web
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast
```

See: https://ui.shadcn.com

---

## 🔧 Common Tasks

### Add a new export
1. Open `apps/web/lib/exports/export-functions.ts`
2. Add new export function
3. Import in `apps/web/app/(admin)/exports/page.tsx`
4. Add to exports array

### Create a new admin page
1. Create `apps/web/app/(admin)/your-page/page.tsx`
2. Add to sidebar in `components/admin/AdminSidebar.tsx`
3. Use shadcn/ui components for UI

### Modify database
1. Update `supabase/migrations/` SQL
2. Run in Supabase SQL Editor
3. Update `packages/shared/types/database.ts`

---

## 📊 Test Data

### Create Test Users
```sql
-- In Supabase SQL Editor
INSERT INTO profiles (id, email, full_name, job_title, role)
VALUES
  (gen_random_uuid(), 'admin@test.com', 'Admin User', 'Administrator', 'admin'),
  (gen_random_uuid(), 'user1@test.com', 'Test User 1', 'Developer', 'attendee'),
  (gen_random_uuid(), 'user2@test.com', 'Test User 2', 'Designer', 'attendee');
```

### Create Test Event
```sql
INSERT INTO events (title, start_date, end_date, status)
VALUES ('ABC Summit 2025', '2025-02-27', '2025-02-28', 'published');
```

---

## 🚢 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy automatically

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 🎯 For Event Day

1. ✅ Test all exports week before
2. ✅ Lock roommate selections 2 weeks before
3. ✅ Run pairing algorithm 1 week before
4. ✅ Print backup attendee list
5. ✅ Have admin credentials ready
6. ✅ Monitor registration dashboard

---

**Questions?** Check `IMPLEMENTATION_COMPLETE.md` or search codebase for examples.

**Built with Next.js 16, Supabase, shadcn/ui, and TypeScript**
