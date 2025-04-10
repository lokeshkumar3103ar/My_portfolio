import React, { useState, useContext, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { FaBriefcase, FaGraduationCap, FaCertificate, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ColorThemeContext } from '../../context/ColorThemeContext';

const timelineData = {
  experience: [
    {
      title: "AI Prompt Engineering Intern",
      company: "Cothon Solutions",
      period: "10/2024 - 11/2024",
      description: "Gained hands-on experience with Artificial Intelligence and Python, working on real-world projects and enhancing knowledge through practical applications."
    }
  ],
  education: [
    {
      degree: "B.Tech in Computer Science and Engineering",
      institution: "Hindustan Institute of Technology and Science",
      period: "08/2023 - 07/2027",
      description: "Currently pursuing with a CGPA of 9.64. Strong focus on theoretical concepts and practical application in computer science."
    },
    {
      degree: "BS in Data Science & Applications",
      institution: "Indian Institute of Technology, Madras",
      period: "01/2025 - Present",
      description: "Pursuing advanced education in data science to complement B.Tech studies and build specialized expertise in this field."
    }
  ],
  certifications: [
    {
      name: "BCG - GenAI Job Simulation",
      institution: "Forage",
      period: "October 2024",
      description: "Practical industry experience with GenAI applications in business contexts, developing skills in Python, chatbot development, data extraction, and NLP.",
      url: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/BCG%20/gabev3vXhuACr48eb_SKZxezskWgmFjRvj9_DCjhenyD3WLu38uyq_1730366810021_completion_certificate.pdf"
    },
    {
      name: "Accenture North America - Data Analytics and Visualization Job Simulation",
      institution: "Forage",
      period: "October 2024",
      description: "Hands-on experience with data analytics and visualization in a simulated professional environment, tackling real-world business problems.",
      url: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/Accenture%20North%20America/hzmoNKtzvAzXsEqx8_T6kdcdKSTfg2aotxT_DCjhenyD3WLu38uyq_1730215450995_completion_certificate.pdf"
    },
    {
      name: "ChatGPT Prompt Engineering for Developers",
      institution: "DeepLearning.AI",
      period: "March 2024",
      description: "Advanced certification in prompt engineering techniques for developers working with large language models.",
      url: "https://learn.deeplearning.ai/accomplishments/99c1427c-e3d9-426e-b7bf-44d69f2c71f8?usp=sharing"
    },
    {
      name: "Introduction to Generative AI",
      institution: "Google Cloud Skills Boost",
      period: "June 2023",
      description: "Fundamental concepts of generative AI, its applications, and implementation in the Google Cloud ecosystem.",
      url: "https://www.cloudskillsboost.google/public_profiles/b097fca6-924b-4eff-9fe4-468cbc4e93fe/badges/4059755?utm_medium=social&utm_source=linkedin&utm_campaign=ql-social-share"
    },
    {
      name: "Google Data Analytics Specialization",
      institution: "Google & Coursera",
      period: "January 2024",
      description: "Comprehensive data analytics program covering data processing, analysis, visualization, and insights communication.",
      url: "https://www.coursera.org/account/accomplishments/certificate/GNZ8NDNG6Q9V"
    },
    {
      name: "DataCamp ChatGPT Intermediate Skill Track",
      institution: "DataCamp",
      period: "January 2024",
      description: "Comprehensive training in intermediate-level ChatGPT usage and prompt engineering skills.",
      url: "https://www.datacamp.com/completed/statement-of-accomplishment/course/387a0167be3743617edaa62ffa10481b080a130a"
    },
    {
      name: "Data Literacy Certification",
      institution: "DataCamp",
      period: "January 2024",
      description: "Certification in understanding, interpreting, and communicating with data effectively.",
      url: "https://www.datacamp.com/skill-verification/DL0038438163443"
    },
    {
      name: "GitHub Foundations Certification",
      institution: "GitHub",
      period: "January 2024",
      description: "Core skills in version control, collaboration, and project management using GitHub.",
      url: "https://www.credly.com/badges/36fa4d5c-c3ee-4a6c-963c-711dad64c17f/linked_in_profile"
    }
  ]
};

const TimelineSection = () => {
  const [activeTab, setActiveTab] = useState('education');
  const [selectedCertIndex, setSelectedCertIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const { colorThemes, activeTheme } = useContext(ColorThemeContext);
  
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const certSectionRef = useRef(null);

  const primaryColor = colorThemes[activeTheme]?.primary || '#6366f1';
  const secondaryColor = colorThemes[activeTheme]?.secondary || '#a78bfa';

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const titleParallax = useTransform(scrollYProgress, [0, 0.5], [0, -30]);
  const opacityParallax = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5]);

  const cardsPerPage = 6;
  const totalCertifications = timelineData.certifications.length;
  const totalPages = Math.ceil(totalCertifications / cardsPerPage);
  
  const paginatedCertifications = Array.from({ length: totalPages }, (_, i) => {
    const startIdx = i * cardsPerPage;
    return timelineData.certifications.slice(startIdx, startIdx + cardsPerPage);
  });

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
    setSelectedCertIndex(null);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    setSelectedCertIndex(null);
  };

  const CertificateCard = ({ item, index, pageIndex }) => {
    const globalIndex = pageIndex * cardsPerPage + index;
    const isSelected = selectedCertIndex === globalIndex;
    
    return (
      <motion.div
        className="h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { 
            delay: index * 0.05,
            duration: 0.5
          }
        }}
        exit={{ opacity: 0, y: -20 }}
      >
        <motion.div
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden h-full flex flex-col
                    transition-all duration-300 border-2 ${isSelected ? 'border-indigo-500' : 'border-transparent'}`}
          whileHover={{ 
            y: -5,
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)"
          }}
          onClick={() => setSelectedCertIndex(isSelected ? null : globalIndex)}
        >
          <div className={`p-6 flex-grow flex flex-col ${isSelected ? 'pb-2' : ''}`}>
            <div className="flex justify-between items-start">
              <span className="text-sm px-3 py-1 rounded-full mb-2 inline-block" style={{
                background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)`,
                color: primaryColor
              }}>
                {item.period}
              </span>
              
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FaExternalLinkAlt className="text-sm" style={{ color: primaryColor }} />
                </a>
              )}
            </div>
            
            <h3 className="text-lg font-bold mt-2 line-clamp-2">{item.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.institution}</p>

            <AnimatePresence>
              {isSelected && (
                <motion.div 
                  className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 inline-block text-sm px-4 py-2 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        color: 'white'
                      }}
                    >
                      View Certificate <FaExternalLinkAlt className="inline ml-2" />
                    </a>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                }}>
                <FaCertificate className="text-white text-sm" />
              </div>
              <button 
                className="text-sm font-medium"
                style={{ color: primaryColor }}
              >
                {isSelected ? "Hide details" : "View details"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const TimelineItem = ({ icon: Icon, period, title, subtitle, description, index, url }) => {
    return (
      <motion.div
        className="flex relative"
        style={{
          zIndex: 10 - index
        }}
      >
        <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center z-20">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              boxShadow: `0 4px 16px ${primaryColor}40`
            }}
          >
            <Icon className="text-white text-xl" />
          </div>
        </div>

        <div className="flex-grow pl-6 pb-12">
          <motion.div
            className="bg-white/80 dark:bg-gray-800/50 p-6 rounded-lg backdrop-blur-md"
            style={{
              boxShadow: `0 8px 24px -10px ${primaryColor}30`,
              border: '1px solid rgba(255,255,255,0.15)',
            }}
            whileHover={{
              y: -8,
              boxShadow: `0 15px 30px -8px ${primaryColor}40`,
              border: '1px solid rgba(255,255,255,0.3)'
            }}
            transition={{
              y: { type: "spring", stiffness: 300, damping: 20 },
              boxShadow: { duration: 0.4 },
              border: { duration: 0.4 }
            }}
          >
            <div className="relative z-10">
              <span
                className="text-sm font-medium inline-block px-3 py-1 rounded-full mb-2"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)`,
                  color: primaryColor,
                  border: `1px solid ${primaryColor}30`
                }}
              >
                {period}
              </span>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold mt-1">{title}</h3>
                {url && (
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    title="View Certificate"
                  >
                    <FaExternalLinkAlt className="text-sm" style={{ color: primaryColor }} />
                  </a>
                )}
              </div>
              <h4 className="text-gray-600 dark:text-gray-400 font-medium mb-3">{subtitle}</h4>
              <p className="text-gray-600 dark:text-gray-300">{description}</p>
            </div>

            <div className="absolute -top-1 -right-1 w-12 h-12 rounded-bl-3xl"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                opacity: 0.6,
                clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    );
  };

  const PaginationControls = () => (
    <div className="flex justify-center items-center mt-8 space-x-4">
      <motion.button
        className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePrevPage}
        style={{
          border: `1px solid ${primaryColor}30`,
        }}
      >
        <FaChevronLeft className="text-sm" style={{ color: primaryColor }} />
      </motion.button>
      
      <div className="text-sm font-medium">
        Page {currentPage + 1} of {totalPages}
      </div>
      
      <motion.button
        className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNextPage}
        style={{
          border: `1px solid ${primaryColor}30`,
        }}
      >
        <FaChevronRight className="text-sm" style={{ color: primaryColor }} />
      </motion.button>
    </div>
  );

  return (
    <section 
      id="timeline" 
      className="py-32 relative overflow-hidden"
      ref={containerRef}
      style={{
        background: 'var(--background)',
        minHeight: '100vh'
      }}
    >
      <div className="absolute inset-0 opacity-10 dark:opacity-20">
        <div className="absolute inset-0 pattern-grid" />
      </div>

      <motion.div
        className="container mx-auto px-6 relative z-10"
        style={{
          y: titleParallax,
          opacity: opacityParallax
        }}
      >
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="text-sm uppercase tracking-wider font-semibold mb-2 inline-block px-3 py-1 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)`,
              color: primaryColor
            }}>
            Experience Timeline
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight relative">
            Professional Journey
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 rounded"
              style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
            />
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-8 max-w-2xl mx-auto">
            My educational background, internship experience, and professional certifications
            in the fields of AI and data science.
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <div className="bg-white/30 dark:bg-black/20 backdrop-blur-md p-1 rounded-xl inline-flex shadow-lg"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {['education', 'experience', 'certifications'].map((tab) => (
              <motion.button
                key={tab}
                className={`relative text-sm uppercase tracking-wider font-medium py-3 px-6 z-10 rounded-lg transition-all`}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedCertIndex(null);
                }}
                style={{
                  backgroundColor: activeTab === tab ? `${primaryColor}20` : 'transparent',
                  color: activeTab === tab ? primaryColor : `${primaryColor}90`,
                  backdropFilter: activeTab === tab ? 'blur(8px)' : 'none',
                  border: activeTab === tab ? `1px solid ${primaryColor}40` : 'none'
                }}
              >
                {tab}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="relative" ref={timelineRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-6xl mx-auto"
            >
              {(activeTab === 'experience' || activeTab === 'education') && (
                <div className="relative">
                  <div
                    className="absolute left-8 top-0 bottom-0 w-0.5 z-10 select-none pointer-events-none"
                    style={{
                      background: `linear-gradient(to bottom, transparent 5%, ${primaryColor} 30%, ${primaryColor} 70%, transparent 95%)`,
                      opacity: 0.8
                    }}
                  />

                  <motion.div>
                    {activeTab === 'experience' && (
                      <div className="space-y-16">
                        {timelineData.experience.map((item, index) => (
                          <TimelineItem
                            key={index}
                            icon={FaBriefcase}
                            period={item.period}
                            title={item.title}
                            subtitle={item.company}
                            description={item.description}
                            index={index}
                          />
                        ))}
                      </div>
                    )}

                    {activeTab === 'education' && (
                      <div className="space-y-16">
                        {timelineData.education.map((item, index) => (
                          <TimelineItem
                            key={index}
                            icon={FaGraduationCap}
                            period={item.period}
                            title={item.degree}
                            subtitle={item.institution}
                            description={item.description}
                            index={index}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              )}

              {activeTab === 'certifications' && (
                <div className="relative" ref={certSectionRef}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`certpage-${currentPage}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedCertifications[currentPage]?.map((cert, index) => (
                          <CertificateCard
                            key={`cert-${currentPage}-${index}`}
                            item={cert}
                            index={index}
                            pageIndex={currentPage}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {totalPages > 1 && <PaginationControls />}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};

export default TimelineSection;