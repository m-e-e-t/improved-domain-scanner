import { useState } from 'react';
import { SecurityReport, SecurityFinding } from '@shared/schema';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger
} from "@/components/ui/accordion";
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, ShieldAlert, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface SecuritySectionProps {
  securityReport: SecurityReport;
  isOpen: boolean;
  onToggle: () => void;
}

export default function SecuritySection({ securityReport, isOpen, onToggle }: SecuritySectionProps) {
  const [expandedFindingId, setExpandedFindingId] = useState<string | null>(null);

  const toggleFinding = (id: string) => {
    if (expandedFindingId === id) {
      setExpandedFindingId(null);
    } else {
      setExpandedFindingId(id);
    }
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-amber-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return '[&>div]:bg-green-600';
    if (score >= 70) return '[&>div]:bg-amber-500';
    if (score >= 50) return '[&>div]:bg-orange-500';
    return '[&>div]:bg-red-600';
  };

  const getStatusIcon = (status: SecurityFinding['status']) => {
    switch (status) {
      case 'secure':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'error':
        return <ShieldAlert className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-500';
      case 'medium':
        return 'bg-amber-500';
      case 'high':
        return 'bg-orange-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-muted/50"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-2">
          <ShieldAlert className="h-5 w-5" />
          <h3 className="font-semibold">Security Analysis</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className={cn("font-bold text-lg", getSecurityScoreColor(securityReport.score))}>
            {securityReport.score}/100
          </span>
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-4 border-t">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Security Score</span>
              <span className={cn("font-bold", getSecurityScoreColor(securityReport.score))}>
                {securityReport.score}/100
              </span>
            </div>
            <Progress 
              value={securityReport.score} 
              className={`h-2 ${getProgressColor(securityReport.score)}`}
            />
          </div>

          {securityReport.vulnerabilities.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Vulnerabilities</h4>
              <ul className="space-y-2">
                {securityReport.vulnerabilities.map((vuln, index) => (
                  <li key={index} className="bg-muted rounded-md p-3">
                    <div className="flex items-start space-x-2">
                      <Badge className={cn(getSeverityColor(vuln.severity), "mt-0.5")}>
                        {vuln.severity}
                      </Badge>
                      <div>
                        <p className="font-medium">{vuln.description}</p>
                        {vuln.details && <p className="text-sm text-muted-foreground mt-1">{vuln.details}</p>}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-6">
            <h4 className="font-semibold mb-2">Findings</h4>
            <Accordion type="single" collapsible className="w-full">
              {securityReport.findings.map((finding, index) => (
                <AccordionItem key={index} value={`finding-${index}`}>
                  <AccordionTrigger className="py-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(finding.status)}
                      <span>{finding.message}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{finding.details}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {securityReport.recommendations.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Recommendations</h4>
              <ul className="list-disc pl-5 space-y-1">
                {securityReport.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-muted-foreground">{recommendation}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}