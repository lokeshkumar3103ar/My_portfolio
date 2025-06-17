import React, { useState, useContext, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { FaBrain, FaRobot, FaQrcode, FaTimes, FaCalendar, FaTag, FaUsers, FaRocket } from 'react-icons/fa';
import { ColorThemeContext } from '../../context/ColorThemeContext';

const projectsData = [  {
    id: 1,
    title: "Qritiq-ConvAi",
    description: "An AI-powered system that evaluates student self-introductions for campus interviews by extracting structured profile data, transcribing speech, and grading performance using rubric-based prompts.",
    longDescription: "Built from scratch with a friend, Qritiq is an AI tool that listens to student self-introductions and provides feedback like an interview coach. The system uses a custom pipeline with Python backend, Whisper for speech-to-text transcription, and Mistral running locally for LLM evaluations. Successfully implemented in college labs to help students refine their interview skills through automated AI-driven evaluation and feedback.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop&crop=center",
    category: "AI Evaluation System",
    tags: ["Python", "Whisper AI", "Mistral LLM", "Speech-to-Text", "Prompt Engineering"],
    icon: FaBrain,
    color: "#6366f1",
    year: 2025,
    status: "User Testing Phase",
    isCollaborative: true,
    features: [
      "Real-time speech-to-text transcription using Whisper",
      "AI-powered interview evaluation with rubric-based scoring",
      "Structured profile data extraction from speech",
      "Custom prompt engineering for accurate assessment",
      "College-focused deployment for lab environments",
      "Automated feedback generation for skill improvement"
    ],
    techStack: {
      backend: ["Python", "FastAPI", "Custom Pipeline"],
      ai: ["Whisper AI", "Mistral LLM (Local)"],
      workflow: "Audio Upload → Transcription → Analysis → Scoring → Feedback"
    }
  },
  {
    id: 2,
    title: "Real-Time Web-Based Attendance System Using Face Detection & QR Code Authentication",
    description: "A comprehensive attendance tracking solution using MTCNN-based facial recognition and dynamic QR codes that change every few seconds. Built with deep learning algorithms to ensure accurate student presence detection.",    longDescription: "This advanced attendance management system combines computer vision and dynamic authentication technologies to create a reliable, error-free tracking solution. Uses MTCNN (Multi-task Cascaded Convolutional Networks) for accurate face detection and recognition, with server-generated QR codes that dynamically change every specific seconds to prevent fraud. The system ensures authentic student presence, provides fast attendance processing, and gives teachers a load-free, error-free, and fair attendance experience. Currently being prepared for testing implementation in our college.",
    image: "https://images.unsplash.com/photo-1606868306217-dbf5046868d2?w=600&h=400&fit=crop&crop=center",
    category: "Web Application",
    tags: ["React", "MTCNN", "Deep Learning", "Dynamic QR", "Face Recognition", "Real-time"],
    icon: FaQrcode,
    color: "#8b5cf6",
    year: 2024,
    status: "College Testing Phase",
    isCollaborative: true,
    features: [
      "MTCNN-based facial recognition for accurate face detection",
      "Dynamic QR code generation that changes every specific seconds",
      "Real-time attendance tracking with fraud prevention",
      "Deep learning algorithms for enhanced recognition accuracy",
      "Server-side QR code management for security",
      "Fast attendance processing for reduced wait times",
      "Error-free and fair attendance system for teachers",
      "Load-free operation reducing teacher workload"
    ],
    techStack: {
      frontend: ["React", "Tailwind CSS", "Real-time Updates"],
      backend: ["Node.js", "Express", "MongoDB", "MTCNN", "Deep Learning Models"],
      security: ["Dynamic QR Generation", "Server-side Authentication"],
      deployment: ["College Infrastructure", "Real-time Processing"]
    }
  },  {
    id: 3,
    title: "Advanced Prompt Engineering Architecture",
    description: "A comprehensive conceptual framework for creating and optimizing AI prompts using my custom-designed structures: TINE, IT DOC, and SUPREME CODE. These frameworks provide systematic approaches to prompt engineering.",    longDescription: "A collection of advanced prompt engineering frameworks and architectural structures that I developed to optimize AI interactions. This includes TINE (There Is No Escape) - a 5-phase recursive improvement system, IT DOC - a developer-inspired structured format, and SUPREME CODE - an advanced coding prompt architecture. These conceptual frameworks provide systematic methodologies for extracting the highest quality, most precise responses from large language models through structured prompt design and optimization techniques.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&crop=center",
    category: "Prompt Architecture",
    tags: ["TINE Framework", "IT DOC", "SUPREME CODE", "Prompt Engineering", "LLM Optimization", "Conceptual Design"],
    icon: FaRobot,
    color: "#6366f1",
    year: 2024,
    status: "Conceptual Framework",
    features: [
      "TINE Framework: 5-phase recursive prompt improvement methodology",
      "IT DOC Format: Developer-inspired structured prompt templates",
      "SUPREME CODE: Advanced coding prompt architecture",
      "Recursive improvement algorithms and techniques",
      "Systematic prompt optimization methodologies",
      "Expert critique integration frameworks",
      "Multi-layer prompt validation structures",
      "Structured prompt design principles and guidelines"
    ],
    techStack: {
      frameworks: ["TINE (There Is No Escape)", "IT DOC Structure", "SUPREME CODE Architecture"],
      methodologies: ["Recursive Improvement", "Structured Optimization", "Multi-Phase Validation"],
      applications: ["LLM Interaction Optimization", "Prompt Template Design", "AI Response Enhancement"],
      concepts: ["Systematic Prompt Engineering", "Architectural Design Patterns", "Response Quality Optimization"]
    }
  }
];

const ProjectsSectionNew = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const { colorThemes, activeTheme } = useContext(ColorThemeContext);
  const sectionRef = useRef(null);
  
  const primaryColor = colorThemes[activeTheme]?.primary || '#6366f1';
  const secondaryColor = colorThemes[activeTheme]?.secondary || '#8b5cf6';
  const gradientBg = colorThemes[activeTheme]?.gradient || 'linear-gradient(135deg, #6366f1, #8b5cf6)';

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7, 
        ease: [0.22, 1, 0.36, 1] 
      }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: { 
        duration: 0.3 
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'User Testing Phase': return '#10B981';
      case 'In Development': return '#F59E0B';
      case 'College Testing Phase': return '#6366F1';
      default: return '#6B7280';
    }
  };

  return (
    <section 
      id="projects" 
      ref={sectionRef} 
      className="py-24 bg-gray-50 dark:bg-gray-950 relative overflow-hidden"
    >      {/* Background decorative elements */}
      <motion.div 
        style={{ 
          y, 
          opacity,
          background: `${primaryColor}10`
        }}
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl"
      />
      <motion.div 
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]), 
          opacity,
          background: `${secondaryColor}10`
        }}
        className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white">
            Featured Projects
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            A showcase of innovative solutions combining AI, computer vision, and modern web technologies 
            to solve real-world problems in education and automation.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projectsData.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              className="group cursor-pointer"
              onClick={() => setSelectedProject(project)}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-800 transition-all duration-300">
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span 
                      className="px-3 py-1 text-xs font-medium text-white rounded-full"
                      style={{ backgroundColor: getStatusColor(project.status) }}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* Collaboration Badge */}
                  {project.isCollaborative && (
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 text-xs font-medium bg-white/20 text-white rounded-full backdrop-blur-sm flex items-center gap-1">
                        <FaUsers className="w-3 h-3" />
                        Collaborative
                      </span>
                    </div>
                  )}

                  {/* Project Icon */}
                  <div className="absolute bottom-4 left-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
                      style={{ backgroundColor: `${project.color}20` }}
                    >
                      <project.icon 
                        className="w-6 h-6 text-white" 
                      />
                    </div>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium" style={{ color: project.color }}>
                      {project.category}
                    </span>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FaCalendar className="w-3 h-3 mr-1" />
                      {project.year}
                    </div>
                  </div>                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2">
                    {project.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Call to Action */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: project.color }}>
                      View Details
                    </span>
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1"
                      style={{ backgroundColor: `${project.color}15` }}
                    >
                      <FaRocket 
                        className="w-4 h-4" 
                        style={{ color: project.color }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>

                {/* Header Content */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: selectedProject.color }}
                    >
                      <selectedProject.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="text-white/80 text-sm">{selectedProject.category}</span>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <FaCalendar className="w-3 h-3" />
                        {selectedProject.year}
                        <span 
                          className="px-2 py-1 rounded-full text-xs"
                          style={{ backgroundColor: getStatusColor(selectedProject.status) }}
                        >
                          {selectedProject.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-[calc(90vh-16rem)] overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                      Project Overview
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {selectedProject.longDescription}
                    </p>

                    <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {selectedProject.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                          <div 
                            className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                            style={{ backgroundColor: selectedProject.color }}
                          />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right Column */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                      Technology Stack
                    </h4>
                    <div className="space-y-4">
                      {Object.entries(selectedProject.techStack).map(([category, technologies]) => (
                        <div key={category}>
                          <h5 className="text-sm font-medium mb-2 capitalize" style={{ color: selectedProject.color }}>
                            {category.replace(/([A-Z])/g, ' $1').trim()}
                          </h5>
                          {Array.isArray(technologies) ? (
                            <div className="flex flex-wrap gap-2">
                              {technologies.map((tech, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded">
                              {technologies}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <h4 className="text-lg font-semibold mb-3 mt-6 text-gray-900 dark:text-white">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm font-medium rounded-full"
                          style={{ 
                            backgroundColor: `${selectedProject.color}15`,
                            color: selectedProject.color
                          }}
                        >
                          <FaTag className="w-3 h-3 inline mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProjectsSectionNew;
