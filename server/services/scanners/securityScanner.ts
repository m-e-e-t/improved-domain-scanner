import { SecurityReport, SecurityFinding, SecurityVulnerability } from '@shared/schema';
import { scanDNS } from './dnsScanner';
import { scanHttpHeaders } from './headerScanner';

/**
 * Security vulnerability scanner for domains
 * Checks for common security issues like:
 * - SPF records
 * - DMARC records
 * - DNSSEC implementation
 * - Exposed sensitive files
 * - Missing security headers
 */
export async function scanSecurity(domain: string): Promise<SecurityReport> {
  console.log(`Starting security scan for ${domain}`);
  
  const findings: SecurityFinding[] = [];
  const vulnerabilities: SecurityVulnerability[] = [];
  const recommendations: string[] = [];
  
  try {
    // Check DNS security (SPF, DMARC, DNSSEC)
    const dnsSecurityFindings = await checkDNSSecurity(domain);
    findings.push(...dnsSecurityFindings);
    
    // Check for security headers
    const headerFindings = await checkSecurityHeaders(domain);
    findings.push(...headerFindings);
    
    // Check for exposed sensitive files/directories
    const exposedPathFindings = await checkExposedPaths(domain);
    findings.push(...exposedPathFindings);

    // Generate vulnerabilities list from critical findings
    vulnerabilities.push(...generateVulnerabilities(findings));
    
    // Generate recommendations based on findings
    recommendations.push(...generateRecommendations(findings));
    
    // Calculate security score (0-100)
    const score = calculateSecurityScore(findings);
    
    return {
      score,
      findings,
      vulnerabilities,
      recommendations
    };
  } catch (error) {
    console.error(`Error during security scan for ${domain}:`, error);
    
    // Return a basic report with error information
    return {
      score: 0,
      findings: [{
        type: 'error',
        status: 'error',
        message: 'Security scan failed',
        details: error instanceof Error ? error.message : String(error)
      }],
      vulnerabilities: [],
      recommendations: ['Retry the security scan']
    };
  }
}

/**
 * Check DNS-related security measures
 */
async function checkDNSSecurity(domain: string): Promise<SecurityFinding[]> {
  const findings: SecurityFinding[] = [];
  
  try {
    // Get all DNS records
    const dnsRecords = await scanDNS(domain);
    
    // Check for SPF record
    const hasSPF = dnsRecords.some(record => 
      record.type === 'TXT' && record.value.toLowerCase().includes('v=spf1')
    );
    
    if (!hasSPF) {
      findings.push({
        type: 'dns-spf',
        status: 'warning',
        message: 'Missing SPF record',
        details: 'SPF records help prevent email spoofing. We recommend adding an SPF record to your domain.'
      });
    } else {
      findings.push({
        type: 'dns-spf',
        status: 'secure',
        message: 'SPF record found',
        details: 'Your domain has an SPF record which helps prevent email spoofing.'
      });
    }
    
    // Check for DMARC record
    const hasDMARC = dnsRecords.some(record => 
      record.type === 'TXT' && record.name.toLowerCase().includes('_dmarc.') && record.value.toLowerCase().includes('v=dmarc1')
    );
    
    if (!hasDMARC) {
      findings.push({
        type: 'dns-dmarc',
        status: 'warning',
        message: 'Missing DMARC record',
        details: 'DMARC records help prevent email spoofing and phishing. We recommend adding a DMARC record to your domain.'
      });
    } else {
      findings.push({
        type: 'dns-dmarc',
        status: 'secure',
        message: 'DMARC record found',
        details: 'Your domain has a DMARC record which helps prevent email spoofing and phishing.'
      });
    }
    
    // Check for DNSSEC
    const hasDNSSEC = dnsRecords.some(record => 
      record.type === 'DS' || (record.type === 'TXT' && record.value.toLowerCase().includes('dnssec'))
    );
    
    if (!hasDNSSEC) {
      findings.push({
        type: 'dns-dnssec',
        status: 'warning',
        message: 'DNSSEC not detected',
        details: 'DNSSEC helps prevent DNS spoofing attacks. Consider implementing DNSSEC for your domain.'
      });
    } else {
      findings.push({
        type: 'dns-dnssec',
        status: 'secure',
        message: 'DNSSEC detected',
        details: 'Your domain has DNSSEC which helps prevent DNS spoofing attacks.'
      });
    }
    
    // Check for CAA record
    const hasCAA = dnsRecords.some(record => record.type === 'CAA');
    
    if (!hasCAA) {
      findings.push({
        type: 'dns-caa',
        status: 'warning',
        message: 'Missing CAA record',
        details: 'CAA records specify which certificate authorities can issue certificates for your domain. Consider adding a CAA record.'
      });
    } else {
      findings.push({
        type: 'dns-caa',
        status: 'secure',
        message: 'CAA record found',
        details: 'Your domain has a CAA record which controls which certificate authorities can issue certificates for your domain.'
      });
    }
    
    return findings;
  } catch (error) {
    console.error('Error checking DNS security:', error);
    
    return [{
      type: 'dns-security',
      status: 'error',
      message: 'Error checking DNS security',
      details: error instanceof Error ? error.message : String(error)
    }];
  }
}

