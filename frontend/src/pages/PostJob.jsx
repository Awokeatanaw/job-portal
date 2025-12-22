// src/pages/PostJob.jsx — FINAL GOD-TIER 2025 DESIGN — LIGHT INDIGO-PINK THEME + INDUSTRY FIELD
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { 
  Upload, Building2, Briefcase, MapPin, DollarSign, Clock, 
  CheckCircle, Users, Tag, Globe 
} from 'lucide-react';
import LoginModal from '../components/LoginModal';
import toast from 'react-hot-toast';

export default function PostJob() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    location: 'Addis Ababa, Ethiopia',
    job_type: 'full-time',
    experience_level: 'mid',
    salary_min: '',
    salary_max: '',
    company_name: '',
    company_logo: null,
    industry: 'Information Technology', // Default industry
  });

  useEffect(() => {
    const checkEmployerAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Please log in as employer');
        navigate('/', { state: { openLogin: true } });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || profile.role !== 'employer') {
        toast.error('Only employers can post jobs');
        navigate('/jobslist', { state: { openLogin: true } });
        return;
      }

      // All good — show form
      setIsChecking(false);
    };

    checkEmployerAccess();
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border-8 border-indigo-400 border-t-indigo-600 animate-spin"
        />
        <p className="ml-8 text-3xl font-bold text-indigo-600">Checking access...</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogo = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({ ...prev, company_logo: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      let logo_url = null;
      if (formData.company_logo) {
        const fileExt = formData.company_logo.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        await supabase.storage.from('company-logos').upload(fileName, formData.company_logo, { upsert: true });
        const { data: { publicUrl } } = supabase.storage.from('company-logos').getPublicUrl(fileName);
        logo_url = publicUrl;
      }

      let company = await supabase.from('companies').select('id').eq('user_id', user.id).single();
      if (!company.data) {
        const { data: newComp } = await supabase.from('companies').insert({
          user_id: user.id,
          name: formData.company_name || `${user.email.split('@')[0]} Company`,
          description: 'Hiring in Ethiopia',
          logo_url,
          verified: false,
          industry: formData.industry, // ← Added industry to company
        }).select().single();
        company.data = newComp;
      }

      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();

      await supabase.from('jobs').insert({
        company_id: company.data.id,
        title: formData.title,
        slug,
        description: formData.description,
        requirements: formData.requirements || null,
        responsibilities: formData.responsibilities || null,
        location: formData.location,
        job_type: formData.job_type,
        experience_level: formData.experience_level,
        salary_min: formData.salary_min ? Number(formData.salary_min) : null,
        salary_max: formData.salary_max ? Number(formData.salary_max) : null,
        is_featured: false,
        posted_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      });

      toast.success('Job posted successfully!');
      navigate('/myjobs');
    } catch (err) {
      console.error('Post job error:', err);
      toast.error('Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ y: [0, -40, 0], rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl opacity-40"
        />
        <motion.div
          animate={{ y: [0, 40, 0], rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl opacity-40"
        />
      </div>

      <div className="relative z-10 py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Hero Title */}
          <div className="text-center mb-16">
            <motion.h1
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 tracking-tight"
            >
              Post a New Job
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl text-gray-700 font-medium"
            >
              Reach 100,000+ talented professionals in Ethiopia
            </motion.p>
          </div>

          {/* Main Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-3xl border border-indigo-200 p-10 md:p-14"
          >
            <form onSubmit={handleSubmit} className="space-y-10">

              {/* Company Name + Logo */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid md:grid-cols-2 gap-8"
              >
                <div className="relative">
                  <Building2 className="absolute left-5 top-6 text-indigo-600" size={28} />
                  <input
                    name="company_name"
                    placeholder="Company Name *"
                    onChange={handleChange}
                    required
                    className="w-full pl-16 pr-6 py-6 bg-indigo-50/20 border border-indigo-300 rounded-2xl text-indigo-900 placeholder-indigo-600 text-xl font-medium focus:outline-none focus:border-indigo-600 focus:bg-indigo-50/30 transition-all"
                  />
                </div>

                <motion.div whileHover={{ scale: 1.03 }} className="flex items-center justify-center bg-indigo-50/20 border-2 border-dashed border-indigo-300 rounded-2xl p-8 cursor-pointer">
                  <label className="text-center text-indigo-600 cursor-pointer">
                    <Upload size={48} className="mx-auto mb-4 text-indigo-600" />
                    <p className="text-lg font-semibold">
                      {formData.company_logo ? 'Logo Selected' : 'Upload Company Logo'}
                    </p>
                    <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
                  </label>
                </motion.div>
              </motion.div>

              {/* Job Title */}
              <motion.input
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                name="title"
                placeholder="Job Title * (e.g. Senior React Developer)"
                onChange={handleChange}
                required
                className="w-full px-8 py-7 bg-indigo-50/20 border border-indigo-300 rounded-2xl text-indigo-900 placeholder-indigo-600 text-3xl font-bold focus:outline-none focus:border-indigo-600 focus:bg-indigo-50/30 transition-all"
              />

              {/* Description */}
              <motion.textarea
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                name="description"
                placeholder="Full Job Description * (Include company culture, benefits, etc.)"
                onChange={handleChange}
                required
                rows="8"
                className="w-full px-8 py-6 bg-indigo-50/20 border border-indigo-300 rounded-2xl text-indigo-900 placeholder-indigo-600 text-lg resize-none focus:outline-none focus:border-indigo-600 focus:bg-indigo-50/30 transition-all"
              />

              {/* Requirements & Responsibilities */}
              <div className="grid md:grid-cols-2 gap-8">
                <motion.textarea
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  name="requirements"
                  placeholder="Requirements (One per line)"
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-8 py-6 bg-indigo-50/20 border border-indigo-300 rounded-2xl text-indigo-900 placeholder-indigo-600 text-lg resize-none focus:outline-none focus:border-indigo-600 focus:bg-indigo-50/30 transition-all"
                />
                <motion.textarea
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  name="responsibilities"
                  placeholder="Responsibilities (One per line)"
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-8 py-6 bg-indigo-50/20 border border-indigo-300 rounded-2xl text-indigo-900 placeholder-indigo-600 text-lg resize-none focus:outline-none focus:border-indigo-600 focus:bg-indigo-50/30 transition-all"
                />
              </div>

              {/* Job Details Grid */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                <div className="relative">
                  <MapPin className="absolute left-5 top-6 text-indigo-600" size={28} />
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="w-full pl-16 pr-6 py-6 bg-indigo-50/20 border border-indigo-300 rounded-2xl text-indigo-900 placeholder-indigo-600 text-xl focus:outline-none focus:border-indigo-600 focus:bg-indigo-50/30 transition-all"
                  />
                </div>

                <div className="relative">
                  <Clock className="absolute left-5 top-6 text-indigo-600" size={28} />
                  <select name="job_type" onChange={handleChange} className="w-full pl-16 pr-6 py-6 bg-indigo-50/20 border border-indigo-300 rounded-2xl text-indigo-900 text-xl appearance-none focus:outline-none focus:border-indigo-600 focus:bg-indigo-50/30 transition-all">
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>

                <div className="relative">
                  <Users className="absolute left-5 top-6 text-indigo-600" size={28} />
                  <select name="experience_level" onChange={handleChange} className="w-full pl-16 pr-6 py-6 bg-indigo-50/20 border border-indigo-300 rounded-2xl text-indigo-900 text-xl appearance-none focus:outline-none focus:border-indigo-600 focus:bg-indigo-50/30 transition-all">
                    <option value="entry">Entry Level</option>
                    <option value="junior">Junior</option>
                    <option value="mid">Mid-Level</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead / Manager</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
              </motion.div>

              {/* Industry */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="relative"
              >
                <Tag className="absolute left-5 top-6 text-indigo-600" size={28} />
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full pl-16 pr-6 py-6 bg-indigo-50/20 border border-indigo-300 rounded-2xl text-indigo-900 text-xl appearance-none focus:outline-none focus:border-indigo-600 focus:bg-indigo-50/30 transition-all"
                >
                  <option value="Information Technology">Information Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance & Banking">Finance & Banking</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Construction">Construction</option>
                  <option value="Hospitality">Marketing</option>
                  <option value="Telecommunications">Engineering</option>
                  <option value="Telecommunications">Human Resources</option>
                  <option value="Telecommunications">Logistics</option>

                  <option value="Other">Other</option>
                </select>
              </motion.div>

              {/* Salary Range */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="grid md:grid-cols-2 gap-8"
              >
                <div className="relative">
                  <DollarSign className="absolute left-5 top-6 text-indigo-600" size={28} />
                  <input
                    type="number"
                    name="salary_min"
                    placeholder="Minimum Salary (ETB)"
                    onChange={handleChange}
                    className="w-full pl-16 pr-6 py-6 bg-indigo-50/20 border border-indigo-300 rounded-2xl text-indigo-900 placeholder-indigo-600 text-xl focus:outline-none focus:border-indigo-600 focus:bg-indigo-50/30 transition-all"
                  />
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-5 top-6 text-indigo-600" size={28} />
                  <input
                    type="number"
                    name="salary_max"
                    placeholder="Maximum Salary (ETB)"
                    onChange={handleChange}
                    className="w-full pl-16 pr-6 py-6 bg-indigo-50/20 border border-indigo-300 rounded-2xl text-indigo-900 placeholder-indigo-600 text-xl focus:outline-none focus:border-indigo-600 focus:bg-indigo-50/30 transition-all"
                  />
                </div>
              </motion.div>

              {/* EPIC SUBMIT BUTTON */}
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="pt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-4xl font-black py-10 rounded-3xl shadow-2xl hover:shadow-indigo-500/50 transition-all duration-500 flex items-center justify-center gap-6 group"
                >
                  {loading ? (
                    <span className="flex items-center gap-4">
                      <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      Posting Your Job...
                    </span>
                  ) : (
                    <>
                      <CheckCircle size={56} className="group-hover:animate-bounce" />
                      Post Job Now – Reach Top Talent in Ethiopia!
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      </div>
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
}