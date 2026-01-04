// src/pages/AppliedJobs.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, Building2, Calendar, Clock, MapPin, 
  CheckCircle, XCircle, Eye, FileText, DollarSign
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-12 sm:py-16">
      {/* Full-width container: no max-width on huge screens */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-4">
          My Applications
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-center text-gray-600 mb-12 md:mb-16 max-w-4xl mx-auto">
          {applications.length} job{applications.length !== 1 ? 's' : ''} applied
        </p>

        {applications.length === 0 ? (
          <div className="text-center py-16 sm:py-20 max-w-3xl mx-auto">
            <Briefcase size={80} className="mx-auto text-gray-300 mb-6 sm:mb-8" />
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-600">No applications yet</h2>
            <Link
              to="/jobs"
              className="inline-block mt-6 sm:mt-8 bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-lg sm:text-xl font-bold px-8 sm:px-12 py-4 sm:py-5 rounded-full hover:opacity-90 transition"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
            {applications.map((app) => {
              const job = app.jobs;
              const company = job.companies;

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-shadow p-6 sm:p-8"
                >
                  <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                    <div className="w-20 sm:w-24 md:w-28 h-20 sm:h-24 md:h-28 rounded-xl sm:rounded-2xl bg-gray-50 border-2 sm:border-4 border-indigo-100 flex items-center justify-center overflow-hidden shrink-0">
                      {company.logo_url ? (
                        <img
                          src={company.logo_url}
                          alt={company.name}
                          className="w-full h-full object-contain p-1 sm:p-2"
                        />
                      ) : (
                        <Building2 size={32} className="text-indigo-500" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0"> {/* prevent flex item from shrinking too much */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                        <div>
                          <Link
                            to={`/job/${job.slug || job.id}`}
                            className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold hover:text-indigo-600 break-words"
                          >
                            {job.title}
                          </Link>
                          <p className="text-base sm:text-lg text-gray-600 mt-1">
                            {company.name}
                          </p>
                        </div>
                        <span
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap mt-2 sm:mt-0 ${
                            getStatusBadge(app.status)
                          }`}
                        >
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-gray-600 mb-5 sm:mb-6">
                        {job.location && (
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-indigo-500 flex-shrink-0" />
                            <span className="text-sm sm:text-base break-words">{job.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-pink-500 flex-shrink-0" />
                          <span className="text-sm sm:text-base">
                            {new Date(app.applied_at).toLocaleDateString()}
                          </span>
                        </div>
                        {job.salary_min && (
                          <div className="flex items-center gap-2 col-span-full sm:col-span-2 lg:col-span-2">
                            <DollarSign size={16} className="text-green-600 flex-shrink-0" />
                            <span className="font-bold text-green-600 text-sm sm:text-base">
                              ETB {Number(job.salary_min).toLocaleString()}
                              {job.salary_max
                                ? ` – ${Number(job.salary_max).toLocaleString()}`
                                : '+'}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {app.resume_url && (
                          <a
                            href={app.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-blue-600 hover:underline text-sm sm:text-base"
                          >
                            <FileText size={16} />
                            Resume
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