// src/components/LoginModal.jsx ← FINAL & PERFECT (NO ERRORS)
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, onOpenRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Freeze background when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        setError(
          error.message.includes('not confirmed')
            ? 'Please verify your email first.'
            : 'Invalid email or password.'
        );
        setLoading(false);
        return;
      }

      onClose();
      window.location.reload();
    } catch (err) {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP — CLICK TO CLOSE */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm z-40 cursor-pointer"
          />

          {/* MODAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-md max-h-screen bg-white/95 backdrop-blur-2xl rounded-3xl shadow-3xl border border-white/30 overflow-hidden flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl pointer-events-none" />

              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/30 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/50 transition shadow-lg"
              >
                <X className="w-7 h-7 text-white" />
              </button>

              {/* CONTENT */}
              <div className="relative z-10 flex-1 overflow-y-auto px-10 pt-24 pb-12">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white text-5xl font-black shadow-2xl">
                  J
                </div>

                <h2 className="text-4xl font-black text-center text-gray-900 mb-3">Welcome Back</h2>
                <p className="text-center text-gray-600 text-lg mb-10">Sign in to JobPortal</p>

                {error && (
                  <div className="mb-6 p-5 bg-red-100 border-2 border-red-400 rounded-2xl text-red-700 text-center font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                  {/* EMAIL INPUT — FIXED */}
                  <div className="relative">
                    <Mail className="absolute left-5 top-5 w-6 h-6 text-purple-600" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      required
                      className="w-full pl-16 pr-6 py-5 bg-white/70 border-2 border-purple-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-300/50 outline-none text-lg transition-all"
                    />
                  </div>

                  {/* PASSWORD INPUT */}
                  <div className="relative">
                    <Lock className="absolute left-5 top-5 w-6 h-6 text-pink-600" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="w-full pl-16 pr-16 py-5 bg-white/70 border-2 border-pink-200 rounded-2xl focus:border-pink-500 focus:ring-4 focus:ring-pink-300/50 outline-none text-lg transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-5 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </button>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-xl py-6 rounded-2xl shadow-2xl disabled:opacity-70 transition-all"
                  >
                    {loading ? "Signing in..." : "Sign In Now"}
                  </motion.button>
                </form>

                {/* REGISTER LINK */}
                <p className="text-center mt-12 text-gray-600 text-lg">
                  No account?{' '}
                  <button
                    onClick={() => {
                      onClose();
                      onOpenRegister();
                    }}
                    className="font-black text-purple-600 hover:underline transition"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;