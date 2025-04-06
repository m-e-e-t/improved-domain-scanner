import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  ChevronDown, 
  ChevronRight, 
  Shield,
  AlertTriangle,
  Lock,
  LockKeyhole,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { SslCertificate } from '@shared/schema';

interface EnhancedSslSectionProps {
  sslCertificate: SslCertificate;
  isOpen: boolean;
  onToggle: () => void;
}

export default function EnhancedSslSection({ sslCertificate, isOpen, onToggle }: EnhancedSslSectionProps) {
  // Check if this is an enhanced SSL certificate with additional fields
  const isEnhanced = Boolean(
    sslCertificate.cipherSuites || 
    sslCertificate.protocols || 
    sslCertificate.certificateChain ||
    sslCertificate.vulnerabilities
  );

  if (!isEnhanced) {
    return null;
  }

  return (
    <Card className="w-full border rounded-lg shadow-sm">
      <CardHeader className="p-4 border-b bg-slate-50 cursor-pointer" onClick={onToggle}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center">
            {isOpen ? <ChevronDown className="h-5 w-5 mr-2" /> : <ChevronRight className="h-5 w-5 mr-2" />}
            <Lock className="h-5 w-5 mr-2" />
            Enhanced SSL Analysis
          </CardTitle>
          <div className="flex items-center space-x-2">
            {sslCertificate.vulnerabilities && sslCertificate.vulnerabilities.length > 0 && (
              <Badge variant="destructive" className="flex items-center">
                <ShieldAlert className="h-3 w-3 mr-1" />
                {sslCertificate.vulnerabilities.length} Vulnerabilities
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
              {isOpen ? 'Hide' : 'Show'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="p-4 space-y-6">
          {sslCertificate.protocols && (
            <div>
              <h3 className="text-sm font-medium flex items-center text-slate-700 mb-3">
                <LockKeyhole className="h-4 w-4 mr-1" />
                SSL/TLS Protocols
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {sslCertificate.protocols.map((protocol, i) => (
                  <div key={i} className={`p-2 rounded-md flex justify-between items-center
                    ${protocol.secure ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                    <span className="font-medium">{protocol.name}</span>
                    {protocol.secure ? (
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                    ) : (
                      <ShieldAlert className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {sslCertificate.cipherSuites && (
            <div>
              <h3 className="text-sm font-medium flex items-center text-slate-700 mb-3">
                <Shield className="h-4 w-4 mr-1" />
                Cipher Suites
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {sslCertificate.cipherSuites.map((cipher, i) => (
                  <div key={i} className={`p-2 rounded-md flex justify-between items-center
                    ${cipher.strength === 'strong' ? 'bg-green-50 border border-green-100' : 
                      cipher.strength === 'medium' ? 'bg-amber-50 border border-amber-100' : 
                      'bg-red-50 border border-red-100'}`}>
                    <span className="font-mono text-xs">{cipher.name}</span>
                    <Badge
                      variant={
                        cipher.strength === 'strong' ? 'outline' : 
                        cipher.strength === 'medium' ? 'secondary' : 'destructive'
                      }
                    >
                      {cipher.strength}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {sslCertificate.certificateChain && (
            <div>
              <h3 className="text-sm font-medium flex items-center text-slate-700 mb-3">
                <Shield className="h-4 w-4 mr-1" />
                Certificate Chain
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Issuer</TableHead>
                    <TableHead>Valid From</TableHead>
                    <TableHead>Valid To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sslCertificate.certificateChain.map((cert, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-sm">{cert.subject}</TableCell>
                      <TableCell>{cert.issuer}</TableCell>
                      <TableCell>{new Date(cert.validFrom).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(cert.validTo).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">OCSP Stapling:</span>
              {sslCertificate.ocspStapling ? (
                <Badge variant="outline" className="bg-green-50 text-green-700">Enabled</Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700">Disabled</Badge>
              )}
            </div>
          </div>
          
          {sslCertificate.vulnerabilities && sslCertificate.vulnerabilities.length > 0 && (
            <div>
              <Separator className="my-4" />
              <h3 className="text-sm font-medium flex items-center text-slate-700 mb-3">
                <AlertTriangle className="h-4 w-4 mr-1" />
                SSL/TLS Vulnerabilities
              </h3>
              <div className="space-y-3">
                {sslCertificate.vulnerabilities.map((vuln, i) => (
                  <div key={i} className={`p-3 rounded-md
                    ${vuln.severity === 'high' ? 'bg-red-50 border border-red-100' : 
                      vuln.severity === 'medium' ? 'bg-amber-50 border border-amber-100' : 
                      'bg-blue-50 border border-blue-100'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{vuln.name}</span>
                      <Badge
                        variant={
                          vuln.severity === 'high' ? 'destructive' : 
                          vuln.severity === 'medium' ? 'default' : 'secondary'
                        }
                      >
                        {vuln.severity}
                      </Badge>
                    </div>
                    <p className="text-sm">{vuln.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}