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
        <div className="text-3xl 2xl:text-4xl 3xl:text-5xl font-bold text-indigo-600">Loading company...</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-4xl 2xl:text-5xl 3xl:text-6xl font-bold text-gray-600">Company not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white py-24 2xl:py-32 3xl:py-40">
        <div className="max-w-7xl 2xl:max-w-[1800px] 3xl:max-w-[2200px] mx-auto px-6 lg:px-8 2xl:px-16 3xl:px-24">
          <Link to="/companies" className="inline-flex items-center gap-2 2xl:gap-3 text-white/80 hover:text-white mb-8 2xl:mb-10 text-lg 2xl:text-xl 3xl:text-2xl">
            <ArrowLeft className="w-6 h-6 2xl:w-8 2xl:h-8 3xl:w-10 3xl:h-10" /> Back to Companies
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-10 2xl:gap-14 3xl:gap-20">
            <div className="w-40 h-40 2xl:w-52 2xl:h-52 3xl:w-64 3xl:h-64 bg-white rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden border-8 border-white/20">
              {company.logo_url ? (
                <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-20 h-20 2xl:w-28 2xl:h-28 3xl:w-32 3xl:h-32 text-indigo-600" />
              )}
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-6xl 2xl:text-7xl 3xl:text-8xl font-bold mb-4 2xl:mb-6">{company.name}</h1>
              <p className="text-2xl 2xl:text-3xl 3xl:text-4xl opacity-90 capitalize">{company.industry || 'Technology'}</p>

              <div className="flex flex-wrap gap-6 2xl:gap-8 mt-8 2xl:mt-10 justify-center md:justify-start">
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-3 2xl:gap-4 bg-white/20 hover:bg-white/30 px-6 py-4 2xl:px-8 2xl:py-5 3xl:px-10 3xl:py-6 rounded-full backdrop-blur text-lg 2xl:text-xl 3xl:text-2xl">
                    <Globe className="w-6 h-6 2xl:w-7 2xl:h-7 3xl:w-8 3xl:h-8" />
                    <span className="font-medium">Website</span>
                  </a>
                )}
                <div className="flex items-center gap-3 2xl:gap-4 bg-white/20 px-6 py-4 2xl:px-8 2xl:py-5 3xl:px-10 3xl:py-6 rounded-full backdrop-blur text-lg 2xl:text-xl 3xl:text-2xl">
                  <Briefcase className="w-6 h-6 2xl:w-7 2xl:h-7 3xl:w-8 3xl:h-8" />
                  <span className="font-medium">{jobs.length} Open Position{jobs.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-3 2xl:gap-4 bg-white/20 px-6 py-4 2xl:px-8 2xl:py-5 3xl:px-10 3xl:py-6 rounded-full backdrop-blur text-lg 2xl:text-xl 3xl:text-2xl">
                  <Calendar className="w-6 h-6 2xl:w-7 2xl:h-7 3xl:w-8 3xl:h-8" />
                  <span className="font-medium">Joined {new Date(company.created_at).getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl 2xl:max-w-[1800px] 3xl:max-w-[2200px] mx-auto px-6 lg:px-8 2xl:px-16 3xl:px-24 py-16 2xl:py-24 3xl:py-32">
        <div className="bg-white rounded-3xl shadow-xl p-10 2xl:p-14 3xl:p-20 mb-12 2xl:mb-16 3xl:mb-20">
          <h2 className="text-4xl 2xl:text-5xl 3xl:text-6xl font-bold text-gray-800 mb-6 2xl:mb-8">About {company.name}</h2>
          <p className="text-xl 2xl:text-2xl 3xl:text-3xl text-gray-600 leading-relaxed">
            {company.description || `${company.name} is a leading company hiring top talent across various roles. Join a dynamic team and grow your career.`}
          </p>
        </div>

        {/* Open Jobs */}
        <h2 className="text-5xl 2xl:text-6xl 3xl:text-7xl font-bold text-gray-800 mb-10 2xl:mb-14 3xl:mb-16 text-center">Open Positions</h2>

        {jobs.length === 0 ? (
          <div className="text-center py-20 2xl:py-28 3xl:py-32 bg-white rounded-3xl shadow-lg">
            <Briefcase className="w-20 h-20 2xl:w-28 2xl:h-28 3xl:w-32 3xl:h-32 mx-auto text-gray-300 mb-6 2xl:mb-8" />
            <p className="text-2xl 2xl:text-3xl 3xl:text-4xl text-gray-600">No open positions right now</p>
            <p className="text-gray-500 mt-4 text-lg 2xl:text-xl 3xl:text-2xl">Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 2xl:gap-10 3xl:gap-12">
            {jobs.map((job) => (
              <Link
                key={job.id}
                to={`/job/${job.slug || job.id}`}
                className="bg-white rounded-3xl shadow-lg hover:shadow-xl hover:shadow-indigo-100 p-8 2xl:p-10 3xl:p-12 transition-all duration-300 transform hover:-translate-y-3 border border-gray-100"
              >
                <h3 className="text-2xl 2xl:text-3xl 3xl:text-4xl font-bold text-gray-800 mb-4 2xl:mb-6">{job.title}</h3>

                <div className="space-y-3 2xl:space-y-4 3xl:space-y-5 text-gray-600 mb-6 2xl:mb-8">
                  {job.location && (
                    <div className="flex items-center gap-3 2xl:gap-4 text-base 2xl:text-lg 3xl:text-xl">
                      <MapPin className="w-5 h-5 2xl:w-6 2xl:h-6 3xl:w-7 3xl:h-7 text-indigo-500" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 2xl:gap-4 text-base 2xl:text-lg 3xl:text-xl">
                    <Briefcase className="w-5 h-5 2xl:w-6 2xl:h-6 3xl:w-7 3xl:h-7 text-pink-500" />
                    <span className="capitalize">{job.job_type.replace('-', ' ')}</span>
                  </div>
                  {job.salary_min && (
                    <div className="text-green-600 font-bold text-xl 2xl:text-2xl 3xl:text-3xl">
                      ETB {Number(job.salary_min).toLocaleString()}
                      {job.salary_max ? ` - ${Number(job.salary_max).toLocaleString()}` : '+'}
                    </div>
                  )}
                </div>

                <div className="pt-6 2xl:pt-8 border-t border-gray-200">
                  <span className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-6 py-3 2xl:px-8 2xl:py-4 3xl:px-10 3xl:py-5 rounded-full font-bold inline-block text-base 2xl:text-lg 3xl:text-xl">
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