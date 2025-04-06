import { FileScan } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { HttpHeaders } from '@shared/schema';

interface HttpHeadersSectionProps {
  httpHeaders: HttpHeaders;
  isOpen: boolean;
  onToggle: () => void;
}

export default function HttpHeadersSection({ httpHeaders, isOpen, onToggle }: HttpHeadersSectionProps) {
  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="p-4 bg-slate-50 border-b flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center">
          <div className="scan-icon-wrapper scan-icon-headers">
            <FileScan className="scan-icon scan-icon-headers" />
          </div>
          <h3 className="ml-3 text-lg font-medium text-slate-800">HTTP Headers</h3>
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
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-slate-500 uppercase mb-3">Security Headers</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead>
                    <tr>
                      <th scope="col" className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Header</th>
                      <th scope="col" className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Value</th>
                      <th scope="col" className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {httpHeaders.securityHeaders.map((header, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm font-medium text-slate-700">{header.name}</td>
                        <td className="px-4 py-3 text-sm font-mono text-slate-600">{header.value}</td>
                        <td className="px-4 py-3">
                          {header.status && (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full badge-${header.status}`}>
                              {header.status === 'implemented' ? 'Implemented' : 'Missing'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-slate-500 uppercase mb-3">General Headers</h4>
              <div className="bg-slate-50 p-4 rounded">
                <pre className="text-sm font-mono text-slate-600 whitespace-pre-wrap">
                  {httpHeaders.generalHeaders}
                </pre>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-slate-500 uppercase mb-3">Security Assessment</h4>
              <div className="bg-slate-50 p-4 rounded">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                    <span className="text-yellow-800 font-bold text-lg">{httpHeaders.securityGrade.grade}</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Security Grade: {httpHeaders.securityGrade.grade}</p>
                    <p className="text-sm text-slate-500">{httpHeaders.securityGrade.description}</p>
                  </div>
                </div>
                
                <h5 className="text-sm font-medium text-slate-700 mb-2">Recommendations</h5>
                <ul className="space-y-2 text-sm text-slate-600">
                  {httpHeaders.securityGrade.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <svg 
                        className={`h-5 w-5 ${recommendation.severity === 'high' ? 'text-red-500' : recommendation.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'} mr-1 flex-shrink-0`} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        {recommendation.severity === 'high' ? (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        )}
                      </svg>
                      {recommendation.message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
