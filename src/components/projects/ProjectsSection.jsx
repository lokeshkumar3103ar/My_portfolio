import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionTransition from '../utils/SectionTransition';
import ScrollAnimation from '../utils/ScrollAnimation';
import ProjectModel from '../models/ProjectModel';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Updated project data
const projectsData = [
  {
    id: 1,
    title: "Web-based Attendance System",
    description: "Attendance system using face and QR code recognition for efficient tracking.",
    image: "./images/attendance-system.png",
    category: "Web-based Attendance",
    tags: ["React", "QR Code", "Face Recognition"],
    demoLink: "#",
    githubLink: "#",
  },
  {
    id: 2,
    title: "Prompt Systems",
    description: "A platform for creating and optimizing AI prompts for various models.",
    image: "./images/prompt-systems.jpg",
    category: "Prompt Systems",
    tags: ["Next.js", "Node.js", "LangChain"],
    demoLink: "#",
    githubLink: "#",
  },
  {
    id: 3,
    title: "AI Genesis",
    description: "A comprehensive AI-driven project showcasing advanced capabilities.",
    image: "./images/aigenesis-project.jpeg",
    category: "AI Genesis",
    tags: ["React", "AI", "Innovation"],
    demoLink: "#",
    githubLink: "#",
  },
];

const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const projectsRef = useRef(null);
  
  // Filter projects based on selected category
  const filteredProjects = selectedCategory === "All" 
    ? projectsData 
    : projectsData.filter(project => project.category === selectedCategory);
  
  // Get unique categories
  const categories = ["All", ...new Set(projectsData.map(project => project.category))];
  
  // Handle project selection
  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    // Scroll to project details
    if (projectsRef.current) {
      const projectDetails = document.getElementById('project-details');
      if (projectDetails) {
        projectDetails.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  // GSAP animation for project details
  useEffect(() => {
    if (selectedProject) {
      const detailsEl = document.getElementById('project-details');
      if (detailsEl) {
        gsap.fromTo(
          detailsEl, 
          { opacity: 0, y: 50 }, 
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
        );
      }
    }
  }, [selectedProject]);
  
  // Staggered animation for category filters
  useEffect(() => {
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    gsap.fromTo(
      categoryBtns,
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.1, 
        duration: 0.6,
        scrollTrigger: {
          trigger: categoryBtns[0],
          start: 'top bottom-=100',
        }
      }
    );
  }, []);
  
  return (
    <SectionTransition 
      id="projects" 
      type="slide" 
      className="py-20 bg-gray-50 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4" ref={projectsRef}>
        <ScrollAnimation animation="slideUp">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            My Projects
          </h2>
          <p className="text-lg text-center mb-12 max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            Explore my portfolio of projects spanning different technologies and domains
          </p>
        </ScrollAnimation>
        
        {/* Category filters */}
        <ScrollAnimation animation="fade" delay={0.2}>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
            {categories.map((category, index) => (
              <button
                key={category}
                className={`category-btn px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${selectedCategory === category 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  } shadow-sm`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </ScrollAnimation>
        
        {/* 3D Project Models Display */}
        <div className="mb-16">
          <ScrollAnimation animation="slideUp" delay={0.3}>
            <ProjectModel 
              projects={filteredProjects} 
              onProjectSelect={handleProjectSelect} 
            />
          </ScrollAnimation>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click on a project to view details
            </p>
          </div>
        </div>
        
        {/* Selected Project Details */}
        {selectedProject && (
          <div 
            id="project-details" 
            className="transition-element bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-4 overflow-hidden rounded-md">
                  <img 
                    src={selectedProject.image} 
                    alt={selectedProject.title} 
                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedProject.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-4">
                  {selectedProject.demoLink && (
                    <a 
                      href={selectedProject.demoLink} 
                      target="_blank" 
                      rel="noreferrer"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                  
                  {selectedProject.githubLink && (
                    <a 
                      href={selectedProject.githubLink} 
                      target="_blank" 
                      rel="noreferrer"
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      View Code
                    </a>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {selectedProject.title}
                </h3>
                <div className="mb-4">
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                    {selectedProject.category}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {selectedProject.description}
                </p>
                
                {/* Additional details can be added here */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    Key Features
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                    <li>Implemented using {selectedProject.tags.slice(0, 2).join(', ')} and more</li>
                    <li>Responsive design for all device sizes</li>
                    <li>User-friendly interface with intuitive navigation</li>
                    <li>Performance optimized for smooth experience</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SectionTransition>
  );
};

export default ProjectsSection;