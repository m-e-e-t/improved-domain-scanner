import { Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { DnsRecord } from '@shared/schema';

interface DnsRecordsSectionProps {
  dnsRecords: DnsRecord[];
  isOpen: boolean;
  onToggle: () => void;
}

export default function DnsRecordsSection({ dnsRecords, isOpen, onToggle }: DnsRecordsSectionProps) {
  const getTypeBadgeClass = (type: string) => {
    const lowerType = type.toLowerCase();
    switch (lowerType) {
      case 'a': return 'badge-dns';
      case 'aaaa': return 'badge-aaaa';
      case 'mx': return 'badge-mx';
      case 'txt': return 'badge-txt';
      case 'ns': return 'badge-ns';
      case 'cname': return 'badge-cname';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="p-4 bg-slate-50 border-b flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center">
          <div className="scan-icon-wrapper scan-icon-dns">
            <Globe className="scan-icon scan-icon-dns" />
          </div>
          <h3 className="ml-3 text-lg font-medium text-slate-800">DNS Records</h3>
        </div>
        <span className="text-primary">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </span>
      </div>
      
      {isOpen && (
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th scope="col" className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">TTL</th>
                  <th scope="col" className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {dnsRecords.map((record, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeClass(record.type)}`}>
                        {record.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{record.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{record.ttl}</td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-700">{record.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Card>
  );
}
