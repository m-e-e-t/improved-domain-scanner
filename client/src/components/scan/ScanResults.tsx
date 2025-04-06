import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ScanResultCard from "./ScanResultCard";
import { ScanResult } from "@/lib/types";

interface ScanResultsProps {
  isLoading: boolean;
  scanProgress?: { 
    current: number; 
    total: number; 
    percentage: number;
  };
}

export default function ScanResults({ isLoading, scanProgress }: ScanResultsProps) {
  const [filter, setFilter] = useState<string | null>(null);
  
  const { data: results = [], isLoading: isLoadingResults } = useQuery<ScanResult[]>({
    queryKey: ["/api/scan/results"],
    enabled: !isLoading,
  });
  
  const filteredResults = filter 
    ? results.filter(result => {
        if (filter === 'active') return result.status.status === 'active';
        if (filter === 'warning') return result.status.status === 'warning';
        if (filter === 'critical') return result.status.status === 'critical';
        return true;
      })
    : results;
    
  const handleExport = () => {
    // Export logic would go here
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "domain-scan-results.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Scan Results</h2>
        <div className="flex space-x-2">
          <div className="relative inline-block text-left">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilter(filter ? null : 'all')}
              className="flex items-center text-sm text-gray-600 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
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
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg> 
              Filter
              {filter && <span className="ml-1">({filter})</span>}
            </Button>
            {filter && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => setFilter(null)}
                  >
                    All
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => setFilter('active')}
                  >
                    Active
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => setFilter('warning')}
                  >
                    Warning
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => setFilter('critical')}
                  >
                    Critical
                  </button>
                </div>
              </div>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
            disabled={results.length === 0}
            className="flex items-center text-sm text-gray-600 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg> 
            Export
          </Button>
        </div>
      </div>
      
      {isLoading && (
        <div className="bg-white shadow rounded-lg p-6 flex items-center justify-center">
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-primary animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-full w-full"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Scanning domains...</h3>
            <p className="mt-2 text-sm text-gray-500">This may take a few moments depending on the number of domains and selected options.</p>
            {scanProgress && (
              <div className="mt-6">
                <Progress className="max-w-md mx-auto h-2" value={scanProgress.percentage} />
                <p className="mt-1 text-xs text-gray-500">
                  Scanning {scanProgress.current} of {scanProgress.total} domains ({scanProgress.percentage}%)
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {!isLoading && isLoadingResults && (
        <div className="bg-white shadow rounded-lg p-6 flex items-center justify-center">
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-primary animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-full w-full"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Loading scan results...</h3>
          </div>
        </div>
      )}
      
      {!isLoading && !isLoadingResults && filteredResults.length === 0 && (
        <div className="bg-white shadow rounded-lg p-6 flex items-center justify-center">
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto h-12 w-12 text-gray-400"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M9 12h6" />
              <path d="M12 9v6" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No scan results</h3>
            <p className="mt-2 text-sm text-gray-500">Enter domains above and start a scan to see results here.</p>
          </div>
        </div>
      )}
      
      {!isLoading && !isLoadingResults && filteredResults.map((result) => (
        <ScanResultCard key={result.id} result={result} />
      ))}
    </div>
  );
}
