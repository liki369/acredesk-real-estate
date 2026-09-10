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
