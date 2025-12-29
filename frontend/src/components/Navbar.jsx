// src/components/Navbar.jsx — FULLY RESPONSIVE (320px → 4K) & CLEAN ON ULTRA-WIDE
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Menu, X, LogOut, Briefcase, Building2, User, 
  Globe, Bookmark, CheckSquare, Bell 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import logo from "../assets/logo.png";
import { t, setLanguage } from "../lib/language";

import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useNotification } from '../context/NotificationContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate = useNavigate();
  const { unreadCount } = useNotification();

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
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-full shadow-md hover:shadow-lg transition-all border border-indigo-200 text-sm font-bold">
          <Globe size={18} className="text-indigo-600" />
          <span className="text-indigo-700">{current === 'en' ? 'EN' : 'አማ'}</span>
        </button>
        <div className="absolute top-full right-0 mt-2 w-48 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 z-50">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-200 overflow-hidden"
          >
            <button onClick={() => setLanguage('en')} className={`w-full px-5 py-4 text-left font-bold transition ${current === 'en' ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700' : 'hover:bg-indigo-50'}`}>
              English
            </button>
            <button onClick={() => setLanguage('am')} className={`w-full px-5 py-4 text-left font-bold font-amharic transition ${current === 'am' ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-pink-700' : 'hover:bg-pink-50'}`}>
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
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <img src={logo} alt="JobPortal" className="w-10 h-10 md:w-12 md:h-12 rounded-full shadow-xl border-4 border-white" />
              <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                JobPortal
              </h1>
            </div>

            {/* Desktop Menu - Hidden on small screens, shown from lg+ */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {!user ? (
                <>
                  <Link to="/jobslist" className="text-base xl:text-lg font-semibold text-gray-700 hover:text-indigo-600 transition">{t('jobs')}</Link>
                  <Link to="/companies" className="text-base xl:text-lg font-semibold text-gray-700 hover:text-purple-600 transition">{t('companies')}</Link>
                  <Link to="/about" className="text-base xl:text-lg font-semibold text-gray-700 hover:text-pink-600 transition">{t('insights')}</Link>
                  <Link to="/contact" className="text-base xl:text-lg font-semibold text-gray-700 hover:text-indigo-600 transition">{t('engage')}</Link>

                  <div className="flex items-center gap-4 ml-8">
                    
                    <button onClick={openLogin} className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-full font-bold hover:bg-indigo-600 hover:text-white transition text-sm xl:text-base">
                      {t('login')}
                    </button>
                    <button onClick={openRegister} className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition text-sm xl:text-base">
                      {t('signup')}
                    </button>
                  </div>
                </>
              ) : profile?.role === "candidate" ? (
                <>
                  <Link to="/jobslist" className="flex items-center gap-2 text-base xl:text-lg font-semibold hover:text-indigo-600 transition">
                    <Briefcase size={20} /> {t('jobs')}
                  </Link>
                  <Link to="/companies" className="flex items-center gap-2 text-base xl:text-lg font-semibold hover:text-purple-600 transition">
                    <Building2 size={20} /> {t('companies')}
                  </Link>
                  <Link to="/saved-jobs" className="flex items-center gap-2 text-base xl:text-lg font-semibold hover:text-pink-600 transition">
                    <Bookmark size={20} /> {t('savedJobs')}
                  </Link>
                  <Link to="/applied" className="flex items-center gap-2 text-base xl:text-lg font-semibold hover:text-indigo-600 transition">
                    <CheckSquare size={20} /> {t('applied')}
                  </Link>
                  <Link to="/profile" className="flex items-center gap-2 text-base xl:text-lg font-semibold hover:text-purple-600 transition">
                    <User size={20} /> {t('profile')}
                  </Link>

                  <div className="flex items-center gap-4 ml-8 border-l border-gray-300 pl-8">
                   
                    <button onClick={handleLogout} className="text-red-600 hover:text-red-700 flex items-center gap-2 font-bold text-base xl:text-lg">
                      <LogOut size={22} /> {t('logout')}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/post-job" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition text-sm xl:text-base">
                    {t('postJob')}
                  </Link>
                  <Link to="/company-profile" className="flex items-center gap-2 text-base xl:text-lg font-semibold hover:text-purple-600 transition">
                    <Building2 size={22} /> {t('companyProfile')}
                  </Link>
                  <Link to="/myjobs" className="flex items-center gap-2 text-base xl:text-lg font-semibold hover:text-indigo-600 transition">
                    <Briefcase size={22} /> {t('myJobs')}
                  </Link>
                  <Link 
                    to="/employernotifications" 
                    className="relative flex items-center gap-2 text-base xl:text-lg font-semibold hover:text-pink-600 transition"
                  >
                    <Bell size={22} className="text-indigo-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse font-bold">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Link>

                  <div className="flex items-center gap-4 ml-8 border-l border-gray-300 pl-8">
                    
                    <button onClick={handleLogout} className="text-red-600 hover:text-red-700 flex items-center gap-2 font-bold text-base xl:text-lg">
                      <LogOut size={22} /> {t('logout')}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="flex items-center gap-4 lg:hidden">
              
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-800 p-2">
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:hidden bg-white border-t border-gray-200 shadow-2xl"
            >
              <div className="px-6 py-8 space-y-6">
                {!user ? (
                  <>
                    <Link to="/jobslist" onClick={() => setMenuOpen(false)} className="block py-3 text-lg font-semibold text-gray-800 hover:text-indigo-600">{t('jobs')}</Link>
                    <Link to="/companies" onClick={() => setMenuOpen(false)} className="block py-3 text-lg font-semibold text-gray-800 hover:text-purple-600">{t('companies')}</Link>
                    <Link to="/about" onClick={() => setMenuOpen(false)} className="block py-3 text-lg font-semibold text-gray-800 hover:text-pink-600">{t('insights')}</Link>
                    <Link to="/contact" onClick={() => setMenuOpen(false)} className="block py-3 text-lg font-semibold text-gray-800 hover:text-indigo-600">{t('engage')}</Link>
                    <div className="pt-6 space-y-4">
                      <button onClick={() => { openLogin(); setMenuOpen(false); }} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg">
                        {t('login')}
                      </button>
                      <button onClick={() => { openRegister(); setMenuOpen(false); }} className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-lg">
                        {t('signup')}
                      </button>
                    </div>
                  </>
                ) : profile?.role === "candidate" ? (
                  <>
                    <Link to="/jobslist" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 py-4 text-lg font-semibold"><Briefcase size={24} /> {t('jobs')}</Link>
                    <Link to="/companies" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 py-4 text-lg font-semibold"><Building2 size={24} /> {t('companies')}</Link>
                    <Link to="/saved-jobs" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 py-4 text-lg font-semibold"><Bookmark size={24} /> {t('savedJobs')}</Link>
                    <Link to="/applied" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 py-4 text-lg font-semibold"><CheckSquare size={24} /> {t('applied')}</Link>
                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 py-4 text-lg font-semibold"><User size={24} /> {t('profile')}</Link>
                    <button onClick={handleLogout} className="w-full py-4 mt-6 bg-red-600 text-white rounded-2xl font-bold flex items-center justify-center gap-4">
                      <LogOut size={24} /> {t('logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/post-job" onClick={() => setMenuOpen(false)} className="block w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-center font-bold shadow-lg">
                      {t('postJob')}
                    </Link>
                    <Link to="/company-profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 py-4 text-lg font-semibold"><Building2 size={24} /> {t('companyProfile')}</Link>
                    <Link to="/myjobs" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 py-4 text-lg font-semibold"><Briefcase size={24} /> {t('myJobs')}</Link>
                    <Link to="/employernotifications" onClick={() => setMenuOpen(false)} className="relative flex items-center gap-4 py-4 text-lg font-semibold">
                      <Bell size={24} className="text-indigo-600" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                      {t('notifications')}
                    </Link>
                    <button onClick={handleLogout} className="w-full py-4 mt-6 bg-red-600 text-white rounded-2xl font-bold flex items-center justify-center gap-4">
                      <LogOut size={24} /> {t('logout')}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <LoginModal isOpen={showLoginModal} onClose={closeAll} onOpenRegister={openRegister} />
      <RegisterModal isOpen={showRegisterModal} onClose={closeAll} onOpenLogin={openLogin} />
    </>
  );
};

export default Navbar;