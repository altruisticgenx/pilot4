## Admin Security Documentation

This project implements comprehensive admin authentication and authorization security controls using Supabase Auth and Lovable Cloud.

## Security Features

### 1. Email Domain Allowlisting
- **Automatic validation**: Only approved email domains can create accounts
- **Default allowed domains**:
  - `.edu` - Educational institutions
  - `lovable.org` - Lovable organization
  - `impactlab.org` - Impact Lab organization
- **Management**: Admins can add/remove allowed domains via the `allowed_email_domains` table

### 2. Role-Based Access Control (RBAC)
- **Secure role storage**: Roles stored in separate `user_roles` table (prevents privilege escalation)
- **Server-side validation**: All admin checks use security definer functions
- **Row-Level Security (RLS)**: Database-level enforcement of access controls

### 3. Audit Logging
- **Comprehensive logging**: All admin actions are logged to `admin_audit_log` table
- **Logged events**:
  - Admin login/logout
  - Role grants/revocations
  - Custom admin actions
- **Log fields**: user_id, email, action, IP address, user agent, metadata, timestamp
- **Immutable logs**: RLS policies prevent modification of audit logs

### 4. Multi-Factor Authentication (MFA)
MFA is now enabled and available for all admin accounts:
1. **Admin Setup**: Admins can enable MFA in the Admin Dashboard → Security Settings tab
2. **TOTP Support**: Uses time-based one-time passwords (compatible with Google Authenticator, Authy, 1Password, etc.)
3. **Easy Enrollment**: Scan QR code with authenticator app and verify with 6-digit code
4. **Recommended**: All admin accounts should enable MFA for enhanced security
5. **Status Visibility**: MFA status is clearly displayed in the Security Settings panel

### 5. Session Management
- **Secure sessions**: Using Supabase Auth with JWT tokens
- **Auto-refresh**: Tokens automatically refresh
- **Immediate revocation**: Sign-out invalidates tokens immediately

## Configuration

### Managing Allowed Email Domains

As an admin, you can manage allowed domains directly in the database:

\`\`\`sql
-- Add a new allowed domain
INSERT INTO public.allowed_email_domains (domain, description)
VALUES ('newdomain.org', 'New partner organization');

-- Remove a domain
DELETE FROM public.allowed_email_domains WHERE domain = 'olddomain.org';
\`\`\`

### Granting Admin Access

**IMPORTANT**: Never grant admin roles through client-side code. Always use the backend:

\`\`\`sql
-- Grant admin role to a user
INSERT INTO public.user_roles (user_id, role)
VALUES ('user-uuid-here', 'admin');

-- Revoke admin role
DELETE FROM public.user_roles 
WHERE user_id = 'user-uuid-here' AND role = 'admin';
\`\`\`

### Viewing Audit Logs

Admins can query audit logs:

\`\`\`sql
-- Recent admin actions
SELECT * FROM public.admin_audit_log 
ORDER BY created_at DESC 
LIMIT 50;

-- Actions by specific user
SELECT * FROM public.admin_audit_log 
WHERE user_email = 'admin@example.edu'
ORDER BY created_at DESC;

-- Role changes
SELECT * FROM public.admin_audit_log 
WHERE action IN ('role_granted', 'role_revoked')
ORDER BY created_at DESC;
\`\`\`

## Best Practices

### 1. Least Privilege
- Grant admin access only when necessary
- Review admin list quarterly
- Remove admin access when no longer needed

### 2. Monitoring
- Regularly review audit logs
- Set up alerts for:
  - New admin role grants
  - Multiple failed login attempts
  - Admin actions from unusual locations

### 3. Onboarding/Offboarding
- **Onboarding**: Verify identity before granting admin access
- **Offboarding**: Immediately revoke all access when team members leave

### 4. Password Requirements
- Minimum 6 characters (enforced)
- Recommend: 12+ characters with mixed case, numbers, symbols
- Enable MFA for all admin accounts

## SSO Integration (Future Enhancement)

While this project currently uses email/password authentication, you can enhance security by integrating SSO:

### Supported Providers in Supabase:
- Google Workspace
- Azure AD / Microsoft Entra
- Okta
- GitHub
- GitLab

### To Enable SSO:
1. Go to Lovable Cloud backend → Auth Settings
2. Enable desired provider(s)
3. Configure OAuth credentials
4. Update allowed domains to match your organization

### Benefits:
- Centralized access control
- MFA enforced at IdP level
- Automatic de-provisioning when users leave organization
- Group-based role assignment

## Security Checklist

- [x] Email domain validation
- [x] Role-based access control
- [x] Audit logging
- [x] Secure session management
- [x] Server-side authorization checks
- [ ] Enable MFA (recommended - configure in backend)
- [ ] Set up monitoring alerts
- [ ] Configure SSO (optional - for enterprise use)
- [ ] Regular security audits

## Support

For questions or security concerns, contact your system administrator or refer to the Lovable Cloud documentation.
