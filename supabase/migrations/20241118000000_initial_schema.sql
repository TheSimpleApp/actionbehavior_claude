-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- Extends auth.users with additional user information
-- =====================================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  preferred_name TEXT,
  job_title TEXT,
  department TEXT,
  center_id TEXT,
  market TEXT,
  role TEXT DEFAULT 'attendee' CHECK (role IN ('admin', 'attendee')),
  from_shanky BOOLEAN DEFAULT false,
  phone_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- EVENTS TABLE
-- Conference events
-- =====================================================
CREATE TABLE public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  max_attendees INTEGER,
  registration_deadline TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- REGISTRATIONS TABLE
-- User registrations for events with all travel/hotel data
-- =====================================================
CREATE TABLE public.registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,

  -- RSVP Status
  rsvp_status TEXT DEFAULT 'pending' CHECK (rsvp_status IN ('yes', 'no', 'pending')),
  registered_at TIMESTAMPTZ DEFAULT NOW(),

  -- Travel Information
  travel_needed BOOLEAN DEFAULT false,
  government_name TEXT, -- As on ID
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('M', 'F', 'Other')),
  personal_email TEXT,
  frequent_flyer_southwest TEXT,
  frequent_flyer_american TEXT,
  frequent_flyer_united TEXT,
  flight_preference_1 TEXT,
  flight_preference_2 TEXT,

  -- Hotel Information
  hotel_needed BOOLEAN DEFAULT false,

  -- Personal Preferences
  shirt_size TEXT,
  meal_preference TEXT,
  medical_accommodations BOOLEAN DEFAULT false,
  medical_accommodations_note TEXT,
  comments TEXT,

  -- Check-in
  checked_in BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  checked_in_by UUID REFERENCES public.profiles(id),

  -- Meta
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one registration per user per event
  UNIQUE(user_id, event_id)
);

-- =====================================================
-- ROOMMATE_SELECTIONS TABLE
-- User's 3 roommate choices (ranked)
-- =====================================================
CREATE TABLE public.roommate_selections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,

  -- Ranked choices
  choice_1_user_id UUID REFERENCES public.profiles(id),
  choice_2_user_id UUID REFERENCES public.profiles(id),
  choice_3_user_id UUID REFERENCES public.profiles(id),

  -- Metadata
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  locked BOOLEAN DEFAULT false, -- Lock after submission deadline

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one selection per user per event
  UNIQUE(user_id, event_id),

  -- Ensure no duplicate choices
  CHECK (
    choice_1_user_id IS DISTINCT FROM choice_2_user_id AND
    choice_1_user_id IS DISTINCT FROM choice_3_user_id AND
    choice_2_user_id IS DISTINCT FROM choice_3_user_id
  )
);

-- =====================================================
-- ROOMMATE_MATCHES TABLE
-- Final roommate assignments (algorithm or admin override)
-- =====================================================
CREATE TABLE public.roommate_matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,

  -- The two matched users
  user_1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  user_2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  -- Matching metadata
  match_score INTEGER, -- Algorithm score
  matched_by TEXT CHECK (matched_by IN ('algorithm', 'admin')),
  matched_by_admin_id UUID REFERENCES public.profiles(id),

  -- Hotel details (admin fills this in)
  hotel_name TEXT,
  confirmation_number TEXT,
  room_number TEXT,

  confirmed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure user_1_id < user_2_id to prevent duplicates
  CHECK (user_1_id < user_2_id),

  -- Ensure unique pairing per event
  UNIQUE(event_id, user_1_id, user_2_id)
);

-- =====================================================
-- CANCELLATION_REQUESTS TABLE
-- Handle registration cancellations
-- =====================================================
CREATE TABLE public.cancellation_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE NOT NULL,

  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),

  requested_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES public.profiles(id),
  admin_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Profiles
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_job_title ON public.profiles(job_title);
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- Events
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_dates ON public.events(start_date, end_date);

-- Registrations
CREATE INDEX idx_registrations_user_id ON public.registrations(user_id);
CREATE INDEX idx_registrations_event_id ON public.registrations(event_id);
CREATE INDEX idx_registrations_rsvp_status ON public.registrations(rsvp_status);
CREATE INDEX idx_registrations_travel_needed ON public.registrations(travel_needed);
CREATE INDEX idx_registrations_hotel_needed ON public.registrations(hotel_needed);

