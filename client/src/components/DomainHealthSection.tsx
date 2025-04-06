import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  ChevronDown, 
  ChevronRight, 
  Clock,
  Check,
  X,
  AlertTriangle,
  HeartPulse
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { DomainHealth } from '@shared/schema';

interface DomainHealthSectionProps {
  domainHealth: DomainHealth;
  isOpen: boolean;
  onToggle: () => void;
}

export default function DomainHealthSection({ domainHealth, isOpen, onToggle }: DomainHealthSectionProps) {
  // Helper function to determine status color
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
      case 'consistent':
      case 'online':
      case 'up':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 whitespace-nowrap flex items-center">
            <Check className="h-3 w-3 mr-1 flex-shrink-0" />
            <span>{status}</span>
          </Badge>
        );
      case 'pending':
      case 'issues':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 whitespace-nowrap flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0" />
            <span>{status}</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="destructive" className="whitespace-nowrap flex items-center">
            <X className="h-3 w-3 mr-1 flex-shrink-0" />
            <span>{status}</span>
          </Badge>
        );
    }
  };

  return (
    <Card className="w-full border rounded-lg shadow-sm">
      <CardHeader className="p-4 border-b bg-slate-50 cursor-pointer" onClick={onToggle}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle className="text-lg font-semibold flex items-center">
            {isOpen ? <ChevronDown className="h-5 w-5 mr-2 flex-shrink-0" /> : <ChevronRight className="h-5 w-5 mr-2 flex-shrink-0" />}
            <HeartPulse className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>Domain Health</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            {getStatusBadge(domainHealth.registrationStatus)}
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
              {isOpen ? 'Hide' : 'Show'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium flex items-center text-slate-700 mb-3">
                <Clock className="h-4 w-4 mr-1" />
                Domain Status
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm mb-4">
                <div className="text-muted-foreground">Registration Status:</div>
                <div>{getStatusBadge(domainHealth.registrationStatus)}</div>
                
                <div className="text-muted-foreground">Expires In:</div>
                <div>
                  {domainHealth.daysUntilExpiration > 0 ? (
                    <span className={
                      domainHealth.daysUntilExpiration < 30 ? 'text-red-600 font-medium' : 
                      domainHealth.daysUntilExpiration < 90 ? 'text-amber-600 font-medium' : ''
                    }>
                      {domainHealth.daysUntilExpiration} days
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">Expired</span>
                  )}
                </div>
                
                <div className="text-muted-foreground">Nameserver Status:</div>
                <div>{getStatusBadge(domainHealth.nameserverStatus)}</div>
              </div>
              
              <h4 className="text-xs font-medium text-slate-500 mb-2">Nameservers</h4>
              <div className="space-y-2">
                {domainHealth.nameserverDetails.map((ns, i) => (
                  <div key={i} className="bg-slate-50 p-2 rounded text-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <span className="font-mono text-xs break-all">{ns.server}</span>
                      {getStatusBadge(ns.status)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 break-all">
                      IPs: {ns.ips.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium flex items-center text-slate-700 mb-3">
                <HeartPulse className="h-4 w-4 mr-1" />
                Uptime Monitoring
              </h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-slate-50 rounded-md text-center">
                  <div className="text-xs text-muted-foreground mb-1">24h Uptime</div>
                  <div className="text-xl font-bold">{domainHealth.uptime.uptime24h}%</div>
                  <Progress value={domainHealth.uptime.uptime24h} className="h-1.5 mt-2" />
                </div>
                <div className="p-3 bg-slate-50 rounded-md text-center">
                  <div className="text-xs text-muted-foreground mb-1">7d Uptime</div>
                  <div className="text-xl font-bold">{domainHealth.uptime.uptime7d}%</div>
                  <Progress value={domainHealth.uptime.uptime7d} className="h-1.5 mt-2" />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                <h4 className="text-xs font-medium text-slate-500">Current Status</h4>
                <div className="text-xs text-muted-foreground">
                  Last check: {new Date(domainHealth.uptime.lastCheck).toLocaleString()}
                </div>
              </div>
              
              <div className="p-3 border rounded-md mb-4">
                {getStatusBadge(domainHealth.uptime.currentStatus)}
              </div>
              
              {domainHealth.uptime.history.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-slate-500 mb-2">History</h4>
                  <div className="space-y-1 max-h-40 overflow-auto">
                    {domainHealth.uptime.history.map((entry, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs p-1 border-b gap-2">
                        <div className="whitespace-nowrap overflow-hidden text-ellipsis">{new Date(entry.timestamp).toLocaleString()}</div>
                        <div className="flex items-center">
                          {entry.status === 'up' ? (
                            <Check className="h-3 w-3 text-green-600 mr-1 flex-shrink-0" />
                          ) : (
                            <X className="h-3 w-3 text-red-600 mr-1 flex-shrink-0" />
                          )}
                          <span>{entry.responseTime}ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {domainHealth.dnsPropagation.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">DNS Propagation</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">DNS Server</TableHead>
                      <TableHead className="whitespace-nowrap">Location</TableHead>
                      <TableHead className="whitespace-nowrap">Resolved IP</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {domainHealth.dnsPropagation.map((dns, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-xs break-all">{dns.server}</TableCell>
                        <TableCell className="whitespace-nowrap">{dns.location}</TableCell>
                        <TableCell className="font-mono text-xs break-all">{dns.resolvedIp || '—'}</TableCell>
                        <TableCell className="text-right">
                          {dns.propagated ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 whitespace-nowrap">
                              Propagated
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 whitespace-nowrap">
                              Not Propagated
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}