import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping the original for reference)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Domain scan schema
export const domainScans = pgTable("domain_scans", {
  id: serial("id").primaryKey(),
  domain: text("domain").notNull(),
  scannedAt: timestamp("scanned_at").notNull().defaultNow(),
  results: json("results").notNull(),
});

export const insertDomainScanSchema = createInsertSchema(domainScans).pick({
  domain: true,
  results: true,
});

export type InsertDomainScan = z.infer<typeof insertDomainScanSchema>;
export type DomainScan = typeof domainScans.$inferSelect;

// DNS Record types
export interface DnsRecord {
  type: string;
  name: string;
  ttl: number;
  value: string;
}

// SSL Certificate types
export interface SslCertificate {
  isValid: boolean;
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
  algorithm: string;
  domainNameMatch: boolean;
  trustedIssuer: boolean;
  daysToExpiration: number;
  alternativeNames: string[];
  // Enhanced SSL certificate analysis
  cipherSuites?: {
    name: string;
    strength: 'strong' | 'medium' | 'weak';
  }[];
  protocols?: {
    name: string;
    secure: boolean;
  }[];
  certificateChain?: {
    subject: string;
    issuer: string;
    validFrom: string;
    validTo: string;
  }[];
  ocspStapling?: boolean;
  vulnerabilities?: {
    name: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
  }[];
}

// WHOIS information types
export interface WhoisInfo {
  domainName: string;
  registryDomainId: string;
  creationDate: string;
  updatedDate: string;
  expirationDate: string;
  status: string[];
  registrar: {
    name: string;
    ianaId: string;
    abuseContactEmail: string;
    abuseContactPhone: string;
  };
  nameServers: string[];
  hasPrivacy: boolean;
}

// HTTP Headers types
export interface HttpHeader {
  name: string;
  value: string;
  status?: 'implemented' | 'missing';
}

export interface HttpHeaders {
  securityHeaders: HttpHeader[];
  generalHeaders: string;
  securityGrade: {
    grade: string;
    description: string;
    recommendations: {
      severity: 'high' | 'medium' | 'low';
      message: string;
    }[];
  };
}

// Port information type
export interface Port {
  port: number;
  service: string;
  status: 'open' | 'closed' | 'filtered';
}

// Technology detection type
export interface Technology {
  name: string;
  version: string | null;
  category: string;
  confidence: number;
}

// Subdomain type
export interface Subdomain {
  name: string;
  ip: string | null;
  isAlive: boolean;
}

// Content Analysis types
export interface ContentAnalysis {
  screenshot?: string; // Base64 encoded screenshot
  contentType: string; // e.g., 'text/html', 'application/json'
  contentCategory?: string; // e.g., 'business', 'personal', 'e-commerce'
  languages: string[]; // Detected languages on the page
  keywords: string[]; // Top keywords found on the page
  textContent: string; // First 1000 chars of text content
  wordCount: number;
  hasLoginForm: boolean;
  hasSocialMedia: boolean;
  hasCookieConsent: boolean;
  suspiciousIndicators?: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
}

// Network Analysis types
export interface NetworkAnalysis {
  ip: string;
  asn: {
    number: number;
    name: string;
    route: string;
    domain: string;
    type: string;
  };
  geolocation: {
    country: string;
    city: string;
    region: string;
    lat: number;
    lng: number;
  };
  isp: string;
  traceroute: {
    hop: number;
    ip: string;
    hostname: string | null;
    rtt: number; // Round trip time in ms
  }[];
  pingStats: {
    min: number;
    max: number;
    avg: number;
    loss: number; // Packet loss percentage
  };
}

