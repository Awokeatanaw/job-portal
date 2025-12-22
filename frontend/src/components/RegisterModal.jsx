// src/components/RegisterModal.jsx ← FINAL & PERFECT (MATCHES LoginModal)
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { X, Mail, Lock, User, Building2 } from 'lucide-react';

const RegisterModal = ({ isOpen, onClose, onOpenLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Freeze background when open
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { firstName, lastName, email, password, confirmPassword, role } = formData;

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            role
          }
        }
      });

      if (signUpError) throw signUpError;

      setSuccess(true);
      setTimeout(() => {
        onClose();
        onOpenLogin();
      }, 2500);
    } catch (err) {
      setError(err.message || 'Registration failed. Try again.');
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

          {/* MODAL — FULLY SCROLLABLE & BEAUTIFUL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-lg max-h-screen bg-white/95 backdrop-blur-2xl rounded-3xl shadow-3xl border border-white/30 overflow-hidden flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl pointer-events-none" />

              {/* X BUTTON */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/30 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/50 transition shadow-lg"
              >
                <X className="w-7 h-7 text-white" />
              </button>

              {/* SCROLLABLE CONTENT */}
              <div className="relative z-10 flex-1 overflow-y-auto px-10 pt-24 pb-12">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white text-5xl font-black shadow-2xl">
                  J
                </div>

                <h2 className="text-4xl font-black text-center text-gray-900 mb-3">Create Account</h2>
                <p className="text-center text-gray-600 text-lg mb-10">Join Ethiopia's #1 Job Platform</p>

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-5 bg-green-100 border-2 border-green-500 rounded-2xl text-green-700 text-center font-bold"
                  >
                    Account created! Check your email to verify.
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-5 bg-red-100 border-2 border-red-500 rounded-2xl text-red-700 text-center font-medium"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-4 top-5 w-5 h-5 text-purple-600" />
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-5 bg-white/70 border-2 border-purple-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-300/50 outline-none text-lg transition-all"
                      />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-5 bg-white/70 border-2 border-purple-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-300/50 outline-none text-lg transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-5 top-5 w-6 h-6 text-indigo-600" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-16 pr-6 py-5 bg-white/70 border-2 border-indigo-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-300/50 outline-none text-lg transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-5 top-5 w-6 h-6 text-pink-600" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password (6+ chars)"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-16 pr-6 py-5 bg-white/70 border-2 border-pink-200 rounded-2xl focus:border-pink-500 focus:ring-4 focus:ring-pink-300/50 outline-none text-lg transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-5 top-5 w-6 h-6 text-pink-600" />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-16 pr-6 py-5 bg-white/70 border-2 border-pink-200 rounded-2xl focus:border-pink-500 focus:ring-4 focus:ring-pink-300/50 outline-none text-lg transition-all"
                    />
                  </div>

                  <div className="flex justify-center gap-10 py-6">
                    <label className="flex items-center gap-4 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="candidate"
                        checked={formData.role === 'candidate'}
                        onChange={handleChange}
                        className="w-6 h-6 text-indigo-600"
                      />
                      <span className="text-lg font-bold text-indigo-700">Job Seeker</span>
                    </label>
                    <label className="flex items-center gap-4 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="employer"
                        checked={formData.role === 'employer'}
                        onChange={handleChange}
                        className="w-6 h-6 text-purple-600"
                      />
                      <span className="text-lg font-bold text-purple-700 flex items-center gap-2">
                        <Building2 size={20} /> Employer
                      </span>
                    </label>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-xl py-6 rounded-2xl shadow-2xl disabled:opacity-70 transition-all"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </motion.button>
                </form>

                <p className="text-center mt-12 text-gray-600 text-lg">
                  Already have an account?{' '}
                  <button
                    onClick={() => { onClose(); onOpenLogin(); }}
                    className="font-black text-purple-600 hover:underline transition"
                  >
                    Login here
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

export default RegisterModal;