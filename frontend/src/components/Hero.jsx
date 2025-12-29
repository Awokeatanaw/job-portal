// src/components/HeroVideo.jsx — FULLY RESPONSIVE (320px → 4K) + CLEAN LAYOUT
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroVideo from "../assets/Herovideo.mp4";
import JobSearchBar from "./JobSearchBar";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* ANIMATED FLOATING ORBS — RESPONSIVE & SUBTLE */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute hidden sm:block w-64 h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] bg-gradient-to-r from-indigo-400/20 via-purple-400/15 to-pink-400/20 rounded-full blur-3xl -z-10"
          animate={{
            x: [0, 100, -80, 0],
            y: [0, -100, 80, 0],
          }}
          transition={{
            duration: 30 + i * 5,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            top: `${10 + i * 15}%`,
            left: `${5 + i * 18}%`,
          }}
        />
      ))}

      {/* VIDEO — FULLY RESPONSIVE & MAX VISIBILITY */}
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 w-full h-full"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{
            filter: "brightness(1.1) contrast(1.15) saturate(1.1)",
          }}
          poster="/fallback-hero.jpg"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* SUBTLE DARK GRADIENT OVERLAY FOR TEXT READABILITY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </motion.div>

      {/* HERO CONTENT — FULLY RESPONSIVE GLASS CARD */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-3xl shadow-3xl p-8 sm:p-12 md:p-16 lg:p-20"
        >
          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-tight"
          >
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Job Portal
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="mt-8 text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800 font-medium max-w-5xl mx-auto leading-relaxed"
          >
            Connecting <span className="font-black text-indigo-600">50+</span> talented Ethiopians
            with <span className="font-black text-pink-600">20+</span> top companies — 
            from Addis Ababa to every corner of our nation.
          </motion.p>

          {/* SEARCH BAR */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 1 }}
            className="mt-12 lg:mt-16"
          >
            <JobSearchBar />
          </motion.div>

          {/* CTA BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mt-12 lg:mt-16"
          >
            <Link
              to="/jobslist"
              className="px-10 py-5 sm:px-12 sm:py-6 text-lg sm:text-xl lg:text-2xl font-black text-white rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300"
            >
              Browse All Jobs
            </Link>
            <Link
              to="/post-job"
              className="px-10 py-5 sm:px-12 sm:py-6 text-lg sm:text-xl lg:text-2xl font-black text-indigo-600 rounded-full bg-white shadow-2xl border-4 border-indigo-200 hover:shadow-indigo-300 hover:scale-105 transition-all duration-300"
            >
              Post a Job — Free
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white"
      >
        <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
};

export default Hero;