import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const skills = [
  { name: 'Prompt Engineering', level: 95, category: 'AI', color: '#6366f1' },
  { name: 'Python', level: 90, category: 'Programming', color: '#8b5cf6' },
  { name: 'AI Model Interaction', level: 85, category: 'AI', color: '#6366f1' },
  { name: 'Data Analytics', level: 88, category: 'Data Science', color: '#8b5cf6' },
  { name: 'Experimentation & Testing', level: 82, category: 'AI', color: '#6366f1' },
  { name: 'Data Literacy', level: 80, category: 'Data Science', color: '#8b5cf6' },
  { name: 'Data Processing', level: 85, category: 'Data Science', color: '#6366f1' },
  { name: 'Research Skills', level: 78, category: 'General', color: '#8b5cf6' },
  { name: 'Problem Solving', level: 90, category: 'General', color: '#6366f1' },
  { name: 'Excel', level: 75, category: 'Tools', color: '#8b5cf6' },
];

// Create sparkle particles for the burst effect
const BurstParticles = ({ x, y, color }) => {
  const particles = Array(20).fill(0).map((_, i) => ({
    id: i,
    angle: (i * 18) % 360,
    distance: Math.random() * 100 + 30,
    size: Math.random() * 8 + 2,
    duration: Math.random() * 1.2 + 0.8,
  }));

  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y, zIndex: 30 }}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
            boxShadow: `0 0 ${particle.size * 3}px ${color}`,
          }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
          animate={{
            opacity: 0,
            x: Math.cos((particle.angle * Math.PI) / 180) * particle.distance,
            y: Math.sin((particle.angle * Math.PI) / 180) * particle.distance,
            scale: 1.5,
          }}
          transition={{ 
            duration: particle.duration,
            ease: [0.1, 0.5, 0.8, 1] 
          }}
        />
      ))}
      
      {/* Central flash */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 50,
          height: 50,
          backgroundColor: 'white',
          boxShadow: `0 0 40px ${color}`,
          top: -25,
          left: -25,
        }}
        initial={{ opacity: 1, scale: 0 }}
        animate={{ opacity: 0, scale: 3 }}
        transition={{ duration: 0.8 }}
      />
    </div>
  );
};

