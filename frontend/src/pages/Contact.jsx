// src/pages/Contact.jsx — FULLY WORKING & STORES MESSAGES IN SUPABASE
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Clock, Send, CheckCircle, 
  Building2, Globe, Facebook, Twitter, Linkedin, Instagram 
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { t } from '../lib/language';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    subject: '', 
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in name, email, and message');
      return;
    }

    setSending(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim() || null,
          message: formData.message.trim(),
          status: 'unread',
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success('Message sent successfully! We’ll reply within 24 hours');
      setSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => setSent(false), 6000);
    } catch (err) {
      console.error('Contact form error:', err);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-50">

      {/* FLOATING ORBS */}
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
        {/* 
          RESPONSIVE CONTAINER: 
          - max-w-7xl on screens <1920px
          - full width with padding on ≥1920px
        */}
        <div className="max-w-7xl mx-auto [@media(min-width:1920px)]:max-w-full [@media(min-width:1920px)]:px-20">

          {/* HERO TITLE */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-24"
          >
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-8"
            >
              {t('contactUs') || "Get in Touch"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl text-gray-700 font-light max-w-5xl mx-auto leading-relaxed"
            >
              We’re here 24/7 — Your success is our mission
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16">

            {/* CONTACT FORM */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="backdrop-blur-xl bg-white/80 border border-white/60 rounded-3xl shadow-2xl p-10 md:p-14"
            >
              <h2 className="text-4xl font-black text-indigo-600 mb-8 flex items-center gap-4">
                <Mail size={48} className="text-pink-600" />
                Send Us a Message
              </h2>

              {sent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-6 bg-emerald-100 border-2 border-emerald-500 rounded-2xl text-center"
                >
                  <CheckCircle size={48} className="mx-auto mb-3 text-emerald-600" />
                  <p className="text-2xl font-bold text-gray-800">Message Sent Successfully!</p>
                  <p className="text-gray-600">We’ll reply within 24 hours</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Full Name *"
                  required
                  className="w-full px-8 py-6 bg-white/70 border border-indigo-200 rounded-2xl text-gray-800 placeholder-gray-500 text-xl focus:outline-none focus:border-indigo-500 transition-all"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email Address *"
                  required
                  className="w-full px-8 py-6 bg-white/70 border border-indigo-200 rounded-2xl text-gray-800 placeholder-gray-500 text-xl focus:outline-none focus:border-indigo-500 transition-all"
                />
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject (optional)"
                  className="w-full px-8 py-6 bg-white/70 border border-indigo-200 rounded-2xl text-gray-800 placeholder-gray-500 text-xl focus:outline-none focus:border-indigo-500 transition-all"
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message *"
                  rows="8"
                  required
                  className="w-full px-8 py-6 bg-white/70 border border-indigo-200 rounded-2xl text-gray-800 placeholder-gray-500 text-lg resize-none focus:outline-none focus:border-indigo-500 transition-all"
                />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={sending}
                  className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-2xl font-black py-7 rounded-3xl shadow-2xl flex items-center justify-center gap-4 group"
                >
                  {sending ? (
                    <>
                      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send size={36} className="group-hover:translate-x-2 transition" />
                      Send Message Now
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* CONTACT INFO */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              {[
                { icon: Building2, title: "Head Office", desc: "Bole Medhanealem, Addis Ababa, Ethiopia" },
                { icon: MapPin, title: "Location", desc: "Near Rwanda Embassy, Behind Atlas Hotel" },
                { icon: Phone, title: "Call Us", desc: "+251 948 860 288\n+251 911 765 432" },
                { icon: Mail, title: "Email Us", desc: "awokeatanaw12@gmail.com\nsupport@jobportal.com" },
                { icon: Clock, title: "Working Hours", desc: "Mon–Fri: 8:00 AM – 6:00 PM\nSat: 9:00 AM – 4:00 PM" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 10 }}
                  className="backdrop-blur-xl bg-white/80 border border-indigo-100 rounded-3xl p-8 shadow-xl hover:shadow-indigo-200/50 transition-all"
                >
                  <div className="flex items-start gap-6">
                    <item.icon size={56} className="text-indigo-600" />
                    <div>
                      <h3 className="text-2xl font-black text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-lg text-gray-600 whitespace-pre-line">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* SOCIAL MEDIA */}
              <div className="backdrop-blur-xl bg-white/80 border border-pink-100 rounded-3xl p-10 shadow-xl">
                <h3 className="text-3xl font-black text-indigo-600 mb-8 flex items-center gap-4">
                  <Globe size={48} className="text-pink-600" />
                  Follow Us
                </h3>
                <div className="flex gap-6 justify-center">
                  {[
                    { icon: Facebook, color: "hover:text-blue-600" },
                    { icon: Twitter, color: "hover:text-sky-500" },
                    { icon: Linkedin, color: "hover:text-blue-700" },
                    { icon: Instagram, color: "hover:text-pink-600" },
                  ].map((social, i) => (
                    <motion.a
                      key={i}
                      href="#"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      className={`w-16 h-16 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-full flex items-center justify-center text-white shadow-lg ${social.color} transition-all`}
                    >
                      <social.icon size={32} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* FINAL TAGLINE */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mt-24">
            <p className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              We Reply Within <span className="text-pink-600">24 Hours</span> — Always
            </p>
            <p className="text-2xl text-gray-600 mt-8 font-light">
              Made with Love in Addis Ababa, Ethiopia
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}