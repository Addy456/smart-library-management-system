import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  BookOpen,
  Users,
  Bell,
  Shield,
  Clock,
  Search,
  Sparkles,
  Code2,
} from "lucide-react";
import { PageHero, Section } from "../components/ui";

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const About = () => {
  const features = [
    { icon: BookOpen, title: "Book Management", desc: "Complete CRUD operations for library books with Cloudinary image upload support.", gradient: "from-indigo-500 to-violet-500" },
    { icon: Users, title: "User Management", desc: "Role-based access control with admin and member roles.", gradient: "from-sky-500 to-blue-500" },
    { icon: Bell, title: "Email Notifications", desc: "Automated email notifications for OTP verification, borrowing, and overdue reminders.", gradient: "from-amber-500 to-orange-500" },
    { icon: Clock, title: "Fine Calculation", desc: "Automatic fine calculation at ₹5 per day for overdue books.", gradient: "from-rose-500 to-pink-500" },
    { icon: Shield, title: "Secure Authentication", desc: "JWT-based authentication with httpOnly cookies and OTP email verification.", gradient: "from-emerald-500 to-teal-500" },
    { icon: Search, title: "Advanced Search", desc: "Search books by title, author, or category with pagination support.", gradient: "from-fuchsia-500 to-purple-500" },
  ];

  const techStack = [
    { name: "MongoDB", desc: "Database" },
    { name: "Express.js", desc: "Backend" },
    { name: "React.js", desc: "Frontend" },
    { name: "Node.js", desc: "Runtime" },
  ];

  const extraTech = ["Redux Toolkit", "Tailwind CSS", "JWT Auth", "Cloudinary"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <PageHero
        variant="public"
        size="md"
        eyebrow={<><Sparkles className="w-3.5 h-3.5" /> About the project</>}
        title={<>About <span className="bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-transparent">Smart Library</span></>}
        subtitle="Smart Library Management System (SLMS) is a full-stack MERN application built as a BCA final year major project. It provides a complete digital solution for library management."
      />

      <Section
        accent="primary"
        title="Technology stack"
        subtitle="The MERN foundation powering Smart Library"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {techStack.map((tech) => (
            <div key={tech.name} className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 rounded-2xl p-5 text-center hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all">
              <div className="flex items-center justify-center mb-2">
                <Code2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-lg font-extrabold text-gray-900 dark:text-white">{tech.name}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-semibold">{tech.desc}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {extraTech.map((tech) => (
            <div key={tech} className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 text-center hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
              <div className="text-sm font-bold text-gray-700 dark:text-gray-300">{tech}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        accent="accent"
        eyebrow="Features"
        title="Everything you need to run a modern library"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <FadeIn key={index} delay={index * 0.05}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gray-50 dark:bg-surface-200 border border-gray-200 dark:border-white/10 rounded-2xl p-6 h-full group hover:shadow-card transition-all"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 shadow-card`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-heading font-extrabold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section
        accent="secondary"
        title="Project team"
        subtitle="The minds behind Smart Library"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {[
            { name: "Aditya Pal", id: "230302010307" },
            { name: "Kunal Panchal", id: "230302010367" },
          ].map((member) => (
            <motion.div
              key={member.name}
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-500/10 dark:to-violet-500/10 border border-indigo-200 dark:border-indigo-500/30 rounded-2xl p-6 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-card">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-lg">{member.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mt-1">{member.id}</p>
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default About;
