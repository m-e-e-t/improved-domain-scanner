import { useState } from 'react';
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
  ShieldAlert, 
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Port } from '@shared/schema';

interface PortsSectionProps {
  ports: Port[];
  isOpen: boolean;
  onToggle: () => void;
}

export default function PortsSection({ ports, isOpen, onToggle }: PortsSectionProps) {
  return (
    <Card className="w-full border rounded-lg shadow-sm">
      <CardHeader className="p-4 border-b bg-slate-50 cursor-pointer" onClick={onToggle}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center">
            {isOpen ? <ChevronDown className="h-5 w-5 mr-2" /> : <ChevronRight className="h-5 w-5 mr-2" />}
            Port Scanning Results
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={ports.some(p => p.status === 'open') ? "destructive" : "outline"} className={!ports.some(p => p.status === 'open') ? "bg-green-50 text-green-700" : ""}>
              {ports.filter(p => p.status === 'open').length} Open Ports
            </Badge>
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
              {isOpen ? 'Hide' : 'Show'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="p-4">
          {ports.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Port</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead className="w-[120px] text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ports.map((port, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{port.port}</TableCell>
                    <TableCell>{port.service}</TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={port.status === 'open' ? 'destructive' : 
                                port.status === 'filtered' ? 'outline' : 'secondary'}
                      >
                        {port.status === 'open' ? 
                          <ShieldAlert className="h-3 w-3 mr-1 inline" /> : 
                          <ShieldCheck className="h-3 w-3 mr-1 inline" />}
                        {port.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No port scan results available.</p>
          )}
        </CardContent>
      )}
    </Card>
  );
}