import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScanResult } from "@/lib/types";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface ScanResultCardProps {
  result: ScanResult;
}

export default function ScanResultCard({ result }: ScanResultCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [isRescanning, setIsRescanning] = useState(false);
  const { toast } = useToast();
  
  const statusClass = {
    active: "status-badge status-badge-active",
    warning: "status-badge status-badge-warning",
    critical: "status-badge status-badge-critical",
    pending: "status-badge status-badge-pending",
  }[result.status.status];
  
  const handleRescan = async () => {
    try {
      setIsRescanning(true);
      await apiRequest("POST", "/api/scan", { 
        domains: [result.domain],
        options: {
          whois: true,
          dns: true,
          http: true,
          ssl: true,
          subdomains: !!result.subdomains,
          ports: !!result.ports,
          technologies: !!result.technologies,
          screenshots: !!result.screenshot,
        }
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/scan/results"] });
      
      toast({
        title: "Rescan started",
        description: `Started rescanning ${result.domain}`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to start the rescan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRescanning(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      await apiRequest("DELETE", `/api/scan/${result.id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/scan/results"] });
      
      toast({
        title: "Scan deleted",
        description: `Deleted scan for ${result.domain}`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete the scan. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              {result.domain}
              <span className={`ml-2 ${statusClass}`}>{result.status.statusText}</span>
            </h3>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              aria-label={expanded ? "Collapse" : "Expand"}
              className="p-1 rounded text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              {expanded ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              aria-label="Delete scan"
              className="p-1 rounded text-gray-500 hover:text-red-600 hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </Button>
          </div>
        </div>
        <div className="mt-1 flex items-center">
          <p className="text-sm text-gray-500">IP: {result.ip}</p>
          <span className="mx-2 text-gray-300">•</span>
          <p className="text-sm text-gray-500">Last Scanned: {format(new Date(result.scanDate), 'MMM d, yyyy')}</p>
        </div>
      </div>
      
      {expanded && (
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">DNS Records</h4>
            <div className="mt-2 space-y-2">
              {result.dns.records.slice(0, 3).map((record, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{record.type} Record</span>
                    <span className={`text-sm ${record.status === 'error' ? 'text-red-500' : record.status === 'warning' ? 'text-yellow-500' : 'text-gray-600'}`}>
                      {record.value}
                    </span>
                  </div>
                </div>
              ))}
              {result.dns.records.length > 3 && (
                <button className="text-sm text-primary hover:text-secondary block mt-2">
                  Show all DNS records
                </button>
              )}
            </div>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">WHOIS Information</h4>
            <div className="mt-2 space-y-2">
              <div className="bg-gray-50 p-2 rounded">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Registered On</span>
                  <span className="text-sm text-gray-600">{result.whois.registeredOn}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Expires On</span>
                  <span className="text-sm text-gray-600">{result.whois.expiresOn}</span>
                </div>
                {result.whois.daysUntilExpiration !== undefined && result.whois.daysUntilExpiration < 90 && (
                  <div className="mt-1">
                    <span className="text-xs text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full">
                      Expires in {result.whois.daysUntilExpiration} days
                    </span>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Registrar</span>
                  <span className="text-sm text-gray-600">{result.whois.registrar}</span>
                </div>
              </div>
              <button className="text-sm text-primary hover:text-secondary block mt-2">
                View full WHOIS data
              </button>
            </div>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">SSL/TLS Certificate</h4>
            <div className="mt-2 space-y-2">
              <div className="bg-gray-50 p-2 rounded flex items-center">
                <span className={`w-8 ${
                  result.ssl.status === 'valid' 
                    ? 'text-green-500' 
                    : result.ssl.status === 'warning' 
                      ? 'text-yellow-500' 
                      : 'text-red-500'
                }`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </span>
                <div className="ml-2">
                  <div className="text-sm font-medium">{result.ssl.statusMessage}</div>
                  <div className="text-xs text-gray-500">
                    {result.ssl.daysRemaining > 0 
                      ? `Expires in ${result.ssl.daysRemaining} days` 
                      : 'Expired'
                    }
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Issuer</span>
                  <span className={`text-sm ${result.ssl.issuer === 'Self-signed' ? 'text-red-500' : 'text-gray-600'}`}>
                    {result.ssl.issuer}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Protocol</span>
                  <span className={`text-sm ${
                    result.ssl.protocol.includes('SSLv3') || result.ssl.protocol.includes('TLS 1.0') 
                      ? 'text-red-500' 
                      : 'text-gray-600'
                  }`}>
                    {result.ssl.protocol}{result.ssl.protocol.includes('SSLv3') && ' (Insecure)'}
                  </span>
                </div>
              </div>
              <button className="text-sm text-primary hover:text-secondary block mt-2">
                View certificate details
              </button>
            </div>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">HTTP Headers</h4>
            <div className="mt-2 space-y-2">
              {result.http.headers.slice(0, 3).map((header, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{header.name}</span>
                    <span className={`text-sm ${header.status === 'error' ? 'text-red-500' : header.status === 'warning' ? 'text-yellow-500' : 'text-gray-600'}`}>
                      {header.value}
                    </span>
                  </div>
                </div>
              ))}
              <button className="text-sm text-primary hover:text-secondary block mt-2">
                View all HTTP headers
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <div className="flex space-x-4">
          <Button
            variant="link"
            size="sm"
            onClick={handleRescan}
            disabled={isRescanning}
            className="text-sm text-primary hover:text-secondary flex items-center p-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1 h-4 w-4"
            >
              <path d="M21 2v6h-6" />
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M3 22v-6h6" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
            {isRescanning ? 'Rescanning...' : 'Rescan'}
          </Button>
          <Button
            variant="link"
            size="sm"
            className="text-sm text-primary hover:text-secondary flex items-center p-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1 h-4 w-4"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            History
          </Button>
        </div>
        <div>
          <span className="text-xs text-gray-500">Scan completed in {result.scanDuration} seconds</span>
        </div>
      </div>
    </Card>
  );
}
