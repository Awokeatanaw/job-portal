
import company1 from './company1.png';
import company2 from './company2.png';
import company3 from './company3.jpg';

import job1 from './job1.jpg';
import job2 from './job2.jpg';
import job3 from './job3.jpg';

import user1 from './user1.jpg';
import user2 from './user2.jpg';

export const sectors = [
  { id: 1, name: "Information Technology", icon: "💻" },
  { id: 2, name: "Marketing", icon: "📈" },
  { id: 3, name: "Finance", icon: "💰" },
  { id: 4, name: "Education", icon: "🎓" },
  { id: 5, name: "Healthcare", icon: "🏥" },
  { id: 6, name: "Engineering", icon: "⚙️" },
];

export const companies = [
  {
    id: 1,
    name: "TechNova",
    logo: company1,
    sector: "Information Technology",
    location: "Addis Ababa, Ethiopia",
    description:
      "TechNova is a leading IT solutions company providing web, mobile, and AI-based products.",
    website: "https://technova.com",
  },
  {
    id: 2,
    name: "GreenBank",
    logo: company2,
    sector: "Finance",
    location: "Nairobi, Kenya",
    description:
      "GreenBank is a financial institution focused on sustainable and digital banking.",
    website: "https://greenbank.com",
  },
  {
    id: 3,
    name: "SkyLearn",
    logo: company3,
    sector: "Education",
    location: "Addis Ababa, Ethiopia",
    description:
      "SkyLearn provides innovative e-learning solutions and training programs.",
    website: "https://skylearn.com",
  },
];

export const jobs = [
  {
    id: 101,
    title: "Frontend Developer",
    companyId: 1,
    location: "Remote",
    type: "Full-time",
    salary: "ETB 35,000 - 45,000 / month",
    category: "Information Technology",
    experience: "2+ years",
    deadline: "2025-12-20",
    description:
      "We are looking for a skilled React developer to build modern web interfaces.",
    requirements: [
      "2+ years experience in ReactJS",
      "Proficiency in HTML, CSS, JavaScript",
      "Experience with REST APIs",
    ],
    image: job1, // 👈 Add image here
  },
  {
    id: 102,
    title: "Marketing Coordinator",
    companyId: 2,
    location: "Addis Ababa",
    type: "Part-time",
    salary: "ETB 20,000 / month",
    category: "Marketing",
    experience: "1+ years",
    deadline: "2025-12-15",
    description:
      "Help manage marketing campaigns and social media content for GreenBank.",
    requirements: [
      "Strong communication skills",
      "Experience with social media marketing",
      "Fluent in Amharic and English",
    ],
    image: job2, // 👈 Add image here
  },
  {
    id: 103,
    title: "Mathematics Instructor",
    companyId: 3,
    location: "Addis Ababa",
    type: "Contract",
    salary: "ETB 25,000 / month",
    category: "Education",
    experience: "3+ years",
    deadline: "2025-12-10",
    description:
      "Teach mathematics courses online to high school students via SkyLearn platform.",
    requirements: [
      "Bachelor’s in Mathematics or related field",
      "Experience in teaching online",
      "Excellent communication skills",
    ],
    image: job3, // 👈 Add image here
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Selam A.",
    role: "Frontend Developer",
    image: user1,
    feedback:
      "This platform helped me find my dream job in less than a month! The job alerts are super helpful.",
  },
  {
    id: 2,
    name: "Abel T.",
    role: "HR Manager at TechNova",
    image: user2,
    feedback:
      "The employer dashboard makes it easy to manage applicants. Great user experience!",
  },
];

export const users = [
  {
    id: 1,
    name: "Selam A.",
    role: "jobseeker",
    email: "selam@example.com",
    skills: ["React", "TailwindCSS", "Node.js"],
    experience: "2 years",
    resume: "/resumes/selam_resume.pdf",
    savedJobs: [101, 103],
  },
  {
    id: 2,
    name: "Abel T.",
    role: "employer",
    email: "abel@technova.com",
    companyId: 1,
    postedJobs: [101],
  },
];

export const alerts = [
  {
    id: 1,
    userId: 1,
    message: "New job posted: Backend Developer at TechNova",
    type: "job_alert",
    date: "2025-11-10",
  },
  {
    id: 2,
    userId: 1,
    message: "Your application for Frontend Developer is under review",
    type: "application_status",
    date: "2025-11-08",
  },
];

export const languages = [
  { code: "en", name: "English" },
  { code: "am", name: "አማርኛ" },
];

export const statistics = {
  enterprises: 1100,
  users: 30100,
  opportunities: 53,
};

export default {
  sectors,
  companies,
  jobs,
  testimonials,
  users,
  alerts,
  languages,
  statistics,
};
