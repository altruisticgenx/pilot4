-- Create admin audit log table
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  action TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs"
ON public.admin_audit_log
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- System can insert audit logs (via trigger)
CREATE POLICY "System can insert audit logs"
ON public.admin_audit_log
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create index for performance
CREATE INDEX idx_admin_audit_user_id ON public.admin_audit_log(user_id);
CREATE INDEX idx_admin_audit_created_at ON public.admin_audit_log(created_at DESC);
CREATE INDEX idx_admin_audit_action ON public.admin_audit_log(action);

-- Create allowed email domains table
CREATE TABLE IF NOT EXISTS public.allowed_email_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.allowed_email_domains ENABLE ROW LEVEL SECURITY;

-- Only admins can manage allowed domains
CREATE POLICY "Only admins can manage allowed domains"
ON public.allowed_email_domains
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Insert default allowed domains (.edu and project domains)
INSERT INTO public.allowed_email_domains (domain, description) VALUES
  ('edu', 'Educational institutions'),
  ('lovable.org', 'Lovable organization'),
  ('impactlab.org', 'Impact Lab organization')
ON CONFLICT (domain) DO NOTHING;

-- Function to validate email domain
CREATE OR REPLACE FUNCTION public.is_email_domain_allowed(email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  email_domain TEXT;
  is_allowed BOOLEAN;
BEGIN
  -- Extract domain from email
  email_domain := split_part(email, '@', 2);
  
  -- Check if domain ends with .edu
  IF email_domain LIKE '%.edu' THEN
    RETURN TRUE;
  END IF;
  
  -- Check against allowed domains list
  SELECT EXISTS (
    SELECT 1 
    FROM public.allowed_email_domains 
    WHERE domain = email_domain
  ) INTO is_allowed;
  
  RETURN is_allowed;
END;
$$;

-- Function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_user_id UUID,
  p_user_email TEXT,
  p_action TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_audit_log (user_id, user_email, action, metadata)
  VALUES (p_user_id, p_user_email, p_action, p_metadata);
END;
$$;

-- Trigger to log admin role assignments
CREATE OR REPLACE FUNCTION public.log_role_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Get user email
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = NEW.user_id;

  -- Log the role assignment
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.admin_audit_log (user_id, user_email, action, metadata)
    VALUES (
      NEW.user_id,
      user_email,
      'role_granted',
      jsonb_build_object('role', NEW.role, 'granted_by', auth.uid())
    );
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.admin_audit_log (user_id, user_email, action, metadata)
    VALUES (
      OLD.user_id,
      user_email,
      'role_revoked',
      jsonb_build_object('role', OLD.role, 'revoked_by', auth.uid())
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for role changes
DROP TRIGGER IF EXISTS on_role_change ON public.user_roles;
CREATE TRIGGER on_role_change
AFTER INSERT OR DELETE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.log_role_changes();