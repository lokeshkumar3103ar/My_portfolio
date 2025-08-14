import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaGithub, FaEnvelope, FaPhone, FaTimes } from 'react-icons/fa';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { ColorThemeContext } from '../../context/ColorThemeContext';

const ContactOverlay = ({ show, onClose, popoverPos }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { currentColors } = useContext(ColorThemeContext);

  // Popover style if popoverPos is provided
  const popoverStyle = popoverPos
    ? {
        position: 'absolute',
        top: popoverPos.top,
        left: popoverPos.left,
        transform: 'translate(-50%, 0)',
        zIndex: 100
      }
    : {};

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Background overlay (only if not popover) */}
          {!popoverPos && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={onClose}
            />
          )}
          {/* Contact modal */}
          <motion.div
            className={`relative ${popoverPos ? 'shadow-2xl' : 'z-50'} bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 md:p-8 m-4 w-full max-w-sm sm:max-w-md mx-auto`}
            style={popoverStyle}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Let's Connect!
              </h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            {/* Contact options */}
            <div className="space-y-4">
              {/* LinkedIn */}
              <motion.a
                href="https://www.linkedin.com/in/lokesh-kumar-a-r-465218244/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: '#0077B5' }}
                >
                  <FaLinkedin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">LinkedIn</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Connect professionally</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.a>
              {/* GitHub */}
              <motion.a
                href="https://github.com/lokeshkumar3103ar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: isDarkMode ? '#fff' : '#333' }}
                >
                  <FaGithub className={`w-6 h-6 ${isDarkMode ? 'text-black' : 'text-white'}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">GitHub</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">View my projects</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.a>
              {/* Email */}
              <motion.a
                href="mailto:lokeshkumar3103ar@gmail.com"
                className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: currentColors.primary }}
                >
                  <FaEnvelope className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Email</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Send an email</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.a>
              {/* Phone */}
              <motion.a
                href="tel:+919677788310"
                className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: '#22c55e' }}
                >
                  <FaPhone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Phone</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Call me directly</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactOverlay;
