"use client";

import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { googleLogin } from '../../lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';

interface GoogleSignInButtonProps {
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
}

export default function GoogleSignInButton({ text = 'signin_with' }: GoogleSignInButtonProps) {
  const { login } = useAuth();
  const router = useRouter();

  const handleGoogleLoginSuccess = async (tokenResponse: any) => {
    console.log("Google token response:", tokenResponse);
    toast.loading('Authenticating with Google...', { id: 'google-auth' });
    try {
      const idToken = tokenResponse.credential;
      const data = await googleLogin(idToken);
      login(data.user);
      toast.success('Authenticated successfully', { id: 'google-auth' });
      router.push("/dashboard");
    } catch (error) {
      console.error("Google authentication failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during Google authentication.";
      toast.error(errorMessage, { id: 'google-auth' });
    }
  };

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={() => {
          console.error('Google Login Failed');
          toast.error('Google login failed. Please try again.', { id: 'google-auth' });
        }}
        theme="outline"
        size="large"
        text={text}
        shape="rectangular"
        width="100%"
      />
    </div>
  );
}
