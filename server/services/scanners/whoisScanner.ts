import whois from 'whois';
import { promisify } from 'util';
import type { WhoisInfo } from '@shared/schema';

const lookupWhois = promisify(whois.lookup);

export async function scanWhois(domain: string): Promise<WhoisInfo> {
  try {
    // Strip protocol if present
    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/i, '');
    
    const whoisData = await lookupWhois(cleanDomain);
    
    // Parse the raw whois data
    const domainName = extractValue(whoisData, 'Domain Name');
    const registryDomainId = extractValue(whoisData, 'Registry Domain ID');
    const creationDate = extractDate(whoisData, 'Creation Date');
    const updatedDate = extractDate(whoisData, 'Updated Date');
    const expirationDate = extractDate(whoisData, 'Expiration Date') || 
                          extractDate(whoisData, 'Registry Expiry Date');
    
    // Extract status codes
    const statusRegex = /Status:\s*([a-zA-Z0-9\s\-]+)/g;
    const statusMatches = [...whoisData.matchAll(statusRegex)];
    const status = statusMatches.map(match => match[1].trim());
    
    // Extract registrar information
    const registrarName = extractValue(whoisData, 'Registrar');
    const registrarIanaId = extractValue(whoisData, 'Registrar IANA ID');
    const abuseEmail = extractValue(whoisData, 'Registrar Abuse Contact Email');
    const abusePhone = extractValue(whoisData, 'Registrar Abuse Contact Phone');
    
    // Extract nameservers
    const nameserverRegex = /Name Server:\s*([a-zA-Z0-9.\-]+)/gi;
    const nameserverMatches = [...whoisData.matchAll(nameserverRegex)];
    const nameServers = nameserverMatches.map(match => match[1].trim());
    
    // Detect privacy status
    const hasPrivacy = whoisData.toLowerCase().includes('privacy') || 
                        whoisData.toLowerCase().includes('private registration') ||
                        whoisData.toLowerCase().includes('redacted');
    
    return {
      domainName: domainName || cleanDomain,
      registryDomainId: registryDomainId || 'Unknown',
      creationDate: creationDate || new Date().toISOString(),
      updatedDate: updatedDate || new Date().toISOString(),
      expirationDate: expirationDate || new Date().toISOString(),
      status: status.length > 0 ? status : ['Unknown'],
      registrar: {
        name: registrarName || 'Unknown',
        ianaId: registrarIanaId || 'Unknown',
        abuseContactEmail: abuseEmail || 'Unknown',
        abuseContactPhone: abusePhone || 'Unknown'
      },
      nameServers: nameServers.length > 0 ? nameServers : ['Unknown'],
      hasPrivacy
    };
  } catch (error) {
    console.error(`Error scanning WHOIS for ${domain}:`, error);
    // Return minimal whois info in case of error
    return {
      domainName: domain,
      registryDomainId: 'Unknown',
      creationDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      expirationDate: new Date().toISOString(),
      status: ['Error fetching WHOIS data'],
      registrar: {
        name: 'Unknown',
        ianaId: 'Unknown',
        abuseContactEmail: 'Unknown',
        abuseContactPhone: 'Unknown'
      },
      nameServers: ['Unknown'],
      hasPrivacy: false
    };
  }
}

// Helper function to extract values from WHOIS data
function extractValue(data: string, field: string): string | null {
  const regex = new RegExp(`${field}:\\s*([^\\n]+)`, 'i');
  const match = data.match(regex);
  return match ? match[1].trim() : null;
}

// Helper function to extract and parse dates from WHOIS data
function extractDate(data: string, field: string): string | null {
  const value = extractValue(data, field);
  if (!value) return null;
  
  try {
    // Attempt to parse the date string
    const date = new Date(value);
    
    // Check if the date is valid
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
    return null;
  } catch (e) {
    return null;
  }
}