/**
 * Check for missing or misconfigured security headers
 */
async function checkSecurityHeaders(domain: string): Promise<SecurityFinding[]> {
  const findings: SecurityFinding[] = [];
  
  try {
    // Scan HTTP headers
    const headerScan = await scanHttpHeaders(domain);
    
    // Extract security headers and their status
    const securityHeaders = headerScan.securityHeaders;
    
    // Check for Content-Security-Policy
    const cspHeader = securityHeaders.find(h => h.name.toLowerCase() === 'content-security-policy');
    if (!cspHeader) {
      findings.push({
        type: 'header-csp',
        status: 'warning',
        message: 'Missing Content-Security-Policy header',
        details: 'Content-Security-Policy helps prevent XSS attacks by specifying which resources can be loaded.'
      });
    } else {
      findings.push({
        type: 'header-csp',
        status: 'secure',
        message: 'Content-Security-Policy header found',
        details: 'Content-Security-Policy is implemented which helps prevent XSS attacks.'
      });
    }
    
    // Check for Strict-Transport-Security (HSTS)
    const hstsHeader = securityHeaders.find(h => h.name.toLowerCase() === 'strict-transport-security');
    if (!hstsHeader) {
      findings.push({
        type: 'header-hsts',
        status: 'warning',
        message: 'Missing Strict-Transport-Security header',
        details: 'HSTS ensures that browsers always use HTTPS for your domain.'
      });
    } else {
      findings.push({
        type: 'header-hsts',
        status: 'secure',
        message: 'Strict-Transport-Security header found',
        details: 'HSTS is implemented which ensures browsers always use HTTPS for your domain.'
      });
    }
    
    // Check for X-Content-Type-Options
    const xctoHeader = securityHeaders.find(h => h.name.toLowerCase() === 'x-content-type-options');
    if (!xctoHeader) {
      findings.push({
        type: 'header-xcto',
        status: 'warning',
        message: 'Missing X-Content-Type-Options header',
        details: 'X-Content-Type-Options prevents MIME-type sniffing attacks.'
      });
    } else {
      findings.push({
        type: 'header-xcto',
        status: 'secure',
        message: 'X-Content-Type-Options header found',
        details: 'X-Content-Type-Options is implemented which prevents MIME-type sniffing attacks.'
      });
    }
    
    // Check for X-Frame-Options
    const xfoHeader = securityHeaders.find(h => h.name.toLowerCase() === 'x-frame-options');
    if (!xfoHeader) {
      findings.push({
        type: 'header-xfo',
        status: 'warning',
        message: 'Missing X-Frame-Options header',
        details: 'X-Frame-Options prevents clickjacking attacks by controlling if a page can be displayed in frames.'
      });
    } else {
      findings.push({
        type: 'header-xfo',
        status: 'secure',
        message: 'X-Frame-Options header found',
        details: 'X-Frame-Options is implemented which prevents clickjacking attacks.'
      });
    }
    
    // Check for Referrer-Policy
    const rpHeader = securityHeaders.find(h => h.name.toLowerCase() === 'referrer-policy');
    if (!rpHeader) {
      findings.push({
        type: 'header-rp',
        status: 'warning',
        message: 'Missing Referrer-Policy header',
        details: 'Referrer-Policy controls what information is included in the Referer header.'
      });
    } else {
      findings.push({
        type: 'header-rp',
        status: 'secure',
        message: 'Referrer-Policy header found',
        details: 'Referrer-Policy is implemented which controls what information is included in the Referer header.'
      });
    }
    
    return findings;
  } catch (error) {
    console.error('Error checking security headers:', error);
    
    return [{
      type: 'header-security',
      status: 'error',
      message: 'Error checking security headers',
      details: error instanceof Error ? error.message : String(error)
    }];
  }
}

/**
 * Check for exposed sensitive files and directories
 */
