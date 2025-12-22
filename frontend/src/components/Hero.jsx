// src/components/HeroVideo.jsx ← FINAL 2025 HERO (MAX VIDEO VISIBILITY + PREMIUM GLASS)
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroVideo from "../assets/Herovideo.mp4";
import JobSearchBar from "./JobSearchBar";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-50">

      {/* ANIMATED FLOATING ORBS — ELEGANT & MODERN */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-96 h-96 bg-gradient-to-r from-indigo-400/25 via-purple-400/20 to-pink-400/25 rounded-full blur-3xl -z-10"
          animate={{
            x: [0, 140, -100, 0],
            y: [0, -140, 100, 0],
          }}
          transition={{
            duration: 28 + i * 4,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            top: `${8 + i * 13}%`,
            left: `${6 + i * 16}%`,
          }}
        />
      ))}

      {/* VIDEO — MAX VISIBILITY, CINEMATIC, NO DARK EDGES */}
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 22, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 lg:px-16"
      >
        <div className="relative w-full max-w-7xl">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full min-h-screen object-cover rounded-3xl shadow-2xl border-8 border-white/50"
            style={{
              filter: "brightness(1.15) contrast(1.18) saturate(1.12)",
            }}
            poster="/fallback-hero.jpg"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>

          {/* ULTRA-SUBTLE OVERLAY — ONLY FOR TEXT PROTECTION */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent rounded-3xl pointer-events-none" />
          
          {/* MINIMAL GLASS EFFECT — KEEPS VIDEO SHARP */}
          <div className="absolute inset-0 bg-white/6 backdrop-blur-sm rounded-3xl pointer-events-none" />
        </div>
      </motion.div>

      {/* HERO CONTENT — PREMIUM GLASS CARD */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: "easeOut" }}
          className="backdrop-blur-2xl bg-white/30 border border-white/50 rounded-3xl shadow-3xl p-10 md:p-16 lg:p-20"
        >
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl font-black text-indigo-700 uppercase tracking-widest"
          >
          </motion.p>

          {/* Main Title — EPIC */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-7xl sm:text-5xl md:text-9xl font-extrabold leading-none"
          >
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              job portal
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xl md:text-2xl lg:text-3xl text-gray-800 font-medium mt-10 max-w-5xl mx-auto leading-relaxed"
          >
            Connecting <span className="font-black text-indigo-600">50+</span> talented Ethiopians
            with <span className="font-black text-pink-600">20+</span> top companies — 
            from Addis Ababa to every corner of our nation.
          </motion.p>

          {/* SEARCH BAR */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-14"
          >
            <JobSearchBar />
          </motion.div>

          {/* CTA BUTTONS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-8 justify-center mt-16"
          >
            <Link
              to="/jobslist"
              className="px-16 py-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-2xl font-black rounded-full shadow-2xl hover:shadow-indigo-500/60 hover:scale-105 transition-all duration-300"
            >
              Browse All Jobs
            </Link>
            <Link
              to="/post-job"
              className="px-16 py-8 bg-white text-indigo-600 text-2xl font-black rounded-full shadow-2xl border-4 border-indigo-200 hover:shadow-indigo-300 hover:scale-105 transition-all duration-300"
            >
              Post a Job — Free
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <svg className="w-12 h-12 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
};

export default Hero;