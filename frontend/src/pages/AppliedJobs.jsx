// src/pages/AppliedJobs.jsx ← FINAL 100% WORKING (NO ERRORS)
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, Building2, Calendar, Clock, MapPin, 
  CheckCircle, XCircle, Eye, FileText, DollarSign   // ← THIS WAS MISSING!
} from 'lucide-react';

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          applied_at,
          cover_letter,
          resume_url,
          jobs (
            id,
            title,
            slug,
            location,
            job_type,
            salary_min,
            salary_max,
            posted_at,
            companies (
              id,
              name,
              logo_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);

    } catch (err) {
      console.error(err);
      alert('Error loading applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      applied: 'bg-gray-100 text-gray-700',
      viewed: 'bg-blue-100 text-blue-700',
      shortlisted: 'bg-purple-100 text-purple-700',
      interview: 'bg-yellow-100 text-yellow-700',
      hired: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return map[status] || map.applied;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-4xl font-bold text-indigo-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-6xl font-bold text-center mb-4">My Applications</h1>
        <p className="text-2xl text-center text-gray-600 mb-16">
          {applications.length} job{applications.length !== 1 ? 's' : ''} applied
        </p>

        {applications.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase size={100} className="mx-auto text-gray-300 mb-8" />
            <h2 className="text-4xl font-bold text-gray-600">No applications yet</h2>
            <Link to="/jobs" className="inline-block mt-8 bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-xl font-bold px-12 py-5 rounded-full">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {applications.map((app) => {
              const job = app.jobs;
              const company = job.companies;

              return (
                <div key={app.id} className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-28 h-28 rounded-2xl bg-gray-50 border-4 border-indigo-100 flex items-center justify-center overflow-hidden">
                      {company.logo_url ? (
                        <img src={company.logo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Building2 size={48} className="text-indigo-500" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <Link to={`/job/${job.slug || job.id}`} className="text-3xl font-bold hover:text-indigo-600">
                            {job.title}
                          </Link>
                          <p className="text-xl text-gray-600 mt-1">{company.name}</p>
                        </div>
                        <span className={`px-6 py-3 rounded-full font-bold ${getStatusBadge(app.status)}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-600 mb-6">
                        {job.location && (
                          <div className="flex items-center gap-2">
                            <MapPin size={18} className="text-indigo-500" />
                            <span>{job.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar size={18} className="text-pink-500" />
                          <span>{new Date(app.applied_at).toLocaleDateString()}</span>
                        </div>
                        {job.salary_min && (
                          <div className="flex items-center gap-2 col-span-2">
                            <DollarSign size={18} className="text-green-600" />
                            <span className="font-bold text-green-600">
                              ETB {Number(job.salary_min).toLocaleString()}
                              {job.salary_max ? ` - ${Number(job.salary_max).toLocaleString()}` : '+'}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-4">
                        {app.resume_url && (
                          <a href={app.resume_url} target="_blank" className="flex items-center gap-2 text-blue-600 hover:underline">
                            <FileText size={18} /> Resume
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}