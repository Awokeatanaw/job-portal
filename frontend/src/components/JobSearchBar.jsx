// src/components/JobSearchBar.jsx ← FULLY THEMED + REAL SUPABASE DATA
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Briefcase, MapPin, Building2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

const JobSearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [jobCount, setJobCount] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
      setJobCount(count || 0);
    };
    fetchCount();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('jobs')
        .select('id, title, slug, location, company:companies(name, logo_url)')
        .or(`title.ilike.%${query}%,company.name.ilike.%${query}%`)
        .limit(7);

      setSuggestions(data || []);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative flex items-center bg-white/95 backdrop-blur-2xl rounded-full shadow-2xl border-4 border-white/30 focus-within:border-pink-400 focus-within:ring-4 focus-within:ring-pink-400/30 transition-all duration-300">
        <Search className="absolute left-6 w-7 h-7 text-purple-600" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Search jobs, skills, companies..."
          className="w-full pl-20 pr-32 py-7 bg-transparent outline-none text-gray-900 text-xl font-semibold placeholder-gray-500"
        />
        
        {/* Job Count Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute right-5 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg"
        >
          <Briefcase className="w-5 h-5" />
          {jobCount.toLocaleString()} jobs
        </motion.div>
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full mt-4 w-full bg-white/98 backdrop-blur-2xl rounded-3xl shadow-3xl border border-purple-200/50 z-50 overflow-hidden"
          >
            {suggestions.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={`/job/${job.slug || job.id}`}
                  className="flex items-center gap-5 px-8 py-6 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all border-b border-purple-100/30 last:border-0"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                    {job.company?.logo_url ? (
                      <img src={job.company.logo_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-8 h-8 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-xl text-gray-900">{job.title}</h4>
                    <div className="flex items-center gap-4 text-purple-600 font-medium mt-1">
                      <span>{job.company?.name || "Great Company"}</span>
                      <span>•</span>
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            <div className="px-8 py-5 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 text-center">
              <Link 
                to={`/jobslist?q=${encodeURIComponent(query)}`} 
                className="text-purple-700 font-bold text-lg hover:underline"
              >
                See all results for "{query}" →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobSearchBar;