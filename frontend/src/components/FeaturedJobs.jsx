// src/components/FeaturedJobs.jsx ← FINAL 2025 VERSION (REAL SUPABASE DATA)
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { MapPin, Briefcase, Calendar, ArrowRight, Building2 } from "lucide-react";

const FeaturedJobs = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select(`
            id,
            title,
            slug,
            location,
            job_type,
            salary_min,
            salary_max,
            posted_at,
            company:companies (
              name,
              logo_url
            )
          `)
          .order("posted_at", { ascending: false })
          .limit(3);

        if (error) throw error;
        setFeaturedJobs(data || []);
      } catch (err) {
        console.error("Error fetching featured jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  if (loading) {
    return (
      <section className="py-20 2xl:py-28 3xl:py-32 bg-gradient-to-b from-indigo-50/50 via-purple-50/30 to-pink-50/50">
        <div className="max-w-7xl 2xl:max-w-[1800px] 3xl:max-w-[2200px] mx-auto px-6 lg:px-8 2xl:px-16 3xl:px-24 text-center">
          <div className="text-4xl 2xl:text-5xl 3xl:text-6xl font-bold text-gray-700">Loading latest jobs...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-15 2xl:py-20 3xl:py-28 bg-gradient-to-b from-indigo-50/50 via-purple-50/30 to-pink-50/50">
      <div className="max-w-7xl 2xl:max-w-[1800px] 3xl:max-w-[2200px] mx-auto px-6 lg:px-8 2xl:px-16 3xl:px-24">

        {/* Premium Title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 2xl:mb-20 3xl:mb-24"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-lg 2xl:text-xl 3xl:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 uppercase tracking-widest"
          >
            Fresh Opportunities
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl 3xl:text-8xl font-extrabold text-gray-900"
          >
            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Featured Jobs</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-xl 2xl:text-2xl 3xl:text-3xl text-gray-700 max-w-3xl 2xl:max-w-4xl 3xl:max-w-5xl mx-auto font-medium"
          >
            Handpicked from Ethiopia's top companies — apply before they're gone!
          </motion.p>
        </motion.div>

        {/* Jobs Grid */}
        <div className="grid md:grid-cols-3 gap-10 2xl:gap-12 3xl:gap-16">
          {featuredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.7 }}
            >
              <Link to={`/job/${job.slug || job.id}`}>
                <motion.div
                  whileHover={{ y: -12, scale: 1.03 }}
                  className="group relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 overflow-hidden"
                >
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-indigo-600/10 group-hover:via-purple-600/10 group-hover:to-pink-600/10 transition-all duration-500" />

                  {/* Company Logo + Title */}
                  <div className="p-8 2xl:p-10 3xl:p-12">
                    <div className="flex items-center gap-5 2xl:gap-6 3xl:gap-8 mb-6 2xl:mb-8">
                      <div className="w-16 h-16 2xl:w-20 2xl:h-20 3xl:w-24 3xl:h-24 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-lg">
                        {job.company?.logo_url ? (
                          <img src={job.company.logo_url} alt={job.company.name} className="w-full h-full object-cover" />
                        ) : (
                          <Building2 className="w-9 h-9 2xl:w-11 2xl:h-11 3xl:w-14 3xl:h-14 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl 2xl:text-3xl 3xl:text-4xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-lg 2xl:text-xl 3xl:text-2xl font-medium text-purple-600 mt-1">
                          {job.company?.name || "Top Company"}
                        </p>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="space-y-4 2xl:space-y-5 3xl:space-y-6 text-gray-700">
                      <div className="flex items-center gap-3 2xl:gap-4">
                        <MapPin className="w-5 h-5 2xl:w-6 2xl:h-6 3xl:w-7 3xl:h-7 text-pink-500" />
                        <span className="font-medium text-base 2xl:text-lg 3xl:text-xl">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-3 2xl:gap-4">
                        <Briefcase className="w-5 h-5 2xl:w-6 2xl:h-6 3xl:w-7 3xl:h-7 text-indigo-500" />
                        <span className="font-medium text-base 2xl:text-lg 3xl:text-xl capitalize">{job.job_type.replace("-", " ")}</span>
                      </div>
                      <div className="flex items-center gap-3 2xl:gap-4">
                        <Calendar className="w-5 h-5 2xl:w-6 2xl:h-6 3xl:w-7 3xl:h-7 text-purple-500" />
                        <span className="font-medium text-base 2xl:text-lg 3xl:text-xl">
                          Posted {new Date(job.posted_at).toLocaleDateString("en-ET", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>

                    {/* Salary + CTA */}
                    <div className="mt-8 2xl:mt-10 3xl:mt-12 flex justify-between items-center">
                      <div>
                        {job.salary_min && job.salary_max ? (
                          <p className="text-2xl 2xl:text-3xl 3xl:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
                            ETB {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}
                          </p>
                        ) : (
                          <p className="text-lg 2xl:text-xl 3xl:text-2xl font-bold text-gray-600">Competitive Salary</p>
                        )}
                      </div>

                      <motion.div
                        whileHover={{ x: 8 }}
                        className="flex items-center gap-2 text-purple-600 font-bold text-lg 2xl:text-xl 3xl:text-2xl"
                      >
                        Apply Now
                        <ArrowRight className="w-6 h-6 2xl:w-7 2xl:h-7 3xl:w-8 3xl:h-8 group-hover:translate-x-2 transition-transform" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-20 2xl:mt-24 3xl:mt-28"
        >
          <Link
            to="/jobslist"
            className="inline-flex items-center gap-4 px-12 py-6 2xl:px-16 2xl:py-8 3xl:px-20 3xl:py-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xl 2xl:text-2xl 3xl:text-3xl font-bold rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105"
          >
            View All {featuredJobs.length > 0 ? featuredJobs.length + "+" : ""} Live Jobs
            <ArrowRight className="w-7 h-7 2xl:w-8 2xl:h-8 3xl:w-10 3xl:h-10" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedJobs;