# ABC Summit 2025 - Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 20.9+ installed
- npm 10+ installed
- Supabase project created
- Vercel account (for deployment)

### Local Development Setup

1. **Clone and Install**
```bash
git clone <repository-url>
cd actionbehavior_claude
npm install
```

2. **Environment Setup**

Create `apps/web/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

3. **Database Setup**
```bash
# Run migrations
cd supabase
supabase db push

# Or manually run the migration file in Supabase dashboard
```

4. **Run Development Server**
```bash
npm run web
```

Visit `http://localhost:3000`

---

## 🗄️ Database Setup

### Required Tables
All tables are created by running the migration file:
`supabase/migrations/20241118000000_initial_schema.sql`

Tables include:
- `profiles` - User profiles
- `events` - Conference events
- `registrations` - Event registrations
- `roommate_selections` - Roommate preferences
- `roommate_matches` - Final roommate pairings
- `cancellation_requests` - Registration cancellations

### Row Level Security (RLS)
RLS policies are automatically applied to ensure:
- Users can only view/edit their own data
- Admins can view/edit all data
- Public events are visible to all authenticated users

---

## 👤 User Setup

### Creating Admin Users

1. **Sign up a user** through the app or Supabase Auth
2. **Promote to admin** by running in Supabase SQL Editor:
```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@actionbehaviorcenters.com';
```

### Default Roles
- `admin` - Full access to admin panel and all features
- `attendee` - Can register for events and view own data

---

## 🔐 Authentication

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI:
   ```
   https://<your-project>.supabase.co/auth/v1/callback
   ```
4. Add credentials to Supabase Authentication settings

### Email/Password Auth

Enabled by default in Supabase. Users can sign up with email/password.

---

## 🌐 Deployment

### Deploy to Vercel

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Import your Git repository
   - Select `apps/web` as the root directory

2. **Environment Variables**
   Add these in Vercel project settings:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   ```

3. **Build Settings**
   ```
   Framework Preset: Next.js
   Root Directory: apps/web
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   Node Version: 20.x
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

### Custom Domain

1. Add custom domain in Vercel project settings
2. Update DNS records with your domain provider
3. Update Supabase Auth redirect URLs:
   ```
   https://yourdomain.com/auth/callback
   ```

---

## ✅ Post-Deployment Checklist

- [ ] Database migrated and tables created
- [ ] At least one admin user created
- [ ] Google OAuth configured (optional)
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured (optional)
- [ ] Supabase redirect URLs updated
- [ ] Test login flow
- [ ] Test admin panel access
- [ ] Test registration flow
- [ ] Test data exports
- [ ] Test roommate matching algorithm

---

## 📊 Key Features to Test

### Admin Panel
- **Dashboard**: View stats and metrics
- **Registrations**: View, search, filter, and edit registrations
- **Roommates**: View selections, run matching algorithm
- **Travel**: View travel bookings and flight data
- **Users**: Manage user roles (admin/attendee)
- **Exports**: Export data to CSV (6 different export types)
- **Notifications**: Send push notifications (placeholder)
- **Settings**: Configure event settings

### Public Registration
- Multi-step registration form
- Conditional fields based on selections
- Roommate selection (if hotel needed)
- Form validation with Zod
- Submission to database

---

## 🔧 Troubleshooting

### Build Errors

**Error: Cannot find module**
```bash
npm install --force
```

**TypeScript errors**
```bash
npm run type-check
```

### Authentication Issues

**Users can't log in**
- Check Supabase Auth settings
- Verify environment variables
- Check redirect URLs match

**Admin users can't access admin panel**
- Verify user role in database:
```sql
SELECT email, role FROM profiles WHERE email = 'user@example.com';
```

### Database Issues

**Tables don't exist**
- Run migrations in Supabase SQL Editor
- Check migration file for errors

**RLS preventing access**
- Check RLS policies in Supabase
- Verify user authentication status

---

## 📈 Performance Optimization

### Recommended Settings

1. **Enable Vercel Analytics**
2. **Add caching headers** for static assets
3. **Enable Supabase connection pooling**
4. **Set up CDN** for images (if using)

### Database Indexes

All necessary indexes are created by migration. Key indexes:
- User email (for login)
- Registration user_id and event_id
- Roommate selection user_id

---

## 🆘 Support

For issues:
1. Check this guide
2. Review error logs in Vercel
3. Check Supabase logs
4. Contact development team

---

## 📝 Notes

- **Data Exports**: Critical feature - test thoroughly
- **Roommate Algorithm**: Can be re-run multiple times
- **Admin Access**: Protect admin credentials carefully
- **Backup**: Set up automated Supabase backups
- **Monitoring**: Set up error tracking (Sentry, etc.)

---

**Last Updated**: November 2024
**Version**: 1.0.0
