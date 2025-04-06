import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  ChevronDown, 
  ChevronRight, 
  Code,
  Layers,
  Database,
  Globe,
  Server
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Technology } from '@shared/schema';

interface TechnologiesSectionProps {
  technologies: Technology[];
  isOpen: boolean;
  onToggle: () => void;
}

export default function TechnologiesSection({ technologies, isOpen, onToggle }: TechnologiesSectionProps) {
  // Group technologies by category
  const categorized: Record<string, Technology[]> = {};
  
  technologies.forEach(tech => {
    if (!categorized[tech.category]) {
      categorized[tech.category] = [];
    }
    categorized[tech.category].push(tech);
  });

  // Get icon for a category
  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('framework') || lowerCategory.includes('javascript')) {
      return <Code className="h-4 w-4 mr-1" />;
    } else if (lowerCategory.includes('cms') || lowerCategory.includes('content')) {
      return <Layers className="h-4 w-4 mr-1" />;
    } else if (lowerCategory.includes('database') || lowerCategory.includes('storage')) {
      return <Database className="h-4 w-4 mr-1" />;
    } else if (lowerCategory.includes('server') || lowerCategory.includes('hosting')) {
      return <Server className="h-4 w-4 mr-1" />;
    } else {
      return <Globe className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <Card className="w-full border rounded-lg shadow-sm">
      <CardHeader className="p-4 border-b bg-slate-50 cursor-pointer" onClick={onToggle}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center">
            {isOpen ? <ChevronDown className="h-5 w-5 mr-2" /> : <ChevronRight className="h-5 w-5 mr-2" />}
            Technology Detection
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {technologies.length} Technologies
            </Badge>
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
              {isOpen ? 'Hide' : 'Show'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="p-4">
          {technologies.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(categorized).map(([category, techs]) => (
                <div key={category} className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center text-slate-700">
                    {getCategoryIcon(category)}
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {techs.map((tech, i) => (
                      <Badge key={i} className="text-xs py-1">
                        {tech.name}
                        {tech.version && <span className="ml-1 opacity-70">v{tech.version}</span>}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No technology detection results available.</p>
          )}
        </CardContent>
      )}
    </Card>
  );
}