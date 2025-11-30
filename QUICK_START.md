# Quick Start Guide - Email Verification

Get email verification working in 5 minutes! 🚀

## ✅ Prerequisites Checklist

- [ ] PostgreSQL database running
- [ ] MailerSend account created
- [ ] MailerSend API key obtained
- [ ] Domain verified in MailerSend
- [ ] Environment variables configured

## 🚀 Step-by-Step Setup

### 1. Install Dependencies (if not already installed)

```bash
npm install better-auth mailersend dotenv
npm install @prisma/client
npm install -D prisma
```

### 2. Configure Environment Variables

Create or update `.env`:

```env
# MailerSend
MAILERSEND_API_KEY=your_api_key_here

# Better Auth
BETTER_AUTH_SECRET=your_random_secret_key
BETTER_AUTH_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/budgety
```

### 3. Update Prisma Schema

Ensure your `schema.prisma` includes Better Auth tables:

```bash
npx prisma generate
npx prisma migrate dev --name add_email_verification
```

### 4. Files Already Created ✅

The following files are already set up for you:

- ✅ `lib/auth.ts` - Server-side auth configuration
- ✅ `lib/sendEmail.ts` - MailerSend email functions
- ✅ `lib/email-verification-example.ts` - Usage examples

### 5. Update Client Configuration

Make sure your `lib/auth-client.ts` includes the emailOTP plugin:

```typescript
import { createAuthClient } from "better-auth/client";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [
    emailOTPClient(), // Add this if not already present
  ],
});
```

### 6. Test Email Sending

Create a test file `test-email.ts`:

```typescript
import { sendVerificationEmail } from './lib/sendEmail';

async function test() {
  await sendVerificationEmail(
    'your-email@example.com',
    'http://localhost:3000/verify?token=test123'
  );
  console.log('✅ Test email sent!');
}

test();
```

Run it:

```bash
npx tsx test-email.ts
```

Check your email inbox!

### 7. Implement Sign Up Form

```typescript
import { authClient } from './lib/auth-client';

async function handleSignUp(email: string, password: string) {
  try {
    await authClient.signUp.email({
      email,
      password,
      name: 'User Name',
      callbackURL: '/dashboard',
    });
    
    alert('✅ Check your email to verify your account!');
  } catch (error) {
    console.error('Sign up failed:', error);
  }
}
```

### 8. Create Verification Page

```typescript
// app/verify-email/page.tsx or similar

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      authClient.verifyEmail({ query: { token } })
        .then(() => setStatus('success'))
        .catch(() => setStatus('error'));
    }
  }, [searchParams]);

  if (status === 'verifying') {
    return <div>Verifying your email...</div>;
  }

  if (status === 'success') {
    return <div>✅ Email verified! You can now sign in.</div>;
  }

  return <div>❌ Verification failed. Link may have expired.</div>;
}
```

## 🧪 Testing the Complete Flow

### Test Scenario 1: Link-Based Verification

1. **Sign Up**: Create a new account
   ```typescript
   await authClient.signUp.email({
     email: 'test@example.com',
     password: 'Password123!',
     callbackURL: '/dashboard'
   });
   ```

2. **Check Email**: Open your email inbox
3. **Click Link**: Click the "Verify Email Address" button
4. **Redirected**: Should redirect to `/dashboard`
5. **Auto Signed In**: User should be automatically signed in

### Test Scenario 2: OTP Verification

1. **Request OTP**:
   ```typescript
   await authClient.emailOtp.sendVerificationOtp({
     email: 'test@example.com',
     type: 'email-verification'
   });
   ```

2. **Check Email**: Look for the 6-digit code
3. **Verify OTP**:
   ```typescript
   await authClient.emailOtp.verifyEmail({
     email: 'test@example.com',
     otp: '123456'
   });
   ```

### Test Scenario 3: Passwordless Sign-In

1. **Request OTP**:
   ```typescript
   await authClient.emailOtp.sendVerificationOtp({
     email: 'test@example.com',
     type: 'sign-in'
   });
   ```

2. **Sign In with OTP**:
   ```typescript
   await authClient.signIn.emailOtp({
     email: 'test@example.com',
     otp: '123456'
   });
   ```

## 🎨 Customization

