// src/context/JobContext.js
import React, { createContext, useState, useContext } from "react";
import { jobs, companies, users } from "../assets/assets";

export const JobContext = createContext();

const JobContextProvider = ({ children }) => {
  const [jobList] = useState(jobs);
  const [companyList] = useState(companies);
  const [currentUser, setCurrentUser] = useState(users[0]); // mock login

  const searchJobs = (keyword = "", location = "", category = "") => {
    return jobList.filter(job => {
      const matchKeyword = keyword ? job.title.toLowerCase().includes(keyword.toLowerCase()) : true;
      const matchLocation = location ? job.location.toLowerCase().includes(location.toLowerCase()) : true;
      const matchCategory = category ? job.category === category : true;
      return matchKeyword && matchLocation && matchCategory;
    });
  };

  const getJobCount = () => jobList.length;

  return (
    <JobContext.Provider
      value={{
        jobList,
        companyList,
        currentUser,
        setCurrentUser,
        searchJobs,
        getJobCount,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export default JobContextProvider;

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) throw new Error("useJobs must be used within JobContextProvider");
  return context;
};