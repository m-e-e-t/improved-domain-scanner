import { CheckCircle, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SslCertificate } from '@shared/schema';

interface SslCertificateSectionProps {
  sslCertificate: SslCertificate;
  isOpen: boolean;
  onToggle: () => void;
}

export default function SslCertificateSection({ sslCertificate, isOpen, onToggle }: SslCertificateSectionProps) {
  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="p-4 bg-slate-50 border-b flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center">
          <div className="scan-icon-wrapper scan-icon-ssl">
            <ShieldCheck className="scan-icon scan-icon-ssl" />
          </div>
          <h3 className="ml-3 text-lg font-medium text-slate-800">SSL Certificate</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`bg-${sslCertificate.isValid ? 'green' : 'red'}-100 text-${sslCertificate.isValid ? 'success' : 'destructive'} text-xs px-2 py-1 rounded-full font-medium flex items-center`}>
            {sslCertificate.isValid ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                Valid
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Invalid
              </>
            )}
          </span>
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
      </div>
      
      {isOpen && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-slate-500 uppercase mb-3">Certificate Information</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">Issued To</p>
                  <p className="text-sm text-slate-600 font-mono bg-slate-50 p-2 rounded mt-1">{sslCertificate.subject}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Issued By</p>
                  <p className="text-sm text-slate-600 font-mono bg-slate-50 p-2 rounded mt-1">{sslCertificate.issuer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Valid From</p>
                  <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded mt-1">{sslCertificate.validFrom}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Valid Until</p>
                  <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded mt-1">{sslCertificate.validTo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Signature Algorithm</p>
                  <p className="text-sm text-slate-600 font-mono bg-slate-50 p-2 rounded mt-1">{sslCertificate.algorithm}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-slate-500 uppercase mb-3">Certificate Status</h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className={`h-5 w-5 ${sslCertificate.isValid ? 'text-success' : 'text-destructive'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h5 className="text-sm font-medium text-slate-800">Certificate is {sslCertificate.isValid ? 'valid' : 'invalid'}</h5>
                    <p className="text-xs text-slate-500">Certificate has {sslCertificate.isValid ? 'not been revoked and is currently valid' : 'been revoked or is not valid'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className={`h-5 w-5 ${sslCertificate.domainNameMatch ? 'text-success' : 'text-destructive'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h5 className="text-sm font-medium text-slate-800">Domain name {sslCertificate.domainNameMatch ? 'matches' : 'does not match'}</h5>
                    <p className="text-xs text-slate-500">The certificate {sslCertificate.domainNameMatch ? 'is valid for the requested domain' : 'does not match the requested domain'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className={`h-5 w-5 ${sslCertificate.trustedIssuer ? 'text-success' : 'text-destructive'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h5 className="text-sm font-medium text-slate-800">{sslCertificate.trustedIssuer ? 'Trusted' : 'Untrusted'} issuer</h5>
                    <p className="text-xs text-slate-500">Certificate was issued by {sslCertificate.trustedIssuer ? 'a trusted' : 'an untrusted'} certificate authority</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className={`h-5 w-5 ${sslCertificate.daysToExpiration > 30 ? 'text-success' : sslCertificate.daysToExpiration > 0 ? 'text-warning' : 'text-destructive'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      {sslCertificate.daysToExpiration > 30 ? (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      )}
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h5 className="text-sm font-medium text-slate-800">
                      {sslCertificate.daysToExpiration <= 0 
                        ? 'Expired' 
                        : `Expiring in ${sslCertificate.daysToExpiration} days`}
                    </h5>
                    <p className="text-xs text-slate-500">
                      {sslCertificate.daysToExpiration <= 0 
                        ? 'The certificate has expired and should be renewed immediately' 
                        : sslCertificate.daysToExpiration <= 30 
                          ? 'The certificate will expire soon and should be renewed' 
                          : 'The certificate is valid for a sufficient period'}
                    </p>
                  </div>
                </div>
              </div>
              
              <h4 className="text-sm font-medium text-slate-500 uppercase mt-6 mb-3">Subject Alternative Names</h4>
              <div className="bg-slate-50 p-3 rounded text-sm text-slate-600 font-mono">
                <ul className="space-y-1">
                  {sslCertificate.alternativeNames.map((name, index) => (
                    <li key={index}>{name}</li>
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
