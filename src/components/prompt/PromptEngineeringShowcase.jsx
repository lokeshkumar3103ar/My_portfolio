import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FaBrain, FaCode, FaCog, FaRegLightbulb, FaChartLine, FaRobot, FaRegClipboard, FaArrowDown } from 'react-icons/fa';
import { HiOutlineTemplate, HiOutlineDocumentDuplicate } from 'react-icons/hi';
import Parallax from '../utils/Parallax';
import PromptEngineeringDeepDive from './PromptEngineeringDeepDive';

const promptSystems = [
  {
    id: "tine",
    title: "TINE",
    tagline: "There Is No Escape",
    type: "Prompt Optimization Framework",
    creator: "Lokesh Kumar A R",
    goal: "Extract the deepest, clearest, and most optimized LLM response possible",
    description: "A 5-phase system that recursively improves outputs by understanding core objectives, structuring responses, and adding expert critique.",
    icon: FaBrain,
    color: '#6366f1',
    accent: '#818cf8',
    steps: [
      "Understanding the Core Objective – Decode the true user intent",
      "Initial Structuring – Draft a base-level response with proper outline",
      "Recursive Improvement – Continuously improve and expand output",
      "External Perspective Check – Add expert critique or simulated alternative views",
      "Finalization – Polish for tone, presentation, clarity"
    ],
    style: "Recursive, intelligent, complete",
    bestFor: "Essays, plans, research, deep ideation",
    example: {
      before: "Explain prompt engineering",
      after: "Give a structured breakdown of prompt engineering including its purpose, structure types, impact on LLM behavior, and examples. Use headings, clarity, and avoid repetition."
    },
    processedExample: {
      title: "Skill Learning App",
      phases: [
        "Phase 1: Understand user intent (learning + engagement)",
        "Phase 2: Define core modules (AI mentor, skill assessment, adaptive path)",
        "Phase 3: Explore delivery (web/app, micro-learning format, gamification)",
        "Phase 4: Add external inputs (compare Duolingo, Notion AI, Udemy)",
        "Phase 5: Refine pitch (AI Mentor that builds your career roadmap in 15 mins/day)"
      ]
    }
  },
  {
    id: "itdoc",
    title: "IT DOC",
    tagline: "I'm the Developer of ChatGPT Prompt",
    type: "Structured Prompt Format",
    creator: "Lokesh Kumar A R",
    goal: "Replicate OpenAI developer prompt style to ensure clear, repeatable outputs",
    description: "A developer-inspired format that assigns clear roles, provides formatting guidance, and structures tasks with step-by-step logic.",
    icon: HiOutlineDocumentDuplicate,
    color: '#8b5cf6',
    accent: '#a78bfa',
    steps: [
      "Assign role (e.g., \"You are a helpful assistant\")",
      "Provide exact formatting guidance",
      "Break down the task into step-by-step logic",
      "Set the output format (Markdown, table, JSON, etc.)"
    ],
    style: "Precise, formatted, repeatable",
    bestFor: "Prompt templates, tools, summarizers, APIs",
    example: {
      goal: "Summarize a YouTube transcript",
      prompt: "You are a summarization assistant. Extract 5–7 key points from the transcript below. Use markdown list. Avoid intro text. Keep under 200 words."
    },
    processedExample: {
      title: "App Design Prompt",
      content: `"You are a product design assistant. You will:
1. Analyze the user goal: Learn skills using AI
2. List 5 app feature ideas based on this
3. Suggest tech stack
4. Suggest marketing pitch

Respond in Markdown table format."`
    }
  },
  {
    id: "supreme",
    title: "The Supreme Code",
    tagline: "Prompt Engineering Blueprint",
    type: "Prompt-Building Methodology",
    creator: "Lokesh Kumar A R",
    goal: "Build optimized prompts by following a structured logic pattern",
    description: "A meta-framework for building reusable prompt templates through a modular, step-by-step approach to prompt design.",
    icon: FaCode,
    color: '#ec4899',
    accent: '#f472b6',
    steps: [
      "Objective – What does the user want?",
      "Context – Who is the user / model?",
      "Constraints – Length, tone, format",
      "Steps – Break down expected behavior",
      "Output Format – Table, list, paragraph",
      "Feedback Loop – (Optional) Ask AI to critique its answer"
    ],
    style: "Modular, reusable, instructional",
    bestFor: "Teaching others to prompt, automation, creating reusable prompt templates",
    example: {
      objective: "Generate 3 startup headlines",
      prompt: "You are a branding assistant. Create 3 punchy headlines for an AI productivity app. Each under 12 words. Use modern tone and benefits-focused language."
    },
    processedExample: {
      title: "Startup Idea Blueprint",
      content: `Objective: Refine startup idea
Context: Solo founder validating idea
Constraints: < 200 words, business pitch ready
Steps:
1. Clarify user type
2. Suggest features
3. Show competitive edge
4. Add monetization

Prompt:
"You are a startup coach. Help refine this idea: 'AI tool for skill learning.' Follow 4-step builder logic. Output as bullet plan."`
    }
  }
];

