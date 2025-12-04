import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Skill categories with modern color scheme
const skillCategories = [
  {
    title: 'AI & Machine Learning',
    icon: '🧠',
    gradient: 'from-violet-500 to-purple-600',
    skills: ['Prompt Engineering', 'LLM Integration', 'RAG Systems', 'Multimodal AI', 'Agent Systems', 'LLM Optimization']
  },
  {
    title: 'Backend & Infrastructure',
    icon: '⚡',
    gradient: 'from-blue-500 to-cyan-500',
    skills: ['Python', 'FastAPI', 'MongoDB', 'Docker', 'AWS/Azure AI', 'Ollama']
  },
  {
    title: 'Data & Analytics',
    icon: '📊',
    gradient: 'from-emerald-500 to-teal-500',
    skills: ['Data Analytics', 'Data Processing', 'Data Literacy', 'Excel', 'AI Pipelines', 'Model Deployment']
  },
  {
    title: 'Problem Solving',
    icon: '🎯',
    gradient: 'from-orange-500 to-rose-500',
    skills: ['Research Skills', 'Problem Solving', 'Experimentation', 'AI Model Interaction']
  },
];

// Skill tag component
const SkillTag = ({ name, delay, gradient }) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.05, y: -2 }}
      className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium 
        bg-white/60 dark:bg-gray-800/60
        text-gray-700 dark:text-gray-200
        border border-gray-200/80 dark:border-gray-700/80
        hover:border-gray-300 dark:hover:border-gray-600
        hover:shadow-md hover:bg-white dark:hover:bg-gray-800
        transition-all duration-300 cursor-default
        backdrop-blur-sm"
    >
      {name}
    </motion.span>
  );
};

// Skill category card component
const SkillCard = ({ category, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Glowing background effect */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${category.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`}
      />

      {/* Card content */}
      <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 h-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          <motion.div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-xl shadow-lg`}
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {category.icon}
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {category.title}
            </h3>
            <div className={`h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${category.gradient} transition-all duration-500`} />
          </div>
        </div>

        {/* Skills as tags */}
        <div className="flex flex-wrap gap-2">
          {category.skills.map((skill, skillIndex) => (
            <SkillTag
              key={skill}
              name={skill}
              delay={skillIndex * 0.05}
              gradient={category.gradient}
            />
          ))}
        </div>

        {/* Decorative corner accent */}
        <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${category.gradient} opacity-10 rounded-bl-full rounded-tr-2xl`} />
      </div>
    </motion.div>
  );
};

// Floating particles background
const FloatingParticles = () => {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 dark:from-indigo-400/30 dark:to-purple-400/30"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: '100%',
          }}
          animate={{
            y: [0, -1200],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

const SkillsSection = () => {
  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Section divider */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />

      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Floating particles */}
      <FloatingParticles />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 border border-indigo-500/20 dark:border-indigo-400/30 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Technical Expertise
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
              Skills & Technologies
            </span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            A comprehensive toolkit spanning AI/ML, backend development,
            and data analytics — enabling end-to-end solution delivery.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {skillCategories.map((category, index) => (
            <SkillCard key={category.title} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;