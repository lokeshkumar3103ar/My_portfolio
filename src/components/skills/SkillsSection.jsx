import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

const skills = [
  // Input Layer - Foundation Skills & Tools
  { name: 'Python', category: 'Programming', color: '#6366f1', layer: 'input' },
  { name: 'FastAPI', category: 'Backend', color: '#8b5cf6', layer: 'input' },
  { name: 'MongoDB', category: 'Database', color: '#6366f1', layer: 'input' },
  { name: 'Docker', category: 'DevOps', color: '#8b5cf6', layer: 'input' },
  { name: 'AWS/Azure AI', category: 'Cloud AI', color: '#6366f1', layer: 'input' },
  { name: 'Data Literacy', category: 'Data Science', color: '#8b5cf6', layer: 'input' },
  { name: 'Research Skills', category: 'General', color: '#6366f1', layer: 'input' },
  { name: 'Excel', category: 'Tools', color: '#8b5cf6', layer: 'input' },

  // Hidden Layer - Processing & Analysis
  { name: 'Data Analytics', category: 'Data Science', color: '#6366f1', layer: 'hidden' },
  { name: 'Data Processing', category: 'Data Science', color: '#8b5cf6', layer: 'hidden' },
  { name: 'LLM Optimization', category: 'AI', color: '#6366f1', layer: 'hidden' },
  { name: 'AI Pipelines', category: 'AI', color: '#8b5cf6', layer: 'hidden' },
  { name: 'Experimentation & Testing', category: 'AI', color: '#6366f1', layer: 'hidden' },
  { name: 'Problem Solving', category: 'General', color: '#8b5cf6', layer: 'hidden' },
  { name: 'Model Deployment', category: 'MLOps', color: '#6366f1', layer: 'hidden' },
  { name: 'Ollama', category: 'Local LLM', color: '#8b5cf6', layer: 'hidden' },

  // Output Layer - Specialized AI Skills
  { name: 'Prompt Engineering', category: 'AI', color: '#6366f1', layer: 'output' },
  { name: 'LLM Integration', category: 'AI', color: '#8b5cf6', layer: 'output' },
  { name: 'AI Model Interaction', category: 'AI', color: '#6366f1', layer: 'output' },
  { name: 'RAG Systems', category: 'AI Architecture', color: '#8b5cf6', layer: 'output' },
  { name: 'Multimodal AI', category: 'Advanced AI', color: '#6366f1', layer: 'output' },
  { name: 'Agent Systems', category: 'AI Architecture', color: '#8b5cf6', layer: 'output' },
];

