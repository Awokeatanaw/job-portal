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
      <section className="py-20 bg-gradient-to-b from-indigo-50/50 via-purple-50/30 to-pink-50/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-4xl font-bold text-gray-700">Loading latest jobs...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-15 bg-gradient-to-b from-indigo-50/50 via-purple-50/30 to-pink-50/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Premium Title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 uppercase tracking-widest"
          >
            Fresh Opportunities
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900"
          >
            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Featured Jobs</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-xl text-gray-700 max-w-3xl mx-auto font-medium"
          >
            Handpicked from Ethiopia’s top companies — apply before they’re gone!
          </motion.p>
        </motion.div>

        {/* Jobs Grid */}
        <div className="grid md:grid-cols-3 gap-10">
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
                  <div className="p-8">
                    <div className="flex items-center gap-5 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-lg">
                        {job.company?.logo_url ? (
                          <img src={job.company.logo_url} alt={job.company.name} className="w-full h-full object-cover" />
                        ) : (
                          <Building2 className="w-9 h-9 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-lg font-medium text-purple-600 mt-1">
                          {job.company?.name || "Top Company"}
                        </p>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="space-y-4 text-gray-700">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-pink-500" />
                        <span className="font-medium">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-indigo-500" />
                        <span className="font-medium capitalize">{job.job_type.replace("-", " ")}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-purple-500" />
                        <span className="font-medium">
                          Posted {new Date(job.posted_at).toLocaleDateString("en-ET", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>

                    {/* Salary + CTA */}
                    <div className="mt-8 flex justify-between items-center">
                      <div>
                        {job.salary_min && job.salary_max ? (
                          <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
                            ETB {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}
                          </p>
                        ) : (
                          <p className="text-lg font-bold text-gray-600">Competitive Salary</p>
                        )}
                      </div>

                      <motion.div
                        whileHover={{ x: 8 }}
                        className="flex items-center gap-2 text-purple-600 font-bold text-lg"
                      >
                        Apply Now
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
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
          className="text-center mt-20"
        >
          <Link
            to="/jobslist"
            className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105"
          >
            View All {featuredJobs.length > 0 ? featuredJobs.length + "+" : ""} Live Jobs
            <ArrowRight className="w-7 h-7" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedJobs;