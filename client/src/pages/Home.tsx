import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DomainScanForm from '@/components/DomainScanForm';
import BatchScanForm from '@/components/BatchScanForm';
import ScanStatus from '@/components/ScanStatus';
import ScanResults from '@/components/ScanResults';
import DomainEcosystemVisualization from '@/components/DomainEcosystemVisualization';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { motion } from 'framer-motion';
import { 
  DomainScanRequest, 
  BatchDomainScanRequest, 
  ScanProgress 
} from '@shared/schema';
import { 
  ShieldCheck, 
  Database,
  Search, 
  Globe, 
  Lock, 
  FileText, 
  Server, 
  Layers, 
  Cpu,
  BarChart2,
  ArrowRight 
} from 'lucide-react';

export default function Home() {
  const [domain, setDomain] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  // Start scan mutation
  const startScanMutation = useMutation({
    mutationFn: async (scanRequest: DomainScanRequest) => {
      const res = await apiRequest('POST', '/api/scan', scanRequest);
      return res.json();
    },
    onSuccess: () => {
      setIsScanning(true);
      toast({
        title: 'Scan started',
        description: `Scanning domain ${domain}`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Scan failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    },
  });

  // Query for scan progress
  const progressQuery = useQuery({
    queryKey: ['/api/scan', domain, 'progress'],
    queryFn: async () => {
      if (!domain || !isScanning) return null;
      
      const res = await fetch(`/api/scan/${encodeURIComponent(domain)}/progress`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch scan progress');
      return res.json() as Promise<ScanProgress>;
    },
    enabled: !!domain && isScanning,
    refetchInterval: isScanning ? 1000 : false,
  });

  // Query for scan results
  const resultsQuery = useQuery({
    queryKey: ['/api/scan', domain, 'results'],
    queryFn: async () => {
      if (!domain) return null;
      
      const res = await fetch(`/api/scan/${encodeURIComponent(domain)}/results`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch scan results');
      return res.json();
    },
    enabled: !!domain && showResults,
  });

  // Batch scan mutation
  const batchScanMutation = useMutation({
    mutationFn: async (batchScanRequest: BatchDomainScanRequest) => {
      const res = await apiRequest('POST', '/api/scan/batch', batchScanRequest);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Batch scan started',
        description: `Scanning ${data.count} domains`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Batch scan failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    },
  });

  // Handle single domain form submission
  const handleScan = (scanRequest: DomainScanRequest) => {
    setDomain(scanRequest.domain);
    setShowResults(false);
    startScanMutation.mutate(scanRequest);
  };

  // Handle batch scan form submission
  const handleBatchScan = (batchScanRequest: BatchDomainScanRequest) => {
    batchScanMutation.mutate(batchScanRequest);
  };

  // Check if scan is complete
  if (progressQuery.data?.status === 'completed' && isScanning) {
    setIsScanning(false);
    setShowResults(true);
  }

  // Feature blocks for the home page
  const featureBlocks = [
    {
      title: 'Security Analysis',
      description: 'Comprehensive security analysis including vulnerabilities, threats, and recommendations.',
      icon: <ShieldCheck className="h-10 w-10 text-primary" />
    },
    {
      title: 'DNS Records',
      description: 'Identify and analyze all DNS records including A, AAAA, MX, CNAME, TXT, and more.',
      icon: <Database className="h-10 w-10 text-primary" />
    },
    {
      title: 'SSL Certificates',
      description: 'Detailed SSL certificate analysis with protocol support and vulnerabilities.',
      icon: <Lock className="h-10 w-10 text-primary" />
    },
    {
      title: 'HTTP Headers',
      description: 'Analyze security headers and identify missing or misconfigured headers.',
      icon: <FileText className="h-10 w-10 text-primary" />
    },
    {
      title: 'Port Scanning',
      description: 'Discover open ports and services running on the target domain.',
      icon: <Server className="h-10 w-10 text-primary" />
    },
    {
      title: 'Technology Detection',
      description: 'Identify technologies, frameworks, and libraries used by the website.',
      icon: <Cpu className="h-10 w-10 text-primary" />
    },
    {
      title: 'Subdomain Discovery',
      description: 'Find and analyze subdomains associated with the target domain.',
      icon: <Layers className="h-10 w-10 text-primary" />
    },
    {
      title: 'Domain Health',
      description: 'Monitor domain health including registration status and expiration.',
      icon: <BarChart2 className="h-10 w-10 text-primary" />
    },
  ];

  return (
    <div>
      {/* Hero section */}
      {!showResults && !isScanning && (
        <div className="bg-gradient-to-b from-white to-slate-50 pb-12">
          <div className="container mx-auto px-4 pt-12 pb-16 text-center">
            <div className="mx-auto mb-10 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-slate-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-slate-300 hover:bg-white/50">
              <p className="text-sm font-medium text-slate-700">
                Advanced Domain Analysis
              </p>
            </div>
            <h1 className="mb-5 font-bold text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-primary to-blue-600 inline-block text-transparent bg-clip-text">
              Comprehensive Domain Scanning
            </h1>
            <p className="md:text-xl mx-auto mb-10 max-w-2xl text-slate-600">
              Analyze domain security, DNS records, SSL certificates, and detect technologies with our advanced domain scanner. Get detailed insights in seconds.
            </p>
          </div>
        </div>
      )}
      
      <main className="container mx-auto px-4 py-8">
        {!showResults && !isScanning && (
          <div className="mb-8 max-w-3xl mx-auto">
            <Tabs defaultValue="single" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="single">Single Domain</TabsTrigger>
                <TabsTrigger value="batch">Batch Scan</TabsTrigger>
              </TabsList>
              
              <TabsContent value="single" className="mt-0">
                <DomainScanForm 
                  onScan={handleScan} 
                  isLoading={startScanMutation.isPending} 
                />
              </TabsContent>
              
              <TabsContent value="batch" className="mt-0">
                <BatchScanForm 
                  onScan={handleBatchScan} 
                  isLoading={batchScanMutation.isPending} 
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {isScanning && progressQuery.data && (
          <div className="mt-8 max-w-3xl mx-auto">
            <ScanStatus 
              domain={domain} 
              progress={progressQuery.data} 
            />
          </div>
        )}
        
        {showResults && resultsQuery.data && (
          <div className="mt-8">
            <ScanResults scanResults={resultsQuery.data} />
          </div>
        )}
        
        {/* Feature blocks - only show when not displaying results */}
        {!showResults && !isScanning && (
          <div className="mt-16 mb-12">
            <h2 className="text-3xl font-bold text-center mb-10">Advanced Scanning Features</h2>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {featureBlocks.map((feature, index) => (
                <div 
                  key={index} 
                  className="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      {/* Domain Ecosystem Visualization - only show when not displaying results */}
      {!showResults && !isScanning && (
        <div className="bg-white py-14 border-t border-b border-slate-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Domain Ecosystem Visualization</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Understand the complex relationships between different aspects of a domain through our
                interactive visualization. See how each component relates to the overall health and security.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="order-2 lg:order-1"
              >
                <DomainEcosystemVisualization domain="example.com" />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="order-1 lg:order-2"
              >
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="text-xl font-semibold mb-4">Comprehensive Analysis</h3>
                  <ul className="space-y-3">
                    {[
                      "Visualize relationships between domain components",
                      "Identify security dependencies and potential vulnerabilities",
                      "Understand how different elements affect overall domain health",
                      "Detect infrastructure weaknesses through visual patterns",
                      "Track the impact of changes to domain configuration"
                    ].map((item, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-start"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + (i * 0.1) }}
                      >
                        <div className="flex-shrink-0 h-5 w-5 mt-0.5 mr-2 rounded-full bg-primary/10 flex items-center justify-center">
                          <ArrowRight className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-slate-700">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Call to action - only show when not displaying results */}
      {!showResults && !isScanning && (
        <div className="bg-slate-50 py-14">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Start analyzing your domains now</h2>
              <p className="mb-6 text-slate-600">
                Our domain scanner provides comprehensive analysis to help you identify security issues, configuration problems, and potential vulnerabilities.
              </p>
              <motion.button 
                onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="mr-2 h-5 w-5" />
                Start Scanning
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
