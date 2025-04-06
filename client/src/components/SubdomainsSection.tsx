import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ChevronDown, 
  ChevronRight,
  Globe,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Subdomain } from '@shared/schema';

interface SubdomainsSectionProps {
  subdomains: Subdomain[];
  isOpen: boolean;
  onToggle: () => void;
}

export default function SubdomainsSection({ subdomains, isOpen, onToggle }: SubdomainsSectionProps) {
  return (
    <Card className="w-full border rounded-lg shadow-sm">
      <CardHeader className="p-4 border-b bg-slate-50 cursor-pointer" onClick={onToggle}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle className="text-lg font-semibold flex items-center">
            {isOpen ? <ChevronDown className="h-5 w-5 mr-2 flex-shrink-0" /> : <ChevronRight className="h-5 w-5 mr-2 flex-shrink-0" />}
            <Globe className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>Subdomain Discovery</span>
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="whitespace-nowrap">
              {subdomains.length} Subdomains
            </Badge>
            <Badge variant="outline" className="whitespace-nowrap">
              {subdomains.filter(s => s.isAlive).length} Active
            </Badge>
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
              {isOpen ? 'Hide' : 'Show'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="p-4 divide-y">
          {subdomains.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Subdomain</TableHead>
                    <TableHead className="whitespace-nowrap">IP Address</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subdomains.map((subdomain, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium break-all">{subdomain.name}</TableCell>
                      <TableCell className="whitespace-nowrap">{subdomain.ip || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        {subdomain.isAlive ? (
                          <Badge className="bg-green-100 text-green-800 flex items-center justify-center w-20 ml-auto">
                            <CheckCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span>Active</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center justify-center w-20 ml-auto">
                            <XCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span>Inactive</span>
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">No subdomains discovered.</p>
          )}
        </CardContent>
      )}
    </Card>
  );
}