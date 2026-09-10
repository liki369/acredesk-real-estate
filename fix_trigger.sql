CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, role, phone_number)
  VALUES (
    NEW.id,
    NEW.email,
    'dealer'::user_role,
    NEW.raw_user_meta_data->>'phone_number'
  );
  RETURN NEW;
END;
$$;
