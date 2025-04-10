import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaBrain, FaRobot, FaDatabase, FaChartBar, FaCode, FaUserGraduate } from 'react-icons/fa';
import ExpertiseModel from '../models/ExpertiseModel';
import Parallax from '../utils/Parallax';

const expertiseAreas = [
  {
    title: 'Prompt Engineering',
    description: 'Specialist in designing and optimizing AI prompts using frameworks like TINE and IT DOC to achieve highly precise, context-aware, and goal-driven responses from LLMs.',
    icon: FaBrain,
    color: '#6366f1'
  },
  {
    title: 'AI Model Interaction',
    description: 'Deep understanding of how to effectively interact with and extract maximum value from AI models through careful prompt design, context setting, and output refinement.',
    icon: FaRobot,
    color: '#8b5cf6'
  },
  {
    title: 'Data Science',
    description: 'Skilled in Python-based data analytics, processing, and visualization. Currently pursuing BS in Data Science from IIT Madras alongside B.Tech in CSE.',
    icon: FaChartBar,
    color: '#8b5cf6'
  },
  {
    title: 'Academic Excellence',
    description: 'Maintaining a CGPA of 9.64, demonstrating strong theoretical understanding and practical application of computer science and data science concepts.',
    icon: FaUserGraduate,
    color: '#6366f1'
  },
  {
    title: 'Python Programming',
    description: 'Proficient in Python programming with focus on data processing, AI applications, and solving real-world problems through efficient code implementation.',
    icon: FaCode,
    color: '#6366f1'
  },
  {
    title: 'Data Literacy',
    description: 'Certified in data literacy with strong abilities in understanding, interpreting, and communicating insights from complex datasets to drive decision-making.',
    icon: FaDatabase,
    color: '#8b5cf6'
  }
];

const ExpertiseSection = () => {
  const sectionRef = useRef(null);
  
  // For parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section id="expertise" ref={sectionRef} className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#6366f1]/5 dark:bg-[#6366f1]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#8b5cf6]/5 dark:bg-[#8b5cf6]/10 rounded-full blur-3xl"></div>
      
      {/* 3D Model Background with Parallax */}
      <div className="absolute inset-0 z-0 opacity-30 dark:opacity-40 pointer-events-none">
        <motion.div style={{ opacity, y }} className="w-full h-full">
          <ExpertiseModel scrollProgress={scrollYProgress} />
        </motion.div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <Parallax type="element" direction="up" speed={0.3}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Areas of Expertise</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Specialized knowledge in AI prompt engineering, data science, and Python programming,
              with focus on creating optimized AI solutions.
            </p>
          </Parallax>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {expertiseAreas.map((area, index) => (
            <Parallax key={area.title} type="element" direction="up" speed={0.1} delay={index * 0.05}>
              <motion.div
                className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 group"
                variants={cardVariants}
                whileHover={{ y: -5 }}
              >
                <div className="p-8">
                  <div 
                    className="w-12 h-12 flex items-center justify-center mb-6 rounded-sm relative"
                    style={{ backgroundColor: `${area.color}10` }}
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0.8 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 * index, duration: 0.5 }}
                    >
                      <area.icon 
                        className="text-xl transition-transform duration-300 group-hover:scale-110" 
                        style={{ color: area.color }}
                      />
                    </motion.div>
                    
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r"
                      style={{ 
                        backgroundImage: `linear-gradient(to right, ${area.color}80, ${area.color}20)`,
                        width: '60%'
                      }}
                      initial={{ width: 0, opacity: 0 }}
                      whileInView={{ width: '60%', opacity: 1 }}
                      transition={{ delay: 0.3 + (0.1 * index), duration: 0.5 }}
                    />
                  </div>
                  
                  <h3 className="text-xl font-medium mb-3 group-hover:text-[#6366f1] dark:group-hover:text-[#a78bfa] transition-colors">
                    {area.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {area.description}
                  </p>
                </div>
              </motion.div>
            </Parallax>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ExpertiseSection;