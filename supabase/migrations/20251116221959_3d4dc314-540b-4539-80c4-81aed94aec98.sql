-- Create a function to notify admins when a new inquiry is submitted
CREATE OR REPLACE FUNCTION public.notify_admin_on_new_inquiry()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_id bigint;
  payload jsonb;
  supabase_url text := 'https://lktbvwqvrldzskyueexm.supabase.co';
  service_key text := current_setting('app.settings.service_role_key', true);
BEGIN
  -- Build the payload
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', TG_TABLE_NAME,
    'record', row_to_json(NEW)
  );

  -- Call the edge function asynchronously
  SELECT net.http_post(
    url := supabase_url || '/functions/v1/notify-admin-inquiry',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_key
    ),
    body := payload
  ) INTO request_id;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the insert
    RAISE WARNING 'Failed to notify admins: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger to call the function on new inquiries
DROP TRIGGER IF EXISTS on_inquiry_submitted ON public.pilot_inquiries;
CREATE TRIGGER on_inquiry_submitted
  AFTER INSERT ON public.pilot_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_on_new_inquiry();