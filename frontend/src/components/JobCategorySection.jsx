// src/components/JobCategorySection.jsx ← FINAL 2025 VERSION (REAL CATEGORIES + REAL LINKS)
import React from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, Code, Building2, GraduationCap, Stethoscope, 
  Truck, Palette, Calculator, Shield, Globe, Users, ShoppingCart 
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Technology", icon: <Code size={48} />, color: "from-indigo-500 to-purple-500" },
  { name: "Finance", icon: <Calculator size={48} />, color: "from-purple-500 to-pink-500" },
  { name: "Healthcare", icon: <Stethoscope size={48} />, color: "from-pink-500 to-rose-500" },
  { name: "Education", icon: <GraduationCap size={48} />, color: "from-indigo-500 to-blue-500" },
  { name: "Engineering", icon: <Briefcase size={48} />, color: "from-purple-500 to-indigo-500" },
  { name: "Marketing", icon: <Palette size={48} />, color: "from-pink-500 to-purple-500" },
  { name: "Sales", icon: <ShoppingCart size={48} />, color: "from-rose-500 to-pink-500" },
  { name: "Human Resources", icon: <Users size={48} />, color: "from-indigo-500 to-cyan-500" },
  { name: "Construction", icon: <Building2 size={48} />, color: "from-gray-600 to-gray-800" },
  { name: "Logistics", icon: <Truck size={48} />, color: "from-orange-500 to-red-500" },
  { name: "Security", icon: <Shield size={48} />, color: "from-green-500 to-emerald-500" },
  { name: "NGO & International", icon: <Globe size={48} />, color: "from-blue-500 to-indigo-500" },
];

const JobCategorySection = () => {
  return (
    <section className="py-10 md:py-10 bg-gradient-to-b from-indigo-50/30 via-purple-50/20 to-pink-50/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Premium Title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 uppercase tracking-widest"
          >
            Explore Your Future
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900"
          >
            Browse Jobs by <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Category</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-xl text-gray-700 max-w-3xl mx-auto font-medium"
          >
            From Tech to Healthcare — find your dream job in Ethiopia’s fastest-growing sectors
          </motion.p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.6 }}
            >
              <Link
                to={`/jobslist?category=${encodeURIComponent(category.name)}`}
                className="group block"
              >
                <motion.div
                  whileHover={{ scale: 1.08, y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 p-8 text-center h-full flex flex-col items-center justify-center group"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <div className="relative z-10 mb-4 p-5 rounded-2xl bg-white/70 shadow-inner group-hover:shadow-purple-500/30 transition-all">
                    <div className="text-gray-700 group-hover:text-white transition-colors duration-500">
                      {category.icon}
                    </div>
                  </div>

                  {/* Category Name */}
                  <h3 className="relative z-10 text-lg font-bold text-gray-800 group-hover:text-white transition-colors duration-500">
                    {category.name}
                  </h3>

                  {/* Subtle Arrow */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute bottom-4 right-4 text-white"
                  >
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-20"
        >
          <Link
            to="/jobslist"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300"
          >
            View All Categories
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default JobCategorySection;