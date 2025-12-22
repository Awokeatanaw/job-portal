// src/components/Footer.jsx ← 2025 MODERN & ON-BRAND (MATCHES YOUR COLOR SYSTEM)
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaInstagram, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt 
} from 'react-icons/fa';
import { t } from '../lib/language';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className=" bg-gradient-to-br from-indigo-50 via-white to-pink-50 border-t-4 border-indigo-200">
      <div className="max-w-7xl mx-auto px-6 py-16">


        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Section */}
          <div className="space-y-6">
            <h3 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              JobPortal
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
              {t('footerDescription') || "Connecting talent with opportunity across Ethiopia. Find your dream job or hire the best candidates."}
            </p>

            {/* Social Icons — Beautiful Gradient Hover */}
            <div className="flex space-x-4">
              {[
                { Icon: FaFacebookF, href: 'https://facebook.com' },
                { Icon: FaTwitter, href: 'https://twitter.com' },
                { Icon: FaLinkedinIn, href: 'https://linkedin.com' },
                { Icon: FaInstagram, href: 'https://instagram.com' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center hover:shadow-2xl hover:shadow-indigo-200 hover:scale-110 transition-all duration-300 group"
                >
                  <Icon className="text-indigo-600 group-hover:text-white transition" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-black text-indigo-700 mb-6">{t('quickLinks') || "Quick Links"}</h4>
            <ul className="space-y-4">
              {[
                { to: '/', label: t('home') || 'Home' },
                { to: '/jobslist', label: t('jobs') || 'Jobs' },
                { to: '/companies', label: t('companies') || 'Companies' },
                { to: '/post-job', label: t('postJob') || 'Post a Job' },
                { to: '/about', label: t('about') || 'About Us' },
                { to: '/contact', label: t('contact') || 'Contact' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Job Categories */}
          <div>
            <h4 className="text-xl font-black text-indigo-700 mb-6">{t('jobCategories') || "Job Categories"}</h4>
            <ul className="space-y-4 text-gray-600">
              {[
                "Technology",
                "Marketing & Sales",
                "Logistics",
                "Customer Support",
                "Finance & Accounting",
                "Human Resources",
                "Healthcare",
                "Education",
                "Engineering",
                "Construction",
                "NGO & International"
              ].map((cat) => (
                <li key={cat} className="hover:text-pink-600 font-medium transition cursor-pointer flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition" />
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-8">
            <div>
              <h4 className="text-xl font-black text-indigo-700 mb-6">{t('stayConnected') || "Stay Connected"}</h4>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <FaMapMarkerAlt className="text-indigo-600" />
                  </div>
                  <span>Addis Ababa, Ethiopia</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <FaPhone className="text-indigo-600" />
                  </div>
                  <span>+251 949 860 088</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <FaEnvelope className="text-indigo-600" />
                  </div>
                  <span>support@jobportal.com</span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-r from-indigo-600 to-pink-600 p-8 rounded-3xl text-white">
              <h5 className="text-lg font-bold mb-3">{t('newsletter') || "Get Latest Jobs Daily"}</h5>
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder={t('emailPlaceholder') || "your@email.com"}
                  className="flex-1 px-5 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:border-white text-white placeholder-white/70 transition"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-indigo-600 font-black rounded-xl hover:bg-gray-100 transition-all shadow-lg"
                >
                  {t('subscribe') || "Subscribe"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-10 border-t-2 border-indigo-200 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p className="text-center md:text-left">
            © {year} <span className="font-bold text-indigo-600">JobPortal</span> • {t('allRightsReserved') || "All rights reserved."}
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-4 md:mt-0 text-sm">
            <Link to="/privacy" className="hover:text-indigo-600 transition font-medium">
              {t('privacyPolicy') || "Privacy Policy"}
            </Link>
            <Link to="/terms" className="hover:text-indigo-600 transition font-medium">
              {t('termsOfService') || "Terms of Service"}
            </Link>
            <Link to="/cookies" className="hover:text-indigo-600 transition font-medium">
              {t('cookiePolicy') || "Cookie Policy"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;