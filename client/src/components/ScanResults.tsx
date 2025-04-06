import { useState } from 'react';
import DnsRecordsSection from './DnsRecordsSection';
import SslCertificateSection from './SslCertificateSection';
import WhoisSection from './WhoisSection';
import HttpHeadersSection from './HttpHeadersSection';
import SecuritySection from './SecuritySection';
import PortsSection from './PortsSection';
import TechnologiesSection from './TechnologiesSection';
import SubdomainsSection from './SubdomainsSection';
import ContentAnalysisSection from './ContentAnalysisSection';
import NetworkAnalysisSection from './NetworkAnalysisSection';
import DomainHealthSection from './DomainHealthSection';
import EnhancedSslSection from './EnhancedSslSection';
import MalwareAnalysisSection from './MalwareAnalysisSection';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Download, File, FileJson, FileSpreadsheet, Link } from 'lucide-react';
import { DomainScanResults } from '@shared/schema';
import { exportScanResults } from '@/lib/utils';

interface ScanResultsProps {
  scanResults: {
    domain: string;
    scannedAt: string;
    results: DomainScanResults;
  };
}

export default function ScanResults({ scanResults }: ScanResultsProps) {
  const [openSections, setOpenSections] = useState({
    dns: true,
    ssl: false,
    whois: false,
    http: false,
    security: false,
    ports: false,
    technologies: false,
    subdomains: false,
    contentAnalysis: false,
    networkAnalysis: false,
    domainHealth: false,
    enhancedSsl: false,
    malwareAnalysis: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Extract actual results from the response
  const results = scanResults.results;

  if (!results) {
    return (
      <div className="p-6 bg-muted rounded-lg">
        <h3 className="text-lg font-medium">No scan results available</h3>
        <p>The scan results could not be loaded or are not available.</p>
      </div>
    );
  }

  // Calculate security score and general status
  const getSecurityScore = (): number | null => {
    if (!results.security || typeof results.security.score !== 'number') return null;
    return results.security.score;
  };
  
  const securityScore = getSecurityScore();
  
  // Count enabled scan types
  const scanCount = Object.keys(results.options || {}).filter(
    key => results.options && results.options[key as keyof typeof results.options] === true
  ).length;
  
  // Count vulnerabilities 
  const vulnerabilityCount = results.security?.vulnerabilities?.length || 0;
  
  // Determine open ports
  const openPortsCount = results.ports?.filter(port => port.status === 'open').length || 0;
  
  // Get technology count
  const techCount = results.technologies?.length || 0;
  
  // Get security badge info
  const getSecurityBadge = () => {
    if (securityScore === null) return { color: 'bg-slate-100 text-slate-600', text: 'No Security Data' };
    if (securityScore >= 80) return { color: 'bg-green-100 text-green-800', text: 'Secure' };
    if (securityScore >= 60) return { color: 'bg-blue-100 text-blue-800', text: 'Good' };
    if (securityScore >= 40) return { color: 'bg-yellow-100 text-yellow-800', text: 'Fair' };
    return { color: 'bg-red-100 text-red-800', text: 'Poor' };
  };
  
  const securityBadge = getSecurityBadge();

  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{results.domain}</h2>
              <p className="text-slate-500 text-sm mt-1">
                Scanned on {new Date(scanResults.scannedAt).toLocaleString()}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-end sm:items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Download size={16} />
                    Export
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => exportScanResults(scanResults, 'json')}>
                    <FileJson size={16} className="mr-2" />
                    Export as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportScanResults(scanResults, 'csv')}>
                    <FileSpreadsheet size={16} className="mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportScanResults(scanResults, 'pdf')}>
                    <File size={16} className="mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Security score badge */}
              {securityScore !== null && (
                <div className="flex items-center space-x-1">
                  <div className={`${securityBadge.color} py-1 px-3 rounded-full text-sm font-medium`}>
                    {securityBadge.text}
                  </div>
                  <div className="text-2xl font-bold ml-2">{securityScore}<span className="text-slate-400 text-lg">/100</span></div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="p-4 text-center">
            <p className="text-sm font-medium text-slate-500">Scan Types</p>
            <p className="mt-1 text-xl font-semibold">{scanCount}</p>
          </div>
          
          <div className="p-4 text-center">
            <p className="text-sm font-medium text-slate-500">Vulnerabilities</p>
            <p className={`mt-1 text-xl font-semibold ${vulnerabilityCount > 0 ? 'text-orange-600' : 'text-green-600'}`}>
              {vulnerabilityCount}
            </p>
          </div>
          
          <div className="p-4 text-center">
            <p className="text-sm font-medium text-slate-500">Open Ports</p>
            <p className="mt-1 text-xl font-semibold">{openPortsCount}</p>
          </div>
          
          <div className="p-4 text-center">
            <p className="text-sm font-medium text-slate-500">Technologies</p>
            <p className="mt-1 text-xl font-semibold">{techCount}</p>
          </div>
        </div>
      </div>

      {/* Scan Result Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 border-b pb-2">Security Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.security && (
              <div className="md:col-span-2">
                <SecuritySection
                  securityReport={results.security}
                  isOpen={openSections.security}
                  onToggle={() => toggleSection('security')}
                />
              </div>
            )}
            
            {results.ssl && (
              <div>
                <SslCertificateSection 
                  sslCertificate={results.ssl} 
                  isOpen={openSections.ssl}
                  onToggle={() => toggleSection('ssl')}
                />
              </div>
            )}
            
            {results.http && (
              <div>
                <HttpHeadersSection 
                  httpHeaders={results.http} 
                  isOpen={openSections.http}
                  onToggle={() => toggleSection('http')}
                />
              </div>
            )}
            
            {results.ssl && (
              <div>
                <EnhancedSslSection
                  sslCertificate={results.ssl}
                  isOpen={openSections.enhancedSsl}
                  onToggle={() => toggleSection('enhancedSsl')}
                />
              </div>
            )}
            
            {results.malwareAnalysis && (
              <div>
                <MalwareAnalysisSection
                  malwareAnalysis={results.malwareAnalysis}
                  isOpen={openSections.malwareAnalysis}
                  onToggle={() => toggleSection('malwareAnalysis')}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-3">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 border-b pb-2">Domain Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.dns && results.dns.records && (
              <div>
                <DnsRecordsSection 
                  dnsRecords={results.dns.records} 
                  isOpen={openSections.dns}
                  onToggle={() => toggleSection('dns')}
                />
              </div>
            )}
            
            {results.whois && (
              <div>
                <WhoisSection 
                  whoisInfo={results.whois} 
                  isOpen={openSections.whois}
                  onToggle={() => toggleSection('whois')}
                />
              </div>
            )}
            
            {results.domainHealth && (
              <div>
                <DomainHealthSection
                  domainHealth={results.domainHealth}
                  isOpen={openSections.domainHealth}
                  onToggle={() => toggleSection('domainHealth')}
                />
              </div>
            )}
            
            {results.subdomains && results.subdomains.length > 0 && (
              <div>
                <SubdomainsSection
                  subdomains={results.subdomains}
                  isOpen={openSections.subdomains}
                  onToggle={() => toggleSection('subdomains')}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-3">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 border-b pb-2">Server & Technology</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.technologies && results.technologies.length > 0 && (
              <div>
                <TechnologiesSection
                  technologies={results.technologies}
                  isOpen={openSections.technologies}
                  onToggle={() => toggleSection('technologies')}
                />
              </div>
            )}
            
            {results.ports && results.ports.length > 0 && (
              <div>
                <PortsSection
                  ports={results.ports}
                  isOpen={openSections.ports}
                  onToggle={() => toggleSection('ports')}
                />
              </div>
            )}
            
            {results.networkAnalysis && (
              <div>
                <NetworkAnalysisSection
                  networkAnalysis={results.networkAnalysis}
                  isOpen={openSections.networkAnalysis}
                  onToggle={() => toggleSection('networkAnalysis')}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-3">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 border-b pb-2">Content Analysis</h3>
          <div className="grid grid-cols-1 gap-4">
            {results.contentAnalysis && (
              <div>
                <ContentAnalysisSection
                  contentAnalysis={results.contentAnalysis}
                  isOpen={openSections.contentAnalysis}
                  onToggle={() => toggleSection('contentAnalysis')}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {results.error && (
        <div className="p-6 bg-destructive/10 text-destructive rounded-lg">
          <h3 className="text-lg font-medium">Error During Scan</h3>
          <p>{results.error}</p>
        </div>
      )}
    </div>
  );
}
