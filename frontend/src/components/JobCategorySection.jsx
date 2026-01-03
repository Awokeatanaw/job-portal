// src/components/JobCategorySection.jsx ← FINAL 2025 VERSION (REAL CATEGORIES + REAL LINKS)
import React from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, Code, Building2, GraduationCap, Stethoscope, 
  Truck, Palette, Calculator, Shield, Globe, Users, ShoppingCart 
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Technology", icon: Code, color: "from-indigo-500 to-purple-500" },
  { name: "Finance", icon: Calculator, color: "from-purple-500 to-pink-500" },
  { name: "Healthcare", icon: Stethoscope, color: "from-pink-500 to-rose-500" },
  { name: "Education", icon: GraduationCap, color: "from-indigo-500 to-blue-500" },
  { name: "Engineering", icon: Briefcase, color: "from-purple-500 to-indigo-500" },
  { name: "Marketing", icon: Palette, color: "from-pink-500 to-purple-500" },
  { name: "Sales", icon: ShoppingCart, color: "from-rose-500 to-pink-500" },
  { name: "Human Resources", icon: Users, color: "from-indigo-500 to-cyan-500" },
  { name: "Construction", icon: Building2, color: "from-gray-600 to-gray-800" },
  { name: "Logistics", icon: Truck, color: "from-orange-500 to-red-500" },
  { name: "Security", icon: Shield, color: "from-green-500 to-emerald-500" },
  { name: "NGO & International", icon: Globe, color: "from-blue-500 to-indigo-500" },
];

const JobCategorySection = () => {
  return (
    <section className="py-10 md:py-10 bg-gradient-to-b from-indigo-50/30 via-purple-50/20 to-pink-50/30">
      {/* Updated container for large screens */}
      <div className="max-w-7xl 2xl:max-w-[1800px] 3xl:max-w-[2200px] mx-auto px-6 lg:px-8 2xl:px-16 3xl:px-24">

        {/* Premium Title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 2xl:mb-20 3xl:mb-24"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-lg 2xl:text-xl 3xl:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 uppercase tracking-widest"
          >
            Explore Your Future
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl 3xl:text-8xl font-extrabold text-gray-900"
          >
            Browse Jobs by <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Category</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-xl 2xl:text-2xl 3xl:text-3xl text-gray-700 max-w-3xl 2xl:max-w-4xl 3xl:max-w-5xl mx-auto font-medium"
          >
            From Tech to Healthcare — find your dream job in Ethiopia's fastest-growing sectors
          </motion.p>
        </motion.div>

        {/* Category Grid - Updated for large screens */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 2xl:gap-10 3xl:gap-12">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
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
                    className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 p-8 2xl:p-10 3xl:p-12 text-center h-full flex flex-col items-center justify-center group"
                  >
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    {/* Icon - Responsive sizing */}
                    <div className="relative z-10 mb-4 2xl:mb-6 p-5 2xl:p-6 3xl:p-8 rounded-2xl bg-white/70 shadow-inner group-hover:shadow-purple-500/30 transition-all">
                      <div className="text-gray-700 group-hover:text-white transition-colors duration-500">
                        <IconComponent className="w-12 h-12 2xl:w-14 2xl:h-14 3xl:w-16 3xl:h-16" />
                      </div>
                    </div>

                    {/* Category Name */}
                    <h3 className="relative z-10 text-lg 2xl:text-xl 3xl:text-2xl font-bold text-gray-800 group-hover:text-white transition-colors duration-500">
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
            );
          })}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-20 2xl:mt-24 3xl:mt-28"
        >
          <Link
            to="/jobslist"
            className="inline-flex items-center gap-3 px-10 py-5 2xl:px-14 2xl:py-7 3xl:px-16 3xl:py-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xl 2xl:text-2xl 3xl:text-3xl font-bold rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300"
          >
            View All Categories
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default JobCategorySection;