### Change Email Brand Colors

Edit `lib/sendEmail.ts` and modify the color values:

```typescript
// Find these in the HTML template
color: #4F46E5; // Primary color (purple/indigo)
background-color: #4F46E5; // Button color
```

Replace with your brand colors:

```typescript
color: #FF6B6B; // Your primary color
background-color: #FF6B6B; // Your button color
```

### Change Sender Name

Edit `lib/sendEmail.ts`:

```typescript
const sentFrom = new Sender(
  "test-86org8ekok0gew13.mlsender.net", 
  "Your App Name" // Change this
);
```

### Change Token Expiration

Edit `lib/auth.ts`:

```typescript
emailVerification: {
  expiresIn: 7200, // 2 hours (in seconds)
}
```

### Disable Auto Sign-In After Verification

Edit `lib/auth.ts`:

```typescript
emailVerification: {
  autoSignInAfterVerification: false, // Change to false
}
```

## 🔍 Debugging

### Enable Debug Logs

Add to your auth configuration:

```typescript
export const auth = betterAuth({
  // ... other config
  logger: {
    level: 'debug'
  }
});
```

### Check MailerSend Delivery

1. Go to [MailerSend Dashboard](https://app.mailersend.com/)
2. Click "Analytics" → "Activity"
3. View recent email sends and delivery status

### Common Issues & Solutions

**Issue**: Email not received
- ✅ Check spam folder
- ✅ Verify MAILERSEND_API_KEY is correct
- ✅ Check MailerSend dashboard for errors
- ✅ Verify domain is verified

**Issue**: "Invalid token" error
- ✅ Token expired (1 hour limit)
- ✅ Token already used
- ✅ Check database connection

**Issue**: Database error
- ✅ Run: `npx prisma migrate dev`
- ✅ Verify DATABASE_URL is correct
- ✅ Check database is running

**Issue**: TypeScript errors
- ✅ Run: `npm install`
- ✅ Run: `npx prisma generate`
- ✅ Restart your IDE/editor

## 📊 What Happens Behind the Scenes

### Sign Up Flow

```
1. User fills sign up form
2. authClient.signUp.email() called
3. User created in database (emailVerified: false)
4. sendVerificationEmail() triggered automatically (sendOnSignUp: true)
5. MailerSend sends beautiful email
6. User receives email with verification link
```

### Verification Flow

```
1. User clicks link in email
2. Link contains token: /verify?token=abc123
3. authClient.verifyEmail() called with token
4. Token validated and marked as used
5. User's emailVerified set to true
6. afterEmailVerification() callback runs
7. User auto signed in (autoSignInAfterVerification: true)
8. Redirected to callbackURL
```

### OTP Flow

```
1. sendVerificationOTP() called
2. 6-digit OTP generated
3. OTP stored in database with expiry
4. sendOTPEmail() sends beautiful email
5. User receives email with OTP code
6. User enters OTP
7. verifyEmail() validates OTP
8. User verified
```

## 🎯 Next Actions

After completing this quick start:

1. ✅ Test the complete flow with a real email
2. ✅ Customize email templates with your branding
3. ✅ Set up password reset (similar implementation)
4. ✅ Add rate limiting for resend verification
5. ✅ Implement "Resend verification email" button
6. ✅ Add email verification status indicator in UI
7. ✅ Set up production domain in MailerSend
8. ✅ Configure webhooks for delivery tracking

## 📖 Full Documentation

For complete details, see:
- `EMAIL_VERIFICATION_SETUP.md` - Complete documentation
- `lib/email-verification-example.ts` - All usage examples

## 🆘 Need Help?

1. **Better Auth Issues**: Check [Better Auth Docs](https://www.better-auth.com/docs)
2. **MailerSend Issues**: Check [MailerSend Docs](https://developers.mailersend.com/)
3. **Email Template Issues**: Edit `lib/sendEmail.ts`
4. **Database Issues**: Run `npx prisma studio` to inspect data

## 🎉 Success Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Test email received successfully
- [ ] Sign up creates user and sends email
- [ ] Email verification link works
- [ ] User auto-signed in after verification
- [ ] OTP verification works (optional)
- [ ] Passwordless sign-in works (optional)

Once all checked, you're ready for production! 🚀

