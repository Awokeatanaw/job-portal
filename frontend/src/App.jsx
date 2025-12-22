
import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import JobDetails from "./pages/JobDetails";
import JobSearch from "./pages/JobSearch";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import EditProfile from "./pages/EditProfile";
import SavedJobs from "./pages/SavedJobs";
import AppliedJobs from "./pages/AppliedJobs";
import CompanyList from "./pages/CompanyList";
import CompanyDetails from "./pages/CompanyDetails";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import PostJob from "./pages/PostJob";
import ApplicantsList from "./pages/ApplicantsList";
import About from "./pages/About";
import Contact from "./pages/Contact";
import JobContextProvider from "./context/JobContext";
import Footer from './components/Footer';
import AuthCallback from './AuthCallback';
import Myjobs from './pages/Myjobs';
import JobsList from './pages/JobsList';
import EmployerNotifications from './pages/EmployerNotifications';
import CompanyProfile from './pages/Companyprofile';
import EditJob from './pages/EditJob';
import { NotificationProvider } from './context/NotificationContext';
const App = () => {
  return (
    <NotificationProvider>
    <div >
      <Navbar/>
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/edit-profile" element={<EditProfile />} />
  <Route path="/jobs" element={<JobSearch />} />
  <Route path="/jobslist" element={<JobsList/>} />
  <Route path="/job/:slug" element={<JobDetails />} />
  <Route path="/saved-jobs" element={<SavedJobs />} />
  <Route path="/applied" element={<AppliedJobs />} />
  <Route path="/companies" element={<CompanyList />} />
  <Route path="/company-profile" element={ <CompanyProfile />} />
  <Route path="/company/:companyId" element={<CompanyDetails />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/notifications" element={<Notifications />} />
  <Route path="/employernotifications" element={<EmployerNotifications />} />
  <Route path="/post-job" element={<PostJob />} />
  <Route path="/applicants/:jobId" element={<ApplicantsList />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/auth/callback" element={<AuthCallback />} />
  <Route path="/myjobs" element={<Myjobs />} />
  <Route path="/edit-job/:jobId" element={<EditJob />} />
</Routes>
   <Footer />
  
    </div>
    </NotificationProvider>
  )
}

export default App