// Domain Health Monitoring types
export interface DomainHealth {
  registrationStatus: 'active' | 'pending' | 'expired';
  daysUntilExpiration: number;
  nameserverStatus: 'consistent' | 'inconsistent' | 'problematic';
  nameserverDetails: {
    server: string;
    ips: string[];
    status: 'online' | 'offline' | 'issues';
  }[];
  dnsPropagation: {
    server: string;
    location: string;
    resolvedIp: string | null;
    propagated: boolean;
  }[];
  uptime: {
    uptime24h: number; // percentage
    uptime7d: number;  // percentage
    lastCheck: string; // ISO date
    currentStatus: 'up' | 'down' | 'issues';
    history: {
      timestamp: string;
      status: 'up' | 'down';
      responseTime: number; // ms
    }[];
  };
}

// Malware Scanning types
export interface MalwareAnalysis {
  malwareDetected: boolean;
  scanDate: string;
  scanEngine: string;
  threatScore: number; // 0-100
  blacklisted: boolean;
  blacklistStatus: {
    provider: string;
    listed: boolean;
    reason?: string;
    listedDate?: string;
  }[];
  threats: {
    type: string;
    name: string;
    location: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }[];
}

// Security scan types
export interface SecurityFinding {
  type: string;
  status: 'secure' | 'warning' | 'critical' | 'error';
  message: string;
  details: string;
}

export interface SecurityVulnerability {
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details?: string;
  [key: string]: any; // Additional information specific to the vulnerability
}

export interface SecurityReport {
  score: number; // 0-100 security score
  findings: SecurityFinding[];
  vulnerabilities: SecurityVulnerability[];
  recommendations: string[];
}

// Domain scan request schema
export const domainScanRequestSchema = z.object({
  domain: z.string().min(1).max(255),
  options: z.object({
    dns: z.boolean().default(true),
    ssl: z.boolean().default(true),
    whois: z.boolean().default(true),
    http: z.boolean().default(true),
    ports: z.boolean().default(false),
    technologies: z.boolean().default(false),
    subdomains: z.boolean().default(false),
    security: z.boolean().default(false),
    contentAnalysis: z.boolean().default(false),
    networkAnalysis: z.boolean().default(false),
    domainHealth: z.boolean().default(false),
    enhancedSsl: z.boolean().default(false),
    malwareAnalysis: z.boolean().default(false),
  }),
});

// Batch domain scan request schema
export const batchDomainScanRequestSchema = z.object({
  domains: z.string().min(1).transform(str => 
    str.split(/[\n,]/)
      .map(d => d.trim())
      .filter(d => d.length > 0)
  ),
  options: z.object({
    dns: z.boolean().default(true),
    ssl: z.boolean().default(true),
    whois: z.boolean().default(true),
    http: z.boolean().default(true),
    ports: z.boolean().default(false),
    technologies: z.boolean().default(false),
    subdomains: z.boolean().default(false),
    security: z.boolean().default(false),
    contentAnalysis: z.boolean().default(false),
    networkAnalysis: z.boolean().default(false),
    domainHealth: z.boolean().default(false),
    enhancedSsl: z.boolean().default(false),
    malwareAnalysis: z.boolean().default(false),
  }),
});

export type DomainScanRequest = z.infer<typeof domainScanRequestSchema>;
export type BatchDomainScanRequest = z.infer<typeof batchDomainScanRequestSchema>;

