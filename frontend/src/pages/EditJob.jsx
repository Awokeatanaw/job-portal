
// src/pages/EditJob.jsx   ← 100% WORKING 2025
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { ArrowLeft, Building2, MapPin, DollarSign, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '',
    location: '',
    job_type: 'full-time',
    experience_level: 'mid',
    salary_min: '',
    salary_max: '',
    description: '',
    requirements: '',
    responsibilities: '',
  });

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error || !data) {
      toast.error('Job not found');
      navigate('/my-jobs');
      return;
    }

    setForm({
      title: data.title || '',
      location: data.location || '',
      job_type: data.job_type || 'full-time',
      experience_level: data.experience_level || 'mid',
      salary_min: data.salary_min || '',
      salary_max: data.salary_max || '',
      description: data.description || '',
      requirements: data.requirements || '',
      responsibilities: data.responsibilities || '',
    });
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.title || !form.location) {
      toast.error('Title and location are required');
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from('jobs')
      .update({
        ...form,
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
        updated_at: new Date(),
      })
      .eq('id', jobId);

    setSaving(false);
    if (error) {
      toast.error('Save failed: ' + error.message);
    } else {
      toast.success('Job updated successfully!');
      navigate('/myjobs');
    }
  };

  if (loading) return <div className="text-center py-32 text-4xl">Loading job...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.button
          whileHover={{ x: -10 }}
          onClick={() => navigate('/myjobs')}
          className="flex items-center gap-4 text-indigo-600 font-black text-2xl mb-12"
        >
          <ArrowLeft size={36} /> Back to My Jobs
        </motion.button>

        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-12 text-center">
            Edit Job Posting
          </h1>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <label className="block text-2xl font-bold text-gray-700 mb-4">Job Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-8 py-6 rounded-2xl border-4 border-indigo-200 text-xl focus:border-indigo-600 outline-none"
                placeholder="Senior React Developer"
              />
            </div>

            <div>
              <label className="block text-2xl font-bold text-gray-700 mb-4 flex items-center gap-3">
                <MapPin size={32} /> Location
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full px-8 py-6 rounded-2xl border-4 border-indigo-200 text-xl focus:border-indigo-600 outline-none"
                placeholder="Addis Ababa, Ethiopia"
              />
            </div>

            <div>
              <label className="block text-2xl font-bold text-gray-700 mb-4">Job Type</label>
              <select name="job_type" value={form.job_type} onChange={handleChange}
                className="w-full px-8 py-6 rounded-2xl border-4 border-indigo-200 text-xl">
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-2xl font-bold text-gray-700 mb-4">Experience Level</label>
              <select name="experience_level" value={form.experience_level} onChange={handleChange}
                className="w-full px-8 py-6 rounded-2xl border-4 border-indigo-200 text-xl">
                <option value="junior">Junior</option>
                <option value="mid">Mid-level</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            <div>
              <label className="block text-2xl font-bold text-gray-700 mb-4 flex items-center gap-3">
                <DollarSign size={32} /> Salary Range (ETB)
              </label>
              <div className="flex gap-4">
                <input
                  name="salary_min"
                  type="number"
                  value={form.salary_min}
                  onChange={handleChange}
                  placeholder="Min"
                  className="w-full px-8 py-6 rounded-2xl border-4 border-indigo-200 text-xl"
                />
                <input
                  name="salary_max"
                  type="number"
                  value={form.salary_max}
                  onChange={handleChange}
                  placeholder="Max"
                  className="w-full px-8 py-6 rounded-2xl border-4 border-indigo-200 text-xl"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-2xl font-bold text-gray-700 mb-4">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={6}
                className="w-full px-8 py-6 rounded-2xl border-4 border-indigo-200 text-xl resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-2xl font-bold text-gray-700 mb-4">Requirements</label>
              <textarea
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                rows={6}
                className="w-full px-8 py-6 rounded-2xl border-4 border-indigo-200 text-xl resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-2xl font-bold text-gray-700 mb-4">Responsibilities</label>
              <textarea
                name="responsibilities"
                value={form.responsibilities}
                onChange={handleChange}
                rows={6}
                className="w-full px-8 py-6 rounded-2xl border-4 border-indigo-200 text-xl resize-none"
              />
            </div>
          </div>

          <div className="mt-16 flex justify-center gap-8">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-20 py-8 bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-3xl font-black rounded-full shadow-2xl hover:shadow-3xl transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}