// Neural Network Visualization Component
const NeuralNetworkField = () => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [activePulse, setActivePulse] = useState(null);
  const [networkData, setNetworkData] = useState({ nodes: [], connections: [] });
  const [isInitialized, setIsInitialized] = useState(false);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 650 });

  // Organize skills by neural network layers
  const layerConfig = {
    input: { x: 0.15, color: '#10b981', label: 'Input Layer' },
    hidden: { x: 0.5, color: '#f59e0b', label: 'Processing Layer' },
    output: { x: 0.85, color: '#ef4444', label: 'Output Layer' }
  };

  // Calculate position for nodes in neural network layout
  const calculateNodePositions = (width, height) => {
    const layers = { input: [], hidden: [], output: [] };
    
    // Group skills by layer
    skills.forEach(skill => {
      layers[skill.layer].push(skill);
    });

    const nodes = [];
    const margin = 80;
    const usableHeight = height - (margin * 2);

    Object.keys(layers).forEach(layerKey => {
      const layer = layers[layerKey];
      const layerX = layerConfig[layerKey].x * width;
      const nodeSpacing = layer.length > 1 ? usableHeight / (layer.length - 1) : 0;
      const startY = layer.length === 1 ? height / 2 : margin;

      layer.forEach((skill, index) => {
        const nodeY = layer.length === 1 ? startY : startY + (index * nodeSpacing);
        // Improved responsive node size based on screen width and skill name's length
        let nodeSize;
        if (width < 480) {
          nodeSize = skill.name.length > 8 ? 32 : 36; // Smaller for mobile
        } else if (width < 768) {
          nodeSize = skill.name.length > 8 ? 38 : 42; // Tablet
        } else if (width < 1024) {
          nodeSize = skill.name.length > 8 ? 44 : 48; // Small desktop
        } else {
          nodeSize = skill.name.length > 8 ? 50 : 54; // Large desktop
        }

        nodes.push({
          id: skills.indexOf(skill),
          skill,
          x: layerX,
          y: nodeY,
          layer: layerKey,
          size: nodeSize,
          originalX: layerX,
          originalY: nodeY,
        });
      });
    });

    return nodes;
  };

  // Generate connections between nodes
  const generateConnections = (nodes) => {
    const connections = [];
    const inputNodes = nodes.filter(n => n.layer === 'input');
    const hiddenNodes = nodes.filter(n => n.layer === 'hidden');
    const outputNodes = nodes.filter(n => n.layer === 'output');

    // Connect input to hidden layer
    inputNodes.forEach(inputNode => {
      hiddenNodes.forEach(hiddenNode => {
        const strength = Math.random() * 0.8 + 0.2;
        connections.push({
          id: `${inputNode.id}-${hiddenNode.id}`,
          from: inputNode.id,
          to: hiddenNode.id,
          strength,
          active: false,
        });
      });
    });

    // Connect hidden to output layer
    hiddenNodes.forEach(hiddenNode => {
      outputNodes.forEach(outputNode => {
        const strength = Math.random() * 0.8 + 0.2;
        connections.push({
          id: `${hiddenNode.id}-${outputNode.id}`,
          from: hiddenNode.id,
          to: outputNode.id,
          strength,
          active: false,
        });
      });
    });

    return connections;
  };

  // Initialize network with proper responsive handling
  useEffect(() => {
    const updateNetworkSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newSize = { 
          width: Math.max(rect.width, 320), 
          height: Math.max(rect.height, 400) 
        };
        
        setContainerSize(newSize);
        
        const nodes = calculateNodePositions(newSize.width, newSize.height);
        const connections = generateConnections(nodes);
        
        setNetworkData({ nodes, connections });
        setIsInitialized(true);
      }
    };

    // Multiple initialization attempts for reliability
    const timer1 = setTimeout(updateNetworkSize, 100);
    const timer2 = setTimeout(updateNetworkSize, 500);
    const timer3 = setTimeout(updateNetworkSize, 1000);
    
    window.addEventListener('resize', updateNetworkSize);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener('resize', updateNetworkSize);
    };
  }, []);

  // Pulse animation effect
  useEffect(() => {
    if (!isInitialized || networkData.connections.length === 0) return;

    const pulseInterval = setInterval(() => {
      const randomConnection = networkData.connections[Math.floor(Math.random() * networkData.connections.length)];
      setActivePulse(randomConnection?.id);
      
      setTimeout(() => setActivePulse(null), 1500);
    }, 2000);

    return () => clearInterval(pulseInterval);
  }, [networkData.connections, isInitialized]);

  // Handle node interaction
  const handleNodeHover = (nodeId) => {
    setHoveredNode(nodeId);
    
    setNetworkData(prev => ({
      ...prev,
      connections: prev.connections.map(conn => ({
        ...conn,
        active: conn.from === nodeId || conn.to === nodeId
      }))
    }));
  };

  const handleNodeLeave = () => {
    setHoveredNode(null);
    setNetworkData(prev => ({
      ...prev,
      connections: prev.connections.map(conn => ({
        ...conn,
        active: false
      }))
    }));
  };

  // Utility to detect dark mode
  const isDarkMode = () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  };

  // Render neural network connections
  const renderConnections = () => {
    if (!networkData.nodes.length) return null;

    // Choose a more legible line color for light mode
    const inactiveLineColor = isDarkMode() ? '#d1d5db' : '#9ca3af';

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {networkData.connections.map((connection) => {
          const fromNode = networkData.nodes.find(n => n.id === connection.from);
          const toNode = networkData.nodes.find(n => n.id === connection.to);
          if (!fromNode || !toNode) return null;
          const isActive = connection.active || hoveredNode === connection.from || hoveredNode === connection.to;
          const isPulsing = activePulse === connection.id;
          return (
            <g key={connection.id}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={isActive ? '#3b82f6' : inactiveLineColor}
                strokeWidth={isActive ? 2 : 1}
                strokeOpacity={isActive ? 0.8 : 0.7}
              />
              {isPulsing && (
                <motion.line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="url(#pulseGradient)"
                  strokeWidth="4"
                  initial={{ pathLength: 0, pathOffset: 0 }}
                  animate={{ pathLength: 1, pathOffset: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              )}
            </g>
          );
        })}
      </svg>
    );
  };
    // Memoized SVG for connections
    const connectionsSvg = useMemo(() => renderConnections(), [networkData.connections, hoveredNode, activePulse]);

  // Responsive container height with better breakpoint handling
  const getContainerHeight = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Adaptive heights based on device and screen size
      if (width < 480) return 'h-[400px] sm:h-[450px]'; // Mobile
      if (width < 768) return 'h-[500px]'; // Large mobile/small tablet
      if (width < 1024) return 'h-[550px]'; // Tablet
      if (width < 1440) return 'h-[600px]'; // Small desktop
      return 'h-[650px]'; // Large desktop
    }
    return 'h-[650px]';
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${getContainerHeight()} overflow-hidden mx-auto bg-gradient-to-br from-gray-50/90 to-gray-100/90 dark:from-gray-950/90 dark:to-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl`}
    >
      {/* Layer labels - responsive positioning */}
      <div className="absolute top-4 left-2 right-2 md:left-4 md:right-4 flex justify-between z-20">
        {Object.entries(layerConfig).map(([key, config]) => (
          <div key={key} className="text-center">
            <div 
              className="inline-block w-2 h-2 md:w-3 md:h-3 rounded-full mb-1"
              style={{ backgroundColor: config.color }}
            ></div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
              {config.label}
            </div>
          </div>
        ))}
      </div>

  {/* Render connections (memoized) */}
  {connectionsSvg}

      {/* Render nodes */}
      {networkData.nodes.length > 0 ? (
        networkData.nodes.map((node) => (
          <motion.div
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
            style={{
              left: node.x,
              top: node.y,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: hoveredNode === node.id ? 1.2 : 1, 
              opacity: 1 
            }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20,
              opacity: { delay: node.id * 0.03 }
            }}
            onMouseEnter={() => handleNodeHover(node.id)}
            onMouseLeave={handleNodeLeave}
          >
            {/* Node glow effect */}
            <div
              className="absolute inset-0 rounded-full blur-md opacity-40"
              style={{
                width: node.size + 10,
                height: node.size + 10,
                backgroundColor: node.skill.color,
                top: -5,
                left: -5,
              }}
            />
            
            {/* Main node */}
            <div
              className="relative rounded-full flex items-center justify-center text-white text-center border-2 border-white/20"
              style={{
                width: node.size,
                height: node.size,
                background: `radial-gradient(circle at 30% 30%, ${node.skill.color}99, ${node.skill.color})`,
                boxShadow: `0 4px 20px ${node.skill.color}40`,
              }}
            >
              <div className="text-xs font-medium text-center leading-tight px-1">
                {node.skill.name.split(' ').map((word, i) => (
                  <div key={i} className={`${
                    node.size < 40 ? 'text-[0.45rem]' : 
                    node.size < 45 ? 'text-[0.55rem]' : 
                    'text-xs'
                  } leading-tight font-semibold`}>
                    {word}
                  </div>
                ))}
              </div>
            </div>

            {/* Pulse ring for active nodes */}
            {hoveredNode === node.id && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 opacity-60"
                style={{
                  borderColor: node.skill.color,
                  width: node.size + 16,
                  height: node.size + 16,
                  top: -8,
                  left: -8,
                }}
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </motion.div>
        ))
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <div className="text-lg mb-2">🧠</div>
            <div>Loading Neural Network...</div>
          </div>
        </div>
      )}

      {/* Hover tooltip - responsive positioning */}
      {hoveredNode !== null && networkData.nodes[hoveredNode] && (
        <motion.div
          className="absolute z-30 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 pointer-events-none max-w-xs"
          style={{
            left: Math.min(networkData.nodes[hoveredNode]?.x + 30, containerSize.width - 150),
            top: Math.max(networkData.nodes[hoveredNode]?.y - 40, 10),
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {networkData.nodes[hoveredNode]?.skill.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {networkData.nodes[hoveredNode]?.skill.category}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const SkillsSection = () => {
  return (
    <section id="skills" className="py-24 bg-gray-50 dark:bg-gray-950 relative">
      {/* Section divider matching footer */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>

      {/* Background decorative elements - responsive */}
      <div className="absolute -top-12 md:-top-24 left-12 md:left-24 w-32 h-32 md:w-64 md:h-64 bg-[#6366f1]/5 dark:bg-[#6366f1]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-12 md:-bottom-24 right-12 md:right-24 w-48 h-48 md:w-96 md:h-96 bg-[#8b5cf6]/5 dark:bg-[#8b5cf6]/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
            My Skills
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
            My expertise visualized as an interactive neural network. Each node represents a skill, 
            with connections showing how they work together to solve complex problems.
            <span className="block mt-2 md:mt-4 text-sm text-gray-500 dark:text-gray-400">
              Hover over nodes to see connections and watch data flow through the network
            </span>
          </p>
        </motion.div>

        <NeuralNetworkField />
      </div>
    </section>
  );
};

export default SkillsSection;