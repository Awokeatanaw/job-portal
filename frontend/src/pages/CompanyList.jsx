// src/pages/CompanyList.jsx ← THE MOST BEAUTIFUL COMPANY PAGE IN AFRICA 2025
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { Building2, Briefcase, Search, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import companyim from '../assets/companyim.jpg';

export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          id,
          name,
          logo_url,
          description,
          website,
          industry,
          jobs (count)
        `)
        .order('name', { ascending: true });

      if (error) throw error;
      setCompanies(data || []);
    } catch (err) {
      console.error('Supabase error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = companies.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-4xl 2xl:text-5xl 3xl:text-6xl font-bold text-indigo-600">Loading companies...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 relative overflow-hidden">

      {/* FLOATING ORBS — SAME AS JOBSLIST & ABOUT */}
      {[...Array(7)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-96 h-96 2xl:w-[500px] 2xl:h-[500px] 3xl:w-[600px] 3xl:h-[600px] bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl -z-10"
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

      {/* HERO — TEXT LEFT + companyim.jpg RIGHT */}
      <div className="relative z-10 py-24 2xl:py-32 3xl:py-40 px-6 lg:px-8 2xl:px-16 3xl:px-24">
        <div className="max-w-7xl 2xl:max-w-[1800px] 3xl:max-w-[2200px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 2xl:gap-24 3xl:gap-32 items-center">

            {/* LEFT — TEXT + SEARCH + STATS */}
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-12 2xl:space-y-16 3xl:space-y-20"
            >
              <div>
                <motion.h1 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-6xl md:text-8xl 2xl:text-9xl 3xl:text-[10rem] font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
                >
                  Top Companies<br />
                  <span className="text-yellow-400">Hiring Now</span><br />
                  in Ethiopia
                </motion.h1>

                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl md:text-3xl 2xl:text-4xl 3xl:text-5xl text-gray-700 font-light mt-8 2xl:mt-12 leading-relaxed"
                >
                  Discover <span className="font-bold text-indigo-600">{companies.length}+ amazing companies</span> building the future of Ethiopia
                </motion.p>
              </div>

              {/* SEARCH BAR — GLASSMORPHISM */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="max-w-2xl 2xl:max-w-3xl 3xl:max-w-4xl"
              >
                <div className="backdrop-blur-xl bg-white/80 border border-white/60 rounded-3xl shadow-2xl flex items-center overflow-hidden group">
                  <Search className="w-9 h-9 2xl:w-11 2xl:h-11 3xl:w-14 3xl:h-14 text-indigo-600 ml-8 2xl:ml-10 group-hover:scale-110 transition" />
                  <input
                    type="text"
                    placeholder="Search by company name or industry..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-8 2xl:py-10 3xl:py-12 px-6 2xl:px-8 text-xl 2xl:text-2xl 3xl:text-3xl text-gray-800 outline-none bg-transparent placeholder:text-gray-500"
                  />
                  <div className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-10 2xl:px-14 3xl:px-16 py-8 2xl:py-10 3xl:py-12 font-bold text-lg 2xl:text-xl 3xl:text-2xl whitespace-nowrap">
                    Search
                  </div>
                </div>
              </motion.div>

              {/* STATS */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-2 gap-8 2xl:gap-10 3xl:gap-12"
              >
                <div className="backdrop-blur-xl bg-white/80 border border-indigo-200 rounded-3xl p-8 2xl:p-10 3xl:p-12 text-center shadow-xl hover:shadow-indigo-300/50 transition">
                  <h3 className="text-5xl 2xl:text-6xl 3xl:text-7xl font-black text-indigo-600">{companies.length}+</h3>
                  <p className="text-lg 2xl:text-xl 3xl:text-2xl font-bold text-gray-700 mt-2">Trusted Companies</p>
                </div>
                <div className="backdrop-blur-xl bg-white/80 border border-pink-200 rounded-3xl p-8 2xl:p-10 3xl:p-12 text-center shadow-xl hover:shadow-pink-300/50 transition">
                  <h3 className="text-5xl 2xl:text-6xl 3xl:text-7xl font-black text-pink-600">
                    {companies.reduce((a, c) => a + (c.jobs?.[0]?.count || 0), 0)}+
                  </h3>
                  <p className="text-lg 2xl:text-xl 3xl:text-2xl font-bold text-gray-700 mt-2">Open Positions</p>
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
                  src={companyim}
                  alt="Top companies in Ethiopia" 
                  className="relative rounded-3xl shadow-3xl w-full border-12 border-white/40 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute -bottom-8 -left-8 2xl:-bottom-10 2xl:-left-10 3xl:-bottom-12 3xl:-left-12 bg-gradient-to-r from-yellow-400 to-orange-500 text-indigo-900 px-10 py-6 2xl:px-14 2xl:py-8 3xl:px-16 3xl:py-10 rounded-3xl font-black text-3xl 2xl:text-4xl 3xl:text-5xl shadow-2xl rotate-[-6deg]">
                  Work With The Best
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* COMPANIES GRID */}
      <div className="max-w-7xl 2xl:max-w-[1800px] 3xl:max-w-[2200px] mx-auto px-6 lg:px-8 2xl:px-16 3xl:px-24 py-20 2xl:py-28 3xl:py-36">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16 2xl:mb-20 3xl:mb-24"
        >
          <h2 className="text-5xl md:text-6xl 2xl:text-7xl 3xl:text-8xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            All Companies
          </h2>
          <p className="text-xl 2xl:text-2xl 3xl:text-3xl text-gray-600 mt-4 2xl:mt-6">
            {companies.length} companies • {companies.reduce((a, c) => a + (c.jobs?.[0]?.count || 0), 0)} open jobs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 2xl:gap-10 3xl:gap-12">
          {filtered.map((company, i) => {
            const jobCount = company.jobs?.[0]?.count || 0;

            return (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/company/${company.id}`}
                  className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-300 transform hover:-translate-y-4 block border border-white/50 group"
                >
                  <div className="p-8 2xl:p-10 3xl:p-12 text-center">
                    <div className="w-32 h-32 2xl:w-40 2xl:h-40 3xl:w-48 3xl:h-48 mx-auto mb-6 2xl:mb-8 bg-gradient-to-br from-indigo-50 to-pink-50 rounded-3xl border-4 border-indigo-100 flex items-center justify-center overflow-hidden group-hover:border-indigo-300 transition">
                      {company.logo_url ? (
                        <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-14 h-14 2xl:w-18 2xl:h-18 3xl:w-20 3xl:h-20 text-indigo-600" />
                      )}
                    </div>

                    <h3 className="text-2xl 2xl:text-3xl 3xl:text-4xl font-black text-gray-800 mb-2 2xl:mb-3 group-hover:text-indigo-600 transition">
                      {company.name}
                    </h3>

                    <p className="text-sm 2xl:text-base 3xl:text-lg text-gray-500 capitalize mb-4 2xl:mb-5 font-medium">
                      {company.industry || 'Various'}
                    </p>

                    <div className="flex items-center justify-center gap-2 2xl:gap-3 text-indigo-600 font-bold mb-6 2xl:mb-8 text-base 2xl:text-lg 3xl:text-xl">
                      <Briefcase className="w-5 h-5 2xl:w-6 2xl:h-6 3xl:w-7 3xl:h-7" />
                      <span>{jobCount} Active Job{jobCount !== 1 ? 's' : ''}</span>
                    </div>

                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 text-sm 2xl:text-base 3xl:text-lg font-medium"
                      >
                        Visit Website <ExternalLink className="w-4 h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
                      </a>
                    )}

                    <div className="mt-8 2xl:mt-10 pt-6 2xl:pt-8 border-t border-gray-100">
                      <span className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-6 py-3 2xl:px-8 2xl:py-4 3xl:px-10 3xl:py-5 rounded-full font-bold text-sm 2xl:text-base 3xl:text-lg">
                        View Company →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-32 2xl:py-40">
            <Building2 className="w-30 h-30 2xl:w-36 2xl:h-36 3xl:w-40 3xl:h-40 mx-auto text-gray-300 mb-8" />
            <p className="text-3xl 2xl:text-4xl 3xl:text-5xl text-gray-600 font-bold">No companies found</p>
            <p className="text-xl 2xl:text-2xl 3xl:text-3xl text-gray-500 mt-4">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}