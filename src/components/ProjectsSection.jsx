import React from 'react';
import { motion } from 'framer-motion';

const ProjectsSection = () => {
  // Example projects data
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-featured e-commerce platform with React, Node.js, and MongoDB. Features include user authentication, product search, cart management, and secure checkout.',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
      githubUrl: '#',
      demoUrl: '#',
      type: 'Full Stack'
    },
    {
      id: 2,
      title: 'Weather Dashboard',
      description: 'Interactive weather app providing real-time forecasts, animated weather conditions, and location-based updates using OpenWeather API.',
      image: 'https://images.unsplash.com/photo-1530908295418-a12e326966ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      technologies: ['JavaScript', 'HTML/CSS', 'REST API'],
      githubUrl: '#',
      demoUrl: '#',
      type: 'Frontend'
    },
    {
      id: 3,
      title: 'Task Management API',
      description: 'RESTful API for task management with authentication, task CRUD operations, and team collaboration features.',
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      technologies: ['Node.js', 'Express', 'MongoDB', 'JWT'],
      githubUrl: '#',
      demoUrl: '#',
      type: 'Backend'
    },
    {
      id: 4,
      title: 'Portfolio Generator',
      description: 'Web app that allows users to create and customize personal portfolio websites through an intuitive drag-and-drop interface.',
      image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      technologies: ['Vue.js', 'Tailwind CSS', 'Firebase'],
      githubUrl: '#',
      demoUrl: '#',
      type: 'SaaS'
    },
    {
      id: 5,
      title: 'Smart Home Dashboard',
      description: 'IoT dashboard for controlling and monitoring smart home devices with real-time updates and automation scheduling.',
      image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      technologies: ['React', 'TypeScript', 'MQTT', 'Socket.io'],
      githubUrl: '#',
      demoUrl: '#',
      type: 'IoT'
    },
    {
      id: 6,
      title: 'Code Learning Platform',
      description: 'Interactive platform for learning programming with coding challenges, live tutorials, and peer review system.',
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      technologies: ['React', 'MongoDB', 'Express', 'Node.js'],
      githubUrl: '#',
      demoUrl: '#',
      type: 'Education'
    }
  ];

  return (
    <section id="projects" className="py-20 relative overflow-hidden bg-gradient-to-b from-background to-background/90 dark:from-background-dark dark:to-background-dark/90">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-3xl"></div>
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/40 dark:via-background-dark/40 to-background dark:to-background-dark"></div>
      </div>

      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="mb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-text dark:text-text-dark">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Featured Projects
              </span>
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-text/80 dark:text-text-dark/80 mb-8">
              Explore my latest work and developments that showcase my skills and expertise.
            </p>
          </motion.div>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-2"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform hover:scale-110 duration-700"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-text dark:text-text-dark">
                    {project.title}
                  </h3>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {project.type}
                  </span>
                </div>
                <p className="text-text/70 dark:text-text-dark/70 mb-4 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-text/70 dark:text-text-dark/70 text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-auto pt-4 flex justify-between gap-4">
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition"
                  >
                    Live Demo
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-4 py-2 border border-text/20 dark:border-text-dark/20 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