-- Roommate Selections
CREATE INDEX idx_roommate_selections_user_id ON public.roommate_selections(user_id);
CREATE INDEX idx_roommate_selections_event_id ON public.roommate_selections(event_id);

-- Roommate Matches
CREATE INDEX idx_roommate_matches_event_id ON public.roommate_matches(event_id);
CREATE INDEX idx_roommate_matches_user_1 ON public.roommate_matches(user_1_id);
CREATE INDEX idx_roommate_matches_user_2 ON public.roommate_matches(user_2_id);

-- Cancellation Requests
CREATE INDEX idx_cancellation_requests_status ON public.cancellation_requests(status);
CREATE INDEX idx_cancellation_requests_registration ON public.cancellation_requests(registration_id);

-- =====================================================
-- UPDATED_AT TRIGGERS
-- Automatically update updated_at timestamp
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.registrations FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.roommate_selections FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.roommate_matches FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.cancellation_requests FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roommate_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roommate_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cancellation_requests ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

-- Users can view all profiles (for roommate selection)
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can insert profiles
CREATE POLICY "Admins can insert profiles"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- EVENTS POLICIES
-- =====================================================

-- Anyone can view published events
CREATE POLICY "Published events are viewable by all"
  ON public.events FOR SELECT
  TO authenticated
  USING (status = 'published');

-- Admins can view all events
CREATE POLICY "Admins can view all events"
  ON public.events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can insert/update/delete events
CREATE POLICY "Admins can manage events"
  ON public.events FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- REGISTRATIONS POLICIES
-- =====================================================

-- Users can view their own registrations
CREATE POLICY "Users can view own registrations"
  ON public.registrations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all registrations
CREATE POLICY "Admins can view all registrations"
  ON public.registrations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can insert their own registrations
CREATE POLICY "Users can insert own registrations"
  ON public.registrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own registrations
CREATE POLICY "Users can update own registrations"
  ON public.registrations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can update any registration
CREATE POLICY "Admins can update any registration"
  ON public.registrations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- ROOMMATE_SELECTIONS POLICIES
-- =====================================================

-- Users can view their own selections
CREATE POLICY "Users can view own roommate selections"
  ON public.roommate_selections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all selections
CREATE POLICY "Admins can view all roommate selections"
  ON public.roommate_selections FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can insert their own selections
CREATE POLICY "Users can insert own roommate selections"
  ON public.roommate_selections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own selections (if not locked)
CREATE POLICY "Users can update own roommate selections"
  ON public.roommate_selections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND NOT locked)
  WITH CHECK (auth.uid() = user_id AND NOT locked);

-- Admins can update any selection
CREATE POLICY "Admins can update any roommate selection"
  ON public.roommate_selections FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- ROOMMATE_MATCHES POLICIES
-- =====================================================

-- Users can view their own matches
CREATE POLICY "Users can view own roommate matches"
  ON public.roommate_matches FOR SELECT
  TO authenticated
  USING (auth.uid() = user_1_id OR auth.uid() = user_2_id);

-- Admins can view all matches
CREATE POLICY "Admins can view all roommate matches"
  ON public.roommate_matches FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can insert/update/delete matches
CREATE POLICY "Admins can manage roommate matches"
  ON public.roommate_matches FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- CANCELLATION_REQUESTS POLICIES
-- =====================================================

-- Users can view their own cancellation requests
CREATE POLICY "Users can view own cancellation requests"
  ON public.cancellation_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.registrations
      WHERE id = cancellation_requests.registration_id
      AND user_id = auth.uid()
    )
  );

-- Admins can view all cancellation requests
CREATE POLICY "Admins can view all cancellation requests"
  ON public.cancellation_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can insert their own cancellation requests
CREATE POLICY "Users can insert own cancellation requests"
  ON public.cancellation_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.registrations
      WHERE id = registration_id
      AND user_id = auth.uid()
    )
  );

-- Only admins can update cancellation requests
CREATE POLICY "Admins can update cancellation requests"
  ON public.cancellation_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- FUNCTION: Create profile on signup
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
