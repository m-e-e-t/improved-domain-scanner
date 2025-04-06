import sslChecker from 'ssl-checker';
import type { SslCertificate } from '@shared/schema';

// Define a type for SSL checker result
interface SSLCheckerResult {
  valid: boolean;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  validFor?: string[];
  issuer?: string;
  algorithm?: string;
  selfSigned?: boolean;
  altNames?: string[];
}

export async function scanSSL(domain: string): Promise<SslCertificate> {
  try {
    // Strip protocol if present
    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/i, '');
    
    // Cast the result to our interface
    const result = await sslChecker(cleanDomain) as unknown as SSLCheckerResult;
    
    return {
      isValid: result.valid,
      issuer: result.issuer || 'Unknown',
      subject: domain,
      validFrom: result.validFrom,
      validTo: result.validTo,
      algorithm: result.algorithm || 'Unknown',
      domainNameMatch: result.valid, // assume valid cert matches domain
      trustedIssuer: result.selfSigned !== undefined ? !result.selfSigned : true,
      daysToExpiration: result.daysRemaining,
      alternativeNames: result.altNames || result.validFor || [],
    };
  } catch (error) {
    console.error(`Error scanning SSL for ${domain}:`, error);
    // Return a certificate indicating failure
    return {
      isValid: false,
      issuer: 'Unknown',
      subject: domain,
      validFrom: new Date().toISOString(),
      validTo: new Date().toISOString(),
      algorithm: 'Unknown',
      domainNameMatch: false,
      trustedIssuer: false,
      daysToExpiration: 0,
      alternativeNames: [],
    };
  }
}