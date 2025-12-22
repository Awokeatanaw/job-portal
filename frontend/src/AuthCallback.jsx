// src/pages/AuthCallback.jsx ← FINAL 2025 — SHOWS ONLY ONCE FOREVER
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // PREVENT RUNNING TWICE — THIS IS THE KEY
    if (sessionStorage.getItem('auth_processed') === 'true') {
      navigate('/login?verified=true', { replace: true });
      return;
    }

    const processAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        // If no session or already processed → redirect
        if (!session || !window.location.hash.includes('access_token')) {
          navigate('/login', { replace: true });
          return;
        }

        // Mark as processed IMMEDIATELY
        sessionStorage.setItem('auth_processed', 'true');

        const { user } = session;

        // Create profile if signup
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const type = params.get('type');

        if (type === 'signup') {
          await supabase.from('profiles').upsert({
            id: user.id,
            email: user.email,
            role: 'candidate',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

          localStorage.setItem('user_role', 'candidate');
        }

        // Clean URL + redirect after 2 seconds
        window.history.replaceState({}, '', '/auth-callback');
        setTimeout(() => {
          navigate('/login?verified=true', { replace: true });
        }, 2000);

      } catch (err) {
        console.error(err);
        navigate('/login', { replace: true });
      }
    };

    processAuth();

    // Auto cleanup after 30 seconds (safety)
    const timer = setTimeout(() => {
      sessionStorage.removeItem('auth_processed');
    }, 30000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center px-4">
      <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-md w-full">
        <div className="w-24 h-24 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
          <svg className="w-14 h-14 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-green-600 mb-3">Email Confirmed!</h1>
        <p className="text-xl text-gray-700">Welcome to JobPortal</p>
        <p className="text-gray-500 mt-6">Redirecting to login...</p>
      </div>
    </div>
  );
}