async function checkExposedPaths(domain: string): Promise<SecurityFinding[]> {
  const findings: SecurityFinding[] = [];
  
  // List of potentially sensitive files/paths to check
  const sensitivePaths = [
    '/.git/',
    '/.env',
    '/wp-config.php',
    '/phpinfo.php',
    '/server-status',
    '/config.yml',
    '/backup.sql',
    '/.htpasswd',
    '/robots.txt'
  ];
  
  try {
    const exposedPaths: string[] = [];
    
    // For each path, check if it exists
    for (const path of sensitivePaths) {
      try {
        const url = `https://${domain}${path}`;
        const response = await fetch(url, { 
          method: 'HEAD',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        // If the server responds with 200 OK, the path exists
        if (response.status === 200) {
          exposedPaths.push(path);
        }
      } catch (error) {
        // Ignore fetch errors for individual paths
        console.log(`Error checking ${path}:`, error);
      }
    }
    
    // Generate findings based on exposed paths
    if (exposedPaths.length > 0) {
      findings.push({
        type: 'exposed-paths',
        status: 'critical',
        message: `Exposed sensitive files or directories: ${exposedPaths.join(', ')}`,
        details: 'These files/directories can leak sensitive information or provide attackers with useful information.'
      });
    } else {
      findings.push({
        type: 'exposed-paths',
        status: 'secure',
        message: 'No exposed sensitive files or directories found',
        details: 'We did not find any common sensitive files or directories exposed on your server.'
      });
    }
    
    return findings;
  } catch (error) {
    console.error('Error checking exposed paths:', error);
    
    return [{
      type: 'exposed-paths',
      status: 'error',
      message: 'Error checking for exposed sensitive files',
      details: error instanceof Error ? error.message : String(error)
    }];
  }
}

/**
 * Convert security findings to vulnerability objects
 */
function generateVulnerabilities(findings: SecurityFinding[]): SecurityVulnerability[] {
  const vulnerabilities: SecurityVulnerability[] = [];
  
  // Look for critical and warning findings
  for (const finding of findings) {
    if (finding.status === 'critical') {
      vulnerabilities.push({
        name: finding.type,
        description: finding.message,
        severity: 'high',
        details: finding.details
      });
    } else if (finding.status === 'warning') {
      vulnerabilities.push({
        name: finding.type,
        description: finding.message,
        severity: 'medium',
        details: finding.details
      });
    }
  }
  
  return vulnerabilities;
}

/**
 * Generate recommendations based on findings
 */
function generateRecommendations(findings: SecurityFinding[]): string[] {
  const recommendations: string[] = [];
  
  // DNS recommendations
  if (findings.some(f => f.type === 'dns-spf' && f.status === 'warning')) {
    recommendations.push('Implement an SPF record to prevent email spoofing');
  }
  
  if (findings.some(f => f.type === 'dns-dmarc' && f.status === 'warning')) {
    recommendations.push('Implement a DMARC record to prevent email spoofing and improve email deliverability');
  }
  
  if (findings.some(f => f.type === 'dns-dnssec' && f.status === 'warning')) {
    recommendations.push('Implement DNSSEC to prevent DNS spoofing attacks');
  }
  
  if (findings.some(f => f.type === 'dns-caa' && f.status === 'warning')) {
    recommendations.push('Add a CAA DNS record to control which certificate authorities can issue certificates for your domain');
  }
  
  // Header recommendations
  if (findings.some(f => f.type === 'header-csp' && f.status === 'warning')) {
    recommendations.push('Implement Content-Security-Policy header to prevent XSS attacks');
  }
  
  if (findings.some(f => f.type === 'header-hsts' && f.status === 'warning')) {
    recommendations.push('Add Strict-Transport-Security header to ensure HTTPS is always used');
  }
  
  if (findings.some(f => f.type === 'header-xcto' && f.status === 'warning')) {
    recommendations.push('Add X-Content-Type-Options header to prevent MIME-type sniffing attacks');
  }
  
  if (findings.some(f => f.type === 'header-xfo' && f.status === 'warning')) {
    recommendations.push('Add X-Frame-Options header to prevent clickjacking attacks');
  }
  
  // Exposed paths
  if (findings.some(f => f.type === 'exposed-paths' && f.status === 'critical')) {
    recommendations.push('Restrict access to sensitive files and directories that are currently publicly accessible');
  }
  
  return recommendations;
}

/**
 * Calculate a security score (0-100) based on findings
 */
function calculateSecurityScore(findings: SecurityFinding[]): number {
  // Count findings by status
  const criticalCount = findings.filter(f => f.status === 'critical').length;
  const warningCount = findings.filter(f => f.status === 'warning').length;
  const secureCount = findings.filter(f => f.status === 'secure').length;
  const errorCount = findings.filter(f => f.status === 'error').length;
  
  // If we have errors, reduce the maximum possible score
  const totalChecks = findings.length - errorCount;
  
  if (totalChecks === 0) {
    return 0; // All checks failed with errors
  }
  
  // Calculate score - each critical finding reduces score by 15 points
  // each warning reduces by 5 points
  let score = 100;
  score -= criticalCount * 15;
  score -= warningCount * 5;
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
}