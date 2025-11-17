import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function MFASetup() {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    checkMFAStatus();
  }, []);

  const checkMFAStatus = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      
      const hasEnabledFactor = data?.totp?.some(factor => factor.status === 'verified');
      setMfaEnabled(!!hasEnabledFactor);
    } catch (error) {
      console.error("Error checking MFA status:", error);
    }
  };

  const handleEnrollMFA = async () => {
    try {
      setIsEnrolling(true);
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Admin Account'
      });

      if (error) throw error;

      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      toast.success("Scan the QR code with your authenticator app");
    } catch (error: any) {
      console.error("Error enrolling MFA:", error);
      toast.error(error.message || "Failed to enroll MFA");
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleVerifyMFA = async () => {
    if (!verifyCode || verifyCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    try {
      setIsVerifying(true);
      const factors = await supabase.auth.mfa.listFactors();
      const factorId = factors.data?.totp?.[0]?.id;

      if (!factorId) {
        toast.error("No MFA enrollment found");
        return;
      }

      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: verifyCode
      });

      if (error) throw error;

      toast.success("MFA enabled successfully!");
      setMfaEnabled(true);
      setQrCode(null);
      setSecret(null);
      setVerifyCode("");
    } catch (error: any) {
      console.error("Error verifying MFA:", error);
      toast.error(error.message || "Invalid verification code");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-climate-blue" />
          <CardTitle>Multi-Factor Authentication</CardTitle>
        </div>
        <CardDescription>
          Enhance your account security with time-based one-time passwords (TOTP)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mfaEnabled ? (
          <Alert className="bg-ethics-green/10 border-ethics-green">
            <CheckCircle2 className="h-4 w-4 text-ethics-green" />
            <AlertDescription className="text-ethics-green">
              MFA is enabled on your account. Your admin account is protected with two-factor authentication.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-accent-warm/10 border-accent-warm">
            <AlertCircle className="h-4 w-4 text-accent-warm" />
            <AlertDescription className="text-charcoal-800">
              <strong>Recommended:</strong> Enable MFA to protect your admin account from unauthorized access.
            </AlertDescription>
          </Alert>
        )}

        {!mfaEnabled && !qrCode && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">How to set up MFA:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-400">
                <li>Install an authenticator app (Google Authenticator, Authy, 1Password, etc.)</li>
                <li>Click "Enable MFA" below to generate a QR code</li>
                <li>Scan the QR code with your authenticator app</li>
                <li>Enter the 6-digit code to verify and complete setup</li>
              </ol>
            </div>
            <Button onClick={handleEnrollMFA} disabled={isEnrolling}>
              {isEnrolling ? "Generating..." : "Enable MFA"}
            </Button>
          </div>
        )}

        {qrCode && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Step 1: Scan QR Code</h4>
              <div className="bg-white p-4 rounded-lg inline-block">
                <img src={qrCode} alt="MFA QR Code" className="w-48 h-48" />
              </div>
              {secret && (
                <div className="text-xs text-muted-400">
                  <p className="mb-1">Can't scan? Enter this code manually:</p>
                  <code className="bg-sand-100 px-2 py-1 rounded font-mono">{secret}</code>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Step 2: Verify Code</h4>
              <Label htmlFor="verify-code">Enter 6-digit code from your app</Label>
              <div className="flex gap-2">
                <Input
                  id="verify-code"
                  type="text"
                  placeholder="000000"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="max-w-xs"
                />
                <Button onClick={handleVerifyMFA} disabled={isVerifying || verifyCode.length !== 6}>
                  {isVerifying ? "Verifying..." : "Verify & Enable"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {mfaEnabled && (
          <div className="pt-2">
            <Badge variant="outline" className="bg-ethics-green/10 text-ethics-green border-ethics-green">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
