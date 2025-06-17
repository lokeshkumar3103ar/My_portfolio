import React, { useContext, useRef, useEffect, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Parallax from '../utils/Parallax';
import { gsap } from 'gsap';

const HeroSection = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const sectionRef = useRef(null);
  const codeContainerRef = useRef(null);

  // State for animated content
  const [currentPhase, setCurrentPhase] = useState('code'); // 'code' or 'icons'
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Code snippets for different prompt types
  const codeSnippets = [
    {
      type: "TINE Framework",
      code: `// TINE: There Is No Escape
// Phase 1: Understanding Core Objective
const prompt = \`
Analyze the user's true intent behind: "Explain AI"

Phase 2: Initial Structuring
- Define AI fundamentals
- Structure response with clear headings
- Include practical examples

Phase 3: Recursive Improvement
- Add deeper technical context
- Expand with real-world applications
- Include limitations and considerations

Phase 4: External Perspective Check
- Add expert viewpoints
- Include contrasting opinions
- Validate technical accuracy

Phase 5: Finalization
- Polish for clarity and flow
- Ensure comprehensive coverage
- Optimize for target audience
\`;`
    },
    {
      type: "SUPREME Code Blueprint",
      code: `// SUPREME: Prompt Engineering Blueprint
// Objective: What does the user want?
const objective = "Generate startup pitch deck outline";

// Context: Who is the user/model?
const context = "Early-stage founder, technical background";

// Constraints: Length, tone, format
const constraints = "< 10 slides, investor-focused, compelling";

// Steps: Break down expected behavior
const steps = [
  "1. Problem identification",
  "2. Solution overview", 
  "3. Market size & opportunity",
  "4. Business model",
  "5. Financial projections"
];

// Output Format: Table, list, paragraph
const format = "Structured slide-by-slide breakdown";
\`;`
    },
    {
      type: "IT DOC Structure",
      code: `// IT DOC: I'm the Developer of ChatGPT
// Role Assignment
const systemPrompt = \`
You are a senior software architect.
Your task is to design a scalable API.

Step-by-step logic:
1. Analyze requirements thoroughly
2. Design database schema
3. Plan API endpoints
4. Consider security measures
5. Document implementation

Output format: Technical specification in Markdown
- Use headers for sections
- Include code examples
- Add security considerations
\`;`
    },
    {
      type: "Chain of Thought",
      code: `// Chain of Thought Reasoning
const prompt = \`
Think step by step to solve this problem:

Problem: How to reduce customer churn?

Step 1: Identify churn indicators
- Usage patterns
- Support ticket frequency  
- Engagement metrics

Step 2: Analyze root causes
- Product issues
- Pricing concerns
- Competition

Step 3: Design intervention strategies
- Proactive outreach
- Feature improvements
- Pricing adjustments

Step 4: Implement and measure
- A/B test interventions
- Track success metrics
- Iterate based on results
\`;`
    }
  ];

  // Tech icons data with real brand logos (using better emojis and symbols)
  const techIcons = [
    { name: 'Docker', icon: '🐳', color: 'text-blue-500', brand: 'Container Platform' },
    { name: 'Python', icon: '🐍', color: 'text-yellow-500', brand: 'Programming Language' },
    { name: 'GitHub Copilot', icon: '🤖', color: 'text-purple-500', brand: 'AI Code Assistant' },
    { name: 'VS Code', icon: '💻', color: 'text-blue-600', brand: 'Code Editor' },
    { name: 'Cursor', icon: '✨', color: 'text-emerald-500', brand: 'AI Editor' },
    { name: 'OpenAI', icon: '🧠', color: 'text-green-500', brand: 'GPT & ChatGPT' },
    { name: 'Claude', icon: '🎯', color: 'text-orange-500', brand: 'Anthropic AI' },
    { name: 'Gemini', icon: '💎', color: 'text-blue-600', brand: 'Google AI' }
  ];

  // For parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Typing animation effect with auto-scroll
  useEffect(() => {
    if (currentPhase !== 'code') return;

    const currentSnippet = codeSnippets[currentCodeIndex];
    const fullText = currentSnippet.code;
    let currentIndex = 0;

    setDisplayedText('');
    setIsTyping(true);

    // Reset scroll position for new snippet
    if (codeContainerRef.current) {
      codeContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        const newText = fullText.slice(0, currentIndex);
        setDisplayedText(newText);
          // Optimized auto-scroll - less frequent updates
        if (currentIndex % 5 === 0 && codeContainerRef.current) {
          const container = codeContainerRef.current;
          const preElement = container.querySelector('pre');
          
          if (preElement) {
            // Simplified scroll calculation
            const containerHeight = container.clientHeight;
            const contentHeight = preElement.scrollHeight;
            
            // Check if content exceeds visible area
            if (contentHeight > containerHeight) {
              const targetScrollTop = Math.max(0, contentHeight - containerHeight + 30);
              
              // Only scroll if needed
              if (Math.abs(container.scrollTop - targetScrollTop) > 20) {
                container.scrollTo({
                  top: targetScrollTop,
                  behavior: 'smooth'
                });
              }
            }
          }
        }
        
        currentIndex += 2; // Moderate typing speed for better performance
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        
        // Wait 2 seconds then switch to icons
        setTimeout(() => {
          setCurrentPhase('icons');
        }, 2000);
      }
    }, 10); // More reasonable typing speed

    return () => clearInterval(typingInterval);
  }, [currentCodeIndex, currentPhase]);

  // Phase switching logic
  useEffect(() => {
    if (currentPhase === 'icons') {
      // Show icons for 3 seconds then switch back to code
      const iconTimer = setTimeout(() => {
        setCurrentCodeIndex((prev) => (prev + 1) % codeSnippets.length);
        setCurrentPhase('code');
      }, 3000);

      return () => clearTimeout(iconTimer);
    }
  }, [currentPhase]);

  // GSAP animations for entrance
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    const heroTitleSpans = document.querySelectorAll(".hero-title span");
    const heroSubtitle = document.querySelector(".hero-subtitle");
    const heroCta = document.querySelector(".hero-cta");

    if (heroTitleSpans.length && heroSubtitle && heroCta) {
      tl.fromTo(
        heroTitleSpans,
        { y: 120, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.1 }
      );

      tl.fromTo(
        heroSubtitle,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.6"
      );

      tl.fromTo(
        heroCta,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.4"
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section id="hero-section" ref={sectionRef} className="relative min-h-screen w-full overflow-hidden bg-grid-pattern flex flex-col" style={{ position: "relative" }}>
      
      {/* Hero content */}
      <div className="container mx-auto px-4 py-8 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-center">
          {/* Text content with parallax effect */}
          <motion.div 
            style={{ y, opacity }} 
            className="z-10 lg:pr-8 order-2 lg:order-1 mt-4 lg:mt-0"
          >
            <Parallax type="element" direction="up" speed={0.2}>
              <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
                <span className="inline-block overflow-hidden mr-2">Hi, I'm</span>
                <span className="inline-block overflow-hidden text-indigo-600 dark:text-indigo-500">Lokesh Kumar A R</span>
              </h1>
              
              <p className="hero-subtitle text-xl md:text-2xl mb-6 text-gray-700 dark:text-gray-300">
                AI Prompt Engineer | Data Science Enthusiast
              </p>
              
              <div className="hero-cta flex flex-wrap gap-4">
                <a 
                  href="#contact" 
                  className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  Contact Me
                </a>
                <a 
                  href="./Lokesh_Kumar_A_R_Prompt_Engineer_CV.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="resume-btn px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <span className="btn-content flex items-center">
                    <span>Download CV</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </span>
                </a>
              </div>
            </Parallax>
          </motion.div>

          {/* Animated Code Snippets & Tech Icons */}
          <motion.div 
            style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "50%"]), opacity }} 
            className="z-10 w-full flex items-center justify-center order-1 lg:order-2 max-h-[40vh] sm:max-h-[45vh] md:max-h-[50vh] lg:h-[60vh]"
          >
            <div className="w-full h-full relative flex items-center justify-center">
              <div className="relative w-full max-w-lg h-80 lg:h-96">
                <AnimatePresence mode="wait">
                  {currentPhase === 'code' ? (
                    <motion.div
                      key="code"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full"
                    >
                      {/* Code Editor Container */}
                      <div className="w-full h-full bg-gray-900 dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
                        {/* Editor Header */}
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-700 border-b border-gray-700">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          </div>
                          <div className="text-sm font-medium text-gray-300">
                            {codeSnippets[currentCodeIndex].type}
                          </div>
                          <div className="w-16"></div>
                        </div>

                        {/* Code Content */}
                        <div 
                          ref={codeContainerRef}
                          className="p-4 font-mono text-sm h-64 overflow-y-auto"
                          style={{
                            scrollBehavior: 'smooth'
                          }}
                        >
                          <pre className="text-green-400 whitespace-pre-wrap">
                            {displayedText}
                            {isTyping && (
                              <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="text-white"
                              >
                                |
                              </motion.span>
                            )}
                          </pre>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="icons"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      {/* Tech Icons Grid */}
                      <div className="grid grid-cols-4 gap-6 p-8">
                        {techIcons.map((tech, index) => (
                          <motion.div
                            key={tech.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                              duration: 0.5, 
                              delay: index * 0.1,
                              repeat: Infinity,
                              repeatType: "reverse",
                              repeatDelay: 2
                            }}
                            className="flex flex-col items-center justify-center p-4 rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/50"
                          >
                            <motion.div
                              animate={{ 
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1]
                              }}
                              transition={{ 
                                duration: 2, 
                                delay: index * 0.2,
                                repeat: Infinity 
                              }}
                              className="text-3xl mb-2"
                            >
                              {tech.icon}
                            </motion.div>
                            <span className={`text-xs font-medium ${tech.color} dark:text-gray-300`}>
                              {tech.name}
                            </span>
                            {tech.brand && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                                {tech.brand}
                              </span>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }} 
        className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-gray-600 dark:text-gray-400"
      >
        <p className="text-sm mb-2">Scroll Down</p>
        <div className="w-6 h-10 border-2 border-gray-600 dark:border-gray-400 rounded-full flex justify-center">
          <motion.div 
            className="w-1.5 h-1.5 bg-gray-600 dark:bg-gray-400 rounded-full mt-2"
            animate={{ 
              y: [0, 12, 0],
              opacity: [1, 0.5, 1] 
            }}
            transition={{ 
              duration: 1.5, 
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;