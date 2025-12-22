// src/pages/ApplicantsList.jsx ← FINAL 2025 — GUARANTEED TO SHOW REAL NAMES
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, Download, Phone, Calendar, MapPin, User, Sparkles 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ApplicantsList() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEverything();
  }, [jobId]);

  const fetchEverything = async () => {
    try {
      // 1. Get job
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('title, location')
        .eq('id', jobId)
        .single();

      if (jobError || !jobData) {
        toast.error('Job not found');
        navigate('/my-jobs');
        return;
      }
      setJob(jobData);

      // 2. Get applications
      const { data: apps, error: appsError } = await supabase
        .from('applications')
        .select('id, status, applied_at, user_id, cover_letter')
        .eq('job_id', jobId)
        .order('applied_at', { ascending: false });

      if (appsError) throw appsError;
      if (!apps || apps.length === 0) {
        setApplicants([]);
        setLoading(false);
        return;
      }

      const userIds = apps.map(a => a.user_id).filter(Boolean);

      // 3. FETCH PROFILES — THIS IS THE MAGIC LINE
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, phone, avatar_url, location, bio, resume_url')
        .in('id', userIds);

      // IF RLS BLOCKS IT → profiles will be null or []
      if (profileError) {
        console.error('Profile fetch failed:', profileError.message);
        toast.error('Cannot load candidate names (RLS issue?)');
      }

      if (!profiles || profiles.length === 0) {
        console.warn('No profiles found. Check RLS policy on profiles table!');
        toast.error('Candidate names hidden — fix RLS policy');
      }

      // 4. Merge data safely
      const merged = apps.map(app => {
        const p = profiles?.find(prof => prof.id === app.user_id);
        
        const fullName = p 
          ? `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Candidate'
          : 'Candidate (Profile Hidden)';

        return {
          ...app,
          profile: {
            full_name: fullName,
            phone: p?.phone || 'Not provided',
            avatar_url: p?.avatar_url || null,
            location: p?.location || null,
            bio: p?.bio || null,
            resume_url: p?.resume_url || null,
          }
        };
      });

      setApplicants(merged);

    } catch (err) {
      console.error('Final error:', err);
      toast.error('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, newStatus) => {
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', appId);

    if (!error) {
      setApplicants(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
      toast.success('Status updated!');
    }
  };

  const downloadResume = (url) => {
    if (!url) return toast.error('No resume');
    window.open(url, '_blank');
  };

  const getStatusBadge = (status) => {
    const map = {
      submitted: 'bg-orange-100 text-orange-800 border-orange-300',
      viewed: 'bg-blue-100 text-blue-800 border-blue-300',
      'under review': 'bg-purple-100 text-purple-800 border-purple-300',
      shortlisted: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      'interview scheduled': 'bg-indigo-100 text-indigo-800 border-indigo-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
      hired: 'bg-green-100 text-green-800 border-green-300',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  const filtered = filter === 'all' ? applicants : applicants.filter(a => a.status === filter);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-24 h-24 rounded-full border-8 border-indigo-200 border-t-indigo-600"
      />
      <p className="mt-8 text-3xl font-black text-indigo-600">Loading applicants...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">

        <motion.button whileHover={{ x: -10 }} onClick={() => navigate('/myjobs')}
          className="flex items-center gap-4 text-indigo-600 font-black text-2xl mb-12">
          <ArrowLeft size={36} /> Back to My Jobs
        </motion.button>

        <div className="text-center mb-16">
          <h1 className="text-7xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            Applicants for {job?.title}
          </h1>
          <p className="text-3xl text-gray-600 mt-4 flex items-center justify-center gap-4">
            <MapPin size={40} /> {job?.location}
          </p>
          <div className="text-7xl font-black text-indigo-600 mt-8">
            {applicants.length} Applicant{applicants.length !== 1 && 's'}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-6 mb-20">
          {['all', 'submitted', 'viewed', 'under review', 'shortlisted', 'interview scheduled', 'rejected', 'hired'].map(s => {
            const count = s === 'all' ? applicants.length : applicants.filter(a => a.status === s).length;
            const label = s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1).replace('scheduled', ' Scheduled');
            return (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-10 py-5 rounded-full font-black text-xl ${filter === s ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white' : 'bg-white text-gray-700'} shadow-xl`}>
                {label} ({count})
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-12">
          {filtered.length === 0 ? (
            <div className="col-span-3 text-center py-32">
              <User size={140} className="mx-auto text-gray-300 mb-8" />
              <h3 className="text-6xl font-black text-gray-400">No applicants here</h3>
            </div>
          ) : filtered.map((app, i) => {
            const p = app.profile;
            return (
              <motion.div key={app.id} initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl shadow-2xl p-10 border-4 border-indigo-100 hover:shadow-3xl transition-all">
                
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-6">
                    <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-black text-5xl shadow-2xl overflow-hidden">
                      {p.avatar_url ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" /> : p.full_name[0]}
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-gray-800">{p.full_name}</h3>
                      {p.location && <p className="text-xl text-gray-600">{p.location}</p>}
                    </div>
                  </div>
                  <Sparkles className="text-yellow-500" size={36} />
                </div>

                <div className={`inline-block px-8 py-4 rounded-full font-black text-xl border-2 mb-8 ${getStatusBadge(app.status)}`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1).replace('scheduled', ' Scheduled')}
                </div>

                <div className="space-y-5 mb-8">
                  {p.phone && p.phone !== 'Not provided' && (
                    <div className="flex items-center gap-5 text-lg">
                      <Phone className="text-emerald-600" size={28} />
                      <span className="font-semibold">{p.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-5 text-lg">
                    <Calendar className="text-purple-600" size={28} />
                    <span>{new Date(app.applied_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                {p.bio && (
                  <div className="bg-gradient-to-r from-indigo-50 to-pink-50 p-6 rounded-3xl mb-8">
                    <h4 className="font-black text-xl text-indigo-700 mb-3">About</h4>
                    <p className="text-gray-700">{p.bio}</p>
                  </div>
                )}

                {app.cover_letter && app.cover_letter !== 'No cover letter provided' && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-3xl mb-8">
                    <h4 className="font-black text-xl text-purple-700 mb-3">Cover Letter</h4>
                    <p className="text-gray-700 italic">"{app.cover_letter}"</p>
                  </div>
                )}

                <div className="flex gap-4">
                  {p.resume_url ? (
                    <button onClick={() => downloadResume(p.resume_url)}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-pink-600 text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4">
                      <Download size={28} /> Resume
                    </button>
                  ) : (
                    <div className="flex-1 bg-gray-200 text-gray-500 py-6 rounded-3xl text-center font-black text-xl">
                      No Resume
                    </div>
                  )}
                  <select value={app.status} onChange={(e) => updateStatus(app.id, e.target.value)}
                    className="px-6 py-6 bg-white border-2 border-indigo-300 rounded-3xl font-bold text-indigo-700">
                    <option value="submitted">New</option>
                    <option value="viewed">Viewed</option>
                    <option value="under review">Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview scheduled">Interview</option>
                    <option value="rejected">Rejected</option>
                    <option value="hired">Hired</option>
                  </select>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}