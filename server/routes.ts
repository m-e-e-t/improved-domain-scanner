import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { storage } from "./storage";
import { domainScanner } from "./services/domainScanner";
import { domainScanRequestSchema, batchDomainScanRequestSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix
  const apiPrefix = "/api";
  
  // Error handler middleware
  app.use(`${apiPrefix}/*`, (err: any, req: Request, res: Response, next: any) => {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ 
        error: 'Validation failed',
        details: validationError.message
      });
    }
    
    console.error('API Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  });
  
  // Domain scanner endpoints
  app.post(`${apiPrefix}/scan`, async (req: Request, res: Response) => {
    try {
      const scanRequest = domainScanRequestSchema.parse(req.body);
      
      // Begin scanning asynchronously
      domainScanner.scanDomain(scanRequest)
        .catch((error: any) => console.error('Scan error:', error));
      
      // Return immediately with acknowledgment
      return res.status(202).json({ 
        message: 'Scan started',
        domain: scanRequest.domain
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          error: 'Validation failed',
          details: validationError.message
        });
      }
      
      console.error('API Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Batch Domain scanner endpoints
  app.post(`${apiPrefix}/scan/batch`, async (req: Request, res: Response) => {
    try {
      const batchScanRequest = batchDomainScanRequestSchema.parse(req.body);
      const domains = batchScanRequest.domains;
      
      if (domains.length === 0) {
        return res.status(400).json({ 
          error: 'Validation failed',
          details: 'No valid domains provided'
        });
      }
      
      if (domains.length > 20) {
        return res.status(400).json({ 
          error: 'Validation failed',
          details: 'Maximum of 20 domains can be scanned at once'
        });
      }
      
      // Begin scanning each domain asynchronously
      const scannedDomains = domains.map(domain => {
        const scanRequest = {
          domain,
          options: batchScanRequest.options
        };
        
        domainScanner.scanDomain(scanRequest)
          .catch((error: any) => console.error(`Scan error for ${domain}:`, error));
          
        return domain;
      });
      
      // Return immediately with acknowledgment
      return res.status(202).json({ 
        message: 'Batch scan started',
        domains: scannedDomains,
        count: scannedDomains.length
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          error: 'Validation failed',
          details: validationError.message
        });
      }
      
      console.error('API Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get scan progress
  app.get(`${apiPrefix}/scan/:domain/progress`, async (req: Request, res: Response) => {
    try {
      const { domain } = req.params;
      
      if (!domain) {
        return res.status(400).json({ error: 'Domain parameter is required' });
      }
      
      const progress = await domainScanner.getScanProgress(domain);
      
      if (!progress) {
        return res.status(404).json({ error: 'No scan found for this domain' });
      }
      
      return res.json(progress);
    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get scan results
  app.get(`${apiPrefix}/scan/:domain/results`, async (req: Request, res: Response) => {
    try {
      const { domain } = req.params;
      
      if (!domain) {
        return res.status(400).json({ error: 'Domain parameter is required' });
      }
      
      const scanResult = await storage.getDomainScan(domain);
      
      if (!scanResult) {
        return res.status(404).json({ error: 'No results found for this domain' });
      }
      
      return res.json({
        domain: scanResult.domain,
        scannedAt: scanResult.scannedAt,
        results: scanResult.results ? JSON.parse(scanResult.results as string) : null
      });
    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get recent scans
  app.get(`${apiPrefix}/scans/recent`, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const recentScans = await storage.getRecentDomainScans(limit);
      
      return res.json(recentScans.map(scan => ({
        domain: scan.domain,
        scannedAt: scan.scannedAt
      })));
    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
