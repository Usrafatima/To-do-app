"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiLogIn, FiLock, FiMail } from "react-icons/fi";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { toast } from 'react-hot-toast';
import { loginUser, googleLogin } from "../../lib/apiClient";
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading('Signing in...', { id: 'login' });

    try {
      const data = await loginUser(email, password);
      login(data.user);
      toast.success('Signed in successfully', { id: 'login' });
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast.error(errorMessage, { id: 'login' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (tokenResponse: any) => {
    console.log("Google token response:", tokenResponse);
    setLoading(true);
    toast.loading('Signing in with Google...', { id: 'google-login' });
    try {
      const idToken = tokenResponse.credential;
      const data = await googleLogin(idToken);
      login(data.user);
      toast.success('Signed in successfully', { id: 'google-login' });
      router.push("/dashboard");
    } catch (error) {
      console.error("Google login failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during Google login.";
      toast.error(errorMessage, { id: 'google-login' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Sign In</h1>
            <p className="mt-2 text-sm text-gray-400">
              to continue to your ProductivityHub
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <FiLogIn className="mr-2" />
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => {
                console.error('Google Login Failed');
                toast.error('Google login failed. Please try again.', { id: 'google-login' });
              }}
              theme="outline"
              size="large"
              shape="rectangular"
              width="100%"
            />
          </div>
          
          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-blue-500 hover:text-blue-400">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}