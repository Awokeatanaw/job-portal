// src/pages/CompanyProfile.jsx ← GOD-TIER 2025 DESIGN — FULLY MATCHES YOUR BRAND
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { 
  Building2, Globe, MapPin, Users, Briefcase, Calendar, 
  Edit3, Camera, CheckCircle, Upload 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CompanyProfile() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', description: '', website: '', industry: '',
    founded_year: '', size: '', location: 'Addis Ababa, Ethiopia',
  });

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }

      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        setCompany(null);
      } else if (data) {
        setCompany(data);
        setFormData({
          name: data.name || '',
          description: data.description || '',
          website: data.website || '',
          industry: data.industry || '',
          founded_year: data.founded_year || '',
          size: data.size || '',
          location: data.location || 'Addis Ababa, Ethiopia',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e) => {
    if (e.target.files[0]) setLogoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      let logo_url = company?.logo_url;

      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${user.id}/logo-${Date.now()}.${fileExt}`;
        await supabase.storage.from('company-logos').upload(fileName, logoFile, { upsert: true });
        const { data: { publicUrl } } = supabase.storage.from('company-logos').getPublicUrl(fileName);
        logo_url = publicUrl;
      }

      const updateData = { ...formData, logo_url, user_id: user.id };

      if (company) {
        await supabase.from('companies').update(updateData).eq('id', company.id);
      } else {
        await supabase.from('companies').insert(updateData);
      }

      alert('Company profile updated successfully!');
      setEditing(false);
      fetchCompany();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center">
        <div className="w-20 h-20 border-8 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-50">

      {/* FLOATING ORBS — SAME AS EVERY OTHER PAGE */}
      {[...Array(7)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl -z-10"
          animate={{ x: [0, 120, -100, 0], y: [0, -120, 100, 0] }}
          transition={{ duration: 28 + i * 5, repeat: Infinity, ease: "linear" }}
          style={{ top: `${12 + i * 15}%`, left: `${8 + i * 17}%` }}
        />
      ))}

      <div className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">

          {/* HERO TITLE */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6"
            >
              {company ? 'Your Company Profile' : 'Create Your Company'}
            </motion.h1>
            <p className="text-2xl md:text-3xl text-gray-700 font-light">
              {company ? 'Showcase your brand to thousands of job seekers' : 'First step to hiring top talent in Ethiopia'}
            </p>
          </motion.div>

          {/* MAIN CARD — GLASSMORPHISM MASTERPIECE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-white/90 border border-white/60 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-10 md:p-16">

              {/* LOGO + NAME */}
              <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
                <motion.div whileHover={{ scale: 1.05 }} className="relative group">
                  <div className="w-56 h-56 bg-gradient-to-br from-indigo-100 to-pink-100 rounded-3xl flex items-center justify-center shadow-2xl border-8 border-white/50 overflow-hidden">
                    {company?.logo_url || logoFile ? (
                      <img 
                        src={logoFile ? URL.createObjectURL(logoFile) : company.logo_url} 
                        alt="Company Logo" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 size={100} className="text-indigo-600" />
                    )}
                  </div>
                  {editing && (
                    <label className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all">
                      <div className="text-center">
                        <Camera size={48} className="text-white mx-auto mb-2" />
                        <p className="text-white font-bold">Change Logo</p>
                      </div>
                      <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                    </label>
                  )}
                </motion.div>

                <div className="text-center md:text-left">
                  {editing ? (
                    <input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="text-5xl md:text-6xl font-black text-indigo-900 bg-white/70 px-8 py-4 rounded-2xl border-2 border-indigo-300 focus:outline-none focus:border-indigo-600 transition-all"
                      placeholder="Your Company Name"
                    />
                  ) : (
                    <h2 className="text-5xl md:text-6xl font-black text-indigo-900">
                      {company?.name || 'Your Company Name'}
                    </h2>
                  )}
                  {company?.verified && (
                    <div className="flex items-center gap-3 mt-6 justify-center md:justify-start">
                      <CheckCircle className="text-emerald-500" size={36} />
                      <span className="text-emerald-600 font-bold text-2xl">Verified Employer</span>
                    </div>
                  )}
                </div>
              </div>

              {/* EDIT / SAVE BUTTON */}
              <div className="flex justify-end mb-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => editing ? handleSubmit(new Event('submit')) : setEditing(true)}
                  className="px-12 py-6 bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-2xl font-black rounded-3xl shadow-2xl flex items-center gap-4 hover:shadow-pink-500/50 transition-all"
                >
                  {editing ? (
                    <>Save Changes</>
                  ) : (
                    <>{company ? 'Edit Profile' : 'Create Profile'}</>
                  )}
                </motion.button>
              </div>

              {/* FORM OR VIEW MODE */}
              {editing ? (
                <div className="grid md:grid-cols-2 gap-8">
                  <input placeholder="Website[](https://example.com)" value={formData.website} onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))} className="px-8 py-6 bg-white/70 border-2 border-indigo-200 rounded-2xl text-gray-800 placeholder-gray-500 text-xl focus:border-indigo-600 focus:outline-none transition" />
                  <input placeholder="Industry (e.g. Technology)" value={formData.industry} onChange={e => setFormData(prev => ({ ...prev, industry: e.target.value }))} className="px-8 py-6 bg-white/70 border-2 border-indigo-200 rounded-2xl text-gray-800 placeholder-gray-500 text-xl focus:border-indigo-600 focus:outline-none transition" />
                  <input placeholder="Founded Year (e.g. 2015)" value={formData.founded_year} onChange={e => setFormData(prev => ({ ...prev, founded_year: e.target.value }))} className="px-8 py-6 bg-white/70 border-2 border-indigo-200 rounded-2xl text-gray-800 placeholder-gray-500 text-xl focus:border-indigo-600 focus:outline-none transition" />
                  <input placeholder="Company Size (e.g. 50-200)" value={formData.size} onChange={e => setFormData(prev => ({ ...prev, size: e.target.value }))} className="px-8 py-6 bg-white/70 border-2 border-indigo-200 rounded-2xl text-gray-800 placeholder-gray-500 text-xl focus:border-indigo-600 focus:outline-none transition" />
                  <input placeholder="Location" value={formData.location} onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))} className="md:col-span-2 px-8 py-6 bg-white/70 border-2 border-indigo-200 rounded-2xl text-gray-800 placeholder-gray-500 text-xl focus:border-indigo-600 focus:outline-none transition" />
                  <textarea
                    placeholder="Tell candidates about your mission, culture, and why they should join you..."
                    rows="8"
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="md:col-span-2 px-8 py-6 bg-white/70 border-2 border-indigo-200 rounded-2xl text-gray-800 placeholder-gray-500 text-lg resize-none focus:border-indigo-600 focus:outline-none transition"
                  />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-16 text-gray-700">
                  <div className="space-y-10">
                    {company?.website && (
                      <div className="flex items-center gap-5"><Globe size={36} className="text-indigo-600" /><a href={company.website} className="text-2xl font-bold text-indigo-600 hover:underline">{company.website}</a></div>
                    )}
                    {company?.industry && (
                      <div className="flex items-center gap-5"><Briefcase size={36} className="text-pink-600" /><p className="text-2xl font-bold">{company.industry}</p></div>
                    )}
                    <div className="flex items-center gap-5"><MapPin size={36} className="text-purple-600" /><p className="text-2xl font-bold">{company?.location || 'Addis Ababa, Ethiopia'}</p></div>
                  </div>
                  <div className="space-y-10">
                    {company?.founded_year && (
                      <div className="flex items-center gap-5"><Calendar size={36} className="text-emerald-600" /><p className="text-2xl font-bold">Founded {company.founded_year}</p></div>
                    )}
                    {company?.size && (
                      <div className="flex items-center gap-5"><Users size={36} className="text-cyan-600" /><p className="text-2xl font-bold">{company.size} employees</p></div>
                    )}
                  </div>
                  <div className="md:col-span-2 mt-8">
                    <h3 className="text-4xl font-black text-indigo-900 mb-6">About Us</h3>
                    <p className="text-xl leading-relaxed text-gray-700">
                      {company?.description || 'Your company story will appear here. Click "Edit Profile" to inspire top talent to join your team!'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}