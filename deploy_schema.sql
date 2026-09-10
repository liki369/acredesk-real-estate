-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis SCHEMA extensions;

-- Create Enums
CREATE TYPE user_role AS ENUM ('superadmin', 'dealer');
CREATE TYPE property_status AS ENUM ('draft', 'pending_review', 'published', 'sold');
CREATE TYPE property_type AS ENUM ('house', 'land', 'commercial');
CREATE TYPE lead_stage AS ENUM ('new', 'contacted', 'site_visit', 'negotiating', 'closed');

-- Users Table (Extended from auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'dealer'::user_role,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Properties Table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type property_type NOT NULL,
  price NUMERIC NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  lat_lng geography(POINT) NOT NULL,
  media_urls TEXT[] NOT NULL DEFAULT '{}',
  status property_status NOT NULL DEFAULT 'draft'::property_status,
  dealer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  specs JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Leads Table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  customer_info JSONB NOT NULL,
  stage lead_stage NOT NULL DEFAULT 'new'::lead_stage,
  assigned_agent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for RLS Performance
CREATE INDEX idx_properties_dealer_id ON public.properties(dealer_id);
CREATE INDEX idx_leads_assigned_agent_id ON public.leads(assigned_agent_id);
CREATE INDEX idx_properties_status ON public.properties(status);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Read/Write restricted to superadmins (using auth.uid() lookup)
CREATE POLICY "Superadmins can read users" ON public.users
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = (SELECT auth.uid())) = 'superadmin'
  );

-- Properties: Public can read published properties
CREATE POLICY "Public can read published properties" ON public.properties
  FOR SELECT USING (status = 'published');

-- Properties: Dealers can read all their own properties
CREATE POLICY "Dealers can read their own properties" ON public.properties
  FOR SELECT USING (dealer_id = (SELECT auth.uid()));

-- Properties: Dealer scoped write
CREATE POLICY "Dealers can insert their own properties" ON public.properties
  FOR INSERT WITH CHECK (dealer_id = (SELECT auth.uid()));

CREATE POLICY "Dealers can update their own properties" ON public.properties
  FOR UPDATE USING (dealer_id = (SELECT auth.uid()));

-- Leads: Agents can read/write their assigned leads
CREATE POLICY "Agents can read their leads" ON public.leads
  FOR SELECT USING (assigned_agent_id = (SELECT auth.uid()));

CREATE POLICY "Agents can update their leads" ON public.leads
  FOR UPDATE USING (assigned_agent_id = (SELECT auth.uid()));
-- Add phone_number to existing users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Create trigger function for new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, phone_number)
  VALUES (
    NEW.id,
    NEW.email,
    'dealer'::user_role, -- In our system, the base role is dealer
    NEW.raw_user_meta_data->>'phone_number'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
