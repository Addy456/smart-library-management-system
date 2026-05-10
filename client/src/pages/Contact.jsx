import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, MessageSquare, Clock } from "lucide-react";
import { PageHero, Section } from "../components/ui";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const mailtoLink = `mailto:library@smartlms.com?subject=Contact from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(formData.message + "\n\nFrom: " + formData.name + " (" + formData.email + ")")}`;
    window.open(mailtoLink, "_blank");
    setLoading(false);
    toast.success("Opening your email client...");
    setFormData({ name: "", email: "", message: "" });
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "library@smartlms.com", color: "from-indigo-500 to-violet-600" },
    { icon: Phone, label: "Phone", value: "+91 98765 43210", color: "from-emerald-500 to-teal-600" },
    { icon: MapPin, label: "Address", value: "Library Building, Campus Road", color: "from-rose-500 to-pink-600" },
  ];

  const inputBase = "w-full px-4 py-2.5 bg-white dark:bg-surface-200 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <PageHero
        variant="public"
        size="md"
        eyebrow={<><MessageSquare className="w-3.5 h-3.5" /> Get in touch</>}
        title={<>Contact <span className="bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-transparent">us</span></>}
        subtitle="Have questions? We'd love to hear from you. Reach out and we'll get back as soon as possible."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Section accent="primary" title="Send us a message">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" className={inputBase} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className={inputBase} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
              <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="Write your message..." className={`${inputBase} resize-none`} />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all font-bold disabled:opacity-50 flex items-center justify-center gap-2 shadow-card"
            >
              <Send className="w-4 h-4" />
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </form>
        </Section>

        <div className="space-y-8">
          <Section accent="accent" title="Reach out" subtitle="We're here to help through any of these channels.">
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-surface-200 border border-gray-200 dark:border-white/10 rounded-2xl hover:shadow-card transition-all">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${info.color} shadow-card`}>
                    <info.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">{info.label}</p>
                    <p className="text-gray-900 dark:text-white font-bold text-sm mt-0.5">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section
            accent="success"
            title={<span className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-500" /> Library hours</span>}
          >
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-3 bg-gray-50 dark:bg-surface-200 border border-gray-200 dark:border-white/10 rounded-xl">
                <span className="text-gray-600 dark:text-gray-400 font-semibold">Monday – Friday</span>
                <span className="text-gray-900 dark:text-white font-bold">9:00 AM – 6:00 PM</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 dark:bg-surface-200 border border-gray-200 dark:border-white/10 rounded-xl">
                <span className="text-gray-600 dark:text-gray-400 font-semibold">Saturday</span>
                <span className="text-gray-900 dark:text-white font-bold">10:00 AM – 4:00 PM</span>
              </div>
              <div className="flex justify-between p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl">
                <span className="text-gray-600 dark:text-gray-400 font-semibold">Sunday</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">Closed</span>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default Contact;
