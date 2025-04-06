import * as dns from 'dns';
import { promisify } from 'util';
import type { DnsRecord } from '@shared/schema';

// Promisify DNS functions
const resolveMx = promisify(dns.resolveMx);
const resolveNs = promisify(dns.resolveNs);
const resolveTxt = promisify(dns.resolveTxt);
const resolve4 = promisify(dns.resolve4);
const resolve6 = promisify(dns.resolve6);
const resolveCname = promisify(dns.resolveCname);
const resolveSoa = promisify(dns.resolveSoa);

export async function scanDNS(domain: string): Promise<DnsRecord[]> {
  const results: DnsRecord[] = [];
  
  try {
    // A records
    try {
      const aRecords = await resolve4(domain);
      for (const record of aRecords) {
        results.push({
          type: 'A',
          name: domain,
          ttl: 3600, // Default TTL since it's not easily accessible
          value: record
        });
      }
    } catch (error) {
      console.log(`No A records found for ${domain}`);
    }
    
    // AAAA records
    try {
      const aaaaRecords = await resolve6(domain);
      for (const record of aaaaRecords) {
        results.push({
          type: 'AAAA',
          name: domain,
          ttl: 3600,
          value: record
        });
      }
    } catch (error) {
      console.log(`No AAAA records found for ${domain}`);
    }
    
    // MX records
    try {
      const mxRecords = await resolveMx(domain);
      for (const record of mxRecords) {
        results.push({
          type: 'MX',
          name: domain,
          ttl: 3600,
          value: `${record.priority} ${record.exchange}`
        });
      }
    } catch (error) {
      console.log(`No MX records found for ${domain}`);
    }
    
    // NS records
    try {
      const nsRecords = await resolveNs(domain);
      for (const record of nsRecords) {
        results.push({
          type: 'NS',
          name: domain,
          ttl: 86400, // NS records typically have longer TTLs
          value: record
        });
      }
    } catch (error) {
      console.log(`No NS records found for ${domain}`);
    }
    
    // TXT records
    try {
      const txtRecords = await resolveTxt(domain);
      for (const record of txtRecords) {
        results.push({
          type: 'TXT',
          name: domain,
          ttl: 3600,
          value: record.join('')
        });
      }
    } catch (error) {
      console.log(`No TXT records found for ${domain}`);
    }
    
    // CNAME records
    try {
      const cnameRecords = await resolveCname(domain);
      for (const record of cnameRecords) {
        results.push({
          type: 'CNAME',
          name: domain,
          ttl: 3600,
          value: record
        });
      }
    } catch (error) {
      console.log(`No CNAME records found for ${domain}`);
    }
    
    // SOA record
    try {
      const soaRecord = await resolveSoa(domain);
      results.push({
        type: 'SOA',
        name: domain,
        ttl: 86400,
        value: `${soaRecord.nsname} ${soaRecord.hostmaster} ${soaRecord.serial} ${soaRecord.refresh} ${soaRecord.retry} ${soaRecord.expire} ${soaRecord.minttl}`
      });
    } catch (error) {
      console.log(`No SOA record found for ${domain}`);
    }
    
    return results;
  } catch (error) {
    console.error(`Error scanning DNS for ${domain}:`, error);
    throw new Error(`DNS scanning failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}