// Domain scan results schema
export const domainScanResultsSchema = z.object({
  domain: z.string(),
  timestamp: z.string().optional(),
  options: z.object({
    dns: z.boolean(),
    ssl: z.boolean(),
    whois: z.boolean(),
    http: z.boolean(),
    ports: z.boolean(),
    technologies: z.boolean(),
    subdomains: z.boolean(),
    security: z.boolean(),
    contentAnalysis: z.boolean(),
    networkAnalysis: z.boolean(),
    domainHealth: z.boolean(),
    enhancedSsl: z.boolean(),
    malwareAnalysis: z.boolean(),
  }).optional(),
  dns: z.object({
    records: z.array(z.object({
      type: z.string(),
      name: z.string(),
      ttl: z.number(),
      value: z.string(),
    })),
  }),
  ssl: z.object({
    isValid: z.boolean(),
    issuer: z.string(),
    subject: z.string(),
    validFrom: z.string(),
    validTo: z.string(),
    algorithm: z.string(),
    domainNameMatch: z.boolean(),
    trustedIssuer: z.boolean(),
    daysToExpiration: z.number(),
    alternativeNames: z.array(z.string()),
    // Enhanced SSL fields (optional)
    cipherSuites: z.array(z.object({
      name: z.string(),
      strength: z.enum(['strong', 'medium', 'weak']),
    })).optional(),
    protocols: z.array(z.object({
      name: z.string(),
      secure: z.boolean(),
    })).optional(),
    certificateChain: z.array(z.object({
      subject: z.string(),
      issuer: z.string(),
      validFrom: z.string(),
      validTo: z.string(),
    })).optional(),
    ocspStapling: z.boolean().optional(),
    vulnerabilities: z.array(z.object({
      name: z.string(),
      severity: z.enum(['high', 'medium', 'low']),
      description: z.string(),
    })).optional(),
  }).nullable(),
  whois: z.object({
    domainName: z.string(),
    registryDomainId: z.string(),
    creationDate: z.string(),
    updatedDate: z.string(),
    expirationDate: z.string(),
    status: z.array(z.string()),
    registrar: z.object({
      name: z.string(),
      ianaId: z.string(),
      abuseContactEmail: z.string(),
      abuseContactPhone: z.string(),
    }),
    nameServers: z.array(z.string()),
    hasPrivacy: z.boolean(),
  }).nullable(),
  http: z.object({
    securityHeaders: z.array(z.object({
      name: z.string(),
      value: z.string(),
      status: z.enum(['implemented', 'missing']).optional(),
    })),
    generalHeaders: z.string(),
    securityGrade: z.object({
      grade: z.string(),
      description: z.string(),
      recommendations: z.array(z.object({
        severity: z.enum(['high', 'medium', 'low']),
        message: z.string(),
      })),
    }),
  }).nullable(),
  ports: z.array(z.object({
    port: z.number(),
    service: z.string(),
    status: z.enum(['open', 'closed', 'filtered']),
  })).nullable(),
  technologies: z.array(z.object({
    name: z.string(),
    version: z.string().nullable(),
    category: z.string(),
    confidence: z.number(),
  })).nullable(),
  subdomains: z.array(z.object({
    name: z.string(),
    ip: z.string().nullable(),
    isAlive: z.boolean(),
  })).nullable(),
  security: z.object({
    score: z.number(),
    findings: z.array(z.object({
      type: z.string(),
      status: z.enum(['secure', 'warning', 'critical', 'error']),
      message: z.string(),
      details: z.string(),
    })),
    vulnerabilities: z.array(z.object({
      name: z.string(),
      description: z.string(),
      severity: z.enum(['low', 'medium', 'high', 'critical']),
    }).passthrough()),
    recommendations: z.array(z.string()),
  }).nullable(),
  contentAnalysis: z.object({
    screenshot: z.string().optional(),
    contentType: z.string(),
    contentCategory: z.string().optional(),
    languages: z.array(z.string()),
    keywords: z.array(z.string()),
    textContent: z.string(),
    wordCount: z.number(),
    hasLoginForm: z.boolean(),
    hasSocialMedia: z.boolean(),
    hasCookieConsent: z.boolean(),
    suspiciousIndicators: z.array(z.object({
      type: z.string(),
      description: z.string(),
      severity: z.enum(['low', 'medium', 'high']),
    })).optional(),
  }).nullable(),
  networkAnalysis: z.object({
    ip: z.string(),
    asn: z.object({
      number: z.number(),
      name: z.string(),
      route: z.string(),
      domain: z.string(),
      type: z.string(),
    }),
    geolocation: z.object({
      country: z.string(),
      city: z.string(),
      region: z.string(),
      lat: z.number(),
      lng: z.number(),
    }),
    isp: z.string(),
    traceroute: z.array(z.object({
      hop: z.number(),
      ip: z.string(),
      hostname: z.string().nullable(),
      rtt: z.number(),
    })),
    pingStats: z.object({
      min: z.number(),
      max: z.number(),
      avg: z.number(),
      loss: z.number(),
    }),
  }).nullable(),
  domainHealth: z.object({
    registrationStatus: z.enum(['active', 'pending', 'expired']),
    daysUntilExpiration: z.number(),
    nameserverStatus: z.enum(['consistent', 'inconsistent', 'problematic']),
    nameserverDetails: z.array(z.object({
      server: z.string(),
      ips: z.array(z.string()),
      status: z.enum(['online', 'offline', 'issues']),
    })),
    dnsPropagation: z.array(z.object({
      server: z.string(),
      location: z.string(),
      resolvedIp: z.string().nullable(),
      propagated: z.boolean(),
    })),
    uptime: z.object({
      uptime24h: z.number(),
      uptime7d: z.number(),
      lastCheck: z.string(),
      currentStatus: z.enum(['up', 'down', 'issues']),
      history: z.array(z.object({
        timestamp: z.string(),
        status: z.enum(['up', 'down']),
        responseTime: z.number(),
      })),
    }),
  }).nullable(),
  malwareAnalysis: z.object({
    malwareDetected: z.boolean(),
    scanDate: z.string(),
    scanEngine: z.string(),
    threatScore: z.number(),
    blacklisted: z.boolean(),
    blacklistStatus: z.array(z.object({
      provider: z.string(),
      listed: z.boolean(),
      reason: z.string().optional(),
      listedDate: z.string().optional(),
    })),
    threats: z.array(z.object({
      type: z.string(),
      name: z.string(),
      location: z.string(),
      severity: z.enum(['low', 'medium', 'high', 'critical']),
      description: z.string(),
    })),
  }).nullable(),
  error: z.string().nullable(),
});

