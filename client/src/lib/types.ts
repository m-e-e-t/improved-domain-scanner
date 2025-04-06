export interface DomainStatus {
  status: "active" | "warning" | "critical" | "pending";
  statusText: string;
}

export interface DnsRecord {
  type: string;
  value: string;
  status?: "ok" | "warning" | "error";
}

export interface WhoisInfo {
  registeredOn: string;
  expiresOn: string;
  registrar: string;
  privacy?: boolean;
  daysUntilExpiration?: number;
  status?: "ok" | "warning" | "error";
}

export interface SslInfo {
  status: "valid" | "warning" | "invalid";
  issuer: string;
  protocol: string;
  validUntil: string;
  daysRemaining: number;
  statusMessage: string;
}

export interface HttpHeader {
  name: string;
  value: string;
  status?: "ok" | "warning" | "error";
}

export interface ScanResult {
  id: number;
  domain: string;
  ip: string;
  status: DomainStatus;
  scanDate: string;
  scanDuration: number;
  dns: {
    records: DnsRecord[];
  };
  whois: WhoisInfo;
  ssl: SslInfo;
  http: {
    headers: HttpHeader[];
  };
  subdomains?: string[];
  ports?: {
    port: number;
    service: string;
    status: string;
  }[];
  technologies?: {
    name: string;
    version?: string;
    category: string;
  }[];
  screenshot?: string;
}

export interface ScanOptions {
  whois: boolean;
  dns: boolean;
  http: boolean;
  ssl: boolean;
  subdomains: boolean;
  ports: boolean;
  technologies: boolean;
  screenshots: boolean;
}

export interface ScanFormData {
  domains: string;
  options: {
    whois: boolean;
    dns: boolean;
    http: boolean;
    ssl: boolean;
  };
  advancedOptions: {
    subdomains: boolean;
    ports: boolean;
    technologies: boolean;
    screenshots: boolean;
  };
}
