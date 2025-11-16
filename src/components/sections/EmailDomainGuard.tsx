import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface EmailDomainGuardProps {
  email: string;
  onValidationResult: (isValid: boolean) => void;
}

export const EmailDomainGuard = ({ email, onValidationResult }: EmailDomainGuardProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAllowed, setIsAllowed] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkEmailDomain = async () => {
      if (!email || !email.includes('@')) {
        setIsAllowed(true);
        onValidationResult(true);
        return;
      }

      setIsChecking(true);
      try {
        const { data, error } = await supabase.rpc('is_email_domain_allowed', {
          email: email.toLowerCase(),
        });

        if (error) throw error;

        setIsAllowed(data ?? false);
        onValidationResult(data ?? false);
        
        if (!data) {
          const domain = email.split('@')[1];
          setMessage(
            `Email domain @${domain} is not authorized. This platform is restricted to educational institutions (.edu), partner organizations, and approved domains. Contact an administrator if you believe this is an error.`
          );
        }
      } catch (error) {
        console.error('Error checking email domain:', error);
        setIsAllowed(true);
        onValidationResult(true);
      } finally {
        setIsChecking(false);
      }
    };

    const timeoutId = setTimeout(checkEmailDomain, 500);
    return () => clearTimeout(timeoutId);
  }, [email, onValidationResult]);

  if (isChecking || isAllowed) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Unauthorized Email Domain</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