const PromptEngineeringShowcase = () => {
  const [selectedTab, setSelectedTab] = useState('tine');
  const [activeSystem, setActiveSystem] = useState(promptSystems[0]);
  const [isComparing, setIsComparing] = useState(false);
  const [showDeepDive, setShowDeepDive] = useState(false);
  const sectionRef = useRef(null);
  const deepDiveRef = useRef(null);
  
  // Animation controls
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
  
  // Card animation variants
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

  const tabVariants = {
    inactive: { opacity: 0.7, scale: 0.95 },
    active: { 
      opacity: 1, 
      scale: 1,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const handleTabChange = (id) => {
    setSelectedTab(id);
    setActiveSystem(promptSystems.find(system => system.id === id));
  };

  const toggleComparison = () => {
    setIsComparing(!isComparing);
  };

  const toggleDeepDive = () => {
    setShowDeepDive(!showDeepDive);
    
    // Scroll to deep dive section when shown
    if (!showDeepDive) {
      setTimeout(() => {
        deepDiveRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      // Scroll back to main section
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <section id="prompt-engineering" ref={sectionRef} className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#6366f1]/5 dark:bg-[#6366f1]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#8b5cf6]/5 dark:bg-[#8b5cf6]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-[#ec4899]/5 dark:bg-[#ec4899]/10 rounded-full blur-3xl"></div>
        
        {/* Code-like background pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
          <div className="w-full h-full" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-12 sm:mb-16"
          >
            <Parallax type="element" direction="up" speed={0.3}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 tracking-tight flex items-center justify-center flex-wrap">
                <span className="mr-2 sm:mr-3 text-2xl sm:text-3xl">🧠</span> 
                <span className="text-center">Prompt Engineering Systems</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 px-4 sm:px-0">
                Original frameworks developed to optimize interactions with large language models
                and extract maximum value from AI systems.
              </p>
            </Parallax>
          </motion.div>

          {/* Tab navigation - Improved mobile layout */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
            {promptSystems.map((system) => (
              <motion.button
                key={system.id}
                onClick={() => handleTabChange(system.id)}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-white transition-all font-medium flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base ${selectedTab === system.id ? 'shadow-lg' : ''}`}
                style={{ 
                  backgroundColor: selectedTab === system.id ? system.color : `${system.color}90`,
                  boxShadow: selectedTab === system.id ? `0 10px 25px -5px ${system.color}30` : 'none'
                }}
                variants={tabVariants}
                animate={selectedTab === system.id ? "active" : "inactive"}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <system.icon className="text-base sm:text-lg" />
                <span className="hidden sm:inline">{system.title}</span>
                <span className="sm:hidden">{system.title.split(' ')[0]}</span>
              </motion.button>
            ))}
          </div>

          {/* Main content area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSystem.id}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <div className="p-4 sm:p-6 md:p-8">
                <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12">
                  {/* Left column - System details */}
                  <div className="flex-1">
                    <div 
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-4 sm:mb-6 relative"
                      style={{ backgroundColor: `${activeSystem.color}20` }}
                    >
                      <activeSystem.icon 
                        className="text-2xl sm:text-3xl" 
                        style={{ color: activeSystem.color }}
                      />
                      <motion.div
                        className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                        style={{ backgroundColor: activeSystem.color }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: activeSystem.color }}>
                      {activeSystem.title}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mb-3">
                      {activeSystem.tagline}
                    </p>

                    <div className="mb-4 sm:mb-6">
                      <span className="inline-block px-3 py-1 text-sm rounded-full text-white mb-3 sm:mb-4"
                            style={{ backgroundColor: activeSystem.color }}>
                        {activeSystem.type}
                      </span>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4">
                        {activeSystem.description}
                      </p>
                      <div className="mb-4 sm:mb-6">
                        <h4 className="text-base sm:text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">Goal</h4>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 italic">
                          "{activeSystem.goal}"
                        </p>
                      </div>
                    </div>

                    {/* System Structure */}
                    <div className="mb-4 sm:mb-6">
                      <h4 className="text-base sm:text-lg font-medium mb-3 flex items-center text-gray-800 dark:text-gray-200">
                        <FaCog className="mr-2" /> System Structure
                      </h4>
                      <div className="space-y-2">
                        {activeSystem.steps.map((step, idx) => (
                          <motion.div 
                            key={idx}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <div 
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center mr-3 shrink-0 mt-0.5"
                              style={{ backgroundColor: `${activeSystem.color}40` }}
                            >
                              <span className="text-xs font-medium" style={{ color: activeSystem.color }}>{idx + 1}</span>
                            </div>
                            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{step}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Best For - Improved mobile layout */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-4 sm:mb-6">
                      <div>
                        <h4 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Style</h4>
                        <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200">{activeSystem.style}</p>
                      </div>
                      <div>
                        <h4 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Best For</h4>
                        <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200">{activeSystem.bestFor}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right column - Example */}
                  <div className="flex-1">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 h-full border border-gray-200 dark:border-gray-700">
                      <h4 className="text-lg font-medium mb-4 flex items-center text-gray-800 dark:text-gray-200">
                        <FaRegLightbulb className="mr-2" /> Real Example
                      </h4>
                      
                      {activeSystem.id === 'tine' && (
                        <>
                          <div className="mb-6">
                            <h5 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Basic Prompt (Before)</h5>
                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                              <p className="text-gray-800 dark:text-gray-200 font-mono text-sm">{activeSystem.example.before}</p>
                            </div>
                          </div>
                          <div className="mb-6">
                            <h5 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">TINE Prompt (After)</h5>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                              <p className="text-gray-800 dark:text-gray-200 font-mono text-sm">{activeSystem.example.after}</p>
                            </div>
                          </div>
                        </>
                      )}

                      {activeSystem.id === 'itdoc' && (
                        <>
                          <div className="mb-6">
                            <h5 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Goal</h5>
                            <p className="text-gray-800 dark:text-gray-200 mb-3">{activeSystem.example.goal}</p>
                            <h5 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">IT DOC Prompt</h5>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                              <p className="text-gray-800 dark:text-gray-200 font-mono text-sm">{activeSystem.example.prompt}</p>
                            </div>
                          </div>
                        </>
                      )}

                      {activeSystem.id === 'supreme' && (
                        <>
                          <div className="mb-6">
                            <h5 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Objective</h5>
                            <p className="text-gray-800 dark:text-gray-200 mb-3">{activeSystem.example.objective}</p>
                            <h5 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Supreme Code Prompt</h5>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                              <p className="text-gray-800 dark:text-gray-200 font-mono text-sm">{activeSystem.example.prompt}</p>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Processed Example */}
                      <div className="mt-8">
                        <h5 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                          <FaChartLine className="mr-1" /> Case Study: {activeSystem.processedExample.title}
                        </h5>
                        
                        <div className="mt-3 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                          {activeSystem.id === 'tine' && (
                            <div className="space-y-2">
                              {activeSystem.processedExample.phases.map((phase, idx) => (
                                <motion.div 
                                  key={idx} 
                                  className="flex items-start"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: idx * 0.15 }}
                                >
                                  <div className="shrink-0 mr-2 w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500 mt-2"></div>
                                  <p className="text-gray-700 dark:text-gray-300 text-sm">{phase}</p>
                                </motion.div>
                              ))}
                            </div>
                          )}

                          {(activeSystem.id === 'itdoc' || activeSystem.id === 'supreme') && (
                            <div className="font-mono text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                              {activeSystem.processedExample.content}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
            <motion.button
              onClick={toggleComparison}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaRegClipboard className="mr-2" />
              {isComparing ? "Hide Comparison" : "Compare All Systems"}
            </motion.button>
            
            <motion.button
              onClick={toggleDeepDive}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaArrowDown className={`mr-2 transition-transform duration-300 ${showDeepDive ? 'rotate-180' : ''}`} />
              <span>{showDeepDive ? "Show Less" : "Deep Dive Analysis"}</span>
            </motion.button>
          </div>

          {/* Comparison section */}
          <AnimatePresence>
            {isComparing && (
              <motion.div 
                className="mt-16"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
                  System Comparison
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg">
                    <thead>
                      <tr>
                        <th className="py-4 px-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">Framework</th>
                        <th className="py-4 px-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">Type</th>
                        <th className="py-4 px-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">Primary Use</th>
                        <th className="py-4 px-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">Response Style</th>
                      </tr>
                    </thead>
                    <tbody>
                      <motion.tr
                        initial={{ backgroundColor: "#6366f120" }}
                        animate={{ backgroundColor: "rgba(99, 102, 241, 0)" }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                      >
                        <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center">
                            <div 
                              className="w-8 h-8 rounded-md flex items-center justify-center mr-3"
                              style={{ backgroundColor: "#6366f120" }}
                            >
                              <FaBrain className="text-indigo-500" />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-gray-200">TINE</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Optimization</td>
                        <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Deep & multi-phase refinement</td>
                        <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Rich, expanded, smart</td>
                      </motion.tr>
                      
                      <motion.tr
                        initial={{ backgroundColor: "#8b5cf620" }}
                        animate={{ backgroundColor: "rgba(139, 92, 246, 0)" }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                      >
                        <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center">
                            <div 
                              className="w-8 h-8 rounded-md flex items-center justify-center mr-3"
                              style={{ backgroundColor: "#8b5cf620" }}
                            >
                              <HiOutlineDocumentDuplicate className="text-purple-500" />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-gray-200">IT DOC</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Structured</td>
                        <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Tool-ready structured prompts</td>
                        <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Clear, modular, repeatable</td>
                      </motion.tr>
                      
                      <motion.tr
                        initial={{ backgroundColor: "#ec489920" }}
                        animate={{ backgroundColor: "rgba(236, 72, 153, 0)" }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                      >
                        <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center">
                            <div 
                              className="w-8 h-8 rounded-md flex items-center justify-center mr-3"
                              style={{ backgroundColor: "#ec489920" }}
                            >
                              <FaCode className="text-pink-500" />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-gray-200">Supreme Code</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Meta Methodology</td>
                        <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Prompt building + automation</td>
                        <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Logic-based, modular</td>
                      </motion.tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Deep Dive Section */}
      {showDeepDive && (
        <div ref={deepDiveRef}>
          <PromptEngineeringDeepDive />
          
          <div className="bg-gray-900 py-8 text-center">
            <motion.button
              onClick={toggleDeepDive}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaArrowDown className="mr-2 transform rotate-180" />
              <span>Back to Overview</span>
            </motion.button>
          </div>
        </div>
      )}
    </>
  );
};

export default PromptEngineeringShowcase;