import React, { useContext, useState, useEffect } from "react";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import JobCategorySection from "../components/JobCategorySection";
import { JobContext } from "../context/JobContext";
import FeaturedJobs from "../components/FeaturedJobs";
import Navbar from "../components/Navbar";
import TrustedBy from "../components/TrustedBy";
import { useLocation } from 'react-router-dom';
import LoginModal from '../components/LoginModal';
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { categoryList, jobList, setJobList } = useContext(JobContext);

  useEffect(() => {
    if (location.state?.openLogin) {
      setIsLoginModalOpen(true);
      // Optional: clean the state
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen">
      <Hero />
      <TrustedBy />
      
      {/* 
        JobCategorySection and TrustedBy have their own responsive containers.
        For FeaturedJobs, wrap with responsive container if it doesn't have one.
      */}
      <JobCategorySection categories={categoryList} />
      
      {/* FeaturedJobs wrapper with responsive container */}
      <section className="py-10 md:py-16">
        <div className="max-w-7xl 2xl:max-w-[1800px] 3xl:max-w-[2200px] mx-auto px-6 lg:px-8 2xl:px-16 3xl:px-24">
          <FeaturedJobs jobs={jobList.slice(0, 6)} />
        </div>
      </section>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default Home;