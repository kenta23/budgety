# Email Verification Setup with Better Auth & MailerSend

This document explains the complete email verification implementation using Better Auth and MailerSend API with MCP server integrations.

## 📋 Overview

The email verification system provides:
- ✅ **Link-based verification**: Users click a link in their email
- ✅ **OTP verification**: Users enter a 6-digit code
- ✅ **Automatic sending**: Verification emails sent on sign up
- ✅ **Auto sign-in**: Users automatically signed in after verification
- ✅ **Beautiful emails**: Professional HTML templates with brand styling
- ✅ **Passwordless sign-in**: Sign in with OTP codes

## 🏗️ Architecture

```
lib/
├── auth.ts                          # Better Auth configuration
├── sendEmail.ts                     # MailerSend integration
├── auth-client.ts                   # Client-side auth setup
└── email-verification-example.ts   # Usage examples
```

## 🔧 Configuration

### 1. Environment Variables

Make sure you have these in your `.env` file:

```env
# MailerSend Configuration
MAILERSEND_API_KEY=your_mailersend_api_key

# Better Auth Configuration
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000 # or your production URL

# Database
DATABASE_URL=your_postgresql_connection_string

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 2. Better Auth Setup (`lib/auth.ts`)

The server-side configuration includes:

```typescript
emailVerification: {
  sendVerificationEmail: async ({ user, url }) => {
    // Sends verification email using MailerSend
    await sendVerificationEmail(user.email, url);
  },
  sendOnSignUp: true,                    // Auto-send on sign up
  autoSignInAfterVerification: true,     // Auto sign-in after verify
  expiresIn: 3600,                       // 1 hour expiration
  afterEmailVerification(user) {
    // Custom logic after verification
    console.log(`✅ Email verified: ${user.email}`);
  },
}
```

### 3. MailerSend Integration (`lib/sendEmail.ts`)

Three main functions:

#### `sendEmail(options)`
Base function for sending any email.

```typescript
await sendEmail({
  to: 'user@example.com',
  subject: 'Hello!',
  html: '<p>HTML content</p>',
  text: 'Plain text content',
});
```

#### `sendVerificationEmail(email, url)`
Sends a beautiful verification email with a clickable link.

Features:
- Professional HTML design
- Brand colors (customizable)
- Clear call-to-action button
- Plain text fallback
- Copy-pasteable link
- Expiration notice

#### `sendOTPEmail(email, otp, type)`
Sends OTP codes for various purposes.

Types:
- `'sign-in'`: Passwordless authentication
- `'email-verification'`: Email verification with code
- `'forget-password'`: Password reset

## 🚀 Usage Examples

### Sign Up with Automatic Email Verification

```typescript
import { authClient } from './lib/auth-client';

const result = await authClient.signUp.email({
  email: 'user@example.com',
  password: 'SecurePassword123!',
  name: 'John Doe',
  callbackURL: '/dashboard',
});

// User receives verification email automatically!
```

### Manually Resend Verification Email

```typescript
await authClient.sendVerificationEmail({
  email: 'user@example.com',
  callbackURL: '/dashboard',
});
```

### Verify Email with Token (from URL)

```typescript
// Extract token from URL: /verify-email?token=abc123
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

await authClient.verifyEmail({
  query: { token },
});
```

### OTP-Based Verification

```typescript
// Step 1: Send OTP
await authClient.emailOtp.sendVerificationOtp({
  email: 'user@example.com',
  type: 'email-verification',
});

// Step 2: User enters OTP
await authClient.emailOtp.verifyEmail({
  email: 'user@example.com',
  otp: '123456',
});
```

### Passwordless Sign-In with OTP

```typescript
// Step 1: Send sign-in OTP
await authClient.emailOtp.sendVerificationOtp({
  email: 'user@example.com',
  type: 'sign-in',
});

// Step 2: Complete sign-in with OTP
const result = await authClient.signIn.emailOtp({
  email: 'user@example.com',
  otp: '123456',
});
```

### Check Verification Status

```typescript
const session = await authClient.getSession();
console.log('Email verified:', session?.user?.emailVerified);
```

## 🎨 Email Templates

### Verification Email Features

- **Professional Design**: Modern, clean layout
- **Responsive**: Works on all devices
- **Brand Colors**: Purple/Indigo theme (customizable)
- **Clear CTA**: Large, prominent verification button
- **Fallback Link**: Copy-pasteable URL
- **Security**: Expiration notice (1 hour)
- **Dual Format**: HTML and plain text versions

### OTP Email Features

- **Large Code Display**: Easy-to-read 6-digit code
- **Letter Spacing**: Clear separation of digits
- **Context-Aware**: Different messages for different types
- **Short Expiry**: 10-minute validity
- **Simple Design**: Focus on the code

## 🔐 Security Features

1. **Token Expiration**: Verification links expire after 1 hour
2. **OTP Expiration**: OTP codes expire after 10 minutes
3. **Secure Tokens**: Cryptographically secure random tokens
4. **Email Ownership**: Confirms user owns the email address
5. **Error Handling**: Graceful failure with clear error messages
6. **Rate Limiting**: Better Auth includes built-in rate limiting

## 📧 MailerSend Configuration

### Domain Setup

Your verified domain: `test-86org8ekok0gew13.mlsender.net`

Status:
- ✅ DKIM: Verified
- ✅ SPF: Verified
- ✅ Domain: Verified

### Sender Information

- **From Email**: `noreply@test-86org8ekok0gew13.mlsender.net`
- **From Name**: `Budgety`
- **Reply-To**: Same as from email

### Email Settings

Configured in MailerSend dashboard:
- Track Opens: Enabled
- Track Clicks: Enabled
- Custom Tracking: Disabled
- Send Paused: False

## 🧪 Testing

### Test the Email Sending

Create a test file:

```typescript
// test-email.ts
import { sendVerificationEmail, sendOTPEmail } from './lib/sendEmail';

