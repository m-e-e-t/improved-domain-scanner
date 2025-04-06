import fetch, { RequestInit, Response as FetchResponse, Headers as FetchHeaders } from 'node-fetch';
import type { HttpHeaders, HttpHeader } from '@shared/schema';

// Define security headers to check for
const SECURITY_HEADERS = [
  { name: 'Strict-Transport-Security', status: 'missing' as const },
  { name: 'Content-Security-Policy', status: 'missing' as const },
  { name: 'X-Content-Type-Options', status: 'missing' as const },
  { name: 'X-Frame-Options', status: 'missing' as const },
  { name: 'X-XSS-Protection', status: 'missing' as const },
  { name: 'Referrer-Policy', status: 'missing' as const },
  { name: 'Permissions-Policy', status: 'missing' as const },
  { name: 'Cache-Control', status: 'missing' as const },
  { name: 'Clear-Site-Data', status: 'missing' as const },
  { name: 'Cross-Origin-Embedder-Policy', status: 'missing' as const },
  { name: 'Cross-Origin-Opener-Policy', status: 'missing' as const },
  { name: 'Cross-Origin-Resource-Policy', status: 'missing' as const }
];

// Custom options for fetch with timeout
interface ExtendedRequestInit extends RequestInit {
  timeout?: number;
}

// Add type declarations for node-fetch Headers
interface RawHeaders {
  [key: string]: string[];
}

// Extend FetchHeaders with raw method
interface ExtendedHeaders extends FetchHeaders {
  raw(): RawHeaders;
}

// Create a fetch with timeout function
async function fetchWithTimeout(url: string, options: ExtendedRequestInit = {}): Promise<FetchResponse> {
  const { timeout = 10000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal
    });
    
    return response;
  } finally {
    clearTimeout(id);
  }
}

export async function scanHttpHeaders(domain: string): Promise<HttpHeaders> {
  try {
    // Ensure domain has http/https
    const url = domain.startsWith('http') ? domain : `https://${domain}`;
    
    // Fetch headers
    const response = await fetchWithTimeout(url, {
      method: 'HEAD',
      headers: { 'User-Agent': 'Mozilla/5.0 Domain Scanner' },
      timeout: 10000
    });
    
    // Manually create a headers object - node-fetch doesn't have raw()
    const headers: RawHeaders = {};
    response.headers.forEach((value, key) => {
      headers[key] = [value];
    });
    
    // Format all headers for display
    const allHeaders = Object.entries(headers)
      .map(([key, values]) => `${key}: ${values.join(', ')}`)
      .join('\n');
    
    // Check for security headers
    const securityHeadersInfo: HttpHeader[] = SECURITY_HEADERS.map(header => {
      const headerValue = headers[header.name.toLowerCase()];
      
      return {
        name: header.name,
        value: headerValue ? headerValue.join(', ') : 'Not implemented',
        status: headerValue ? 'implemented' : 'missing'
      };
    });
    
    // Calculate security grade
    const implementedCount = securityHeadersInfo.filter(h => h.status === 'implemented').length;
    const totalHeaders = SECURITY_HEADERS.length;
    const percentage = Math.floor((implementedCount / totalHeaders) * 100);
    
    // Determine grade based on percentage
    let grade: string;
    if (percentage >= 90) grade = 'A';
    else if (percentage >= 80) grade = 'B';
    else if (percentage >= 70) grade = 'C';
    else if (percentage >= 60) grade = 'D';
    else grade = 'F';
    
    // Generate recommendations
    const recommendations = securityHeadersInfo
      .filter(h => h.status === 'missing')
      .map(h => {
        let severity: 'high' | 'medium' | 'low';
        
        // Determine severity based on header
        if (['Strict-Transport-Security', 'Content-Security-Policy'].includes(h.name)) {
          severity = 'high';
        } else if (['X-Content-Type-Options', 'X-Frame-Options', 'X-XSS-Protection'].includes(h.name)) {
          severity = 'medium';
        } else {
          severity = 'low';
        }
        
        return {
          severity,
          message: `Implement ${h.name} header to improve security`
        };
      });
    
    return {
      securityHeaders: securityHeadersInfo,
      generalHeaders: allHeaders,
      securityGrade: {
        grade: `${grade} (${percentage}%)`,
        description: getGradeDescription(grade),
        recommendations
      }
    };
    
  } catch (error) {
    console.error(`Error scanning HTTP headers for ${domain}:`, error);
    
    // Return error state
    return {
      securityHeaders: SECURITY_HEADERS.map(header => ({
        name: header.name,
        value: 'Error fetching headers',
        status: 'missing'
      })),
      generalHeaders: 'Error fetching headers',
      securityGrade: {
        grade: 'F (0%)',
        description: 'Unable to fetch HTTP headers',
        recommendations: [{
          severity: 'high',
          message: 'Could not connect to server to verify headers'
        }]
      }
    };
  }
}

// Helper function for grade descriptions
function getGradeDescription(grade: string): string {
  switch (grade) {
    case 'A': return 'Excellent security implementation';
    case 'B': return 'Good security implementation with minor improvements needed';
    case 'C': return 'Average security implementation, several improvements recommended';
    case 'D': return 'Below average security, significant improvements needed';
    case 'F': return 'Poor security implementation, critical improvements required';
    default: return 'Unable to grade security';
  }
}