export type DomainScanResults = z.infer<typeof domainScanResultsSchema>;

// Scan progress schema
export const scanProgressSchema = z.object({
  domain: z.string(),
  status: z.enum(['scanning', 'completed', 'failed']),
  progress: z.object({
    dns: z.enum(['waiting', 'scanning', 'completed', 'failed', 'skipped']),
    ssl: z.enum(['waiting', 'scanning', 'completed', 'failed', 'skipped']),
    whois: z.enum(['waiting', 'scanning', 'completed', 'failed', 'skipped']),
    http: z.enum(['waiting', 'scanning', 'completed', 'failed', 'skipped']),
    ports: z.enum(['waiting', 'scanning', 'completed', 'failed', 'skipped']),
    technologies: z.enum(['waiting', 'scanning', 'completed', 'failed', 'skipped']),
    subdomains: z.enum(['waiting', 'scanning', 'completed', 'failed', 'skipped']),
    security: z.enum(['waiting', 'scanning', 'completed', 'failed', 'skipped']),
    contentAnalysis: z.enum(['waiting', 'scanning', 'completed', 'failed', 'skipped']),
    networkAnalysis: z.enum(['waiting', 'scanning', 'completed', 'failed', 'skipped']),
    domainHealth: z.enum(['waiting', 'scanning', 'completed', 'failed', 'skipped']),
    enhancedSsl: z.enum(['waiting', 'scanning', 'completed', 'failed', 'skipped']),
    malwareAnalysis: z.enum(['waiting', 'scanning', 'completed', 'failed', 'skipped']),
  }),
  percentage: z.number(),
  error: z.string().optional(),
  cachedResult: z.boolean().optional(),
  cachedTimestamp: z.string().optional(),
});

export type ScanProgress = z.infer<typeof scanProgressSchema>;
