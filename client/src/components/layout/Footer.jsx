import { BookOpen, Globe, Mail, MessageCircle, Briefcase, ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/catalog", label: "Book Catalog" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const productLinks = [
    { to: "/register", label: "Get Started" },
    { to: "/login", label: "Sign In" },
    { to: "/catalog", label: "Browse Books" },
    { to: "/about", label: "How It Works" },
  ];

  const socialLinks = [
    { icon: Globe, href: "#", label: "Website", color: "hover:bg-indigo-600" },
    { icon: MessageCircle, href: "#", label: "Twitter", color: "hover:bg-sky-500" },
    { icon: Briefcase, href: "#", label: "LinkedIn", color: "hover:bg-blue-600" },
    { icon: Mail, href: "mailto:library@example.com", label: "Email", color: "hover:bg-rose-500" },
  ];

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Top gradient hero band */}
      <div className="relative bg-gradient-to-br from-indigo-700 via-violet-600 to-blue-600 px-4 sm:px-6 lg:px-8 py-14">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto text-center">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3">
            Stay in the loop
          </h2>
          <p className="text-white/85 text-sm sm:text-base mb-6 max-w-xl mx-auto">
            Get notified about new features, book arrivals, and monthly reading picks — no spam, ever.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="min-w-0 flex-1 px-4 py-3 bg-white/15 border border-white/30 rounded-xl text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/25 transition-all backdrop-blur-sm font-semibold"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 px-5 py-3 bg-white text-indigo-700 rounded-xl hover:bg-gray-100 transition-all font-extrabold shadow-card"
            >
              Subscribe <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="bg-gray-50 dark:bg-[#0a0b10] border-t border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Brand */}
            <div className="lg:col-span-5">
              <Link to="/" className="flex items-center gap-2.5 group mb-5 w-fit">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-card group-hover:shadow-hero transition-shadow">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="font-heading font-extrabold text-xl text-gray-900 dark:text-white">
                  Smart<span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Library</span>
                </span>
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 max-w-sm">
                A complete intelligent library management platform built for the modern age. Track, manage, and discover books effortlessly.
              </p>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-white hover:border-transparent ${social.color} transition-all shadow-card`}
                    title={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-3">
              <h3 className="text-xs font-extrabold text-gray-900 dark:text-white mb-5 tracking-[0.2em] uppercase">
                Explore
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white/20 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-400 group-hover:w-3 transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Product */}
            <div className="lg:col-span-4">
              <h3 className="text-xs font-extrabold text-gray-900 dark:text-white mb-5 tracking-[0.2em] uppercase">
                Get Started
              </h3>
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white/20 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-400 group-hover:w-3 transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 safe-bottom">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold flex items-center gap-1.5">
              © {new Date().getFullYear()} SmartLibrary · Crafted with
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              by Aditya
            </p>
            <div className="flex items-center gap-5">
              <a href="#" className="text-xs text-gray-600 dark:text-gray-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors font-bold">Privacy</a>
              <a href="#" className="text-xs text-gray-600 dark:text-gray-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors font-bold">Terms</a>
              <a href="#" className="text-xs text-gray-600 dark:text-gray-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors font-bold">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
