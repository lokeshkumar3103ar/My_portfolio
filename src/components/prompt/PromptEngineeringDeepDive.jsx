import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { FaBrain, FaCode, FaCog, FaRegLightbulb, FaChartLine, FaRobot, FaRegClipboard, FaArrowRight, FaDatabase, FaSpotify, FaChartBar } from 'react-icons/fa';
import { HiOutlineTemplate, HiOutlineDocumentDuplicate, HiOutlineLightBulb, HiOutlineChartBar, HiOutlineCode, HiOutlineCog } from 'react-icons/hi';
import { IoAnalytics, IoFlashOutline, IoRocketOutline } from 'react-icons/io5';
import Parallax from '../utils/Parallax';

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
    }
  ];
  
  // Business use case data
  const businessCaseData = {
    dataset: "Spotify 2024 Global Streaming",
    impact: [
      "Identified targeted user clusters for optimized marketing allocation",
      "Applied log-scale transformations for more intuitive analytics visualization",
      "Ranked feature importance showing Artist > Genre > Country as key drivers",
      "Detected outlier influencers that disproportionately affect streaming metrics"
    ],
    codeEfficiency: "Packed JPMorgan-level analytics into 80 lines of code with 4x the insight density",
    visualData: [
      { category: "User Engagement", value: 87, color: "#6366f1" },
      { category: "Feature Impact", value: 92, color: "#8b5cf6" },
      { category: "Anomaly Detection", value: 78, color: "#ec4899" },
      { category: "Predictive Power", value: 83, color: "#0ea5e9" }
    ]
  };
  
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
    }
  };

  // Chart animation values
  const chartValues = businessCaseData.visualData.map(item => ({
    ...item,
    animatedValue: animateChart ? item.value : 0
  }));

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-br from-gray-900 to-gray-950 text-white relative overflow-hidden">
      {/* Decorative backgrounds */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full opacity-10">
          <div className="absolute top-0 -right-40 w-80 h-80 bg-blue-500/30 rounded-full mix-blend-screen filter blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl"></div>
          <div className="absolute bottom-0 right-20 w-80 h-80 bg-pink-500/30 rounded-full mix-blend-screen filter blur-3xl"></div>
        </div>
        
        {/* Abstract code pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              The Science Behind The Systems
            </h2>
            <p className="text-lg text-blue-100/80 max-w-3xl mx-auto">
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
            {['overview', 'testing', 'business', 'comparison'].map((section) => (
              <motion.button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeSection === section
                    ? 'bg-white/10 shadow-lg shadow-white/5 border border-white/20'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
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
                    className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 group"
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
                          <h4 className="text-xl font-bold" style={{ color: framework.color }}>
                            {framework.title}
                          </h4>
                          <p className="text-sm text-blue-100/60">{framework.fullName}</p>
                        </div>
                      </div>
                      
                      <p className="text-white/80 mb-6">{framework.description}</p>
                      
                      {/* Capability bars */}
                      <div className="space-y-3 mt-6">
                        {framework.capabilities.map((capability, index) => {
                          const capabilityParts = capability.split(" with ");
                          return (
                            <div key={index} className="group/cap">
                              <div className="flex justify-between mb-1 text-xs">
                                <span className="text-white/60">{capabilityParts[0]}</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
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
                                <p className="text-xs text-white/50 italic">{capabilityParts[1]}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Strengths section */}
                      <div className="mt-8 pt-6 border-t border-white/10">
                        <h5 className="text-sm uppercase tracking-wider text-white/60 mb-2">Key Strength</h5>
                        <p className="text-sm text-white/80">
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
                className="mt-20 bg-gradient-to-br from-white/5 to-white/10 p-6 border border-white/10 rounded-xl"
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
                        <h4 className="text-lg font-semibold mb-2 text-white group-hover:text-blue-200 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-sm text-white/70">{item.description}</p>
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
                className="flex flex-wrap space-x-4 mb-8"
              >
                {testScenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => setActiveTest(scenario.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                      activeTest === scenario.id
                        ? 'bg-white/10 shadow-lg shadow-white/5 border border-white/20'
                        : 'bg-transparent hover:bg-white/5'
                    }`}
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
                      <div className="bg-white/5 border border-white/10 p-6 rounded-xl mb-8">
                        <h4 className="text-xl font-semibold mb-4">Test Question:</h4>
                        <p className="text-lg font-light text-blue-200 italic mb-4">"{scenario.question}"</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                          {scenario.results.map((result, idx) => (
                            <motion.div 
                              key={idx}
                              className="bg-white/5 rounded-lg p-5 border border-white/10 relative overflow-hidden group"
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
                                <p className="text-white/90 text-sm leading-relaxed">
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
                      <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-lg p-6 border border-white/10">
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
                              <span className="text-blue-400 mr-2 mt-1">→</span>
                              <span className="text-white/80">{insight}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </motion.div>
          )}
          
          {/* BUSINESS CASE SECTION */}
          {activeSection === 'business' && (
            <motion.div
              key="business"
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
                <IoAnalytics className="text-blue-400 mr-3 text-3xl" /> 
                Business Impact Case Study
              </motion.h3>
              
              {/* Business case showcase */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Dataset info */}
                <motion.div 
                  variants={itemVariants}
                  className="md:col-span-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-green-500/30 to-blue-500/30 mr-4">
                        <FaSpotify className="text-green-400 text-2xl" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">Case Study</h4>
                        <p className="text-sm text-blue-100/60">{businessCaseData.dataset}</p>
                      </div>
                    </div>
                    
                    <p className="text-white/80 mb-6">
                      Comprehensive analysis of global streaming patterns using Lokesh's prompt frameworks to extract business intelligence.
                    </p>
                    
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30">
                        <span className="text-blue-400 font-semibold">80</span>
                      </div>
                      <div className="text-white/70 text-sm">
                        Lines of code to produce enterprise-grade insights
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-8">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/20 mr-3">
                        <FaChartBar className="text-blue-300" />
                      </div>
                      <div className="text-white/70 text-sm">
                        {businessCaseData.codeEfficiency}
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Business impact */}
                <motion.div 
                  variants={itemVariants}
                  className="md:col-span-8 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-xl"
                >
                  <div className="p-6">
                    <h4 className="text-xl font-bold mb-6 flex items-center">
                      <FaChartLine className="mr-3 text-blue-400" /> 
                      Business Insights & Impact
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        {businessCaseData.impact.map((impact, idx) => (
                          <motion.div 
                            key={idx}
                            className="mb-4 flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.2 }}
                            viewport={{ once: true }}
                          >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 shrink-0 mr-3 mt-1">
                              <span className="text-xs font-medium text-blue-300">{idx + 1}</span>
                            </div>
                            <div>
                              <p className="text-white/90">{impact}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Visualization metrics */}
                      <div ref={chartRef} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <h5 className="text-sm font-medium text-white/60 mb-4">Performance Metrics</h5>
                        {chartValues.map((item, idx) => (
                          <div key={idx} className="mb-5 last:mb-0">
                            <div className="flex justify-between mb-1">
                              <span className="text-xs text-white/70">{item.category}</span>
                              <span 
                                className="text-xs font-medium" 
                                style={{ color: item.color }}
                              >
                                {Math.round(item.animatedValue)}%
                              </span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: item.color }}
                                initial={{ width: '0%' }}
                                animate={{ width: `${item.animatedValue}%` }}
                                transition={{ duration: 1, delay: idx * 0.2 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Value proposition */}
                <motion.div
                  variants={itemVariants}
                  className="md:col-span-12 bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <h4 className="text-xl font-bold mb-6">Value to Clients</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      {
                        title: "Analytical Systems",
                        description: "Prompts become complete analytical systems, not mere questions",
                        color: "#6366f1",
                        icon: FaBrain
                      },
                      {
                        title: "Creative Acceleration",
                        description: "Constraints transform into creative accelerators",
                        color: "#8b5cf6",
                        icon: FaRegLightbulb
                      },
                      {
                        title: "Insight-First Code",
                        description: "Coding becomes insight-first, not line-first",
                        color: "#ec4899",
                        icon: FaCode
                      },
                      {
                        title: "Business Intelligence",
                        description: "Prompts evolve into business intelligence engines",
                        color: "#0ea5e9",
                        icon: FaDatabase
                      }
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors group"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.3 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                          style={{ backgroundColor: `${item.color}20` }}
                        >
                          <item.icon 
                            className="text-xl transition-transform duration-300 group-hover:scale-110" 
                            style={{ color: item.color }}
                          />
                        </div>
                        <h5 className="text-lg font-medium mb-2 group-hover:text-blue-300 transition-colors">{item.title}</h5>
                        <p className="text-sm text-white/70">{item.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
          
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
                <table className="min-w-full bg-white/5 backdrop-blur-lg">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-4 px-6 text-left text-sm font-semibold text-white/80">Feature</th>
                      <th className="py-4 px-6 text-center text-sm font-semibold text-white/80">
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
                        <td className="py-4 px-6 text-sm font-medium text-white">{row.feature}</td>
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
                className="mt-16 bg-white/5 rounded-xl border border-white/10 p-6"
              >
                <h4 className="text-xl font-bold mb-6">Framework Selection Methodology</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="text-lg font-medium mb-3 flex items-center">
                      <FaRegLightbulb className="text-yellow-300 mr-2" /> When to Use Each Framework
                    </h5>
                    
                    <div className="space-y-4">
                      <div className="bg-white/5 p-4 rounded-lg border border-[#6366f1]/20">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#6366f1]/20 mr-3">
                            <FaBrain className="text-[#6366f1]" />
                          </div>
                          <h6 className="font-medium text-[#6366f1]">TINE Framework</h6>
                        </div>
                        <ul className="mt-3 ml-11 space-y-1 text-white/80 text-sm">
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
                      
                      <div className="bg-white/5 p-4 rounded-lg border border-[#8b5cf6]/20">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#8b5cf6]/20 mr-3">
                            <HiOutlineDocumentDuplicate className="text-[#8b5cf6]" />
                          </div>
                          <h6 className="font-medium text-[#8b5cf6]">IT DOC Framework</h6>
                        </div>
                        <ul className="mt-3 ml-11 space-y-1 text-white/80 text-sm">
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
                      
                      <div className="bg-white/5 p-4 rounded-lg border border-[#ec4899]/20">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#ec4899]/20 mr-3">
                            <FaCode className="text-[#ec4899]" />
                          </div>
                          <h6 className="font-medium text-[#ec4899]">Supreme Code Framework</h6>
                        </div>
                        <ul className="mt-3 ml-11 space-y-1 text-white/80 text-sm">
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
                  
                  <div className="bg-gradient-to-br from-black/50 to-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full filter blur-3xl"></div>
                    
                    <h5 className="text-lg font-medium mb-4">Framework Integration</h5>
                    <p className="text-white/80 mb-6">
                      The true power emerges when frameworks are used in combination, creating a comprehensive prompt ecosystem:
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#6366f1]/30 to-[#8b5cf6]/30 text-white">
                          1
                        </div>
                        <div className="flex-1 bg-white/10 p-3 rounded-lg">
                          <p className="text-white/90 text-sm">Use <span className="text-[#ec4899] font-medium">Supreme Code</span> to architect prompt strategy</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center ml-6">
                        <FaArrowRight className="text-white/30 rotate-90" />
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#8b5cf6]/30 to-[#ec4899]/30 text-white">
                          2
                        </div>
                        <div className="flex-1 bg-white/10 p-3 rounded-lg">
                          <p className="text-white/90 text-sm">Implement with <span className="text-[#8b5cf6] font-medium">IT DOC</span> format for structure</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center ml-6">
                        <FaArrowRight className="text-white/30 rotate-90" />
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#ec4899]/30 to-[#6366f1]/30 text-white">
                          3
                        </div>
                        <div className="flex-1 bg-white/10 p-3 rounded-lg">
                          <p className="text-white/90 text-sm">Optimize with <span className="text-[#6366f1] font-medium">TINE</span> for depth and insight</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Call to Action */}
              <motion.div
                variants={itemVariants}
                className="mt-12 text-center"
              >
                <motion.a
                  href="#contact"
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="text-lg font-medium">Connect For Custom Solutions</span>
                  <FaArrowRight className="ml-2" />
                </motion.a>
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
    <td className="py-4 px-6 text-center">
      <div className="flex items-center justify-center">
        <motion.span
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            highlight ? 'bg-white/10' : ''
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