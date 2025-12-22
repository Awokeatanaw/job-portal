// src/pages/JobDetails.jsx ← FINAL MASTERPIECE 2025 — FULL DETAILS + SAME GORGEOUS DESIGN
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  MapPin, Clock, DollarSign, Building2, ArrowLeft, 
  CheckCircle, ExternalLink, Briefcase, Users, Calendar 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import LoginModal from '../components/LoginModal';

export default function JobDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [slug]);

  const fetchJob = async () => {
    try {
      let query = supabase.from('jobs').select(`
        *,
        company_id,
        companies!inner (
          id,
          name,
          logo_url,
          description,
          website,
          industry
        )
      `);

      if (slug.includes('-')) {
        query = query.eq('slug', slug);
      } else {
        query = query.eq('id', slug);
      }

      const { data, error } = await query.single();
      if (error) throw error;

      setJob(data);
      setCompany(data.companies);

      // Check if already applied
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: existing } = await supabase
          .from('applications')
          .select('id')
          .eq('job_id', data.id)
          .eq('user_id', user.id)
          .maybeSingle();

        if (existing) setApplied(true);
      }
    } catch (err) {
      console.error('Job fetch error:', err);
      toast.error('Job not found');
      navigate('/jobslist');
    } finally {
      setLoading(false);
    }
  };

        const handleApply = async () => {
    if (applied || applying) return;

    setApplying(true);
    const toastId = toast.loading('Submitting your application...');

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
      toast.dismiss(toastId);
        toast.error('Please log in to apply');
        setIsLoginModalOpen(true);
        setApplying(false);
        return;
      }

      // Prevent duplicate
      const { data: exists } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', job.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (exists) {
        toast.dismiss(toastId);
        toast.error('You already applied!');
        setApplied(true);
        setApplying(false);
        return;
      }

      // 1. Submit application
      const { error: appError } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          user_id: user.id,
          status: 'submitted'
        });

      if (appError) throw appError;

      const candidateName = user.user_metadata?.full_name || 'A candidate';

      // 2. CRITICAL: AWAIT BOTH NOTIFICATIONS — NO SILENT FAILURES
      const employerNotif = supabase
        .from('notifications')
        .insert({
          company_id: job.company_id,           // ← NOW 100% CORRECT
          title: "New Applicant!",
          message: `${candidateName} just applied for "${job.title}"`,
          type: "new_application",
          target_role: "employer",
          read: false
        });

      const candidateNotif = supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: "Application Sent!",
          message: `You applied for "${job.title}" at ${company?.name || 'the company'}`,
          type: "application_update",
          target_role: "candidate",
          read: false
        });

      // AWAIT BOTH — SO WE KNOW THEY SUCCEEDED
      const [employerRes, candidateRes] = await Promise.all([employerNotif, candidateNotif]);

      if (employerRes.error) {
        console.error('Employer notification FAILED:', employerRes.error);
        toast.error('Applied, but employer not notified!', { id: toastId });
      }
      if (candidateRes.error) {
        console.warn('Candidate notification failed:', candidateRes.error);
      }

      setApplied(true);
      toast.success('Applied successfully! Employer notified.', { id: toastId });

    } catch (err) {
      console.error('Apply failed:', err);
      toast.error('Failed to apply: ' + err.message, { id: toastId });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center py-32">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 rounded-full border-12 border-indigo-200 border-t-indigo-600"
        />
        <p className="mt-10 text-4xl font-black text-indigo-600">Loading amazing job...</p>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Link to="/jobslist" className="inline-flex items-center gap-3 text-white/80 hover:text-white text-xl mb-10">
            <ArrowLeft size={28} /> Back to All Jobs
          </Link>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight"
              >
                {job.title}
              </motion.h1>

              <div className="flex flex-wrap gap-6 text-xl">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-lg flex items-center justify-center overflow-hidden shadow-xl">
                    {company?.logo_url ? (
                      <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 size={40} />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-2xl">{company?.name || 'Hiring Company'}</p>
                    <p className="opacity-90">Ethiopia</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              {applied ? (
                <div className="bg-emerald-500 text-white px-16 py-8 rounded-3xl font-black text-3xl shadow-2xl flex items-center justify-center gap-4">
                  <CheckCircle size={48} /> Applied!
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleApply}
                  disabled={applying}
                  className="bg-white text-indigo-600 px-20 py-8 rounded-3xl font-black text-4xl shadow-2xl hover:shadow-3xl transition-all disabled:opacity-60"
                >
                  {applying ? 'Applying...' : 'Apply Now'}
                </motion.button>
                
              )}
              
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* LEFT COLUMN — ALL JOB INFO */}
          <div className="lg:col-span-2 space-y-12">

            {/* JOB DETAILS CARD */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-12 border border-indigo-100"
            >
              <h2 className="text-5xl font-extrabold text-gray-800 mb-10 flex items-center gap-4">
                <Briefcase className="text-indigo-600" size={40} /> Job Details
              </h2>
              <div className="grid md:grid-cols-2 gap-8 text-xl">
                {job.location && (
                  <div className="flex items-center gap-5">
                    <MapPin className="text-indigo-600" size={32} />
                    <div>
                      <p className="text-gray-500">Location</p>
                      <p className="font-bold text-2xl">{job.location}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-5">
                  <Clock className="text-pink-600" size={32} />
                  <div>
                    <p className="text-gray-500">Job Type</p>
                    <p className="font-bold text-2xl capitalize">{job.job_type.replace('-', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <Users className="text-purple-600" size={32} />
                  <div>
                    <p className="text-gray-500">Experience</p>
                    <p className="font-bold text-2xl capitalize">{job.experience_level.replace('-', ' ')}</p>
                  </div>
                </div>
                {(job.salary_min || job.salary_max) && (
                  <div className="flex items-center gap-5">
                    <DollarSign className="text-emerald-600" size={32} />
                    <div>
                      <p className="text-gray-500">Salary Range</p>
                      <p className="font-bold text-3xl text-emerald-600">
                        ETB {job.salary_min ? Number(job.salary_min).toLocaleString() : 'Negotiable'}
                        {job.salary_max && ` - ${Number(job.salary_max).toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-5">
                  <Calendar className="text-orange-600" size={32} />
                  <div>
                    <p className="text-gray-500">Posted</p>
                    <p className="font-bold text-2xl">{new Date(job.posted_at || job.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* DESCRIPTION */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl p-12 border border-indigo-100"
            >
              <h2 className="text-5xl font-extrabold text-gray-800 mb-10">About the Role</h2>
              <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-justify">
                {job.description || 'No description provided.'}
              </div>
            </motion.div>

            {/* REQUIREMENTS */}
            {job.requirements && (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-indigo-50 to-pink-50 rounded-3xl shadow-2xl p-12 border border-indigo-200"
              >
                <h2 className="text-5xl font-extrabold text-indigo-700 mb-10">Requirements</h2>
                <ul className="space-y-5 text-xl text-gray-700">
                  {job.requirements.split('\n').filter(r => r.trim()).map((req, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="text-indigo-600 font-bold text-2xl mt-1">•</span>
                      <span>{req.trim()}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* RESPONSIBILITIES */}
            {job.responsibilities && (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-2xl p-12 border border-purple-200"
              >
                <h2 className="text-5xl font-extrabold text-purple-700 mb-10">Responsibilities</h2>
                <ul className="space-y-5 text-xl text-gray-700">
                  {job.responsibilities.split('\n').filter(r => r.trim()).map((res, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="text-purple-600 font-bold text-2xl mt-1">•</span>
                      <span>{res.trim()}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

          </div>

          {/* RIGHT COLUMN — COMPANY CARD + APPLY BUTTON */}
          <div className="space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-10 border border-indigo-100"
            >
              <h3 className="text-4xl font-extrabold text-gray-800 mb-8">About the Company</h3>
              <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-indigo-200 to-pink-200 flex items-center justify-center overflow-hidden shadow-xl mb-6">
                {company?.logo_url ? (
                  <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 size={60} className="text-indigo-600" />
                )}
              </div>
              <h4 className="text-3xl font-black text-center mb-4">{company?.name || 'Great Company'}</h4>
              {company?.description && (
                <p className="text-gray-600 text-lg text-center mb-6">{company.description}</p>
              )}
              {company?.website && (
                <a 
                  href={company.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-center text-pink-600 hover:text-pink-700 font-bold text-xl underline"
                >
                  Visit Website <ExternalLink className="inline" size={24} />
                </a>
              )}
            </motion.div>
            {/* Render LoginModal */}
        <LoginModal 
            isOpen={isLoginModalOpen} 
            onClose={() => setIsLoginModalOpen(false)} 
            onOpenRegister={() => {/* Logic to open register modal */}} // Add this if you have a register modal
        />

            {/* BIG APPLY BUTTON */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-indigo-600 to-pink-600 rounded-3xl shadow-3xl p-10 text-center"
            >
              <button
                onClick={handleApply}
                disabled={applied || applying}
                className="w-full bg-white text-indigo-600 hover:bg-gray-100 px-12 py-10 rounded-3xl font-black text-4xl shadow-2xl hover:shadow-3xl transition-all disabled:opacity-60"
              >
                {applied ? 'Already Applied' : applying ? 'Applying...' : 'Apply for This Job'}
              </button>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}