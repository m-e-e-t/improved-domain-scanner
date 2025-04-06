import type { 
  DomainScanRequest, 
  DomainScanResults, 
  ScanProgress, 
  DnsRecord, 
  SslCertificate, 
  WhoisInfo, 
  HttpHeaders,
  Port,
  Technology,
  Subdomain,
  SecurityReport,
  ContentAnalysis,
  NetworkAnalysis,
  DomainHealth,
  MalwareAnalysis
} from '@shared/schema';
import { storage } from '../storage';
import { scanDNS } from './scanners/dnsScanner';
import { scanSSL } from './scanners/sslScanner';
import { scanWhois } from './scanners/whoisScanner';
import { scanHttpHeaders } from './scanners/headerScanner';
import { scanPorts } from './scanners/portScanner';
import { detectTechnologies } from './scanners/technologyScanner';
import { findSubdomains } from './scanners/subdomainScanner';
import { scanSecurity } from './scanners/securityScanner';
import { scanContent } from './scanners/contentAnalysisScanner';
import { scanNetwork } from './scanners/networkAnalysisScanner';
import { scanDomainHealth } from './scanners/domainHealthScanner';
import { scanEnhancedSSL } from './scanners/enhancedSslScanner';
import { scanMalware } from './scanners/malwareScanner';

export class DomainScanner {
  private scanQueue: Map<string, Promise<DomainScanResults>>;
  
  // Rate limiting properties
  private rateLimit: number;
  private rateLimitPeriod: number;
  private lastScanTime: Map<string, number>;
  private scanCache: Map<string, {timestamp: string, results: DomainScanResults}>;
  private cacheExpiry: number; // Cache expiry in milliseconds (default: 1 hour)
  
  constructor() {
    this.scanQueue = new Map();
    this.lastScanTime = new Map();
    this.scanCache = new Map();
    this.rateLimit = 5; // Maximum of 5 scans per minute per domain
    this.rateLimitPeriod = 60 * 1000; // 1 minute in milliseconds
    this.cacheExpiry = 60 * 60 * 1000; // 1 hour cache expiry
  }
  
  async scanDomain(request: DomainScanRequest): Promise<DomainScanResults> {
    const { domain, options } = request;
    
    // Clean domain - remove protocol and www if present
    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/i, '');
    
    // Check cache first if we have a recent scan
    const cachedScan = this.scanCache.get(cleanDomain);
    const now = Date.now();
    
    if (cachedScan && now - new Date(cachedScan.timestamp).getTime() < this.cacheExpiry) {
      console.log(`Using cached scan results for ${cleanDomain}`);
      
      // Create a progress object that shows we're using cached results
      const cachedProgress: ScanProgress = {
        domain: cleanDomain,
        status: 'completed',
        progress: {
          dns: options.dns ? 'completed' : 'skipped',
          ssl: options.ssl ? 'completed' : 'skipped',
          whois: options.whois ? 'completed' : 'skipped',
          http: options.http ? 'completed' : 'skipped',
          ports: options.ports ? 'completed' : 'skipped',
          technologies: options.technologies ? 'completed' : 'skipped',
          subdomains: options.subdomains ? 'completed' : 'skipped',
          security: options.security ? 'completed' : 'skipped',
          contentAnalysis: options.contentAnalysis ? 'completed' : 'skipped',
          networkAnalysis: options.networkAnalysis ? 'completed' : 'skipped',
          domainHealth: options.domainHealth ? 'completed' : 'skipped',
          enhancedSsl: options.enhancedSsl ? 'completed' : 'skipped',
          malwareAnalysis: options.malwareAnalysis ? 'completed' : 'skipped',
        },
        percentage: 100,
        cachedResult: true,
        cachedTimestamp: cachedScan.timestamp
      };
      
      await storage.saveScanProgress(cleanDomain, cachedProgress);
      return cachedScan.results;
    }
    
    // Check rate limiting
    if (this.lastScanTime.has(cleanDomain)) {
      const lastScan = this.lastScanTime.get(cleanDomain) || 0;
      const timeSinceLastScan = now - lastScan;
      
      if (timeSinceLastScan < this.rateLimitPeriod) {
        // Update the timestamp for this domain
        this.lastScanTime.set(cleanDomain, now);
        throw new Error(`Rate limit exceeded for ${cleanDomain}. Please try again later.`);
      }
    }
    
    // Update the timestamp for this domain
    this.lastScanTime.set(cleanDomain, now);
    
