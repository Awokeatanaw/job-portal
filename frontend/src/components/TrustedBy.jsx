// src/components/TrustedBy.jsx — FINAL 2025 TRUSTED BY SECTION (REAL DATA FROM SUPABASE)
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.png";
import image4 from "../assets/image4.jpg";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.png";
import image7 from "../assets/image7.jpg";
import image8 from "../assets/image8.jpg";

const logos = [image1, image2, image4, image5, image6, image7, image8];

import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

const TrustedBy = () => {
  const [stats, setStats] = useState({
    jobSeekers: 0,
    companiesHiring: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { count: seekersCount, error: seekersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'candidate');

        if (seekersError) throw seekersError;

        const { count: companiesCount, error: compCountError } = await supabase
          .from('companies')
          .select('*', { count: 'exact', head: true });

        if (compCountError) throw compCountError;

        const { count: totalUsersCount, error: totalError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (totalError) throw totalError;

        setStats({
          jobSeekers: seekersCount || 0,
          companiesHiring: companiesCount || 0,
          totalUsers: totalUsersCount || 0,
        });
      } catch (err) {
        console.error('Error fetching trusted data:', err);
        toast.error('Failed to load trusted companies');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-indigo-50/50 via-purple-50/30 to-pink-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 uppercase tracking-widest"
          >
            Trusted by Ethiopia’s Top Companies
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-4 text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight"
          >
            Powering <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">{stats.totalUsers.toLocaleString() || '50K+'}</span> Success Stories
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-lg md:text-xl text-gray-700 max-w-4xl mx-auto font-medium"
          >
            From startups in Bole to enterprises in Hawassa — the best companies hire with <span className="font-bold text-purple-600">JobPortal</span>
          </motion.p>
        </motion.div>

        {/* Infinite Scrolling Logos */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl">
            <motion.div
              className="flex gap-12 md:gap-20 items-center py-10"
              animate={{ x: [0, "-50%"] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 50,
                  ease: "linear",
                },
              }}
              style={{ width: "200%" }}
              onMouseEnter={(e) => e.currentTarget.style.animationPlayState = "paused"}
              onMouseLeave={(e) => e.currentTarget.style.animationPlayState = "running"}
            >
              {[...logos, ...logos].map((logo, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.15, y: -12 }}
                  className="flex-shrink-0 w-40 md:w-52 lg:w-64 h-28 md:h-32 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/40 p-6 flex items-center justify-center group relative"
                >
                  <img
                    src={logo}
                    alt={`Trusted company ${index + 1}`}
                    className="max-w-full max-h-full object-contain grayscale-0 group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-400/10 via-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Gradient Fade Edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-indigo-50/50 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-pink-50/50 to-transparent z-10" />
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
        >
          <div className="text-center bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
            <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              {stats.jobSeekers.toLocaleString() || '50K+'}
            </h3>
            <p className="text-xl font-bold text-gray-800 mt-2">Active Job Seekers</p>
          </div>
          <div className="text-center bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
            <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              {stats.companiesHiring.toLocaleString() || '1,500+'}
            </h3>
            <p className="text-xl font-bold text-gray-800 mt-2">Companies Hiring</p>
          </div>
          <div className="text-center bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
            <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
              98%
            </h3>
            <p className="text-xl font-bold text-gray-800 mt-2">Satisfaction Rate</p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-20"
        >
          <p className="text-xl text-gray-700 mb-6">
            Ready to hire top Ethiopian talent?
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/post-job"
            className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300"
          >
            Post a Job for Free
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedBy;
