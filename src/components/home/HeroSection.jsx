import React, { useContext, useRef, useEffect } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import Parallax from '../utils/Parallax';
import HeroModel from '../models/HeroModel';
import { gsap } from 'gsap';

const HeroSection = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const sectionRef = useRef(null);

  // For parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // GSAP animations for entrance
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    const heroTitleSpans = document.querySelectorAll(".hero-title span");
    const heroSubtitle = document.querySelector(".hero-subtitle");
    const heroCta = document.querySelector(".hero-cta");
    const floatingParticles = document.querySelectorAll(".floating-particle");

    if (heroTitleSpans.length && heroSubtitle && heroCta && floatingParticles.length) {
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

      tl.fromTo(
        floatingParticles,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 0.8, duration: 1, stagger: 0.2, ease: "elastic.out(1, 0.4)" },
        "-=0.8"
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section id="hero-section" ref={sectionRef} className="relative min-h-screen w-full overflow-hidden bg-grid-pattern flex flex-col" style={{ position: "relative" }}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className={`floating-particle absolute rounded-full opacity-30 dark:opacity-50 blend-screen`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              background: i % 2 === 0 ? 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' : 'radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)',
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              filter: 'blur(50px)',
            }}
          />
        ))}
      </div>
      
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
                  href="./resume.pdf" 
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
          
          {/* 3D Model */}
          <motion.div 
            style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "50%"]), opacity }} 
            className="z-10 w-full flex items-center justify-center order-1 lg:order-2 max-h-[40vh] sm:max-h-[45vh] md:max-h-[50vh] lg:h-[60vh]"
          >
            <div className="w-full h-full relative">
              <HeroModel scrollYProgress={scrollYProgress} />
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