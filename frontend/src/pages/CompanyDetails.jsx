
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Building2, Globe, MapPin, Users, Briefcase, Calendar, ArrowLeft, ExternalLink } from 'lucide-react';

export default function CompanyDetails() {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (companyId) fetchCompanyAndJobs();
  }, [companyId]);

  const fetchCompanyAndJobs = async () => {
    try {
      // Fetch company details
      const { data: comp, error: compError } = await supabase
        .from('companies')
        .select(`
          id,
          name,
          logo_url,
          description,
          website,
          industry,
          created_at
        `)
        .eq('id', companyId)
        .single();

      if (compError) throw compError;
      setCompany(comp);

      // Fetch open jobs from this company
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select(`
          id,
          title,
          slug,
          location,
          job_type,
          salary_min,
          salary_max,
          posted_at,
          experience_level
        `)
        .eq('company_id', companyId)
        .order('posted_at', { ascending: false });

      if (jobError) throw jobError;
      setJobs(jobData || []);

    } catch (err) {
      console.error(err);
      alert('Failed to load company');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-3xl font-bold text-indigo-600">Loading company...</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-4xl font-bold text-gray-600">Company not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Link to="/companies" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8">
            <ArrowLeft size={24} /> Back to Companies
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-40 h-40 bg-white rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden border-8 border-white/20">
              {company.logo_url ? (
                <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 size={80} className="text-indigo-600" />
              )}
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-6xl font-bold mb-4">{company.name}</h1>
              <p className="text-2xl opacity-90 capitalize">{company.industry || 'Technology'}</p>

              <div className="flex flex-wrap gap-6 mt-8 justify-center md:justify-start">
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-3 bg-white/20 hover:bg-white/30 px-6 py-4 rounded-full backdrop-blur">
                    <Globe size={24} />
                    <span className="font-medium">Website</span>
                  </a>
                )}
                <div className="flex items-center gap-3 bg-white/20 px-6 py-4 rounded-full backdrop-blur">
                  <Briefcase size={24} />
                  <span className="font-medium">{jobs.length} Open Position{jobs.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/20 px-6 py-4 rounded-full backdrop-blur">
                  <Calendar size={24} />
                  <span className="font-medium">Joined {new Date(company.created_at).getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-xl p-10 mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">About {company.name}</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            {company.description || `${company.name} is a leading company hiring top talent across various roles. Join a dynamic team and grow your career.`}
          </p>
        </div>

        {/* Open Jobs */}
        <h2 className="text-5xl font-bold text-gray-800 mb-10 text-center">Open Positions</h2>

        {jobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
            <Briefcase size={80} className="mx-auto text-gray-300 mb-6" />
            <p className="text-2xl text-gray-600">No open positions right now</p>
            <p className="text-gray-500 mt-4">Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <Link
                key={job.id}
                to={`/job/${job.slug || job.id}`}
                className="bg-white rounded-3xl shadow-lg hover:shadow-xl hover:shadow-indigo-100 p-8 transition-all duration-300 transform hover:-translate-y-3 border border-gray-100"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{job.title}</h3>

                <div className="space-y-3 text-gray-600 mb-6">
                  {job.location && (
                    <div className="flex items-center gap-3">
                      <MapPin size={20} className="text-indigo-500" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Briefcase size={20} className="text-pink-500" />
                    <span className="capitalize">{job.job_type.replace('-', ' ')}</span>
                  </div>
                  {job.salary_min && (
                    <div className="text-green-600 font-bold text-xl">
                      ETB {Number(job.salary_min).toLocaleString()}
                      {job.salary_max ? ` - ${Number(job.salary_max).toLocaleString()}` : '+'}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <span className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-6 py-3 rounded-full font-bold inline-block">
                    Apply Now
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}