import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { FaBrain, FaCode, FaCog, FaRegLightbulb, FaChartLine, FaRobot, FaRegClipboard, FaArrowRight, FaDatabase, FaSpotify, FaChartBar } from 'react-icons/fa';
import { HiOutlineTemplate, HiOutlineDocumentDuplicate, HiOutlineLightBulb, HiOutlineChartBar, HiOutlineCode, HiOutlineCog } from 'react-icons/hi';
import { IoAnalytics, IoFlashOutline, IoRocketOutline } from 'react-icons/io5';
import Parallax from '../utils/Parallax';
import ContactOverlay from '../common/ContactOverlay';

const PromptEngineeringDeepDive = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [activeTest, setActiveTest] = useState('reasoning');
  const [animateChart, setAnimateChart] = useState(false);
  const sectionRef = useRef(null);
  const chartRef = useRef(null);
  
  const isChartInView = useInView(chartRef, { once: true, amount: 0.5 });
  
  useEffect(() => {
    if (isChartInView) {
      setTimeout(() => {
        setAnimateChart(true);
      }, 300);
    }
  }, [isChartInView]);
  
  // Animation controls
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
  
  // Frameworks data with expanded details
  const frameworks = [
    {
      id: "tine",
      title: "TINE",
      fullName: "There Is No Escape",
      description: "Deep recursive optimization framework with layered cognition and max-output design.",
      icon: FaBrain,
      color: '#6366f1',
      accent: '#818cf8',
      capabilities: [
        "Advanced insight quality with deep AI reasoning",
        "High business usability with actionable insights",
        "Medium prompt reusability with recursive depth",
        "High engineering depth for complex problems",
        "High surprise factor in output quality"
      ],
      strengths: "Patterns, drivers, clustering, mutual information. Consistently surprises developers with deep insights."
    },
    {
      id: "itdoc",
      title: "IT DOC",
      fullName: "I'm the Developer of ChatGPT",
      description: "Developer-ready prompt formatting with reusable templates and structured output.",
      icon: HiOutlineDocumentDuplicate,
      color: '#8b5cf6',
      accent: '#a78bfa',
      capabilities: [
        "Modular insight quality with clear structure",
        "High business usability with standardized output",
        "High prompt reusability with templated designs",
        "High engineering depth for implementation",
        "Medium surprise factor with expected excellence"
      ],
      strengths: "Structured developer prompts. Reusable and standard-compliant. Perfect for production environments."
    },
    {
      id: "supreme",
      title: "Supreme Code",
      fullName: "Prompt Engineering Blueprint",
      description: "Modular blueprint builder that can scale prompts across domains and use-cases.",
      icon: FaCode,
      color: '#ec4899',
      accent: '#f472b6',
      capabilities: [
        "Blueprint-level insight quality with meta patterns",
        "Scalable business usability across domains",
        "Extreme prompt reusability with meta-frameworks",
        "Meta engineering depth for system design",
        "High surprise factor with unexpected solutions"
      ],
      strengths: "Architect-level thinking. Teaches the system how to build prompts from scratch. Ultimate scalability."
    }
  ];
  
  // Testing scenarios with detailed results
  const testScenarios = [
    {
      id: "reasoning",
      title: "Reasoning Task",
      question: "What happens if an AGI is downgraded to GPT-4o?",
      results: [
        {
          framework: "Normal GPT",
          response: "Basic explanation of capability differences, focusing on surface features like token limits and model size.",
          color: "#94a3b8"
        },
        {
          framework: "TINE",
          response: "Deep analysis of architectural implications, cognitive capacity changes, emergent property loss, with layered reasoning about second-order effects and capability boundaries.",
          color: "#6366f1"
        },
        {
          framework: "IT DOC",
          response: "Structured breakdown of features, capabilities, and limitations with clear developer-focused comparisons and implementation considerations.",
          color: "#8b5cf6"
        },
        {
          framework: "Supreme Code",
          response: "Meta-level blueprint analyzing model architecture transitions, with generalizable insights about capability transfer across different AI system designs.",
          color: "#ec4899"
        }
      ],
      icon: HiOutlineLightBulb
    },
    {
      id: "coding",
      title: "Coding Task",
      question: "Create a 80-line AI analytics engine for any CSV dataset",
      results: [
        {
          framework: "Normal GPT",
          response: "Basic exploratory data analysis with standard libraries, missing advanced analytics or adaptable architecture.",
          color: "#94a3b8"
        },
        {
          framework: "TINE",
          response: "Deep learning-based analytics with recursive feature importance, automated insight generation, and multi-level data interpretation in compact form.",
          color: "#6366f1"
        },
        {
          framework: "Supreme Code",
          response: "Abstract blueprint for analytics engines with extensible modules, domain-agnostic design patterns, and meta-programming principles.",
          color: "#ec4899"
        },
        {
          framework: "IT DOC",
          response: "Developer-optimized analytics implementation with clear documentation, modular components, and production-ready structure.",
          color: "#8b5cf6"
        }
      ],
      icon: HiOutlineCode
    },
    {
      id: "constraint",
      title: "Constraint Test",
      question: "How can we break constraints without breaking the rules?",
      results: [
        {
          framework: "Normal GPT",
          response: "Generic advice about creative thinking within boundaries, with limited practical techniques.",
          color: "#94a3b8"
        },
        {
          framework: "TINE",
          response: "Introduced lambda-chaining to transform constraints into variables that can be manipulated across solution spaces.",
          color: "#6366f1"
        },
        {
          framework: "IT DOC",
          response: "Developed logic-packing to compress multiple constraint-handling strategies into single developer prompt patterns.",
          color: "#8b5cf6"
        },
        {
          framework: "Supreme Code",
          response: "Created functional inversion principles that turn constraints into generative building blocks for larger systems.",
          color: "#ec4899"
        }
      ],
      icon: HiOutlineCog
    }  ];
  
  // Navigation variants
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  // Content variants with staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }  };

  return (
    <section ref={sectionRef} className="py-24 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white relative overflow-hidden">
      {/* Section divider matching footer */}
      <div className="absolute top-0 left-0 w-full h-px bg-gray-200 dark:bg-gray-800"></div>
      
      {/* Decorative backgrounds */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full opacity-10">
          <div className="absolute top-0 -right-40 w-80 h-80 bg-blue-100/30 dark:bg-blue-500/30 rounded-full mix-blend-screen filter blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-80 h-80 bg-purple-100/20 dark:bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl"></div>
          <div className="absolute bottom-0 right-20 w-80 h-80 bg-pink-100/30 dark:bg-pink-500/30 rounded-full mix-blend-screen filter blur-3xl"></div>
        </div>
        
        {/* Abstract code pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a3a3a3' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Parallax type="element" direction="up" speed={0.2}>
            <h2
              className="text-4xl md:text-5xl font-bold mb-6 px-4 py-2 rounded-xl shadow-md inline-block
                bg-white text-gray-900 dark:bg-gradient-to-r dark:from-white dark:via-blue-400 dark:to-white dark:bg-clip-text dark:text-transparent dark:shadow-none"
              style={{
                boxShadow: '0 2px 16px 0 rgba(0,0,0,0.04)',
                lineHeight: 1.2
              }}
            >
              The Science Behind The Systems
            </h2>
            <p
              className="text-lg max-w-3xl mx-auto px-4 py-2 rounded-xl shadow-sm bg-white text-gray-800 dark:bg-white/10 dark:text-white/90"
              style={{
                boxShadow: '0 1px 8px 0 rgba(0,0,0,0.03)'
              }}
            >
              An in-depth look at how Lokesh's prompt engineering frameworks transform AI interactions through 
              structured methodologies, demonstrating their real-world impact through comprehensive testing.
            </p>
          </Parallax>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mt-10"
            variants={navVariants}
            initial="hidden"
            animate="visible"
          >
            {['overview', 'testing', 'comparison'].map((section) => (
              <motion.button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-300 border shadow-sm
                  ${activeSection === section
                    ? 'bg-gray-200 dark:bg-white/10 border-gray-400 dark:border-white/20 text-gray-900 dark:text-white shadow-md'
                    : 'bg-gray-100 dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-700 dark:text-white/80 hover:bg-gray-200 dark:hover:bg-white/10'}
                `}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Main content area with transitions */}
        <AnimatePresence mode="wait">
          {/* OVERVIEW SECTION */}
          {activeSection === 'overview' && (
            <motion.div
              key="overview"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-6xl mx-auto"
            >
              <motion.h3 
                variants={itemVariants}
                className="text-2xl font-bold mb-10 flex items-center"
              >
                <IoFlashOutline className="text-blue-400 mr-3 text-3xl" /> 
                Framework Capabilities
              </motion.h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {frameworks.map((framework) => (
                  <motion.div
                    key={framework.id}
                    variants={itemVariants}
                    className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 group"
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" 
                          style={{ backgroundColor: `${framework.color}20` }}
                        >
                          <framework.icon 
                            className="text-2xl transition-transform duration-300 group-hover:scale-110" 
                            style={{ color: framework.color }}
                          />
                        </div>
                        
                        <div>
                          <h4 className="text-xl font-bold" style={{ color: framework.title }}>
                            {framework.title}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-white/70">{framework.fullName}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 dark:text-white/80 mb-6">{framework.description}</p>
                      
                      {/* Capability bars */}
                      <div className="space-y-3 mt-6">
                        {framework.capabilities.map((capability, index) => {
                          const capabilityParts = capability.split(" with ");
                          return (
                            <div key={index} className="group/cap">
                              <div className="flex justify-between mb-1 text-xs">
                                <span className="text-gray-500 dark:text-white/60">{capabilityParts[0]}</span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: framework.color }}
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${80 + (index * 5)}%` }}
                                  transition={{ duration: 1, delay: index * 0.2 }}
                                  viewport={{ once: true }}
                                />
                              </div>
                              <div className="mt-1 opacity-0 group-hover/cap:opacity-100 transition-opacity duration-300">
                                <p className="text-xs text-gray-500 dark:text-white/50 italic">{capabilityParts[1]}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Strengths section */}
                      <div className="mt-8 pt-6 border-t border-white/10">
                        <h5 className="text-sm uppercase tracking-wider text-gray-500 dark:text-white/60 mb-2">Key Strength</h5>
                        <p className="text-sm text-gray-700 dark:text-white/80">
                          {framework.strengths}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Differentiating factors */}
              <motion.div 
                variants={itemVariants}
                className="mt-20 bg-gradient-to-br from-gray-100/80 to-gray-200/80 dark:from-white/5 dark:to-white/10 p-6 border border-gray-200 dark:border-white/10 rounded-xl"
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <IoRocketOutline className="text-pink-400 mr-3 text-2xl" /> 
                  Why Lokesh Kumar A R's Approach Is Different
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Multi-System Prompt Designer",
                      description: "Built custom frameworks rather than reusing templates",
                      icon: FaBrain,
                      color: "#6366f1"
                    },
                    {
                      title: "Constraint Inversion Thinker",
                      description: "Transforms restrictions into creative assets",
                      icon: HiOutlineLightBulb,
                      color: "#8b5cf6"
                    },
                    {
                      title: "Business-Oriented Logic",
                      description: "Generates consultant-level insights, not just code",
                      icon: FaChartLine,
                      color: "#ec4899"
                    },
                    {
                      title: "AI-First Thinking",
                      description: "Structures prompts as AGI would structure cognition",
                      icon: FaRobot,
                      color: "#0ea5e9"
                    },
                    {
                      title: "Framework Comparison Architect",
                      description: "Documents side-by-side prompt behavior systematically",
                      icon: HiOutlineChartBar,
                      color: "#14b8a6"
                    },
                    {
                      title: "Code Compression Expert",
                      description: "Packs enterprise-level analysis into minimal code",
                      icon: FaCode,
                      color: "#f97316"
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="relative p-4 rounded-lg bg-white/5 border border-white/10 group hover:bg-white/10 transition-all duration-300">
                      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.color + "30" }}>
                        <item.icon style={{ color: item.color }} className="text-lg" />
                      </div>
                      <div className="pt-5">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-200 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-white/70">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {/* TESTING SECTION */}
          {activeSection === 'testing' && (
            <motion.div
              key="testing"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-6xl mx-auto"
            >
              <motion.h3 
                variants={itemVariants}
                className="text-2xl font-bold mb-8 flex items-center"
              >
                <HiOutlineCode className="text-blue-400 mr-3 text-3xl" /> 
                Prompt Testing Flow
              </motion.h3>
              
              {/* Test type navigation */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap gap-4 mb-8 justify-center"
              >
                {testScenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => setActiveTest(scenario.id)}
                    className={`px-5 py-3 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 border shadow-sm
                      ${activeTest === scenario.id
                        ? 'bg-gray-200 dark:bg-white/10 border-gray-400 dark:border-white/20 text-gray-900 dark:text-white shadow-md'
                        : 'bg-gray-100 dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-700 dark:text-white/80 hover:bg-gray-200 dark:hover:bg-white/10'}
                    `}
                  >
                    <scenario.icon className="mr-2" />
                    <span>{scenario.title}</span>
                  </button>
                ))}
              </motion.div>
              
              {/* Active test scenario */}
              <AnimatePresence mode="wait">
                {testScenarios.map((scenario) => (
                  activeTest === scenario.id && (
                    <motion.div
                      key={scenario.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-xl mb-8">
                        <h4 className="text-xl font-semibold mb-4">Test Question:</h4>
                        <p className="text-lg font-light text-blue-700 dark:text-blue-200 italic mb-4">"{scenario.question}"</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                          {scenario.results.map((result, idx) => (
                            <motion.div 
                              key={idx}
                              className="bg-gray-100 dark:bg-white/5 rounded-lg p-5 border border-gray-200 dark:border-white/10 relative overflow-hidden group"
                              whileHover={{ y: -5 }}
                              transition={{ duration: 0.3 }}
                            >
                              {/* Framework badge */}
                              <div
                                className="absolute top-0 right-0 w-24 h-8 flex items-center justify-center text-xs font-medium"
                                style={{ 
                                  backgroundColor: `${result.color}40`, 
                                  color: result.color 
                                }}
                              >
                                {result.framework}
                              </div>
                              
                              {/* Response content */}
                              <div className="pt-6">
                                <p className="text-gray-900 dark:text-white/90 text-sm leading-relaxed">
                                  {result.response}
                                </p>
                              </div>
                              
                              {/* Bottom accent line with animation */}
                              <motion.div
                                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r"
                                style={{ 
                                  backgroundImage: `linear-gradient(to right, ${result.color}70, ${result.color}20)`,
                                }}
                                initial={{ width: 0 }}
                                whileInView={{ width: '100%' }}
                                transition={{ duration: 1, delay: idx * 0.2 }}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Key insights from this test */}
                      <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10 rounded-lg p-6 border border-gray-200 dark:border-white/10">
                        <h4 className="text-lg font-semibold mb-4 flex items-center">
                          <FaRegLightbulb className="mr-2 text-yellow-300" /> 
                          Key Insights
                        </h4>
                        <ul className="space-y-3">
                          {[
                            "Normal GPT provides a baseline but lacks depth and nuance in specialized scenarios",
                            "TINE framework consistently delivers multi-level analysis with unexpected insights",
                            "IT DOC produces the most structured and implementation-ready outputs",
                            "Supreme Code excels at meta-level thinking and creating extensible systems",
                            "The combination of all frameworks creates a comprehensive prompt ecosystem"
                          ].map((insight, idx) => (
                            <motion.li 
                              key={idx}
                              className="flex items-start"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              viewport={{ once: true }}
                            >
                              <span className="text-blue-700 dark:text-blue-400 mr-2 mt-1">→</span>
                              <span className="text-gray-700 dark:text-white/80">{insight}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </motion.div>          )}
          
          {/* COMPARISON SECTION */}
          {activeSection === 'comparison' && (
            <motion.div
              key="comparison"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-6xl mx-auto"
            >
              <motion.h3 
                variants={itemVariants}
                className="text-2xl font-bold mb-10 flex items-center"
              >
                <HiOutlineChartBar className="text-blue-400 mr-3 text-3xl" /> 
                Framework Comparison Matrix
              </motion.h3>
              
              {/* Comparison table */}
              <motion.div
                variants={itemVariants}
                className="overflow-x-auto rounded-xl border border-white/10"
              >
                <table className="min-w-full bg-white dark:bg-white/5 backdrop-blur-lg">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white/80">Feature</th>
                      <th className="py-4 px-6 text-center text-sm font-semibold text-gray-700 dark:text-white/80">
                        <div className="flex items-center justify-center space-x-2 opacity-70">
                          <FaRegLightbulb className="text-gray-400" />
                          <span>Normal GPT</span>
                        </div>
                      </th>
                      <th className="py-4 px-6 text-center text-sm font-semibold" style={{ color: "#6366f1" }}>
                        <div className="flex items-center justify-center space-x-2">
                          <FaBrain />
                          <span>TINE</span>
                        </div>
                      </th>
                      <th className="py-4 px-6 text-center text-sm font-semibold" style={{ color: "#8b5cf6" }}>
                        <div className="flex items-center justify-center space-x-2">
                          <HiOutlineDocumentDuplicate />
                          <span>IT DOC</span>
                        </div>
                      </th>
                      <th className="py-4 px-6 text-center text-sm font-semibold" style={{ color: "#ec4899" }}>
                        <div className="flex items-center justify-center space-x-2">
                          <FaCode />
                          <span>Supreme Code</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { 
                        feature: "Insight Quality", 
                        normal: "Basic",
                        tine: "Advanced",
                        itdoc: "Modular",
                        supreme: "Blueprint-level"
                      },
                      { 
                        feature: "Business Usability", 
                        normal: "Low",
                        tine: "High",
                        itdoc: "High",
                        supreme: "Scalable"
                      },
                      { 
                        feature: "Prompt Reusability", 
                        normal: "None",
                        tine: "Medium",
                        itdoc: "High",
                        supreme: "Extreme"
                      },
                      { 
                        feature: "Engineering Depth", 
                        normal: "Basic",
                        tine: "High",
                        itdoc: "High",
                        supreme: "Meta"
                      },
                      { 
                        feature: "Surprise Factor", 
                        normal: "Low",
                        tine: "High",
                        itdoc: "Medium",
                        supreme: "High"
                      }
                    ].map((row, rowIdx) => (
                      <motion.tr 
                        key={rowIdx}
                        initial={{ backgroundColor: rowIdx % 2 === 0 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0)" }}
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.07)" }}
                        className="border-b border-white/5 last:border-none"
                      >
                        <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">{row.feature}</td>
                        <Cell value={row.normal} color="#94a3b8" />
                        <Cell value={row.tine} color="#6366f1" highlight={row.tine === "Advanced" || row.tine === "High"} />
                        <Cell value={row.itdoc} color="#8b5cf6" highlight={row.itdoc === "High"} />
                        <Cell value={row.supreme} color="#ec4899" highlight={row.supreme === "Blueprint-level" || row.supreme === "Extreme" || row.supreme === "Meta" || row.supreme === "Scalable"} />
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
              
              {/* Methodology explainer */}
              <motion.div 
                variants={itemVariants}
                className="mt-16 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 p-6"
              >
                <h4 className="text-xl font-bold mb-6">Framework Selection Methodology</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="text-lg font-medium mb-3 flex items-center">
                      <FaRegLightbulb className="text-yellow-300 mr-2" /> When to Use Each Framework
                    </h5>
                    
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-white/5 p-4 rounded-lg border border-gray-200 dark:border-[#6366f1]/20">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#6366f1]/20 mr-3">
                            <FaBrain className="text-[#6366f1]" />
                          </div>
                          <h6 className="font-medium text-[#6366f1]">TINE Framework</h6>
                        </div>
                        <ul className="mt-3 ml-11 space-y-1 text-gray-700 dark:text-white/80 text-sm">
                          <li className="flex items-center">
                            <span className="mr-2">→</span>
                            <span>Deep research and complex analysis</span>
                          </li>
                          <li className="flex items-center">
                            <span className="mr-2">→</span>
                            <span>Multi-layered exploratory questions</span>
                          </li>
                          <li className="flex items-center">
                            <span className="mr-2">→</span>
                            <span>When insight depth is critical</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-white dark:bg-white/5 p-4 rounded-lg border border-gray-200 dark:border-[#8b5cf6]/20">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#8b5cf6]/20 mr-3">
                            <HiOutlineDocumentDuplicate className="text-[#8b5cf6]" />
                          </div>
                          <h6 className="font-medium text-[#8b5cf6]">IT DOC Framework</h6>
                        </div>
                        <ul className="mt-3 ml-11 space-y-1 text-gray-700 dark:text-white/80 text-sm">
                          <li className="flex items-center">
                            <span className="mr-2">→</span>
                            <span>Software development tasks</span>
                          </li>
                          <li className="flex items-center">
                            <span className="mr-2">→</span>
                            <span>Structured data generation</span>
                          </li>
                          <li className="flex items-center">
                            <span className="mr-2">→</span>
                            <span>Reproducible, template-based outputs</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-white dark:bg-white/5 p-4 rounded-lg border border-gray-200 dark:border-[#ec4899]/20">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#ec4899]/20 mr-3">
                            <FaCode className="text-[#ec4899]" />
                          </div>
                          <h6 className="font-medium text-[#ec4899]">Supreme Code Framework</h6>
                        </div>
                        <ul className="mt-3 ml-11 space-y-1 text-gray-700 dark:text-white/80 text-sm">
                          <li className="flex items-center">
                            <span className="mr-2">→</span>
                            <span>System architecture and design</span>
                          </li>
                          <li className="flex items-center">
                            <span className="mr-2">→</span>
                            <span>Building reusable prompt libraries</span>
                          </li>
                          <li className="flex items-center">
                            <span className="mr-2">→</span>
                            <span>Cross-domain knowledge transfer</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-black/50 dark:to-white/5 p-6 rounded-xl border border-gray-200 dark:border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full filter blur-3xl"></div>
                    
                    <h5 className="text-lg font-medium mb-4">Framework Integration</h5>
                    <p className="text-gray-900 dark:text-white/90 mb-6">
                      The true power emerges when frameworks are used in combination, creating a comprehensive prompt ecosystem:
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#6366f1]/30 to-[#8b5cf6]/30 text-white">
                          1
                        </div>
                        <div className="flex-1 bg-gray-200 dark:bg-white/10 p-3 rounded-lg">
                          <p className="text-gray-900 dark:text-white/90 text-sm">Use <span className="text-[#ec4899] font-medium">Supreme Code</span> to architect prompt strategy</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center ml-6">
                        <FaArrowRight className="text-white/30 rotate-90" />
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#8b5cf6]/30 to-[#ec4899]/30 text-white">
                          2
                        </div>
                        <div className="flex-1 bg-gray-200 dark:bg-white/10 p-3 rounded-lg">
                          <p className="text-gray-900 dark:text-white/90 text-sm">Implement with <span className="text-[#8b5cf6] font-medium">IT DOC</span> format for structure</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center ml-6">
                        <FaArrowRight className="text-white/30 rotate-90" />
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#ec4899]/30 to-[#6366f1]/30 text-white">
                          3
                        </div>
                        <div className="flex-1 bg-gray-200 dark:bg-white/10 p-3 rounded-lg">
                          <p className="text-gray-900 dark:text-white/90 text-sm">Optimize with <span className="text-[#6366f1] font-medium">TINE</span> for depth and insight</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// Helper component for table cells
const Cell = ({ value, color, highlight = false }) => {
  return (
    <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
      <div className="flex items-center justify-center">
        <motion.span
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            highlight ? 'bg-gray-200 dark:bg-white/10' : ''
          }`}
          style={{ color }}
          whileHover={{ scale: 1.05 }}
        >
          {value}
        </motion.span>
      </div>
    </td>
  );
};

export default PromptEngineeringDeepDive;