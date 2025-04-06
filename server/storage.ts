import { 
  users, 
  type User, 
  type InsertUser, 
  domainScans, 
  type DomainScan, 
  type InsertDomainScan,
  type DomainScanResults,
  type ScanProgress
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Domain scan methods
  saveDomainScan(scan: InsertDomainScan): Promise<DomainScan>;
  getDomainScan(domain: string): Promise<DomainScan | undefined>;
  getRecentDomainScans(limit: number): Promise<DomainScan[]>;
  
  // Scan progress tracking
  saveScanProgress(domain: string, progress: ScanProgress): Promise<void>;
  getScanProgress(domain: string): Promise<ScanProgress | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private domainScans: Map<string, DomainScan>;
  private scanProgress: Map<string, ScanProgress>;
  
  currentUserId: number;
  currentScanId: number;

  constructor() {
    this.users = new Map();
    this.domainScans = new Map();
    this.scanProgress = new Map();
    this.currentUserId = 1;
    this.currentScanId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Domain scan methods
  async saveDomainScan(scan: InsertDomainScan): Promise<DomainScan> {
    const id = this.currentScanId++;
    const domainScan: DomainScan = { 
      id, 
      domain: scan.domain,
      results: scan.results, 
      scannedAt: new Date()
    };
    
    this.domainScans.set(scan.domain, domainScan);
    return domainScan;
  }
  
  async getDomainScan(domain: string): Promise<DomainScan | undefined> {
    return this.domainScans.get(domain);
  }
  
  async getRecentDomainScans(limit: number): Promise<DomainScan[]> {
    return Array.from(this.domainScans.values())
      .sort((a, b) => b.scannedAt.getTime() - a.scannedAt.getTime())
      .slice(0, limit);
  }
  
  // Scan progress tracking
  async saveScanProgress(domain: string, progress: ScanProgress): Promise<void> {
    this.scanProgress.set(domain, progress);
  }
  
  async getScanProgress(domain: string): Promise<ScanProgress | undefined> {
    return this.scanProgress.get(domain);
  }
}

export const storage = new MemStorage();