// Interactive bubble field
const BubbleField = () => {
  const [bubbles, setBubbles] = useState([]);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [cursorPosition, setCursorPosition] = useState({ x: 9999, y: 9999 });
  const [isInitialized, setIsInitialized] = useState(false);
  const firstRenderRef = useRef(true);
  
  // Physics constants
  const friction = 0.998;
  const cursorInfluence = 0.3;
  const slowMotionFactor = 0.9;
  const wallRepulsionRange = 90;
  const wallRepulsionStrength = 0.35;
  const velocityDecay = 0.03;
  const bubbleRepulsionRange = 10;
  const bubbleRepulsionStrength = 0.5;
  
  // Add subtle connecting lines between bubbles
  const ConnectingLines = ({ bubblePositions, poppedIndices }) => {
    if (bubblePositions.length === 0) return null;
    
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {bubblePositions.map((bubble, i) => (
          bubblePositions.slice(i + 1).map((target, j) => {
            const realJ = j + i + 1;
            const isPopped = poppedIndices.includes(i) || poppedIndices.includes(realJ);
            
            // Calculate distance to make closer bubbles have stronger connections
            const dx = bubble.x - target.x;
            const dy = bubble.y - target.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 180;
            
            if (distance > maxDistance) return null;
            
            const opacity = (1 - distance/maxDistance) * 0.3;
            
            return (
              <motion.line 
                key={`${i}-${realJ}`}
                x1={bubble.x} 
                y1={bubble.y} 
                x2={target.x} 
                y2={target.y}
                stroke={`${isPopped ? '#ccc' : 'url(#gradient' + i + realJ + ')'}`}
                strokeWidth="1.5"
                strokeOpacity={isPopped ? opacity * 0.3 : opacity}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            );
          })
        ))}
        
        {/* Define gradients for each connection */}
        <defs>
          {bubblePositions.map((bubble, i) => (
            bubblePositions.slice(i + 1).map((target, j) => {
              const realJ = j + i + 1;
              return (
                <linearGradient id={`gradient${i}${realJ}`} key={`grad-${i}-${realJ}`} 
                  x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={skills[i].color} />
                  <stop offset="100%" stopColor={skills[realJ].color} />
                </linearGradient>
              );
            })
          ))}
        </defs>
      </svg>
    );
  };
  
  // Calculate bubble size based on skill level
  const getBubbleSize = (level) => {
    return 75 + ((level / 100) * 75);
  };

  // Track container size for responsive positioning
  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
        
        if (!isInitialized) {
          // Initial scatter of bubbles
          initializeBubblePositions(rect.width, rect.height);
          setIsInitialized(true);
        } else {
          // If already initialized, just update positions proportionally
          updateBubblePositions(rect.width, rect.height);
        }
      }
    };
    
    // Update on mount and window resize
    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    return () => window.removeEventListener('resize', updateContainerSize);
  }, [isInitialized]);
  
  // Initial random position generation with collision avoidance
  const initializeBubblePositions = (width, height) => {
    const positions = [];
    
    for (let i = 0; i < skills.length; i++) {
      let attempts = 0;
      let validPosition = false;
      let position;
      
      while (!validPosition && attempts < 50) {
        const bubbleSize = getBubbleSize(skills[i].level);
        const radius = bubbleSize / 2;
        
        const x = radius + 20 + Math.random() * (width - radius * 2 - 40);
        const y = radius + 20 + Math.random() * (height - radius * 2 - 40);
        
        let hasCollision = false;
        for (let j = 0; j < positions.length; j++) {
          const dx = x - positions[j].x;
          const dy = y - positions[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = (radius + positions[j].radius) * 0.9;
          
          if (distance < minDistance) {
            hasCollision = true;
            break;
          }
        }
        
        if (!hasCollision || attempts > 40) {
          validPosition = true;
          position = {
            x,
            y,
            initialX: x,
            initialY: y,
            rotation: Math.random() * 20 - 10,
            velocity: { 
              x: (Math.random() * 2 - 1) * 1,
              y: (Math.random() * 2 - 1) * 1
            },
            mass: 1 + (skills[i].level / 100),
            level: skills[i].level,
            radius: radius,
            bounciness: 0.7 + Math.random() * 0.2,
          };
        }
        
        attempts++;
      }
      
      if (position) {
        positions.push(position);
      }
    }
    
    setBubbles(positions);
    
    if (firstRenderRef.current) {
      setTimeout(() => {
        setBubbles(prev => prev.map(bubble => ({
          ...bubble,
          velocity: {
            x: (Math.random() * 2 - 1) * 3,
            y: (Math.random() * 2 - 1) * 3
          }
        })));
        firstRenderRef.current = false;
      }, 700);
    }
  };
  
  // Resize handler
  const updateBubblePositions = (width, height) => {
    setBubbles(prev => prev.map(bubble => {
      const ratioX = width / containerSize.width;
      const ratioY = height / containerSize.height;
      
      return {
        ...bubble,
        x: bubble.x * ratioX,
        y: bubble.y * ratioY,
        initialX: bubble.initialX * ratioX,
        initialY: bubble.initialY * ratioY,
      };
    }));
  };
  
  // Track cursor position for bubble movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;
      
      // Only update if position changed significantly to prevent infinite renders
      if (Math.abs(cursorPosition.x - newX) > 2 || Math.abs(cursorPosition.y - newY) > 2) {
        setCursorPosition({ x: newX, y: newY });
      }
    };
    
    const handleMouseLeave = () => {
      setCursorPosition({ x: 9999, y: 9999 });
    };

    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener("mousemove", handleMouseMove);
      currentContainer.addEventListener("mouseleave", handleMouseLeave);
    }
    
    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener("mousemove", handleMouseMove);
        currentContainer.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [containerRef, cursorPosition]); // Add proper dependencies
  
  const [poppedBubbles, setPoppedBubbles] = useState([]);
  const [burstEffects, setBurstEffects] = useState([]);
  
  // Handle bubble bursting
  const burstBubble = (index, event) => {
    setBurstEffects(prev => [...prev, {
      id: Date.now(),
      x: bubbles[index].x,
      y: bubbles[index].y,
      color: skills[index].color,
    }]);
    
    setPoppedBubbles(prev => [...prev, index]);
    
    setBubbles(prev => prev.map((bubble, i) => {
      if (i !== index && !poppedBubbles.includes(i)) {
        const dx = bubble.x - bubbles[index].x;
        const dy = bubble.y - bubbles[index].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          const pushForce = 8 * (1 - distance / 200);
          const angle = Math.atan2(dy, dx);
          return {
            ...bubble,
            velocity: {
              x: bubble.velocity.x + Math.cos(angle) * pushForce,
              y: bubble.velocity.y + Math.sin(angle) * pushForce
            }
          };
        }
      }
      return bubble;
    }));
    
    setTimeout(() => {
      setPoppedBubbles(prev => prev.filter(i => i !== index));
      
      setBubbles(prev => prev.map((bubble, i) => {
        if (i === index) {
          return {
            ...bubble,
            velocity: {
              x: (Math.random() * 2 - 1) * 5,
              y: (Math.random() * 2 - 1) * 5
            }
          };
        }
        return bubble;
      }));
    }, 1800);
  };
  
  // Physics simulation
  useEffect(() => {
    if (bubbles.length === 0) return;
    
    const updateBubblesWithIceBallPhysics = () => {
      setBubbles(prev => {
        if (prev.length === 0) return prev;
        
        const newBubbles = prev.map((bubble, index) => {
          if (poppedBubbles.includes(index)) {
            return {
              ...bubble,
              velocity: {
                x: 0,
                y: -2,
              }
            };
          }
          
          let vx = bubble.velocity.x;
          let vy = bubble.velocity.y;
          
          const dx = cursorPosition.x - bubble.x;
          const dy = cursorPosition.y - bubble.y;
          const distanceSq = dx * dx + dy * dy;
          const distance = Math.sqrt(distanceSq);
          
          if (distance < 180) {
            const force = Math.pow(1 - distance / 180, 1.5) * cursorInfluence;
            const angle = Math.atan2(dy, dx);
            const speedMultiplier = distance < 60 ? 25 : 18;
            
            vx -= Math.cos(angle) * force * speedMultiplier;
            vy -= Math.sin(angle) * force * speedMultiplier;
          }
          
          const currentSpeed = Math.sqrt(vx * vx + vy * vy);
          if (currentSpeed > 0.2) {
            const decayFactor = Math.max(0, 1 - (velocityDecay * (currentSpeed > 5 ? 2 : 1)));
            vx *= decayFactor;
            vy *= decayFactor;
          } else if (currentSpeed < 0.2 && currentSpeed > 0.01) {
            vx *= 0.95;
            vy *= 0.95;
          } else if (currentSpeed <= 0.01) {
            vx = 0;
            vy = 0;
          }
          
          const radius = bubble.radius;
          
          if (bubble.x - radius < wallRepulsionRange) {
            const distFromWall = bubble.x - radius;
            const repulsionForce = (1 - Math.max(0, distFromWall) / wallRepulsionRange) * wallRepulsionStrength;
            vx += Math.pow(repulsionForce, 0.8) * 4;
          }
          
          if (containerSize.width - (bubble.x + radius) < wallRepulsionRange) {
            const distFromWall = containerSize.width - (bubble.x + radius);
            const repulsionForce = (1 - Math.max(0, distFromWall) / wallRepulsionRange) * wallRepulsionStrength;
            vx -= Math.pow(repulsionForce, 0.8) * 4;
          }
          
          if (bubble.y - radius < wallRepulsionRange) {
            const distFromWall = bubble.y - radius;
            const repulsionForce = (1 - Math.max(0, distFromWall) / wallRepulsionRange) * wallRepulsionStrength;
            vy += Math.pow(repulsionForce, 0.8) * 4;
          }
          
          if (containerSize.height - (bubble.y + radius) < wallRepulsionRange) {
            const distFromWall = containerSize.height - (bubble.y + radius);
            const repulsionForce = (1 - Math.max(0, distFromWall) / wallRepulsionRange) * wallRepulsionStrength;
            vy -= Math.pow(repulsionForce, 0.8) * 4;
          }
          
          vx *= friction;
          vy *= friction;
          
          vx *= slowMotionFactor;
          vy *= slowMotionFactor;
          
          const newX = bubble.x + vx;
          const newY = bubble.y + vy;
          
          let finalX = newX;
          let finalY = newY;
          let finalVx = vx;
          let finalVy = vy;
          
          const bufferZone = 5;
          if (newX - radius < 0) {
            finalX = radius + bufferZone;
            finalVx = Math.abs(vx) * bubble.bounciness * 0.6;
          } else if (newX + radius > containerSize.width) {
            finalX = containerSize.width - radius - bufferZone;
            finalVx = -Math.abs(vx) * bubble.bounciness * 0.6;
          }
          
          if (newY - radius < 0) {
            finalY = radius + bufferZone;
            finalVy = Math.abs(vy) * bubble.bounciness * 0.6;
          } else if (newY + radius > containerSize.height) {
            finalY = containerSize.height - radius - bufferZone;
            finalVy = -Math.abs(vy) * bubble.bounciness * 0.6;
          }
          
          return {
            ...bubble,
            x: finalX,
            y: finalY,
            velocity: { x: finalVx, y: finalVy },
            newPosition: { x: finalX, y: finalY }
          };
        });
        
        for (let i = 0; i < newBubbles.length; i++) {
          if (poppedBubbles.includes(i)) continue;
          
          for (let j = i + 1; j < newBubbles.length; j++) {
            if (poppedBubbles.includes(j)) continue;
            
            const bubbleA = newBubbles[i];
            const bubbleB = newBubbles[j];
            
            const dx = bubbleB.x - bubbleA.x;
            const dy = bubbleB.y - bubbleA.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const minDistance = bubbleA.radius + bubbleB.radius;
            const extendedDistance = minDistance + bubbleRepulsionRange;
            
            if (distance < extendedDistance) {
              const nx = dx / distance;
              const ny = dy / distance;
              
              const repulsionFactor = Math.min(1.5, (extendedDistance - distance) / bubbleRepulsionRange);
              const repulsionStrength = bubbleRepulsionStrength * repulsionFactor;
              
              const massFactorA = 1 / bubbleA.mass;
              const massFactorB = 1 / bubbleB.mass;
              const totalMassFactor = massFactorA + massFactorB;
              
              newBubbles[i].velocity.x -= nx * repulsionStrength * (massFactorA / totalMassFactor) * 2;
              newBubbles[i].velocity.y -= ny * repulsionStrength * (massFactorA / totalMassFactor) * 2;
              newBubbles[j].velocity.x += nx * repulsionStrength * (massFactorB / totalMassFactor) * 2;
              newBubbles[j].velocity.y += ny * repulsionStrength * (massFactorB / totalMassFactor) * 2;
              
              if (distance < minDistance) {
                const vx = bubbleB.velocity.x - bubbleA.velocity.x;
                const vy = bubbleB.velocity.y - bubbleA.velocity.y;
                
                const velocityAlongNormal = vx * nx + vy * ny;
                
                if (velocityAlongNormal > 0) continue;
                
                const restitution = Math.min(bubbleA.bounciness, bubbleB.bounciness) * 0.65;
                
                const impulseScalar = -(1 + restitution) * velocityAlongNormal;
                const totalMass = bubbleA.mass + bubbleB.mass;
                
                const impulseX = impulseScalar * nx;
                const impulseY = impulseScalar * ny;
                
                newBubbles[i].velocity.x -= (impulseX * bubbleB.mass) / totalMass * 0.8;
                newBubbles[i].velocity.y -= (impulseY * bubbleB.mass) / totalMass * 0.8;
                newBubbles[j].velocity.x += (impulseX * bubbleA.mass) / totalMass * 0.8;
                newBubbles[j].velocity.y += (impulseY * bubbleA.mass) / totalMass * 0.8;
                
                const percent = 0.5;
                const slop = 0.01;
                
                const penetration = minDistance - distance;
                
                if (penetration > slop) {
                  const correctionMagnitude = penetration * percent * 1.5;
                  const correctionX = nx * correctionMagnitude;
                  const correctionY = ny * correctionMagnitude;
                  
                  newBubbles[i].x -= correctionX * bubbleB.mass / totalMass;
                  newBubbles[i].y -= correctionY * bubbleB.mass / totalMass;
                  newBubbles[j].x += correctionX * bubbleA.mass / totalMass;
                  newBubbles[j].y += correctionY * bubbleA.mass / totalMass;
                }
              }
            }
          }
        }
        
        return newBubbles;
      });
    };
    
    const animationRef = { current: null };
    
    const runAnimation = () => {
      updateBubblesWithIceBallPhysics();
      animationRef.current = requestAnimationFrame(runAnimation);
    };
    
    runAnimation();
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [bubbles.length, containerSize, poppedBubbles, cursorPosition]);

  useEffect(() => {
    if (burstEffects.length > 0) {
      const timer = setTimeout(() => {
        setBurstEffects(prev => {
          const [_, ...rest] = prev;
          return rest;
        });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [burstEffects]);
  
  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[600px] overflow-hidden mx-auto bg-[#f5f5f7]/80 dark:bg-[#101013]/80 backdrop-blur-sm rounded-sm border border-gray-200 dark:border-gray-800"
      style={{ position: 'relative' }}
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      
      {/* Connecting lines between bubbles */}
      {bubbles.length > 0 && (
        <ConnectingLines bubblePositions={bubbles} poppedIndices={poppedBubbles} />
      )}
      
      {/* Skill bubbles */}
      {bubbles.map((bubble, index) => (
        <motion.div
          key={index}
          className="absolute transform -translate-x-1/2 -translate-y-1/2" 
          style={{
            left: bubble.x,
            top: bubble.y,
            zIndex: poppedBubbles.includes(index) ? 0 : 10,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: poppedBubbles.includes(index) ? 0 : 1,
            scale: poppedBubbles.includes(index) ? 0 : 1,
            rotate: bubble.rotation,
          }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { type: "spring", stiffness: 200, damping: 20 },
          }}
        >
          <motion.div
            className="cursor-pointer relative"
            onClick={(e) => burstBubble(index, e)}
            whileHover={{ 
              scale: 1.12, 
              transition: { duration: 0.4 }
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Bubble Design */}
            <div className="relative">
              {/* Inner shadow for depth */}
              <div 
                className="absolute rounded-full blur-sm"
                style={{ 
                  width: `${getBubbleSize(skills[index].level) - 6}px`, 
                  height: `${getBubbleSize(skills[index].level) - 6}px`,
                  backgroundColor: skills[index].color,
                  opacity: 0.15,
                  top: 3,
                  left: 3
                }}
              />
              
              {/* Main bubble */}
              <div 
                className="rounded-full flex items-center justify-center text-white text-center p-3"
                style={{ 
                  width: `${getBubbleSize(skills[index].level)}px`, 
                  height: `${getBubbleSize(skills[index].level)}px`,
                  background: `radial-gradient(circle at 30% 30%, 
                    ${skills[index].color}99 0%, 
                    ${skills[index].color}BB 70%, 
                    ${skills[index].color} 100%)`,
                  boxShadow: `0 5px 20px ${skills[index].color}50`,
                  transform: `translateZ(10px)`,
                }}
              >
                <div className="text-sm md:text-base font-medium tracking-tight">{skills[index].name}</div>
              </div>
              
              {/* Highlight reflection */}
              <div 
                className="absolute rounded-full overflow-hidden"
                style={{
                  width: "60%",
                  height: "30%",
                  top: "10%",
                  left: "20%",
                  background: "linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)",
                  transform: "rotate(-30deg) translateZ(20px)",
                  opacity: 0.6
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      ))}
      
      {/* Render burst effects */}
      {burstEffects.map(effect => (
        <BurstParticles 
          key={effect.id} 
          x={effect.x}
          y={effect.y}
          color={effect.color} 
        />
      ))}
    </div>
  );
};

const SkillsSection = () => {
  return (
    <section id="skills" className="py-24 bg-[#f5f5f7] dark:bg-[#101013] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -top-24 left-24 w-64 h-64 bg-[#6366f1]/5 dark:bg-[#6366f1]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 right-24 w-96 h-96 bg-[#8b5cf6]/5 dark:bg-[#8b5cf6]/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Interactive Skills
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            My expertise spans AI prompt engineering, data science, and Python programming.
            <span className="block mt-4 text-sm text-gray-500 dark:text-gray-400">
              Move your cursor over the bubbles and click to interact with them
            </span>
          </p>
        </motion.div>

        <BubbleField />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 max-w-xl mx-auto"
        >
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 italic">
            Each bubble represents a skill with its size reflecting my proficiency level.
            The interactive nature demonstrates my approach to creating engaging user experiences.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;