async function testEmails() {
  // Test verification email
  await sendVerificationEmail(
    'your-test@email.com',
    'http://localhost:3000/verify?token=test123'
  );

  // Test OTP email
  await sendOTPEmail(
    'your-test@email.com',
    '123456',
    'email-verification'
  );
}

testEmails();
```

Run: `npx tsx test-email.ts`

### Test the Full Flow

1. **Sign Up**: Create a new account
2. **Check Email**: Look for verification email
3. **Click Link**: Verify email
4. **Auto Sign-In**: Should be signed in automatically

## 🎯 Client-Side Implementation

### React Component Example

```typescript
'use client';

import { useState } from 'react';
import { authClient } from './lib/auth-client';

export function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await authClient.signUp.email({
        email,
        password,
        callbackURL: '/dashboard',
      });
      
      setStatus('success');
      // Show message: "Check your email to verify your account!"
    } catch (error) {
      setStatus('error');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Sign Up</button>
      
      {status === 'success' && (
        <p>✅ Account created! Check your email to verify.</p>
      )}
    </form>
  );
}
```

### Verification Page

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authClient } from './lib/auth-client';

export function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      verifyEmail(token);
    }
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      await authClient.verifyEmail({
        query: { token },
      });
      
      setStatus('success');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      setStatus('error');
      console.error(error);
    }
  };

  if (status === 'loading') {
    return <div>Verifying your email...</div>;
  }

  if (status === 'success') {
    return <div>✅ Email verified! Redirecting to dashboard...</div>;
  }

  return <div>❌ Verification failed. The link may have expired.</div>;
}
```

## 🐛 Troubleshooting

### Email Not Received

1. **Check spam folder**
2. **Verify MailerSend API key** in `.env`
3. **Check MailerSend dashboard** for delivery status
4. **Verify domain status**: Should show "verified"
5. **Check console logs** for error messages

### Verification Link Not Working

1. **Check token expiration**: Links expire after 1 hour
2. **Verify callback URL**: Should be a valid URL
3. **Check Better Auth configuration**: Ensure `emailVerification` is set up
4. **Look for JavaScript errors** in browser console

### OTP Not Working

1. **Check OTP expiration**: Codes expire after 10 minutes
2. **Verify case sensitivity**: OTP codes are case-sensitive
3. **Check rate limiting**: Too many attempts may be blocked
4. **Verify email plugin** is properly configured

### Database Errors

1. **Run migrations**: `npx prisma migrate dev`
2. **Check connection string**: Verify `DATABASE_URL`
3. **Verify Prisma schema**: Should include verification tables
4. **Check database permissions**: User needs write access

## 📚 Additional Resources

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [MailerSend API Docs](https://developers.mailersend.com/)
- [Better Auth Email Verification](https://www.better-auth.com/docs/authentication/email)
- [Better Auth Email OTP Plugin](https://www.better-auth.com/docs/plugins/email-otp)

## 🔄 Next Steps

1. **Customize Email Templates**: Update colors and branding in `sendEmail.ts`
2. **Add Password Reset**: Similar flow to email verification
3. **Implement Welcome Email**: Send after successful verification
4. **Add Analytics**: Track verification rates
5. **Setup Production Domain**: Configure your own domain in MailerSend
6. **Add Tests**: Write integration tests for the flow
7. **Monitor Delivery**: Set up MailerSend webhooks for delivery status

## 💡 Pro Tips

1. **Use environment-specific domains**: Different domains for dev/staging/prod
2. **Monitor bounce rates**: High bounces may affect deliverability
3. **Warm up your domain**: Start with small volumes, gradually increase
4. **A/B test subject lines**: Improve open rates
5. **Keep it simple**: Don't overwhelm users with too much text
6. **Mobile-first**: Most emails are opened on mobile
7. **Test across clients**: Gmail, Outlook, Apple Mail, etc.
8. **Provide support link**: Help users who don't receive emails

## 🎉 You're All Set!

Your email verification system is now fully configured and ready to use. Users will automatically receive beautiful verification emails when they sign up, and you have multiple verification methods available (link-based and OTP-based).

For questions or issues, refer to the Better Auth or MailerSend documentation, or check the example file at `lib/email-verification-example.ts`.

