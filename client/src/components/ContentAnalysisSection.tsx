import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  ChevronDown, 
  ChevronRight, 
  FileText,
  Tag,
  Languages,
  Flag,
  Image,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ContentAnalysis } from '@shared/schema';

interface ContentAnalysisSectionProps {
  contentAnalysis: ContentAnalysis;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ContentAnalysisSection({ contentAnalysis, isOpen, onToggle }: ContentAnalysisSectionProps) {
  return (
    <Card className="w-full border rounded-lg shadow-sm">
      <CardHeader className="p-4 border-b bg-slate-50 cursor-pointer" onClick={onToggle}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center">
            {isOpen ? <ChevronDown className="h-5 w-5 mr-2" /> : <ChevronRight className="h-5 w-5 mr-2" />}
            <FileText className="h-5 w-5 mr-2" />
            Content Analysis
          </CardTitle>
          <div className="flex items-center space-x-2">
            {contentAnalysis.suspiciousIndicators && contentAnalysis.suspiciousIndicators.length > 0 && (
              <Badge variant="destructive" className="flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {contentAnalysis.suspiciousIndicators.length} Suspicious Indicators
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
              {isOpen ? 'Hide' : 'Show'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium flex items-center text-slate-700 mb-2">
                  <Image className="h-4 w-4 mr-1" />
                  Screenshot
                </h3>
                {contentAnalysis.screenshot ? (
                  <div className="border rounded-md p-1 bg-slate-50">
                    <img 
                      src={`data:image/png;base64,${contentAnalysis.screenshot}`} 
                      alt="Website Screenshot" 
                      className="rounded w-full"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No screenshot available</p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium flex items-center text-slate-700 mb-2">
                  <Tag className="h-4 w-4 mr-1" />
                  Content Details
                </h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="text-muted-foreground">Content Type:</div>
                  <div>{contentAnalysis.contentType}</div>
                  {contentAnalysis.contentCategory && (
                    <>
                      <div className="text-muted-foreground">Category:</div>
                      <div>{contentAnalysis.contentCategory}</div>
                    </>
                  )}
                  <div className="text-muted-foreground">Word Count:</div>
                  <div>{contentAnalysis.wordCount.toLocaleString()}</div>
                  <div className="text-muted-foreground">Login Form:</div>
                  <div>{contentAnalysis.hasLoginForm ? 'Yes' : 'No'}</div>
                  <div className="text-muted-foreground">Social Media:</div>
                  <div>{contentAnalysis.hasSocialMedia ? 'Yes' : 'No'}</div>
                  <div className="text-muted-foreground">Cookie Consent:</div>
                  <div>{contentAnalysis.hasCookieConsent ? 'Yes' : 'No'}</div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium flex items-center text-slate-700 mb-2">
                  <Languages className="h-4 w-4 mr-1" />
                  Languages & Keywords
                </h3>
                <div className="space-y-2">
                  {contentAnalysis.languages.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Languages</p>
                      <div className="flex flex-wrap gap-1">
                        {contentAnalysis.languages.map((lang, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {contentAnalysis.keywords.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Top Keywords</p>
                      <div className="flex flex-wrap gap-1">
                        {contentAnalysis.keywords.map((keyword, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {contentAnalysis.textContent && (
            <div>
              <h3 className="text-sm font-medium flex items-center text-slate-700 mb-2">
                <FileText className="h-4 w-4 mr-1" />
                Text Content Sample
              </h3>
              <div className="bg-slate-50 p-3 rounded-md text-sm font-mono max-h-40 overflow-auto">
                {contentAnalysis.textContent}
              </div>
            </div>
          )}
          
          {contentAnalysis.suspiciousIndicators && contentAnalysis.suspiciousIndicators.length > 0 && (
            <div>
              <h3 className="text-sm font-medium flex items-center text-slate-700 mb-2">
                <Flag className="h-4 w-4 mr-1" />
                Suspicious Indicators
              </h3>
              <div className="space-y-2">
                {contentAnalysis.suspiciousIndicators.map((indicator, i) => (
                  <div key={i} className="bg-red-50 border border-red-100 rounded-md p-3">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-red-800">{indicator.type}</span>
                      <Badge 
                        variant={
                          indicator.severity === 'high' ? 'destructive' : 
                          indicator.severity === 'medium' ? 'default' : 'secondary'
                        }
                      >
                        {indicator.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-red-700">{indicator.description}</p>
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