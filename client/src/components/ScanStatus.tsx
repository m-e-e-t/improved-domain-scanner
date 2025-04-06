import { useEffect, useState, useMemo } from 'react';
import { ScanProgress } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  Database,
  Lock, 
  FileText, 
  Info, 
  Server,
  Cpu, 
  Layers,
  ShieldAlert,
  FileImage,
  Network,
  Activity,
  ShieldCheck,
  CircleAlert
} from 'lucide-react';
import AnimatedProgressRing from './AnimatedProgressRing';
import DomainMascot, { MascotMood } from './DomainMascot';

interface ScanStatusProps {
  domain: string;
  progress: ScanProgress;
}

type ScanType = keyof ScanProgress['progress'];

interface ScanTypeInfo {
  name: string;
  icon: JSX.Element;
  category: 'basic' | 'advanced';
}

export default function ScanStatus({ domain, progress }: ScanStatusProps) {
  const [overallProgress, setOverallProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'all' | 'basic' | 'advanced'>('all');
  
  // Determine the mascot mood based on progress
  const mascotMood = useMemo<MascotMood>(() => {
    if (overallProgress >= 100) return 'happy';
    if (overallProgress > 0) return 'scanning';
    return 'idle';
  }, [overallProgress]);
  
  // Define scan types and their display metadata
  const scanTypes: Record<ScanType, ScanTypeInfo> = {
    dns: { name: 'DNS Records', icon: <Database className="h-4 w-4" />, category: 'basic' },
    ssl: { name: 'SSL Certificate', icon: <Lock className="h-4 w-4" />, category: 'basic' },
    whois: { name: 'WHOIS Information', icon: <Info className="h-4 w-4" />, category: 'basic' },
    http: { name: 'HTTP Headers', icon: <FileText className="h-4 w-4" />, category: 'basic' },
    security: { name: 'Security Analysis', icon: <ShieldAlert className="h-4 w-4" />, category: 'basic' },
    ports: { name: 'Port Scanning', icon: <Server className="h-4 w-4" />, category: 'advanced' },
    technologies: { name: 'Technology Detection', icon: <Cpu className="h-4 w-4" />, category: 'advanced' },
    subdomains: { name: 'Subdomain Discovery', icon: <Layers className="h-4 w-4" />, category: 'advanced' },
    contentAnalysis: { name: 'Content Analysis', icon: <FileImage className="h-4 w-4" />, category: 'advanced' },
    networkAnalysis: { name: 'Network Analysis', icon: <Network className="h-4 w-4" />, category: 'advanced' },
    domainHealth: { name: 'Domain Health', icon: <Activity className="h-4 w-4" />, category: 'advanced' },
    enhancedSsl: { name: 'Enhanced SSL Analysis', icon: <ShieldCheck className="h-4 w-4" />, category: 'advanced' },
    malwareAnalysis: { name: 'Malware Analysis', icon: <CircleAlert className="h-4 w-4" />, category: 'advanced' },
  };

  // Calculate overall progress and individual scan progress percentages
  useEffect(() => {
    // Count number of active scan types
    const scanTypes = Object.keys(progress.progress) as ScanType[];
    const activeScans = scanTypes.filter(type => progress.progress[type] !== 'skipped');
    
    if (activeScans.length === 0) {
      setOverallProgress(0);
      return;
    }
    
    // Calculate progress for each scan type
    const statusValues = {
      'waiting': 0,
      'scanning': 33,
      'completed': 100,
      'failed': 100,
      'skipped': 0
    };
    
    // Calculate overall progress
    const totalProgress = activeScans.reduce((sum, type) => {
      const status = progress.progress[type];
      return sum + statusValues[status];
    }, 0);
    
    setOverallProgress(Math.round(totalProgress / activeScans.length));
  }, [progress]);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting': return 'Waiting';
      case 'scanning': return 'Scanning';
      case 'completed': return 'Complete';
      case 'failed': return 'Failed';
      case 'skipped': return 'Skipped';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Clock className="h-4 w-4 text-slate-500" />;
      case 'scanning':
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'skipped':
        return <Clock className="h-4 w-4 text-slate-300" />;
      default:
        return <Clock className="h-4 w-4 text-slate-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-slate-400';
      case 'scanning': return 'bg-primary';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'skipped': return 'bg-slate-200';
      default: return 'bg-slate-200';
    }
  };
  
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'waiting': return 'secondary';
      case 'scanning': return 'default';
      case 'completed': return 'default';
      case 'failed': return 'destructive';
      case 'skipped': return 'outline';
      default: return 'outline';
    }
  };

  // Get the scan types based on the active tab
  const getFilteredScanTypes = (): ScanType[] => {
    const allTypes = Object.keys(progress.progress) as ScanType[];
    
    if (activeTab === 'all') {
      return allTypes.filter(type => progress.progress[type] !== 'skipped');
    }
    
    return allTypes.filter(type => 
      scanTypes[type]?.category === activeTab && 
      progress.progress[type] !== 'skipped'
    );
  };

  // Count scans in each category
  const scanCounts = {
    all: Object.keys(progress.progress).filter(
      type => progress.progress[type as ScanType] !== 'skipped'
    ).length,
    basic: Object.keys(progress.progress).filter(
      type => scanTypes[type as ScanType]?.category === 'basic' && 
             progress.progress[type as ScanType] !== 'skipped'
    ).length,
    advanced: Object.keys(progress.progress).filter(
      type => scanTypes[type as ScanType]?.category === 'advanced' && 
             progress.progress[type as ScanType] !== 'skipped'
    ).length
  };

  return (
    <Card className="bg-white rounded-lg shadow">
      <CardHeader className="border-b pb-3">
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <CardTitle className="text-xl flex items-center">
              <Loader2 className="h-5 w-5 text-primary mr-2 animate-spin" />
              Domain Scan in Progress
            </CardTitle>
            <CardDescription>
              Scanning <span className="font-medium">{domain}</span>
            </CardDescription>
          </div>
          <div className="mt-2 sm:mt-0 flex items-center">
            <div className="mr-3 text-right">
              <span className="text-sm font-medium">{overallProgress}%</span>
              <p className="text-xs text-muted-foreground">Overall progress</p>
            </div>
            <div className="flex-shrink-0">
              <AnimatedProgressRing 
                progress={overallProgress} 
                size={64} 
                strokeWidth={5}
                animated={true}
                showPercentage={false}
              >
                <DomainMascot 
                  mood={mascotMood}
                  size={42}
                />
              </AnimatedProgressRing>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs 
          defaultValue="all" 
          className="w-full"
          onValueChange={(value) => setActiveTab(value as 'all' | 'basic' | 'advanced')}
        >
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all" className="flex items-center justify-center">
              All
              <Badge variant="outline" className="ml-2 bg-slate-100">
                {scanCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="basic" className="flex items-center justify-center">
              Basic
              <Badge variant="outline" className="ml-2 bg-slate-100">
                {scanCounts.basic}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center justify-center">
              Advanced
              <Badge variant="outline" className="ml-2 bg-slate-100">
                {scanCounts.advanced}
              </Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="space-y-2">
              {getFilteredScanTypes().map((type) => (
                <div 
                  key={type} 
                  className="bg-slate-50 border rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      <AnimatedProgressRing
                        progress={progress.progress[type] === 'waiting' ? 0 : 
                                progress.progress[type] === 'scanning' ? 50 : 
                                (progress.progress[type] === 'completed' || progress.progress[type] === 'failed') ? 100 : 0}
                        size={36}
                        strokeWidth={3}
                        color={progress.progress[type] === 'completed' ? '#22c55e' : 
                              progress.progress[type] === 'failed' ? '#ef4444' :
                              'hsl(var(--primary))'}
                        bgColor="hsl(var(--muted))"
                        animated={progress.progress[type] === 'scanning'}
                        showPercentage={false}
                      >
                        <div className="bg-white p-1 rounded-full">
                          {scanTypes[type]?.icon}
                        </div>
                      </AnimatedProgressRing>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{scanTypes[type]?.name}</div>
                      <span className="text-xs text-slate-500 flex items-center mt-0.5">
                        {getStatusIcon(progress.progress[type])}
                        <span className="ml-1">{getStatusText(progress.progress[type])}</span>
                      </span>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(progress.progress[type])}>
                    {progress.progress[type] === 'scanning' && (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    )}
                    {getStatusText(progress.progress[type])}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="basic" className="mt-0">
            <div className="space-y-2">
              {getFilteredScanTypes().map((type) => (
                <div 
                  key={type} 
                  className="bg-slate-50 border rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      <AnimatedProgressRing
                        progress={progress.progress[type] === 'waiting' ? 0 : 
                                progress.progress[type] === 'scanning' ? 50 : 
                                (progress.progress[type] === 'completed' || progress.progress[type] === 'failed') ? 100 : 0}
                        size={36}
                        strokeWidth={3}
                        color={progress.progress[type] === 'completed' ? '#22c55e' : 
                              progress.progress[type] === 'failed' ? '#ef4444' :
                              'hsl(var(--primary))'}
                        bgColor="hsl(var(--muted))"
                        animated={progress.progress[type] === 'scanning'}
                        showPercentage={false}
                      >
                        <div className="bg-white p-1 rounded-full">
                          {scanTypes[type]?.icon}
                        </div>
                      </AnimatedProgressRing>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{scanTypes[type]?.name}</div>
                      <span className="text-xs text-slate-500 flex items-center mt-0.5">
                        {getStatusIcon(progress.progress[type])}
                        <span className="ml-1">{getStatusText(progress.progress[type])}</span>
                      </span>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(progress.progress[type])}>
                    {progress.progress[type] === 'scanning' && (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    )}
                    {getStatusText(progress.progress[type])}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="mt-0">
            <div className="space-y-2">
              {getFilteredScanTypes().map((type) => (
                <div 
                  key={type} 
                  className="bg-slate-50 border rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      <AnimatedProgressRing
                        progress={progress.progress[type] === 'waiting' ? 0 : 
                                progress.progress[type] === 'scanning' ? 50 : 
                                (progress.progress[type] === 'completed' || progress.progress[type] === 'failed') ? 100 : 0}
                        size={36}
                        strokeWidth={3}
                        color={progress.progress[type] === 'completed' ? '#22c55e' : 
                              progress.progress[type] === 'failed' ? '#ef4444' :
                              'hsl(var(--primary))'}
                        bgColor="hsl(var(--muted))"
                        animated={progress.progress[type] === 'scanning'}
                        showPercentage={false}
                      >
                        <div className="bg-white p-1 rounded-full">
                          {scanTypes[type]?.icon}
                        </div>
                      </AnimatedProgressRing>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{scanTypes[type]?.name}</div>
                      <span className="text-xs text-slate-500 flex items-center mt-0.5">
                        {getStatusIcon(progress.progress[type])}
                        <span className="ml-1">{getStatusText(progress.progress[type])}</span>
                      </span>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(progress.progress[type])}>
                    {progress.progress[type] === 'scanning' && (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    )}
                    {getStatusText(progress.progress[type])}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {progress.cachedResult && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <div className="flex items-start">
              <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Using cached results</p>
                <p className="text-xs mt-1">Results are from a previous scan performed on {new Date(progress.cachedTimestamp || '').toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
