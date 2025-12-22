// src/pages/JobsList.jsx ← FINAL MODERN DESIGN (INDIGO-PINK THEME)
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Building2, Calendar, Search, Briefcase, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import jobhero from '../assets/jobhero.jpg'
import { motion } from 'framer-motion';

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const navigate = useNavigate();

  const checkSavedStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('saved_jobs')
      .select('job_id')
      .eq('user_id', user.id);

    if (data) setSavedJobs(new Set(data.map(item => item.job_id)));
  };

  useEffect(() => {
    fetchJobs();
    checkSavedStatus();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companies?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id, title, slug, location, job_type,
          salary_min, salary_max, posted_at, experience_level,
          companies ( name, logo_url )
        `)
        .order('posted_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
      setFilteredJobs(data || []);
    } catch (err) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveJob = async (e, jobId) => {
    e.preventDefault();
    e.stopPropagation();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please log in to save jobs');
      navigate('/login');
      return;
    }

    const isSaved = savedJobs.has(jobId);

    if (isSaved) {
      await supabase.from('saved_jobs').delete().eq('user_id', user.id).eq('job_id', jobId);
      setSavedJobs(prev => { const s = new Set(prev); s.delete(jobId); return s; });
      toast.success('Removed from saved');
    } else {
      await supabase.from('saved_jobs').insert({ user_id: user.id, job_id: jobId });
      setSavedJobs(prev => new Set(prev).add(jobId));
      toast.success('Job saved!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-4xl font-bold text-indigo-600">Loading Jobs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* HERO */}
                  {/* HERO — EPIC 2025 DESIGN (LIKE ABOUT PAGE) */}
      <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 overflow-hidden">

        {/* FLOATING ORBS — SAME AS ABOUT PAGE */}
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

        <div className="relative z-10 py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* LEFT — TEXT + SEARCH + STATS */}
              <motion.div
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-12"
              >
                <div>
                  <motion.h1 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
                  >
                    Find Your<br />
                    <span className="text-yellow-400">Dream Job</span><br />
                    in Ethiopia
                  </motion.h1>

                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl md:text-3xl text-gray-700 font-light mt-8 leading-relaxed"
                  >
                    Join <span className="font-bold text-indigo-600">100,000+ Ethiopians</span> getting hired every month at top companies
                  </motion.p>
                </div>

                {/* SEARCH BAR — GLASSMORPHISM */}
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="max-w-2xl"
                >
                  <div className="backdrop-blur-xl bg-white/80 border border-white/60 rounded-3xl shadow-2xl flex items-center overflow-hidden group">
                    <Search size={36} className="text-indigo-600 ml-8 group-hover:scale-110 transition" />
                    <input
                      type="text"
                      placeholder="Search jobs, companies, or locations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full py-8 px-6 text-xl text-gray-800 outline-none bg-transparent"
                    />
                    <div className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-10 py-8 font-bold text-lg">
                      Search
                    </div>
                  </div>
                </motion.div>

                {/* STATS — GLASS CARDS */}
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="grid grid-cols-2 gap-8"
                >
                  <div className="backdrop-blur-xl bg-white/80 border border-indigo-200 rounded-3xl p-8 text-center shadow-xl hover:shadow-indigo-300/50 transition">
                    <h3 className="text-5xl font-black text-indigo-600">{jobs.length}+</h3>
                    <p className="text-lg font-bold text-gray-700 mt-2">Active Jobs</p>
                  </div>
                  <div className="backdrop-blur-xl bg-white/80 border border-pink-200 rounded-3xl p-8 text-center shadow-xl hover:shadow-pink-300/50 transition">
                    <h3 className="text-5xl font-black text-pink-600">500+</h3>
                    <p className="text-lg font-bold text-gray-700 mt-2">Trusted Companies</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* RIGHT — HERO IMAGE */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="hidden lg:block"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/30 to-pink-400/30 rounded-3xl blur-3xl transform rotate-6 scale-110"></div>
                  <img 
                    src={jobhero} 
                    alt="Dream job in Ethiopia" 
                    className="relative rounded-3xl shadow-3xl w-full border-12 border-white/40 hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute -bottom-8 -left-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-indigo-900 px-10 py-6 rounded-3xl font-black text-3xl shadow-2xl rotate-[-6deg]">
                    #1 Job Portal in Ethiopia
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* JOBS GRID */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-gray-800 mb-4">Latest Opportunities</h2>
          <p className="text-xl text-gray-600">Save jobs • Apply anytime • Get hired faster</p>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-32">
            <div className="bg-white/70 backdrop-blur rounded-3xl p-16 inline-block">
              <Search size={80} className="text-gray-300 mx-auto mb-6" />
              <h3 className="text-4xl font-bold text-gray-700">No jobs found</h3>
              <p className="text-xl text-gray-500 mt-4">Try different keywords</p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job) => {
              const isSaved = savedJobs.has(job.id);

              return (
                <Link
                  key={job.id}
                  to={`/job/${job.slug || job.id}`}
                  className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-4 block relative group overflow-hidden"
                >
                  {/* SAVE BUTTON */}
                  <button
                    onClick={(e) => toggleSaveJob(e, job.id)}
                    className={`absolute top-6 right-6 z-20 p-4 rounded-full transition-all ${
                      isSaved
                        ? 'bg-red-500 text-white shadow-xl'
                        : 'bg-white/90 backdrop-blur text-gray-500 hover:text-red-500 hover:bg-red-50'
                    } group-hover:scale-110`}
                  >
                    <Heart size={28} className={isSaved ? 'fill-current' : ''} />
                  </button>

                  {/* CARD CONTENT */}
                  <div className="p-8">
                    <div className="flex items-center gap-5 mb-6">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-pink-100 flex items-center justify-center overflow-hidden shadow-lg">
                        {job.companies?.logo_url ? (
                          <img src={job.companies.logo_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Building2 size={40} className="text-indigo-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-xl text-gray-800">{job.companies?.name || 'Company'}</h4>
                        <p className="text-sm text-indigo-600">Verified • Hiring Now</p>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-4 line-clamp-2">
                      {job.title}
                    </h3>

                    <div className="space-y-4 text-gray-600 mb-8">
                      <div className="flex items-center gap-3">
                        <MapPin size={22} className="text-indigo-600" />
                        <span className="font-medium">{job.location || 'Ethiopia'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock size={22} className="text-pink-600" />
                        <span className="capitalize">{job.job_type?.replace('-', ' ') || 'Full-time'}</span>
                      </div>
                    </div>

                    {job.salary_min && (
                      <div className="text-2xl font-bold text-green-600 mb-6">
                        ETB {Number(job.salary_min).toLocaleString()}
                        {job.salary_max && ` - ${Number(job.salary_max).toLocaleString()}`}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar size={20} />
                        <span>{new Date(job.posted_at).toLocaleDateString()}</span>
                      </div>
                      <span className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-6 py-3 rounded-full font-bold">
                        Apply Now
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}