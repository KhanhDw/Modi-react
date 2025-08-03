import { MapPin, Clock, DollarSign, Users, Briefcase } from "lucide-react"

const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Vietnam",
    location: "Ho Chi Minh City",
    type: "Full-time",
    salary: "$2000 - $3000",
    experience: "3+ years",
    description:
      "We are looking for an experienced Frontend Developer to join our dynamic team. You will be responsible for developing user-facing web applications using modern technologies.",
    requirements: [
      "Strong experience with React.js and TypeScript",
      "Proficient in HTML5, CSS3, and JavaScript ES6+",
      "Experience with state management (Redux, Zustand)",
      "Knowledge of responsive design and cross-browser compatibility",
    ],
    benefits: [
      "Competitive salary and performance bonuses",
      "13th month salary and annual review",
      "Health insurance and annual health check",
      "Flexible working hours and remote work options",
    ],
    postedDate: "2 days ago",
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "StartupXYZ",
    location: "Hanoi",
    type: "Full-time",
    salary: "$1800 - $2500",
    experience: "2+ years",
    description:
      "Join our backend team to build scalable and robust server-side applications. You will work with cutting-edge technologies and contribute to our growing platform.",
    requirements: [
      "Experience with Node.js and Express.js",
      "Knowledge of databases (MongoDB, PostgreSQL)",
      "Understanding of RESTful APIs and GraphQL",
      "Familiarity with cloud services (AWS, GCP)",
    ],
    benefits: [
      "Stock options and equity participation",
      "Learning and development budget",
      "Modern office with gaming area",
      "Team building activities and company trips",
    ],
    postedDate: "1 week ago",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Design Studio Pro",
    location: "Da Nang",
    type: "Part-time",
    salary: "$1200 - $1800",
    experience: "1+ years",
    description:
      "We are seeking a creative UI/UX Designer to create intuitive and visually appealing user interfaces. You will collaborate with our development team to bring designs to life.",
    requirements: [
      "Proficiency in Figma, Sketch, or Adobe XD",
      "Strong understanding of user-centered design principles",
      "Experience with prototyping and wireframing",
      "Knowledge of design systems and component libraries",
    ],
    benefits: [
      "Creative freedom and flexible schedule",
      "Access to design tools and resources",
      "Mentorship from senior designers",
      "Portfolio development opportunities",
    ],
    postedDate: "3 days ago",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "Ho Chi Minh City",
    type: "Full-time",
    salary: "$2500 - $3500",
    experience: "4+ years",
    description:
      "Looking for a skilled DevOps Engineer to manage our infrastructure and deployment pipelines. You will ensure our applications run smoothly and efficiently in production.",
    requirements: [
      "Experience with Docker and Kubernetes",
      "Knowledge of CI/CD pipelines (Jenkins, GitLab CI)",
      "Proficiency in cloud platforms (AWS, Azure, GCP)",
      "Scripting skills in Python, Bash, or PowerShell",
    ],
    benefits: [
      "High salary with performance incentives",
      "Professional certification support",
      "Latest technology and equipment",
      "International project opportunities",
    ],
    postedDate: "5 days ago",
  },
  {
    id: 5,
    title: "Mobile App Developer",
    company: "MobileFirst Inc",
    location: "Remote",
    type: "Contract",
    salary: "$1500 - $2200",
    experience: "2+ years",
    description:
      "Develop cross-platform mobile applications using React Native or Flutter. You will work on exciting projects for various clients across different industries.",
    requirements: [
      "Experience with React Native or Flutter",
      "Knowledge of mobile app deployment (App Store, Google Play)",
      "Understanding of mobile UI/UX best practices",
      "Familiarity with native mobile development (iOS/Android)",
    ],
    benefits: [
      "Fully remote work environment",
      "Flexible project-based schedule",
      "Diverse client portfolio",
      "Opportunity to work with latest mobile technologies",
    ],
    postedDate: "1 day ago",
  },
]

function JobItem({ job }) {
  return (
    <div className="p-6 border-l-4 border-l-blue-500 mb-6 transition-all duration-200 hover:shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 dark:border-2  dark:hoaver:border-violet-600">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{job.title}</h2>
            <p className="text-lg font-medium text-blue-600 dark:text-blue-400">{job.company}</p>
          </div>
          <span className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            {job.postedDate}
          </span>
        </div>

        {/* Job Info */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4" />
            <span>{job.type}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <DollarSign className="w-4 h-4" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <Briefcase className="w-4 h-4" />
            <span>{job.experience}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{job.description}</p>

        {/* Requirements */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Requirements:</h3>
          <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
            {job.requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Benefits:</h3>
          <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
            {job.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Apply Button */}
        <div className="pt-2">
          <button className="px-6 py-2 rounded-lg font-medium transition-colors duration-200 bg-blue-600 hover:bg-blue-700 text-white">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default function RecruitmentPage() {
  return (
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Career Opportunities</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Join our team and build the future together</p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span>{jobs.length} positions available</span>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-0">
          {jobs.map((job) => (
            <JobItem key={job.id} job={job} />
          ))}
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-12 p-6 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300">
          <p className="text-sm">
            {"Can't find the right position? Send us your CV at "}
            <a href="mailto:careers@company.com" className="text-blue-500 hover:underline">
              careers@company.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
