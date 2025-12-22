// src/components/Navbar.jsx ← FINAL & 100% WORKING (NO ERRORS)
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Menu, X, LogOut, Briefcase, Building2, User, 
  Globe, Bookmark, CheckSquare, MessageSquare,Bell 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import logo from "../assets/logo.png";
import { t, setLanguage } from "../lib/language";

import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { JobContext } from "../context/JobContext";
import { useNotification } from '../context/NotificationContext'; // <-- IMPORT THE HOOK

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate = useNavigate();
  const { unreadCount } = useNotification(); // <-- USE THE HOOK

  const openLogin = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
  };
  const openRegister = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };
  const closeAll = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  const fetchUserAndProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (data) setProfile(data);
      else console.error("Profile not found:", error);
    } else {
      setProfile(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserAndProfile();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        fetchUserAndProfile();
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => listener?.subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    closeAll();
    setMenuOpen(false);
    navigate("/");
  };

  const LanguageSwitcher = () => {
    const current = localStorage.getItem('lang') || 'en';
    return (
      <div className="relative group">
        <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-full shadow-lg hover:shadow-xl transition-all border-2 border-indigo-200">
          <Globe size={20} className="text-indigo-600" />
          <span className="font-black text-indigo-700">{current === 'en' ? 'EN' : 'አአማ'}</span>
        </button>
        <div className="absolute top-14 right-0 w-52 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 z-50">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200"
          >
            <button onClick={() => setLanguage('en')} className={`w-full px-6 py-5 text-left font-bold ${current === 'en' ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700' : 'hover:bg-indigo-50'}`}>
              English
            </button>
            <button onClick={() => setLanguage('am')} className={`w-full px-6 py-5 text-left font-bold font-amharic ${current === 'am' ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-pink-700' : 'hover:bg-pink-50'}`}>
              አማርኛ
            </button>
          </motion.div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="JobPortal" className="w-12 h-12 rounded-full shadow-xl" />
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              JobPortal
            </h1>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <motion.nav 
        initial={{ y: -120 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="navbar bg-white/95 backdrop-blur-2xl shadow-2xl sticky top-0 z-40 border-b border-indigo-100"
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

          {/* LOGO */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} alt="JobPortal" className="w-12 h-12 rounded-full shadow-2xl border-4 border-white" />
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              JobPortal
            </h1>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-8 text-gray-700 font-sans">
            {!user ? (
              <>
                <Link to="/jobslist" className="font-bold hover:text-indigo-600 transition">{t('jobs')}</Link>
                <Link to="/companies" className="font-bold hover:text-purple-600 transition">{t('companies')}</Link>
                <Link to="/about" className="font-bold hover:text-pink-600 transition">{t('Insights')}</Link>
                <Link to="/contact" className="font-bold hover:text-indigo-600 transition">{t('Engage')}</Link>

                <div className="flex items-center gap-6 ml-10">
                  <LanguageSwitcher />
                  <button onClick={openLogin} className="px-8 py-4 border-4 border-indigo-600 text-indigo-600 rounded-full font-black hover:bg-indigo-600 hover:text-white shadow-lg">
                    {t('login')}
                  </button>
                  <button onClick={openRegister} className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-full font-black shadow-2xl">
                    {t('signup')}
                  </button>
                </div>
              </>
            ) : profile?.role === "candidate" ? (
              <>
                <Link to="/jobslist" className="flex items-center gap-3 font-bold hover:text-indigo-600 transition">
                  <Briefcase size={24} /> {t('jobs')}
                </Link>
                <Link to="/companies" className="flex items-center gap-3 font-bold hover:text-purple-600 transition">
                  <Building2 size={24} /> {t('companies')}
                </Link>
                <Link to="/saved-jobs" className="flex items-center gap-3 font-bold hover:text-pink-600 transition">
                  <Bookmark size={24} /> {t('savedJobs')}
                </Link>
                <Link to="/applied" className="flex items-center gap-3 font-bold hover:text-indigo-600 transition">
                  <CheckSquare size={24} /> {t('applied')}
                </Link>
                <Link to="/profile" className="flex items-center gap-3 font-bold hover:text-purple-600 transition">
                  <User size={24} /> {t('profile')}
                </Link>

                <div className="flex items-center gap-6 border-l-4 border-indigo-300 pl-10">
                  <LanguageSwitcher />
                  <button onClick={handleLogout} className="text-red-600 hover:text-red-700 flex items-center gap-3 font-black">
                    <LogOut size={26} /> {t('logout')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/post-job" className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-full font-black shadow-2xl hover:shadow-pink-500/50">
                  {t('postJob')}
                </Link>
                <Link to="/company-profile" className="flex items-center gap-3 font-bold hover:text-purple-600 transition">
                  <Building2 size={26} /> {t('companyProfile')}
                </Link>
                <Link to="/myjobs" className="flex items-center gap-3 font-bold hover:text-indigo-600 transition">
                  <Briefcase size={26} /> {t('myJobs')}
                </Link>
                <Link 
                  to="/employernotifications" 
                  className="relative flex items-center gap-3 font-bold hover:text-pink-600 transition"
                   >
                  <Bell size={26} className="text-indigo-600" />
                  {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-green-700 text-white text-xs rounded-full flex items-center justify-center animate-pulse font-black shadow-lg">
                  {unreadCount > 99 ? '99+' : unreadCount} 
                  </span>
                  )}
                </Link>

                <div className="flex items-center gap-6 border-l-4 border-pink-300 pl-10">
                  <LanguageSwitcher />
                  <button onClick={handleLogout} className="text-red-600 hover:text-red-700 flex items-center gap-3 font-black">
                    <LogOut size={26} /> {t('logout')}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <div className="flex items-center gap-5 lg:hidden">
            <LanguageSwitcher />
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-800">
              {menuOpen ? <X size={36} /> : <Menu size={36} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 border-t-4 border-indigo-300"
            >
              <div className="px-8 py-10 space-y-8 text-xl font-bold text-gray-800">
                {/* Same logic as desktop */}
                {!user ? (
                  <>
                    <Link to="/jobslist" onClick={() => setMenuOpen(false)} className="block py-0 mb-1 font-bold hover:text-indigo-600 transition">{t('jobs')}</Link>
                    <Link to="/companies" onClick={() => setMenuOpen(false)} className="block py-0 mb-1 font-bold hover:text-indigo-600 transition">{t('companies')}</Link>
                    <Link to="/about" onClick={() => setMenuOpen(false)} className="block py-0 mb-1 font-bold hover:text-indigo-600 transition">{t('insights')}</Link>
                    <Link to="/contact" onClick={() => setMenuOpen(false)} className="block py-0 mb-1 font-bold hover:text-indigo-600 transition">{t('engage')}</Link>
                    <button onClick={() => { openLogin(); setMenuOpen(false); }} className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl shadow-2xl">
                      {t('login')}
                    </button>
                    <button onClick={() => { openRegister(); setMenuOpen(false); }} className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl shadow-2xl">
                      {t('signup')}
                    </button>
                  </>
                ) : profile?.role === "candidate" ? (
                  <>
                    <Link to="/jobslist" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 py-4"><Briefcase /> {t('jobs')}</Link>
                    <Link to="/companies" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 font-bold hover:text-purple-600 transition"><Building2 size={24} /> {t('companies')}</Link>
                    <Link to="/saved-jobs" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 py-4"><Bookmark /> {t('savedJobs')}</Link>
                    <Link to="/applied" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 font-bold hover:text-indigo-600 transition"><CheckSquare size={24} /> {t('applied')}</Link>                            
                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 font-bold hover:text-purple-600 transition"> <User size={24} /> {t('profile')}</Link>                 
                    <button onClick={handleLogout} className="w-full py-5 bg-red-600 text-white rounded-3xl shadow-2xl flex items-center justify-center gap-4">
                      <LogOut /> {t('logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/post-job" onClick={() => setMenuOpen(false)} className="block py-5 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-3xl shadow-2xl text-center">
                      {t('postJob')}
                    </Link>
                    <Link to="/company-profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 font-bold hover:text-purple-600 transition">
                      <Building2 size={26} /> {t('companyProfile')}
                    </Link>
                    <Link to="/myjobs" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 font-bold hover:text-indigo-600 transition">
                      <Briefcase size={26} /> {t('myJobs')}
                    </Link>
                    <Link to="/employernotifications" onClick={() => setMenuOpen(false)} className="relative flex items-center gap-3 font-bold hover:text-pink-600 transition">
                     <Bell size={26} className="text-indigo-600" />
                     {unreadCount > 0 && (
                     <span className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-r white white text-white text-xs rounded-full flex items-center justify-center animate-pulse font-black shadow-lg">
                     {unreadCount > 99 ? '99+' : unreadCount} 
                     </span>
                      )}
                    </Link>
                    <button onClick={handleLogout} className="w-full py-5 bg-red-600 text-white rounded-3xl shadow-2xl flex items-center justify-center gap-4">
                      <LogOut /> {t('logout')}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* MODALS */}
      <LoginModal isOpen={showLoginModal} onClose={closeAll} onOpenRegister={openRegister} />
      <RegisterModal isOpen={showRegisterModal} onClose={closeAll} onOpenLogin={openLogin} />
    </>
  );
};

export default Navbar;