    // Create initial scan progress and save it
    const initialProgress: ScanProgress = {
      domain: cleanDomain,
      status: 'scanning',
      progress: {
        dns: options.dns ? 'waiting' : 'skipped',
        ssl: options.ssl ? 'waiting' : 'skipped',
        whois: options.whois ? 'waiting' : 'skipped',
        http: options.http ? 'waiting' : 'skipped',
        ports: options.ports ? 'waiting' : 'skipped',
        technologies: options.technologies ? 'waiting' : 'skipped',
        subdomains: options.subdomains ? 'waiting' : 'skipped',
        security: options.security ? 'waiting' : 'skipped',
        contentAnalysis: options.contentAnalysis ? 'waiting' : 'skipped',
        networkAnalysis: options.networkAnalysis ? 'waiting' : 'skipped',
        domainHealth: options.domainHealth ? 'waiting' : 'skipped',
        enhancedSsl: options.enhancedSsl ? 'waiting' : 'skipped',
        malwareAnalysis: options.malwareAnalysis ? 'waiting' : 'skipped',
      },
      percentage: 0
    };
    
    await storage.saveScanProgress(cleanDomain, initialProgress);
    
    // Return immediately if this domain is already being scanned
    if (this.scanQueue.has(cleanDomain)) {
      return this.scanQueue.get(cleanDomain) as Promise<DomainScanResults>;
    }
    
    // Start scan and add to queue
    const scanPromise = this.performScan(cleanDomain, options);
    this.scanQueue.set(cleanDomain, scanPromise);
    
    // Remove from queue after completion
    scanPromise.finally(() => {
      this.scanQueue.delete(cleanDomain);
    });
    
    // Save results to cache after completion
    scanPromise.then(results => {
      this.scanCache.set(cleanDomain, {
        timestamp: new Date().toISOString(),
        results
      });
    });
    
