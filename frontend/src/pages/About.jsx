// src/pages/About.jsx ← THE MOST BEAUTIFUL ABOUT PAGE IN AFRICA (2025 EDITION)
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Briefcase, Building2, Globe, Heart, Target, 
  Award, TrendingUp, MapPin, CheckCircle, Sparkles 
} from 'lucide-react';
import aboutus from '../assets/aboutus.png';
import { t } from '../lib/language';

export default function About() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-50">

      {/* ANIMATED FLOATING ORBS — SAME AS HERO */}
      {[...Array(7)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl -z-10"
          animate={{ 
            x: [0, 120, -100, 0], 
            y: [0, -120, 100, 0] 
          }}
          transition={{ 
            duration: 28 + i * 5, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          style={{ 
            top: `${12 + i * 15}%`, 
            left: `${8 + i * 17}%` 
          }}
        />
      ))}

      <div className="relative z-10 py-20 px-6">

        {/* HERO */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-7xl mx-auto mb-24"
        >
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-8"
          >
            {t('aboutTitle') || "We Are JobPortal"}
          </motion.h1>
          <p className="text-2xl md:text-3xl text-gray-700 font-light max-w-5xl mx-auto leading-relaxed">
            {t('aboutSubtitle') || "Ethiopia’s #1 career platform — connecting ambitious talent with visionary companies since 2025"}
          </p>
          <div className="mt-10 flex justify-center">
            <Sparkles className="w-12 h-12 text-indigo-600 animate-pulse" />
          </div>
        </motion.section>

        {/* IMAGE + MISSION — REVERSED FOR BETTER FLOW */}
        <section className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ x: -80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            <h2 className="text-5xl font-black text-indigo-600 mb-8 flex items-center gap-5">
              <Target size={60} className="text-pink-600" />
              Our Mission
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              To empower <span className="font-bold text-indigo-600">every Ethiopian</span> with access to meaningful careers and help companies build world-class teams — fast, fair, and free from bias.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed">
              We believe work is dignity. Work is growth. Work is the future of Ethiopia.
            </p>

            <div className="grid grid-cols-2 gap-8 mt-12">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="backdrop-blur-xl bg-white/80 border border-indigo-200 rounded-3xl p-8 text-center shadow-xl"
              >
                <h3 className="text-5xl font-black text-indigo-600">500K+</h3>
                <p className="text-lg font-bold text-gray-700 mt-2">Active Users</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="backdrop-blur-xl bg-white/80 border border-pink-200 rounded-3xl p-8 text-center shadow-xl"
              >
                <h3 className="text-5xl font-black text-pink-600">10K+</h3>
                <p className="text-lg font-bold text-gray-700 mt-2">Companies Trust Us</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="order-1 md:order-2"
          >
            <img 
              src={aboutus} 
              alt="JobPortal Team" 
              className="w-full rounded-3xl shadow-2xl border-8 border-white hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
        </section>

        {/* WHY CHOOSE JOBPORTAL — GLASS CARDS */}
        <section className="py-20">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-5xl md:text-6xl font-black text-center bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-20"
          >
            Why Thousands Choose JobPortal
          </motion.h2>

          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
            {[
              { icon: Globe, color: "indigo", title: "100% Ethiopian", desc: "Built in Addis Ababa. Made for Ethiopia. Understands our culture." },
              { icon: CheckCircle, color: "emerald", title: "Real Jobs Only", desc: "Every job is verified. No scams. No fake postings." },
              { icon: TrendingUp, color: "pink", title: "Fastest Growing", desc: "10,000+ new users every month. The momentum is real." },
              { icon: Heart, color: "rose", title: "Fair & Inclusive", desc: "Equal opportunity for all regions, genders, and backgrounds." },
              { icon: MapPin, color: "cyan", title: "Nationwide", desc: "Addis • Dire Dawa • Hawassa • Mekelle • Gambella • Everywhere" },
              { icon: Award, color: "purple", title: "Award-Winning Design", desc: "The most beautiful job platform in Africa — 2025" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -12 }}
                className="backdrop-blur-xl bg-white/80 border border-white/60 rounded-3xl p-10 text-center shadow-2xl hover:shadow-indigo-200/50 transition-all group"
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-${item.color}-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition`}>
                  <item.icon size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-4">{item.title}</h3>
                <p className="text-lg text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FINAL CTA — BIG & BOLD */}
        <section className="py-32 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-10">
              Ready to Shape Ethiopia’s Future?
            </h2>
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <motion.a
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                href="/jobslist"
                className="px-16 py-8 bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-2xl font-black rounded-full shadow-2xl hover:shadow-pink-500/60 flex items-center justify-center gap-4"
              >
                <Briefcase size={40} /> Find Your Dream Job
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                href="/post-job"
                className="px-16 py-8 bg-white text-indigo-600 text-2xl font-black rounded-full shadow-2xl border-4 border-indigo-200 hover:shadow-indigo-300 flex items-center justify-center gap-4"
              >
                <Building2 size={40} /> Hire Top Talent
              </motion.a>
            </div>
          </motion.div>
        </section>

        {/* FINAL TAGLINE */}
        <div className="text-center py-20">
          <p className="text-3xl font-bold text-gray-700 mb-4">
            Made with <Heart className="inline text-red-600 mx-3 animate-pulse" size={40} /> in Addis Ababa
          </p>
          <p className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            JobPortal — The Future of Work in Ethiopia
          </p>
        </div>

      </div>
    </div>
  );
}