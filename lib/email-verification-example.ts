// Example usage of email verification with Better Auth

import { emailOtp, sendVerificationEmail, signIn, signUp, verifyEmail } from './auth-client';
import { getSession } from './server';

/**
 * Email Verification Flow Examples
 * 
 * This file demonstrates how to use the email verification system
 * configured in lib/auth.ts with MailerSend integration.
 */

// ============================================
// 1. AUTOMATIC EMAIL VERIFICATION ON SIGN UP
// ============================================
// When a user signs up, they will automatically receive a verification email
// because we set `sendOnSignUp: true` in auth.ts

export async function signUpWithEmailVerification() {
  try {
    const result = await signUp.email({
      email: 'user@example.com',
      password: 'SecurePassword123!',
      name: 'John Doe',
      // callbackURL is where the user will be redirected after verification
      callbackURL: '/dashboard',
    });

    console.log('Sign up successful! Verification email sent.');
    console.log('User:', result.data);

    // Show a message to the user
    return {
      success: true,
      message: 'Account created! Please check your email to verify your account.',
    };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return {
      success: false,
      message: error.message || 'Failed to sign up',
    };
  }
}

// ============================================
// 2. MANUALLY SEND VERIFICATION EMAIL
// ============================================
// You can manually trigger a verification email for a user

export async function resendVerificationEmail(email: string) {
  try {
    await sendVerificationEmail({
      email,
      callbackURL: '/dashboard', // Where to redirect after verification
    });

    return {
      success: true,
      message: 'Verification email sent! Please check your inbox.',
    };
  } catch (error: any) {
    console.error('Error sending verification email:', error);
    return {
      success: false,
      message: error.message || 'Failed to send verification email',
    };
  }
}

// ============================================
// 3. VERIFY EMAIL WITH TOKEN (Manual Verification)
// ============================================
// This is used when you have a custom verification URL
// and extract the token from the URL query parameters

export async function verifyEmailWithToken(token: string) {
  try {
    await verifyEmail({
      query: {
        token,
      },
    });

    return {
      success: true,
      message: 'Email verified successfully! You can now sign in.',
    };
  } catch (error: any) {
    console.error('Verification error:', error);
    return {
      success: false,
      message: error.message || 'Failed to verify email. The link may have expired.',
    };
  }
}

// ============================================
// 4. SIGN IN WITH EMAIL VERIFICATION CHECK
// ============================================
// If you require email verification before allowing sign in

export async function signInWithVerificationCheck() {
  try {
    const result = await signIn.email(
      {
        email: 'user@example.com',
        password: 'SecurePassword123!',
      },
      {
        onError: (ctx) => {
          // Handle verification errors
          if (ctx.error.status === 403) {
            alert('Please verify your email address before signing in.');
            // Optionally resend verification email
            resendVerificationEmail('user@example.com');
          } else {
            alert(ctx.error.message);
          }
        },
      }
    );

    return {
      success: true,
      message: 'Signed in successfully!',
      user: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to sign in',
    };
  }
}

// ============================================
// 5. OTP EMAIL VERIFICATION
// ============================================
// Alternative to link-based verification using OTP codes

export async function sendEmailVerificationOTP(email: string) {
  try {
    await emailOtp.sendVerificationOtp({
      email,
      type: 'email-verification',
    });

    return {
      success: true,
      message: 'Verification code sent to your email!',
    };
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      message: error.message || 'Failed to send verification code',
    };
  }
}

export async function verifyEmailWithOTP(email: string, otp: string) {
  try {
    await emailOtp.verifyEmail({
      email,
      otp,
    });

    return {
      success: true,
      message: 'Email verified successfully with OTP!',
    };
  } catch (error: any) {
    console.error('OTP verification error:', error);
    return {
      success: false,
      message: error.message || 'Invalid or expired verification code',
    };
  }
}

// ============================================
// 6. OTP SIGN IN (Passwordless)
// ============================================
// Allow users to sign in using OTP instead of password

export async function signInWithOTP(email: string) {
  try {
    // Step 1: Send OTP to user's email
    await emailOtp.sendVerificationOtp({
      email,
      type: 'sign-in',
    });

    return {
      success: true,
      message: 'Sign-in code sent to your email!',
      nextStep: 'enter-otp',
    };
  } catch (error: any) {
    console.error('Error sending sign-in OTP:', error);
    return {
      success: false,
      message: error.message || 'Failed to send sign-in code',
    };
  }
}

export async function completeOTPSignIn(email: string, otp: string) {
  try {
    // Step 2: Verify OTP and sign in
    const result = await signIn.emailOtp({
      email,
      otp,
    });

    return {
      success: true,
      message: 'Signed in successfully!',
      user: result.data,
    };
  } catch (error: any) {
    console.error('OTP sign-in error:', error);
    return {
      success: false,
      message: error.message || 'Invalid or expired sign-in code',
    };
  }
}

// ============================================
// 7. CHECK VERIFICATION STATUS
// ============================================
// Check if the current user's email is verified

export async function checkEmailVerificationStatus() {
  try {
    const session = await getSession();

    if (!session?.user) {
      return {
        isVerified: false,
        message: 'No active session',
      };
    }

    return {
      isVerified: session.user.emailVerified,
      email: session.user.email,
      message: session.user.emailVerified
        ? 'Email is verified'
        : 'Email is not verified',
    };
  } catch (error: any) {
    console.error('Error checking verification status:', error);
    return {
      isVerified: false,
      message: 'Failed to check verification status',
    };
  }
}

// ============================================
// 8. REACT COMPONENT EXAMPLE
// ============================================
// Example React component for email verification flow

/*
import { useState } from 'react';

export function EmailVerificationForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResendVerification = async () => {
    setLoading(true);
    const result = await resendVerificationEmail(email);
    setMessage(result.message);
    setLoading(false);
  };

  return (
    <div className="verification-form">
      <h2>Verify Your Email</h2>
      <p>We've sent a verification link to your email address.</p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <button
        onClick={handleResendVerification}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Resend Verification Email'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
*/

// ============================================
// CONFIGURATION NOTES
// ============================================
/*
The email verification system is configured in lib/auth.ts with:

1. sendVerificationEmail: Sends a beautifully styled HTML email using MailerSend
2. sendOnSignUp: true - Automatically sends verification email on sign up
3. autoSignInAfterVerification: true - User is signed in after verifying
4. expiresIn: 3600 - Verification links expire after 1 hour
5. afterEmailVerification: Callback for custom logic after verification

Email Templates:
- Verification emails include both HTML and plain text versions
- Professional design with your brand colors
- Clear call-to-action button
- Copy-pasteable verification link
- Expiration notice

OTP Configuration:
- 6-digit OTP codes
- Sent via MailerSend with beautiful templates
- Supports: sign-in, email-verification, forget-password
- Expires in 10 minutes

MailerSend Configuration:
- Domain: test-86org8ekok0gew13.mlsender.net
- From: Budgety
- Verified and ready to send emails
*/

