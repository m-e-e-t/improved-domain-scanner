import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  ChevronDown, 
  ChevronRight, 
  Network,
  MapPin,
  Server,
  Activity
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
import { Progress } from '@/components/ui/progress';
import { NetworkAnalysis } from '@shared/schema';

interface NetworkAnalysisSectionProps {
  networkAnalysis: NetworkAnalysis;
  isOpen: boolean;
  onToggle: () => void;
}

export default function NetworkAnalysisSection({ networkAnalysis, isOpen, onToggle }: NetworkAnalysisSectionProps) {
  return (
    <Card className="w-full border rounded-lg shadow-sm">
      <CardHeader className="p-4 border-b bg-slate-50 cursor-pointer" onClick={onToggle}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center">
            {isOpen ? <ChevronDown className="h-5 w-5 mr-2" /> : <ChevronRight className="h-5 w-5 mr-2" />}
            <Network className="h-5 w-5 mr-2" />
            Network Analysis
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              ASN: {networkAnalysis.asn.number}
            </Badge>
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
                <Server className="h-4 w-4 mr-1" />
                Network Information
              </h3>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-muted-foreground">IP Address:</div>
                <div className="col-span-2 font-mono">{networkAnalysis.ip}</div>
                
                <div className="text-muted-foreground">ASN:</div>
                <div className="col-span-2">
                  AS{networkAnalysis.asn.number} - {networkAnalysis.asn.name}
                </div>
                
                <div className="text-muted-foreground">Route:</div>
                <div className="col-span-2 font-mono">{networkAnalysis.asn.route}</div>
                
                <div className="text-muted-foreground">AS Type:</div>
                <div className="col-span-2">{networkAnalysis.asn.type}</div>
                
                <div className="text-muted-foreground">Domain:</div>
                <div className="col-span-2">{networkAnalysis.asn.domain}</div>
                
                <div className="text-muted-foreground">ISP:</div>
                <div className="col-span-2">{networkAnalysis.isp}</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium flex items-center text-slate-700 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                Geolocation
              </h3>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-muted-foreground">Country:</div>
                <div className="col-span-2">{networkAnalysis.geolocation.country}</div>
                
                <div className="text-muted-foreground">Region:</div>
                <div className="col-span-2">{networkAnalysis.geolocation.region}</div>
                
                <div className="text-muted-foreground">City:</div>
                <div className="col-span-2">{networkAnalysis.geolocation.city}</div>
                
                <div className="text-muted-foreground">Coordinates:</div>
                <div className="col-span-2">
                  {networkAnalysis.geolocation.lat}, {networkAnalysis.geolocation.lng}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium flex items-center text-slate-700 mb-3">
              <Activity className="h-4 w-4 mr-1" />
              Ping Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 rounded-md">
                <div className="text-xs text-muted-foreground mb-1">Min RTT</div>
                <div className="text-xl font-bold">{networkAnalysis.pingStats.min}ms</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-md">
                <div className="text-xs text-muted-foreground mb-1">Max RTT</div>
                <div className="text-xl font-bold">{networkAnalysis.pingStats.max}ms</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-md">
                <div className="text-xs text-muted-foreground mb-1">Avg RTT</div>
                <div className="text-xl font-bold">{networkAnalysis.pingStats.avg}ms</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-md">
                <div className="text-xs text-muted-foreground mb-1">Packet Loss</div>
                <div className="text-xl font-bold">{networkAnalysis.pingStats.loss}%</div>
                <Progress 
                  value={100 - networkAnalysis.pingStats.loss} 
                  className="h-1.5 mt-2"
                />
              </div>
            </div>
          </div>
          
          {networkAnalysis.traceroute.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">Traceroute</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hop</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Hostname</TableHead>
                    <TableHead className="text-right">RTT</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {networkAnalysis.traceroute.map((hop) => (
                    <TableRow key={hop.hop}>
                      <TableCell>{hop.hop}</TableCell>
                      <TableCell className="font-mono">{hop.ip}</TableCell>
                      <TableCell>{hop.hostname || '—'}</TableCell>
                      <TableCell className="text-right">{hop.rtt}ms</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}