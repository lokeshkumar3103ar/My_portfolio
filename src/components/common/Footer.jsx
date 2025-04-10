import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedinIn, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <footer className="bg-[#f5f5f7] dark:bg-[#101013] py-20 relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute -top-40 left-0 w-64 h-64 bg-[#6366f1]/5 dark:bg-[#6366f1]/10 rounded-full blur-3xl"></div>
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#8b5cf6]/5 dark:bg-[#8b5cf6]/10 rounded-full blur-3xl"></div>
      
      {/* Top border line with gradient */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {/* Brand Section */}
          <motion.div 
            className="md:col-span-5"
            variants={fadeIn}
          >
            <h3 className="text-2xl font-medium mb-6 tracking-tight flex items-center">
              <span>Lokesh</span>
              <span className="text-[#6366f1] dark:text-[#a78bfa] ml-2">Kumar</span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-md">
              AI Prompt Engineering Intern specializing in structured approaches like 
              TINE & IT DOC frameworks, creating intelligent solutions through 
              strategic AI interactions and data-driven methodologies.
            </p>
            <div className="flex space-x-6">
              <a 
                href="https://github.com/lokeshkumar3103ar" 
                target="_blank" 
                rel="noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-[#6366f1] dark:hover:text-[#a78bfa] transition-all"
                aria-label="GitHub profile"
              >
                <FaGithub size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/in/lokesh-kumar-a-r-465218244/" 
                target="_blank" 
                rel="noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-[#6366f1] dark:hover:text-[#a78bfa] transition-all"
                aria-label="LinkedIn profile"
              >
                <FaLinkedinIn size={20} />
              </a>
              <a 
                href="mailto:lokeshkumar3103ar@gmail.com"
                className="text-gray-500 dark:text-gray-400 hover:text-[#6366f1] dark:hover:text-[#a78bfa] transition-all"
                aria-label="Email me"
              >
                <FaEnvelope size={20} />
              </a>
            </div>
          </motion.div>
          
          <div className="md:col-span-2"></div>
          
          {/* Navigation */}
          <motion.div 
            variants={fadeIn}
            className="md:col-span-2"
          >
            <h3 className="text-xs uppercase tracking-wider font-medium text-gray-900 dark:text-gray-100 mb-6">Navigation</h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="#expertise" 
                  className="text-gray-500 dark:text-gray-400 hover:text-[#6366f1] dark:hover:text-[#a78bfa] transition-all text-sm"
                >
                  Expertise
                </a>
              </li>
              <li>
                <a 
                  href="#skills" 
                  className="text-gray-500 dark:text-gray-400 hover:text-[#6366f1] dark:hover:text-[#a78bfa] transition-all text-sm"
                >
                  Skills
                </a>
              </li>
              <li>
                <a 
                  href="#timeline" 
                  className="text-gray-500 dark:text-gray-400 hover:text-[#6366f1] dark:hover:text-[#a78bfa] transition-all text-sm"
                >
                  Timeline
                </a>
              </li>
            </ul>
          </motion.div>
          
          {/* Contact */}
          <motion.div 
            variants={fadeIn}
            className="md:col-span-3"
          >
            <h3 className="text-xs uppercase tracking-wider font-medium text-gray-900 dark:text-gray-100 mb-6">Contact</h3>
            <div className="space-y-4">
              <a 
                href="tel:9489112725"
                className="flex items-start text-gray-500 dark:text-gray-400 group"
              >
                <div className="mt-1 mr-3 text-gray-400 dark:text-gray-500 group-hover:text-[#6366f1] dark:group-hover:text-[#a78bfa] transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22 20.4704 21.7893 20.9983 21.4142 21.3734C21.0391 21.7484 20.5113 21.9591 19.96 21.96C16.4 22.25 12.93 21.26 10 19.08C7.36 17.14 5.14 14.92 3.2 12.28C1.02 9.34 0.0300002 5.87 0.32 2.31C0.325365 1.7613 0.538041 1.23712 0.912109 0.86287C1.28618 0.488619 1.81017 0.275113 2.36 0.27H5.36C6.35419 0.262111 7.2064 1.00182 7.38 1.98C7.50248 2.6541 7.68302 3.31511 7.92 3.95C8.14318 4.55611 8.03077 5.23201 7.62 5.73L6.29 7.06C8.10826 9.90421 10.4038 12.2884 13.28 14.14L14.61 12.81C15.1046 12.3992 15.78 12.2868 16.38 12.51C17.0253 12.7458 17.6863 12.9265 18.36 13.05C19.3452 13.2265 20.0747 14.0836 20.06 15.08L22 16.92Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-sm group-hover:text-[#6366f1] dark:group-hover:text-[#a78bfa] transition-all">9489112725</span>
              </a>
              
              <a 
                href="mailto:lokeshkumar3103ar@gmail.com"
                className="flex items-start text-gray-500 dark:text-gray-400 group"
              >
                <div className="mt-1 mr-3 text-gray-400 dark:text-gray-500 group-hover:text-[#6366f1] dark:group-hover:text-[#a78bfa] transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-sm group-hover:text-[#6366f1] dark:group-hover:text-[#a78bfa] transition-all">
                  lokeshkumar3103ar@gmail.com
                </span>
              </a>
              
              <div className="flex items-start text-gray-500 dark:text-gray-400">
                <div className="mt-1 mr-3 text-gray-400 dark:text-gray-500">
                  <FaMapMarkerAlt size={16} />
                </div>
                <span className="text-sm">
                  Based in Chennai, India
                </span>
              </div>
            </div>
            <motion.a 
              href="mailto:lokeshkumar3103ar@gmail.com" 
              className="inline-flex items-center gap-2 text-sm text-[#6366f1] dark:text-[#a78bfa] font-medium mt-6 group"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <span>Get In Touch</span>
              <svg className="h-3 w-3 transition-transform group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.66667 12.6667L12 7.33333L6.66667 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="relative pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Top border with gradient */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>
          
          <p className="text-gray-400 dark:text-gray-500 text-xs">
            &copy; {currentYear} Lokesh Kumar A R. All rights reserved.
          </p>
          <div className="flex items-center mt-4 md:mt-0">
            <p className="text-gray-400 dark:text-gray-500 text-xs">
              Built with React, Tailwind CSS & Framer Motion
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;