// src/pages/MyJobs.jsx ← FINAL 2025: YOUR DESIGN + FULLY WORKING BUTTONS
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Clock, Users, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndJobs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in as employer');
        navigate('/employer/login');
        return;
      }

      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!company) {
        toast.error('Company not found. Please create your company profile.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id, title, slug, location, job_type,
          salary_min, salary_max, posted_at, is_featured,
          applications(count)
        `)
        .eq('company_id', company.id)
        .order('posted_at', { ascending: false });

      if (error) {
        toast.error('Failed to load jobs');
      } else {
        setJobs(data || []);
      }
      setLoading(false);
    };

    fetchUserAndJobs();
  }, [navigate]);

  // DELETE — WORKS 100%
  const handleDelete = async (jobId) => {
  if (!confirm('Delete this job permanently?\nAll applications and saved entries will also be removed.')) 
    return;

  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId);

  if (error) {
    toast.error('Delete failed: ' + error.message);
  } else {
    setJobs(prev => prev.filter(j => j.id !== jobId));
    toast.success('Job deleted successfully!');
  }
};

  // EDIT — WORKS 100%
  const handleEdit = (jobId) => {
    navigate(`/edit-job/${jobId}`);
  };

  // VIEW APPLICANTS
  const viewApplicants = (jobId) => navigate(`/applicants/${jobId}`);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border-8 border-indigo-200 border-t-indigo-600"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-2xl font-bold text-indigo-600"
        >
          Loading your jobs...
        </motion.p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }}>
            <Briefcase size={140} className="mx-auto text-indigo-500 mb-8 opacity-90" />
          </motion.div>
          <h1 className="text-5xl font-extrabold text-gray-800 mb-6">No Jobs Posted Yet</h1>
          <p className="text-xl text-gray-600 mb-12">Be the first to hire top talent in Ethiopia!</p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/post-job')}
            className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-20 py-7 rounded-full text-3xl font-bold shadow-2xl hover:shadow-3xl transition-all"
          >
            Post Your First Job
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-16">
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 mb-4">
            My Jobs
          </h1>
          <p className="text-2xl text-gray-700">
            {jobs.length} active job{jobs.length !== 1 && 's'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {jobs.map((job, index) => {
            const applicantCount = job.applications?.[0]?.count || 0;

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.03 }}
                className="bg-white rounded-3xl shadow-xl hover:shadow-3xl transition-all duration-500 border border-gray-100 overflow-hidden"
              >
                {job.is_featured && (
                  <motion.div
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    className="bg-gradient-to-r from-purple-600 to-pink-700 text-white text-sm font-bold px-5 py-2 text-center"
                  >
                    Featured Job
                  </motion.div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-5 line-clamp-2">
                    {job.title}
                  </h3>

                  <div className="space-y-5 text-gray-600 mb-8">
                    {job.location && (
                      <motion.div className="flex items-center gap-3" whileHover={{ x: 10 }}>
                        <MapPin size={22} className="text-indigo-600" />
                        <span className="font-medium">{job.location}</span>
                      </motion.div>
                    )}
                    <div className="flex items-center gap-3">
                      <Clock size={22} className="text-pink-600" />
                      <span className="capitalize">{job.job_type.replace('-', ' ')}</span>
                    </div>
                    <motion.div
                      className="flex items-center gap-3"
                      animate={{ scale: applicantCount > 0 ? [1, 1.2, 1] : 1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Users size={24} className="text-emerald-600" />
                      <span className="font-bold text-xl text-emerald-600">
                        {applicantCount} Applicant{applicantCount !== 1 && 's'}
                      </span>
                    </motion.div>

                    {(job.salary_min || job.salary_max) && (
                      <div className="text-emerald-600 font-bold text-xl">
                        ETB {job.salary_min ? Number(job.salary_min).toLocaleString() : 'Negotiable'}
                        {job.salary_max && ` - ${Number(job.salary_max).toLocaleString()}`}
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-gray-500 text-right mb-6">
                    Posted {new Date(job.posted_at).toLocaleDateString('en-GB')}
                  </div>

                  {/* ACTION BUTTONS — NOW FULLY WORKING */}
                  <div className="flex gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => viewApplicants(job.id)}
                      disabled={applicantCount === 0}
                      className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold transition-all shadow-xl ${
                        applicantCount > 0
                          ? 'bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Eye size={22} />
                      View ({applicantCount})
                    </motion.button>

                    {/* EDIT BUTTON — WORKS */}
                    <motion.button
                      whileHover={{ scale: 1.2, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(job.id)}
                      className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all"
                      title="Edit Job"
                    >
                      <Edit size={24} />
                    </motion.button>

                    {/* DELETE BUTTON — WORKS */}
                    <motion.button
                      whileHover={{ scale: 1.2, rotate: -15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(job.id)}
                      className="p-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all"
                      title="Delete Job"
                    >
                      <Trash2 size={24} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mt-24"
        >
          <motion.button
            whileHover={{ scale: 1.1, boxShadow: "0 0 60px rgba(147, 51, 234, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/post-job')}
            className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-3xl font-extrabold px-28 py-9 rounded-full shadow-3xl hover:shadow-4xl transition-all duration-500"
          >
            Post New Job
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}