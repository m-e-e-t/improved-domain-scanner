import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Server, Lock, FileText, Database, Code, Network, Shield, Zap } from 'lucide-react';

interface DomainEcosystemVisualizationProps {
  domain: string;
  animate?: boolean;
}

type NodeType = {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
};

const DomainEcosystemVisualization: React.FC<DomainEcosystemVisualizationProps> = ({ 
  domain,
  animate = true,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Define the nodes in our ecosystem visualization
  const nodeTypes: NodeType[] = [
    { 
      id: 'domain', 
      label: 'Domain', 
      icon: <Globe className="h-4 w-4 text-white" />, 
      description: 'The primary domain name being analyzed',
      color: 'from-primary to-blue-600'
    },
    { 
      id: 'dns', 
      label: 'DNS', 
      icon: <Database className="h-4 w-4 text-white" />, 
      description: 'DNS records including A, AAAA, MX, CNAME, TXT records',
      color: 'from-orange-500 to-orange-600'
    },
    { 
      id: 'ssl', 
      label: 'SSL', 
      icon: <Lock className="h-4 w-4 text-white" />, 
      description: 'SSL certificate information and security protocols',
      color: 'from-green-500 to-green-600'
    },
    { 
      id: 'headers', 
      label: 'HTTP', 
      icon: <FileText className="h-4 w-4 text-white" />, 
      description: 'HTTP headers and security configurations',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: 'ports', 
      label: 'Ports', 
      icon: <Server className="h-4 w-4 text-white" />, 
      description: 'Open ports and running services',
      color: 'from-pink-500 to-pink-600'
    },
    { 
      id: 'tech', 
      label: 'Tech', 
      icon: <Code className="h-4 w-4 text-white" />, 
      description: 'Technologies and frameworks in use',
      color: 'from-yellow-500 to-yellow-600'
    },
    { 
      id: 'network', 
      label: 'Network', 
      icon: <Network className="h-4 w-4 text-white" />, 
      description: 'Network information and routing details',
      color: 'from-cyan-500 to-cyan-600'
    },
    { 
      id: 'security', 
      label: 'Security', 
      icon: <Shield className="h-4 w-4 text-white" />, 
      description: 'Security assessment and vulnerabilities',
      color: 'from-red-500 to-red-600'
    },
    { 
      id: 'performance', 
      label: 'Performance', 
      icon: <Zap className="h-4 w-4 text-white" />, 
      description: 'Performance metrics and response times',
      color: 'from-lime-500 to-lime-600'
    }
  ];

  // Calculate positions in a circle
  const calculatePositions = () => {
    if (!svgRef.current) return [];
    
    const centerNode = { id: 'domain', x: 150, y: 120 };
    const radius = 100;
    const numNodesInRing = nodeTypes.length - 1;
    
    return nodeTypes.map((node, index) => {
      if (node.id === 'domain') {
        return { ...node, x: centerNode.x, y: centerNode.y };
      }
      
      // Calculate position in a circle around the center
      const angle = ((index - 1) * (2 * Math.PI / numNodesInRing));
      return {
        ...node,
        x: centerNode.x + radius * Math.cos(angle),
        y: centerNode.y + radius * Math.sin(angle)
      };
    });
  };

  // Create connection lines to the center node
  const renderConnections = (nodes: (NodeType & { x: number; y: number })[]) => {
    const centerNode = nodes.find(n => n.id === 'domain');
    if (!centerNode) return null;
    
    return nodes.filter(n => n.id !== 'domain').map((node) => (
      <motion.line
        key={`line-${node.id}`}
        x1={centerNode.x}
        y1={centerNode.y}
        x2={node.x}
        y2={node.y}
        stroke="#e2e8f0"
        strokeWidth={1.5}
        strokeDasharray="4,4"
        initial={animate ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 0.7 }}
        animate={animate ? { 
          pathLength: 1, 
          opacity: 0.7,
          transition: { 
            duration: 1.5,
            delay: 0.5 + (nodes.indexOf(node) * 0.1)
          }
        } : {}}
      />
    ));
  };

  // Render the nodes as circles with icons
  const renderNodes = (nodes: (NodeType & { x: number; y: number })[]) => {
    return nodes.map((node) => (
      <motion.g
        key={node.id}
        initial={animate ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        animate={animate ? { 
          scale: 1, 
          opacity: 1,
          transition: { 
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 1 + (nodes.indexOf(node) * 0.1) 
          }
        } : {}}
        whileHover={{ scale: 1.1 }}
        className="cursor-pointer"
      >
        <title>{node.description}</title>
        <circle
          cx={node.x}
          cy={node.y}
          r={node.id === 'domain' ? 30 : 22}
          className={`bg-gradient-to-br ${node.color} fill-current`}
        />
        <foreignObject x={node.x - 10} y={node.y - 10} width="20" height="20">
          <div className="h-full w-full flex items-center justify-center">
            {node.icon}
          </div>
        </foreignObject>
        <text
          x={node.x}
          y={node.y + (node.id === 'domain' ? 45 : 35)}
          textAnchor="middle"
          className="text-xs font-medium fill-slate-700"
        >
          {node.label}
        </text>
        {node.id === 'domain' && (
          <text
            x={node.x}
            y={node.y + 60}
            textAnchor="middle"
            className="text-xs fill-slate-500"
          >
            {domain}
          </text>
        )}
      </motion.g>
    ));
  };

  // Main SVG rendering logic
  const calculateHeight = () => {
    // Calculate height based on screen size
    return window.innerWidth < 640 ? 400 : 300;
  };

  const positions = calculatePositions();

  return (
    <div className="w-full overflow-hidden rounded-lg bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-2 text-center">Domain Ecosystem</h3>
      <div className="w-full overflow-x-auto">
        <svg 
          ref={svgRef} 
          viewBox="0 0 300 240" 
          width="100%"
          height={calculateHeight()}
          className="mx-auto"
        >
          {renderConnections(positions)}
          {renderNodes(positions)}
        </svg>
      </div>
      <p className="text-xs text-center text-slate-500 mt-2">
        Interactive visualization of the domain's components and relationships
      </p>
    </div>
  );
};

export default DomainEcosystemVisualization;