import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/common/Header";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { TaskProvider } from '@/contexts/TaskContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskPilot - Your AI Todo Assistant",
  description: "A modern, cool, and responsive AI Todo App",
  icons: {
    icon: "/globe.svg", // Using existing globe.svg as the favicon
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <AuthProvider>
        <TaskProvider>
          <html lang="en" className="dark">
            <body className={`${inter.className} bg-gray-900`}>
              <Header />
              <Toaster position="top-center" />
              {children}
            </body>
          </html>
        </TaskProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}