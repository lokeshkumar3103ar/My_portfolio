import React, { useContext, useRef, useEffect, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { ColorThemeContext } from '../../context/ColorThemeContext';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Parallax from '../utils/Parallax';
import { gsap } from 'gsap';
import { FaLinkedin, FaGithub, FaEnvelope, FaPhone, FaTimes } from 'react-icons/fa';

const HeroSection = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { currentColors } = useContext(ColorThemeContext);
  const sectionRef = useRef(null);
  const codeContainerRef = useRef(null);

  // State for animated content
  const [currentPhase, setCurrentPhase] = useState('code'); // 'code' or 'icons'
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showContactOverlay, setShowContactOverlay] = useState(false);

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

  // Tech icons data with SVG/image URLs for crisp brand icons
  const techIcons = [
    { name: 'Docker', icon: <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/docker.svg" alt="Docker" className="w-8 h-8" />, color: 'text-blue-500', brand: 'Container Platform' },
    { name: 'Python', icon: <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/python.svg" alt="Python" className="w-8 h-8" />, color: 'text-yellow-500', brand: 'Programming Language' },
    { name: 'GitHub Copilot', icon: <svg viewBox="0 0 512 416" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" className="w-8 h-8"><path d="M181.33 266.143c0-11.497 9.32-20.818 20.818-20.818 11.498 0 20.819 9.321 20.819 20.818v38.373c0 11.497-9.321 20.818-20.819 20.818-11.497 0-20.818-9.32-20.818-20.818v-38.373zM308.807 245.325c-11.477 0-20.798 9.321-20.798 20.818v38.373c0 11.497 9.32 20.818 20.798 20.818 11.497 0 20.818-9.32 20.818-20.818v-38.373c0-11.497-9.32-20.818-20.818-20.818z" fillRule="nonzero"/><path d="M512.002 246.393v57.384c-.02 7.411-3.696 14.638-9.67 19.011C431.767 374.444 344.695 416 256 416c-98.138 0-196.379-56.542-246.33-93.21-5.975-4.374-9.65-11.6-9.671-19.012v-57.384a35.347 35.347 0 016.857-20.922l15.583-21.085c8.336-11.312 20.757-14.31 33.98-14.31 4.988-56.953 16.794-97.604 45.024-127.354C155.194 5.77 226.56 0 256 0c29.441 0 100.807 5.77 154.557 62.722 28.19 29.75 40.036 70.401 45.025 127.354 13.263 0 25.602 2.936 33.958 14.31l15.583 21.127c4.476 6.077 6.878 13.345 6.878 20.88zm-97.666-26.075c-.677-13.058-11.292-18.19-22.338-21.824-11.64 7.309-25.848 10.183-39.46 10.183-14.454 0-41.432-3.47-63.872-25.869-5.667-5.625-9.527-14.454-12.155-24.247a212.902 212.902 0 00-20.469-1.088c-6.098 0-13.099.349-20.551 1.088-2.628 9.793-6.509 18.622-12.155 24.247-22.4 22.4-49.418 25.87-63.872 25.87-13.612 0-27.86-2.855-39.501-10.184-11.005 3.613-21.558 8.828-22.277 21.824-1.17 24.555-1.272 49.11-1.375 73.645-.041 12.318-.082 24.658-.288 36.976.062 7.166 4.374 13.818 10.882 16.774 52.97 24.124 103.045 36.278 149.137 36.278 46.01 0 96.085-12.154 149.014-36.278 6.508-2.956 10.84-9.608 10.881-16.774.637-36.832.124-73.809-1.642-110.62h.041zM107.521 168.97c8.643 8.623 24.966 14.392 42.56 14.392 13.448 0 39.03-2.874 60.156-24.329 9.28-8.951 15.05-31.35 14.413-54.079-.657-18.231-5.769-33.28-13.448-39.665-8.315-7.371-27.203-10.574-48.33-8.644-22.399 2.238-41.267 9.588-50.875 19.833-20.798 22.728-16.323 80.317-4.476 92.492zm130.556-56.008c.637 3.51.965 7.35 1.273 11.517 0 2.875 0 5.77-.308 8.952 6.406-.636 11.847-.636 16.959-.636s10.553 0 16.959.636c-.329-3.182-.329-6.077-.329-8.952.329-4.167.657-8.007 1.294-11.517-6.735-.637-12.812-.965-17.924-.965s-11.21.328-17.924.965zm49.275-8.008c-.637 22.728 5.133 45.128 14.413 54.08 21.105 21.454 46.708 24.328 60.155 24.328 17.596 0 33.918-5.769 42.561-14.392 11.847-12.175 16.322-69.764-4.476-92.492-9.608-10.245-28.476-17.595-50.875-19.833-21.127-1.93-40.015 1.273-48.33 8.644-7.679 6.385-12.791 21.434-13.448 39.665z"/></svg>, color: 'text-orange-500', brand: 'Anthropic AI' },
    { name: 'Gemini', icon: <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="w-8 h-8"><path d="M16 8.016A8.522 8.522 0 008.016 16h-.032A8.521 8.521 0 000 8.016v-.032A8.521 8.521 0 007.984 0h.032A8.522 8.522 0 0016 7.984v.032z" fill="url(#prefix__paint0_radial_980_20147)"/><defs><radialGradient id="prefix__paint0_radial_980_20147" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(16.1326 5.4553 -43.70045 129.2322 1.588 6.503)"><stop offset=".067" stopColor="#9168C0"/><stop offset=".343" stopColor="#5684D1"/><stop offset=".672" stopColor="#1BA1E3"/></radialGradient></defs></svg>, color: 'text-blue-600', brand: 'Google AI' },
    { name: 'VS Code', icon: <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/visualstudiocode.svg" alt="VS Code" className="w-8 h-8" />, color: 'text-blue-600', brand: 'Code Editor' },
    { name: 'Cursor', icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48" className="w-8 h-8"><polygon fill="#bcbcbc" points="23.974,4 6.97,14 6.97,34 23.998,44 40.97,34 40.97,14"></polygon><line x1="7.97" x2="23.579" y1="33" y2="24.454" fill="none" stroke="#bcbcbc" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"></line><line x1="23.972" x2="23.966" y1="5.903" y2="15.864" fill="none" stroke="#bcbcbc" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"></line><line x1="39.97" x2="32.97" y1="33" y2="29" fill="none" stroke="#bcbcbc" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"></line><polygon fill="#757575" points="23.974,4 6.97,14 6.97,34 23.97,24"></polygon><polygon fill="#424242" points="23.981,14 40.97,14 40.97,34 23.971,24"></polygon><polygon fill="#616161" fillRule="evenodd" points="40.97,14 23.966,17 23.974,4" clipRule="evenodd"></polygon><polygon fill="#616161" fillRule="evenodd" points="6.97,14 23.981,16.881 23.966,24 6.97,34" clipRule="evenodd"></polygon><polygon fill="#ededed" points="6.97,14 23.97,24 23.998,44 40.97,14"></polygon></svg>, color: 'text-emerald-500', brand: 'AI Editor' },
    { name: 'OpenAI', icon: <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/openai.svg" alt="OpenAI" className="w-8 h-8" />, color: 'text-green-500', brand: 'GPT & ChatGPT' },
    { name: 'Claude', icon: <svg xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 509.64" className="w-8 h-8"><path fill="#D77655" d="M115.612 0h280.775C459.974 0 512 52.026 512 115.612v278.415c0 63.587-52.026 115.612-115.613 115.612H115.612C52.026 509.639 0 457.614 0 394.027V115.612C0 52.026 52.026 0 115.612 0z"/><path fill="#FCF2EE" fillRule="nonzero" d="M142.27 316.619l73.655-41.326 1.238-3.589-1.238-1.996-3.589-.001-12.31-.759-42.084-1.138-36.498-1.516-35.361-1.896-8.897-1.895-8.34-10.995.859-5.484 7.482-5.03 10.717.935 23.683 1.617 35.537 2.452 25.782 1.517 38.193 3.968h6.064l.86-2.451-2.073-1.517-1.618-1.517-36.776-24.922-39.81-26.338-20.852-15.166-11.273-7.683-5.687-7.204-2.451-15.721 10.237-11.273 13.75.935 3.513.936 13.928 10.716 29.749 23.027 38.848 28.612 5.687 4.727 2.275-1.617.278-1.138-2.553-4.271-21.13-38.193-22.546-38.848-10.035-16.101-2.654-9.655c-.935-3.968-1.617-7.304-1.617-11.374l11.652-15.823 6.445-2.073 15.545 2.073 6.547 5.687 9.655 22.092 15.646 34.78 24.265 47.291 7.103 14.028 3.791 12.992 1.416 3.968 2.449-.001v-2.275l1.997-26.641 3.69-32.707 3.589-42.084 1.239-11.854 5.863-14.206 11.652-7.683 9.099 4.348 7.482 10.716-1.036 6.926-4.449 28.915-8.72 45.294-5.687 30.331h3.313l3.792-3.791 15.342-20.372 25.782-32.227 11.374-12.789 13.27-14.129 8.517-6.724 16.1-.001 11.854 17.617-5.307 18.199-16.581 21.029-13.75 17.819-19.716 26.54-12.309 21.231 1.138 1.694 2.932-.278 44.536-9.479 24.062-4.347 28.714-4.928 12.992 6.066 1.416 6.167-5.106 12.613-30.71 7.583-36.018 7.204-53.636 12.689-.657.48.758.935 24.164 2.275 10.337.556h25.301l47.114 3.514 12.309 8.139 7.381 9.959-1.238 7.583-18.957 9.655-25.579-6.066-59.702-14.205-20.474-5.106-2.83-.001v1.694l17.061 16.682 31.266 28.233 39.152 36.397 1.997 8.999-5.03 7.102-5.307-.758-34.401-25.883-13.27-11.651-30.053-25.302-1.996-.001v2.654l6.926 10.136 36.574 54.975 1.895 16.859-2.653 5.485-9.479 3.311-10.414-1.895-21.408-30.054-22.092-33.844-17.819-30.331-2.173 1.238-10.515 113.261-4.929 5.788-11.374 4.348-9.478-7.204-5.03-11.652 5.03-23.027 6.066-30.052 4.928-23.886 4.449-29.674 2.654-9.858-.177-.657-2.173.278-22.37 30.71-34.021 45.977-26.919 28.815-6.445 2.553-11.173-5.789 1.037-10.337 6.243-9.2 37.257-47.392 22.47-29.371 14.508-16.961-.101-2.451h-.859l-98.954 64.251-17.618 2.275-7.583-7.103.936-11.652 3.589-3.791 29.749-20.474-.101.102.024.101z"/></svg>, color: 'text-orange-500', brand: 'Anthropic AI' },
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
      <div className="container mx-auto px-4 sm:px-6 py-8 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full items-center">
          {/* Text content with parallax effect */}
          <motion.div 
            style={{ y, opacity }} 
            className="z-10 lg:pr-8 order-2 lg:order-1 mt-4 lg:mt-0 text-center lg:text-left"
          >
            <Parallax type="element" direction="up" speed={0.2}>
              <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
                <span className="inline-block overflow-hidden mr-2">Hi, I'm</span>
                <span className="inline-block overflow-hidden text-indigo-600 dark:text-indigo-500">Lokesh Kumar A R</span>
              </h1>
              
              <p className="hero-subtitle text-lg sm:text-xl md:text-2xl mb-4 text-gray-700 dark:text-gray-300">
                <span className="highlighted-role font-semibold">AI/ML Engineer</span> |
                <span className="highlighted-role font-semibold"> Creator of QritiQ</span>
              </p>
              
              <div className="hero-cta flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4">
                <button 
                  onClick={() => setShowContactOverlay(true)}
                  className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all hover:shadow-lg hover:-translate-y-1 text-center"
                >
                  Contact Me
                </button>
                <a 
                  href="./Lokesh_Kumar_AR_Resume_2025.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="resume-btn px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium transition-all hover:shadow-lg hover:-translate-y-1 text-center"
                >
                  <span className="btn-content flex items-center justify-center">
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
            className="z-10 w-full flex items-center justify-center order-1 lg:order-2 max-h-[35vh] sm:max-h-[40vh] md:max-h-[45vh] lg:h-[60vh]"
          >
            <div className="w-full h-full relative flex items-center justify-center px-4 sm:px-0">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg h-72 sm:h-80 lg:h-96">
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
                        <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-gray-800 dark:bg-gray-700 border-b border-gray-700">
                          <div className="flex items-center space-x-2">
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                          </div>
                          <div className="text-xs sm:text-sm font-medium text-gray-300 truncate max-w-[120px] sm:max-w-none">
                            {codeSnippets[currentCodeIndex].type}
                          </div>
                          <div className="w-12 sm:w-16"></div>
                        </div>

                        {/* Code Content */}
                        <div 
                          ref={codeContainerRef}
                          className="p-2 sm:p-4 font-mono text-xs sm:text-sm h-56 sm:h-64 overflow-y-auto"
                          style={{
                            scrollBehavior: 'smooth'
                          }}
                        >
                          <pre className="text-green-400 whitespace-pre-wrap break-words">
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
                      {/* Tech Icons Grid - Responsive */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 p-4 sm:p-6 lg:p-8 max-w-sm sm:max-w-none">
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
                            className="flex flex-col items-center justify-center p-2 sm:p-3 lg:p-4 rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/50"
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
                              className="text-2xl sm:text-3xl mb-1 sm:mb-2"
                            >
                              {tech.icon}
                            </motion.div>
                            <span className={`text-xs font-medium ${tech.color} dark:text-gray-300 text-center`}>
                              {tech.name}
                            </span>
                            {tech.brand && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center hidden sm:block">
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

      {/* Contact Overlay */}
      <AnimatePresence>
        {showContactOverlay && (
          <motion.div
            className="absolute inset-0 z-[50] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Background overlay - confined to hero section */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowContactOverlay(false)}
            />
            
            {/* Contact modal - positioned within hero section */}
            <motion.div
              className="relative z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 m-4 w-full max-w-sm sm:max-w-md mx-auto"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Let's Connect!
                </h3>
                <button
                  onClick={() => setShowContactOverlay(false)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Contact options */}
              <div className="space-y-4">
                {/* LinkedIn */}
                <motion.a
                  href="https://www.linkedin.com/in/lokesh-kumar-a-r-465218244/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                    style={{ backgroundColor: '#0077B5' }}
                  >
                    <FaLinkedin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">LinkedIn</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Connect professionally</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.a>

                {/* GitHub */}
                <motion.a
                  href="https://github.com/lokeshkumar3103ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                    style={{ backgroundColor: isDarkMode ? '#fff' : '#333' }}
                  >
                    <FaGithub className={`w-6 h-6 ${isDarkMode ? 'text-black' : 'text-white'}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">GitHub</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">View my projects</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.a>

                {/* Email */}
                <motion.a
                  href="mailto:lokeshkumar3103ar@gmail.com"
                  className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                    style={{ backgroundColor: currentColors.primary }}
                  >
                    <FaEnvelope className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Email</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">lokeshkumar3103ar@gmail.com</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.a>

                {/* Phone */}
                <motion.a
                  href="tel:9489112725"
                  className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                    style={{ backgroundColor: currentColors.secondary }}
                  >
                    <FaPhone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Phone</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">+91 94891 12725</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.a>
              </div>

              {/* Footer message */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  I'd love to hear about your project ideas!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;