    return scanPromise;
  }
  
  private async performScan(domain: string, options: DomainScanRequest['options']): Promise<DomainScanResults> {
    console.log(`Starting scan for domain: ${domain}`);
    
    // Initialize results object
    const results: DomainScanResults = {
      domain,
      timestamp: new Date().toISOString(),
      options,
      dns: { records: [] },
      ssl: null,
      whois: null,
      http: null,
      ports: null,
      technologies: null,
      subdomains: null,
      security: null,
      contentAnalysis: null,
      networkAnalysis: null,
      domainHealth: null,
      malwareAnalysis: null,
      error: null
    };
    
    try {
      // Run selected scans in parallel
      const scanPromises: Promise<void>[] = [];
      
      // DNS scan
      if (options.dns) {
        scanPromises.push(
          (async () => {
            await this.updateProgress(domain, 'dns', 'scanning');
            try {
              results.dns.records = await scanDNS(domain);
              await this.updateProgress(domain, 'dns', 'completed');
            } catch (error) {
              console.error('DNS scan error:', error);
              await this.updateProgress(domain, 'dns', 'failed');
            }
          })()
        );
      }
      
      // SSL scan
      if (options.ssl) {
        scanPromises.push(
          (async () => {
            await this.updateProgress(domain, 'ssl', 'scanning');
            try {
              results.ssl = await scanSSL(domain);
              await this.updateProgress(domain, 'ssl', 'completed');
            } catch (error) {
              console.error('SSL scan error:', error);
              await this.updateProgress(domain, 'ssl', 'failed');
            }
          })()
        );
      }
      
      // WHOIS scan
      if (options.whois) {
        scanPromises.push(
          (async () => {
            await this.updateProgress(domain, 'whois', 'scanning');
            try {
              results.whois = await scanWhois(domain);
              await this.updateProgress(domain, 'whois', 'completed');
            } catch (error) {
              console.error('WHOIS scan error:', error);
              await this.updateProgress(domain, 'whois', 'failed');
            }
          })()
        );
      }
      
      // HTTP Headers scan
      if (options.http) {
        scanPromises.push(
          (async () => {
            await this.updateProgress(domain, 'http', 'scanning');
            try {
              results.http = await scanHttpHeaders(domain);
              await this.updateProgress(domain, 'http', 'completed');
            } catch (error) {
              console.error('HTTP Headers scan error:', error);
              await this.updateProgress(domain, 'http', 'failed');
            }
          })()
        );
      }
      
      // Port scanning
      if (options.ports) {
        scanPromises.push(
          (async () => {
            await this.updateProgress(domain, 'ports', 'scanning');
            try {
              results.ports = await scanPorts(domain);
              await this.updateProgress(domain, 'ports', 'completed');
            } catch (error) {
              console.error('Port scan error:', error);
              await this.updateProgress(domain, 'ports', 'failed');
            }
          })()
        );
      }
      
      // Technology detection
      if (options.technologies) {
        scanPromises.push(
          (async () => {
            await this.updateProgress(domain, 'technologies', 'scanning');
            try {
              results.technologies = await detectTechnologies(domain);
              await this.updateProgress(domain, 'technologies', 'completed');
            } catch (error) {
              console.error('Technology detection error:', error);
              await this.updateProgress(domain, 'technologies', 'failed');
            }
          })()
        );
      }
      
      // Subdomain discovery
      if (options.subdomains) {
        scanPromises.push(
          (async () => {
            await this.updateProgress(domain, 'subdomains', 'scanning');
            try {
              results.subdomains = await findSubdomains(domain);
              await this.updateProgress(domain, 'subdomains', 'completed');
            } catch (error) {
              console.error('Subdomain discovery error:', error);
              await this.updateProgress(domain, 'subdomains', 'failed');
            }
          })()
        );
      }
      
      // Security scanning
      if (options.security) {
        scanPromises.push(
          (async () => {
            await this.updateProgress(domain, 'security', 'scanning');
            try {
              results.security = await scanSecurity(domain);
              await this.updateProgress(domain, 'security', 'completed');
            } catch (error) {
              console.error('Security scan error:', error);
              await this.updateProgress(domain, 'security', 'failed');
            }
          })()
        );
      }
      
      // Content Analysis
      if (options.contentAnalysis) {
        scanPromises.push(
          (async () => {
            await this.updateProgress(domain, 'contentAnalysis', 'scanning');
            try {
              results.contentAnalysis = await scanContent(domain);
              await this.updateProgress(domain, 'contentAnalysis', 'completed');
            } catch (error) {
              console.error('Content analysis error:', error);
              await this.updateProgress(domain, 'contentAnalysis', 'failed');
            }
          })()
        );
      }
      
      // Network Analysis
      if (options.networkAnalysis) {
        scanPromises.push(
          (async () => {
            await this.updateProgress(domain, 'networkAnalysis', 'scanning');
            try {
              results.networkAnalysis = await scanNetwork(domain);
              await this.updateProgress(domain, 'networkAnalysis', 'completed');
            } catch (error) {
              console.error('Network analysis error:', error);
              await this.updateProgress(domain, 'networkAnalysis', 'failed');
            }
          })()
        );
      }
      
      // Domain Health Monitoring
      if (options.domainHealth) {
        scanPromises.push(
          (async () => {
            await this.updateProgress(domain, 'domainHealth', 'scanning');
            try {
              results.domainHealth = await scanDomainHealth(domain);
              await this.updateProgress(domain, 'domainHealth', 'completed');
            } catch (error) {
              console.error('Domain health scan error:', error);
              await this.updateProgress(domain, 'domainHealth', 'failed');
            }
          })()
        );
      }
      
      // Enhanced SSL Analysis
      if (options.enhancedSsl) {
        scanPromises.push(
          (async () => {
            await this.updateProgress(domain, 'enhancedSsl', 'scanning');
            try {
              // If basic SSL scan is enabled, use the enhanced scanner in place of the basic one
              if (options.ssl) {
                results.ssl = await scanEnhancedSSL(domain);
              } else {
                // If basic SSL scan is not enabled, run the enhanced scanner separately
                const enhancedSslResult = await scanEnhancedSSL(domain);
                if (enhancedSslResult) {
                  results.ssl = enhancedSslResult;
                }
              }
              await this.updateProgress(domain, 'enhancedSsl', 'completed');
            } catch (error) {
              console.error('Enhanced SSL scan error:', error);
              await this.updateProgress(domain, 'enhancedSsl', 'failed');
            }
          })()
        );
      }
      
      // Malware Analysis
      if (options.malwareAnalysis) {
        scanPromises.push(
          (async () => {
            await this.updateProgress(domain, 'malwareAnalysis', 'scanning');
            try {
              results.malwareAnalysis = await scanMalware(domain);
              await this.updateProgress(domain, 'malwareAnalysis', 'completed');
            } catch (error) {
              console.error('Malware analysis error:', error);
              await this.updateProgress(domain, 'malwareAnalysis', 'failed');
            }
          })()
        );
      }
      
      // Wait for all scans to complete
      await Promise.all(scanPromises);
      
      // Save completed scan to storage
      await storage.saveDomainScan({
        domain,
        results: JSON.stringify(results)
      });
      
      // Update scan progress to completed
      const completedProgress: ScanProgress = {
        domain,
        status: 'completed',
        progress: {
          dns: options.dns ? 'completed' : 'skipped',
          ssl: options.ssl ? 'completed' : 'skipped',
          whois: options.whois ? 'completed' : 'skipped',
          http: options.http ? 'completed' : 'skipped',
          ports: options.ports ? 'completed' : 'skipped',
          technologies: options.technologies ? 'completed' : 'skipped',
          subdomains: options.subdomains ? 'completed' : 'skipped',
          security: options.security ? 'completed' : 'skipped',
          contentAnalysis: options.contentAnalysis ? 'completed' : 'skipped',
          networkAnalysis: options.networkAnalysis ? 'completed' : 'skipped',
          domainHealth: options.domainHealth ? 'completed' : 'skipped',
          enhancedSsl: options.enhancedSsl ? 'completed' : 'skipped',
          malwareAnalysis: options.malwareAnalysis ? 'completed' : 'skipped',
        },
        percentage: 100
      };
      
      await storage.saveScanProgress(domain, completedProgress);
      
      return results;
    } catch (error) {
      console.error(`Error during domain scan for ${domain}:`, error);
      
      // Update scan progress to failed
      results.error = (error instanceof Error) ? error.message : String(error);
      
      const failedProgress: ScanProgress = {
        domain,
        status: 'failed',
        progress: {
          dns: options.dns ? 'failed' : 'skipped',
          ssl: options.ssl ? 'failed' : 'skipped',
          whois: options.whois ? 'failed' : 'skipped',
          http: options.http ? 'failed' : 'skipped',
          ports: options.ports ? 'failed' : 'skipped',
          technologies: options.technologies ? 'failed' : 'skipped',
          subdomains: options.subdomains ? 'failed' : 'skipped',
          security: options.security ? 'failed' : 'skipped',
          contentAnalysis: options.contentAnalysis ? 'failed' : 'skipped',
          networkAnalysis: options.networkAnalysis ? 'failed' : 'skipped',
          domainHealth: options.domainHealth ? 'failed' : 'skipped',
          enhancedSsl: options.enhancedSsl ? 'failed' : 'skipped',
          malwareAnalysis: options.malwareAnalysis ? 'failed' : 'skipped',
        },
        percentage: 0,
        error: results.error
      };
      
      await storage.saveScanProgress(domain, failedProgress);
      
      return results;
    }
  }
  
  // Helper method to update scan progress
  async updateProgress(domain: string, scanType: keyof ScanProgress['progress'], status: 'waiting' | 'scanning' | 'completed' | 'failed'): Promise<void> {
    // Get current progress
    const currentProgress = await storage.getScanProgress(domain);
    
    if (!currentProgress) return;
    
    // Update the specified scan type
    currentProgress.progress[scanType] = status;
    
    // Calculate new percentage
    const scanTypes = [
      'dns', 'ssl', 'whois', 'http', 'ports', 'technologies', 'subdomains', 'security',
      'contentAnalysis', 'networkAnalysis', 'domainHealth', 'enhancedSsl', 'malwareAnalysis'
    ];
    const enabledScanTypes = scanTypes.filter(type => 
      currentProgress.progress[type as keyof ScanProgress['progress']] !== 'skipped'
    );
    
    if (enabledScanTypes.length === 0) {
      currentProgress.percentage = 100;
    } else {
      const completedScans = enabledScanTypes.filter(type => 
        currentProgress.progress[type as keyof ScanProgress['progress']] === 'completed'
      ).length;
      
      currentProgress.percentage = Math.floor((completedScans / enabledScanTypes.length) * 100);
    }
    
    // Update overall status if all scans are completed or any scan failed
    if (enabledScanTypes.every(type => 
      ['completed', 'failed', 'skipped'].includes(currentProgress.progress[type as keyof ScanProgress['progress']] as string)
    )) {
      if (enabledScanTypes.some(type => 
        currentProgress.progress[type as keyof ScanProgress['progress']] === 'failed'
      )) {
        currentProgress.status = 'failed';
      } else {
        currentProgress.status = 'completed';
      }
    }
    
    // Save updated progress
    await storage.saveScanProgress(domain, currentProgress);
  }
  
  // Method to get current scan progress
  async getScanProgress(domain: string): Promise<ScanProgress | undefined> {
    return storage.getScanProgress(domain);
  }
  
  // Method to scan multiple domains (for batch scanning)
  async scanMultipleDomains(domains: string[], options: DomainScanRequest['options']): Promise<string[]> {
    // Queue up all domain scans and return list of domains being scanned
    const scanPromises = domains.map(domain => {
      return this.scanDomain({ domain, options });
    });
    
    // Start all scans but don't wait for completion
    Promise.all(scanPromises).catch(error => {
      console.error('Error in batch domain scan:', error);
    });
    
    // Return list of domains that were queued for scanning
    return domains;
  }
}

// Export singleton instance
export const domainScanner = new DomainScanner();