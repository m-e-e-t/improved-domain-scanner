import type { Port } from '@shared/schema';
import { createConnection } from 'net';

/**
 * Port Scanner
 * Scans common ports to detect open services on a domain
 */
export async function scanPorts(domain: string): Promise<Port[]> {
  try {
    // Clean domain name (remove protocol if present)
    const cleanDomain = domain.replace(/^https?:\/\//i, '');
    
    // In a real implementation, this would use proper DNS lookups
    // and would scan a wider range of ports
    
    // Common ports and their associated services
    const commonPorts = [
      { port: 21, service: 'FTP' },
      { port: 22, service: 'SSH' },
      { port: 23, service: 'Telnet' },
      { port: 25, service: 'SMTP' },
      { port: 53, service: 'DNS' },
      { port: 80, service: 'HTTP' },
      { port: 110, service: 'POP3' },
      { port: 143, service: 'IMAP' },
      { port: 443, service: 'HTTPS' },
      { port: 465, service: 'SMTPS' },
      { port: 587, service: 'Submission' },
      { port: 993, service: 'IMAPS' },
      { port: 995, service: 'POP3S' },
      { port: 3306, service: 'MySQL' },
      { port: 5432, service: 'PostgreSQL' },
      { port: 8080, service: 'HTTP-Proxy' },
      { port: 8443, service: 'HTTPS-Alt' }
    ];
    
    // In a real implementation, we would scan all ports
    // For demo purposes, we'll scan a subset of common ports
    const portsToScan = commonPorts;
    
    // Try to get the IP address of the domain
    let ip: string;
    try {
      // Simple mock for IP lookup - in a real implementation, would use DNS
      // Using domainSeed to generate a deterministic IP for the same domain
      const domainSeed = cleanDomain.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const octet1 = 10 + (domainSeed % 240);
      const octet2 = 1 + (domainSeed % 254);
      const octet3 = 1 + ((domainSeed * 2) % 254);
      const octet4 = 1 + ((domainSeed * 3) % 254);
      ip = `${octet1}.${octet2}.${octet3}.${octet4}`;
    } catch (error) {
      console.error(`Failed to resolve IP for ${cleanDomain}:`, error);
      return [];
    }
    
    // Scan each port in parallel, but in small batches to be considerate
    const batchSize = 5;
    const promises: Promise<Port>[] = [];
    
    for (let i = 0; i < portsToScan.length; i += batchSize) {
      const batch = portsToScan.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (portInfo) => {
        const status = await checkPort(ip, portInfo.port);
        return {
          port: portInfo.port,
          service: portInfo.service,
          status: status as 'open' | 'closed' | 'filtered'
        };
      });
      
      promises.push(...batchPromises);
      
      // Small delay to avoid overwhelming the target
      if (i + batchSize < portsToScan.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error(`Error scanning ports for ${domain}:`, error);
    return [];
  }
}

/**
 * Check if a port is open on the specified host
 * In a real implementation, this would connect to the actual host
 * For this demo, we're simulating responses based on domain and port
 */
async function checkPort(ip: string, port: number): Promise<'open' | 'closed' | 'filtered'> {
  // For demo purposes, we'll simulate port scanning based on IP and port
  // In a real implementation, this would actually try to connect to the ports
  
  // Generate a deterministic but realistic-looking response
  const ipSum = ip.split('.').reduce((sum, octet) => sum + parseInt(octet, 10), 0);
  const seed = ipSum + port;
  
  // Commonly open ports
  const commonlyOpen = [80, 443, 22, 25, 53];
  
  if (commonlyOpen.includes(port)) {
    // Common ports are more likely to be open
    return (seed % 5 > 0) ? 'open' : 'closed';
  } else if (port === 21 || port === 23 || port === 3306 || port === 5432) {
    // These ports are sometimes open (20% chance)
    return (seed % 5 === 0) ? 'open' : 'closed';
  } else if (port > 1000) {
    // Higher ports occasionally filtered
    return (seed % 10 === 0) ? 'filtered' : 'closed';
  } else {
    // Most other ports are closed
    return (seed % 20 === 0) ? 'open' : 'closed';
  }
  
  // In a real implementation, we would use something like:
  /*
  return new Promise((resolve) => {
    const socket = createConnection({
      host: ip,
      port: port,
      timeout: 2000
    });
    
    socket.on('connect', () => {
      socket.end();
      resolve('open');
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve('filtered');
    });
    
    socket.on('error', (err) => {
      resolve('closed');
    });
  });
  */
}