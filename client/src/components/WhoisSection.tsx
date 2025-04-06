import { Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { WhoisInfo } from '@shared/schema';

interface WhoisSectionProps {
  whoisInfo: WhoisInfo;
  isOpen: boolean;
  onToggle: () => void;
}

export default function WhoisSection({ whoisInfo, isOpen, onToggle }: WhoisSectionProps) {
  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="p-4 bg-slate-50 border-b flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center">
          <div className="scan-icon-wrapper scan-icon-whois">
            <Info className="scan-icon scan-icon-whois" />
          </div>
          <h3 className="ml-3 text-lg font-medium text-slate-800">WHOIS Information</h3>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-slate-500 uppercase mb-3">Domain Information</h4>
              <div className="bg-slate-50 p-4 rounded">
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-slate-700">Domain Name</dt>
                    <dd className="mt-1 text-sm text-slate-600 font-mono">{whoisInfo.domainName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-700">Registry Domain ID</dt>
                    <dd className="mt-1 text-sm text-slate-600 font-mono">{whoisInfo.registryDomainId}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-700">Creation Date</dt>
                    <dd className="mt-1 text-sm text-slate-600">{whoisInfo.creationDate}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-700">Updated Date</dt>
                    <dd className="mt-1 text-sm text-slate-600">{whoisInfo.updatedDate}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-700">Expiration Date</dt>
                    <dd className="mt-1 text-sm text-slate-600">{whoisInfo.expirationDate}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-700">Status</dt>
                    <dd className="mt-1">
                      {whoisInfo.status.map((status, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-1 mb-1"
                        >
                          {status}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-slate-500 uppercase mb-3">Registrar Information</h4>
              <div className="bg-slate-50 p-4 rounded">
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-slate-700">Registrar</dt>
                    <dd className="mt-1 text-sm text-slate-600">{whoisInfo.registrar.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-700">Registrar IANA ID</dt>
                    <dd className="mt-1 text-sm text-slate-600">{whoisInfo.registrar.ianaId}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-700">Registrar Abuse Contact Email</dt>
                    <dd className="mt-1 text-sm text-slate-600 font-mono">{whoisInfo.registrar.abuseContactEmail}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-700">Registrar Abuse Contact Phone</dt>
                    <dd className="mt-1 text-sm text-slate-600">{whoisInfo.registrar.abuseContactPhone}</dd>
                  </div>
                </dl>
              </div>
              
              <h4 className="text-sm font-medium text-slate-500 uppercase mt-6 mb-3">Name Servers</h4>
              <div className="bg-slate-50 p-4 rounded">
                <ul className="space-y-1 text-sm text-slate-600 font-mono">
                  {whoisInfo.nameServers.map((nameServer, index) => (
                    <li key={index}>{nameServer}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium text-slate-500 uppercase mb-3">Privacy Status</h4>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    {whoisInfo.hasPrivacy
                      ? 'This domain has WHOIS privacy protection enabled. Registrant information is protected by a privacy service.'
                      : 'This domain does not have WHOIS privacy protection. Registrant information is publicly available.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
