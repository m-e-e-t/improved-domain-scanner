import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  Calendar, 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { DomainScan } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function History() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Query recent scans
  const { data: scans, isLoading, error } = useQuery({
    queryKey: ['/api/scans/recent'],
    queryFn: async () => {
      const response = await fetch('/api/scans/recent');
      if (!response.ok) throw new Error('Failed to fetch scan history');
      return response.json() as Promise<DomainScan[]>;
    },
  });

  // Filter and search scans
  const filteredScans = scans?.filter(scan => {
    let matchesSearch = true;
    let matchesFilter = true;
    
    // Filter by search query
    if (searchQuery) {
      matchesSearch = scan.domain.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    // Filter by scan type
    if (filterType !== 'all') {
      try {
        const results = JSON.parse(scan.results as string);
        matchesFilter = results.options && results.options[filterType] === true;
      } catch (e) {
        matchesFilter = false;
      }
    }
    
    return matchesSearch && matchesFilter;
  }) || [];

  // Get security score and scan types
  const getScanDetails = (scan: DomainScan) => {
    try {
      const results = JSON.parse(scan.results as string);
      
      // Get security score
      const securityScore = results.security?.score;
      
      // Get scan types that were performed
      const scanTypes = [];
      if (results.options) {
        for (const [key, value] of Object.entries(results.options)) {
          if (value === true) {
            scanTypes.push(key);
          }
        }
      }
      
      return { securityScore, scanTypes };
    } catch (e) {
      return { securityScore: null, scanTypes: [] };
    }
  };

  // Format scan types as readable text
  const formatScanType = (type: string): string => {
    const typeMapping: Record<string, string> = {
      dns: 'DNS',
      ssl: 'SSL',
      whois: 'WHOIS',
      http: 'HTTP Headers',
      security: 'Security',
      ports: 'Ports',
      technologies: 'Technologies',
      subdomains: 'Subdomains',
      contentAnalysis: 'Content',
      networkAnalysis: 'Network',
      domainHealth: 'Domain Health',
      enhancedSsl: 'SSL (Enhanced)',
      malwareAnalysis: 'Malware'
    };
    
    return typeMapping[type] || type;
  };
  
  // Get color for security score
  const getScoreColor = (score: number | null) => {
    if (score === null) return '';
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };
  
  if (error) {
    toast({
      title: 'Error loading scan history',
      description: error instanceof Error ? error.message : 'Failed to load scan history',
      variant: 'destructive',
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Scan History</h1>
          <p className="text-muted-foreground">View and analyze your previous domain scans</p>
        </div>
        
        <Link href="/">
          <Button className="mt-4 md:mt-0" variant="outline">
            <Search className="mr-2 h-4 w-4" />
            New Scan
          </Button>
        </Link>
      </div>
      
      {/* Search and filter controls */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search domains..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex-shrink-0 w-full md:w-64">
              <Select 
                value={filterType} 
                onValueChange={(value) => setFilterType(value)}
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Filter by scan type</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All scan types</SelectItem>
                  <SelectItem value="dns">DNS Records</SelectItem>
                  <SelectItem value="ssl">SSL Certificate</SelectItem>
                  <SelectItem value="whois">WHOIS Information</SelectItem>
                  <SelectItem value="http">HTTP Headers</SelectItem>
                  <SelectItem value="security">Security Analysis</SelectItem>
                  <SelectItem value="ports">Port Scanning</SelectItem>
                  <SelectItem value="technologies">Technology Detection</SelectItem>
                  <SelectItem value="subdomains">Subdomain Discovery</SelectItem>
                  <SelectItem value="contentAnalysis">Content Analysis</SelectItem>
                  <SelectItem value="networkAnalysis">Network Analysis</SelectItem>
                  <SelectItem value="domainHealth">Domain Health</SelectItem>
                  <SelectItem value="enhancedSsl">Enhanced SSL Analysis</SelectItem>
                  <SelectItem value="malwareAnalysis">Malware Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Results count and export button */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          {filteredScans.length} {filteredScans.length === 1 ? 'result' : 'results'}
        </p>
      </div>
      
      {/* Scan history table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Scan History</CardTitle>
          <CardDescription>Historical record of all domain scans performed</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredScans.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-slate-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium">No scan history found</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                {searchQuery || filterType !== 'all' 
                  ? 'Try changing your search or filter criteria' 
                  : 'Scan some domains to start building your history'}
              </p>
              <Link href="/">
                <Button variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Start a New Scan
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Domain</TableHead>
                    <TableHead>Scan Date</TableHead>
                    <TableHead>Scan Types</TableHead>
                    <TableHead>Security Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredScans.map((scan) => {
                    const { securityScore, scanTypes } = getScanDetails(scan);
                    return (
                      <TableRow key={scan.id}>
                        <TableCell className="font-medium">
                          {scan.domain}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{new Date(scan.scannedAt).toLocaleString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[280px]">
                            {scanTypes.slice(0, 3).map((type) => (
                              <Badge key={type} variant="outline" className="text-xs">
                                {formatScanType(type)}
                              </Badge>
                            ))}
                            {scanTypes.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{scanTypes.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {securityScore !== null ? (
                            <div className="flex items-center">
                              {securityScore >= 70 ? (
                                <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                              ) : (
                                <AlertTriangle className="mr-2 h-4 w-4 text-orange-500" />
                              )}
                              <span className={`font-medium ${getScoreColor(securityScore)}`}>
                                {securityScore}/100
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/?domain=${encodeURIComponent(scan.domain)}&view=results`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">View details</span>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}