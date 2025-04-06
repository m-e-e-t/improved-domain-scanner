import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Globe, Search, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { DomainScanRequest } from '@shared/schema';
import { motion } from 'framer-motion';

interface DomainScanFormProps {
  onScan: (data: DomainScanRequest) => void;
  isLoading: boolean;
}

const formSchema = z.object({
  domain: z.string()
    .min(1, { message: 'Domain is required' })
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, {
      message: 'Please enter a valid domain (e.g., example.com)',
    }),
  options: z.object({
    dns: z.boolean().default(true),
    ssl: z.boolean().default(true),
    whois: z.boolean().default(true),
    http: z.boolean().default(true),
    ports: z.boolean().default(false),
    technologies: z.boolean().default(false),
    subdomains: z.boolean().default(false),
    security: z.boolean().default(true),
    contentAnalysis: z.boolean().default(false),
    networkAnalysis: z.boolean().default(false),
    domainHealth: z.boolean().default(false),
    enhancedSsl: z.boolean().default(false),
    malwareAnalysis: z.boolean().default(false),
  }),
});

export default function DomainScanForm({ onScan, isLoading }: DomainScanFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: '',
      options: {
        dns: true,
        ssl: true,
        whois: true,
        http: true,
        ports: false,
        technologies: false,
        subdomains: false,
        security: true,
        contentAnalysis: false,
        networkAnalysis: false,
        domainHealth: false,
        enhancedSsl: false,
        malwareAnalysis: false,
      },
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onScan(data);
  };

  const [activeTab, setActiveTab] = useState<string>("all");

  // Scan option descriptions for tooltips
  const scanDescriptions = {
    dns: "Analyze DNS records (A, AAAA, MX, CNAME, TXT)",
    ssl: "Check SSL certificate information and validity",
    whois: "Retrieve domain registration and ownership information",
    http: "Review HTTP headers and security configurations",
    security: "Perform basic security analysis of the domain",
    ports: "Detect open ports and running services",
    technologies: "Identify technologies, frameworks, and libraries",
    subdomains: "Discover subdomains associated with the target domain",
    contentAnalysis: "Analyze website content, structure, and security issues",
    networkAnalysis: "Examine network infrastructure, routing, and connectivity",
    domainHealth: "Check domain registration status and nameserver health",
    enhancedSsl: "Perform detailed SSL analysis including protocols and vulnerabilities",
    malwareAnalysis: "Scan for indicators of malware or blacklisting",
  };

  // Scan option categories
  const basicScans = ["dns", "ssl", "whois", "http", "security"];
  const advancedScans = [
    "ports", "technologies", "subdomains", "contentAnalysis", 
    "networkAnalysis", "domainHealth", "enhancedSsl", "malwareAnalysis"
  ];

  // Handler to toggle all options in a category
  const toggleCategory = (category: string[], enable: boolean) => {
    const updatedOptions = { ...form.getValues().options };
    
    category.forEach(opt => {
      updatedOptions[opt as keyof typeof updatedOptions] = enable;
    });
    
    // Update all form values at once
    form.setValue("options", updatedOptions);
  };

  // Handler to select scan profile presets
  const selectProfile = (profile: string) => {
    const updatedOptions = { ...form.getValues().options };
    
    // Reset all options first
    Object.keys(updatedOptions).forEach(key => {
      updatedOptions[key as keyof typeof updatedOptions] = false;
    });
    
    // Set options based on selected profile
    if (profile === "basic") {
      basicScans.forEach(opt => {
        updatedOptions[opt as keyof typeof updatedOptions] = true;
      });
    } else if (profile === "comprehensive") {
      [...basicScans, "ports", "technologies", "contentAnalysis"].forEach(opt => {
        updatedOptions[opt as keyof typeof updatedOptions] = true;
      });
    } else if (profile === "advanced") {
      [...basicScans, ...advancedScans].forEach(opt => {
        updatedOptions[opt as keyof typeof updatedOptions] = true;
      });
    }

    // Update form values
    form.setValue("options", updatedOptions);
  };

  // Render the form field for a scan option with explicit IDs for accessibility
  const renderScanOption = (name: string, label: string, description: string) => {
    const checkboxId = `option-${name}-check`;
    
    return (
      <FormField
        control={form.control}
        name={`options.${name}` as any}
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2 relative">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                id={checkboxId}
              />
            </FormControl>
            <div className="flex items-center">
              <FormLabel htmlFor={checkboxId} className="text-sm text-slate-700 mr-1 cursor-pointer">
                {label}
              </FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-xs">{description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </FormItem>
        )}
      />
    );
  };

  return (
    <Card className="bg-white rounded-lg shadow-md mb-8">
      <CardContent className="p-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-slate-800 flex items-center">
            <Globe className="mr-2 h-5 w-5 text-primary" />
            Scan Domain
          </h2>
        </motion.div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Domain input field */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="domain-input" className="text-sm font-medium text-slate-700">Domain Name</FormLabel>
                    <FormControl>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="h-5 w-5 text-slate-400" />
                        </div>
                        <Input
                          {...field}
                          id="domain-input"
                          placeholder="example.com"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <p className="mt-1 text-sm text-slate-500">Enter a domain name without http/https</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            
            {/* Scan profile selection */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-slate-50 p-3 rounded-md border border-slate-200"
            >
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Scan Profile</h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className={`text-xs ${activeTab === "basic" ? 'bg-primary/10 border-primary/30' : ''}`}
                  onClick={() => { selectProfile("basic"); setActiveTab("basic"); }}
                >
                  Basic
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className={`text-xs ${activeTab === "comprehensive" ? 'bg-primary/10 border-primary/30' : ''}`}
                  onClick={() => { selectProfile("comprehensive"); setActiveTab("comprehensive"); }}
                >
                  Comprehensive
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className={`text-xs ${activeTab === "advanced" ? 'bg-primary/10 border-primary/30' : ''}`}
                  onClick={() => { selectProfile("advanced"); setActiveTab("advanced"); }}
                >
                  Advanced
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className={`text-xs ${activeTab === "all" ? 'bg-primary/10 border-primary/30' : ''}`}
                  onClick={() => setActiveTab("all")}
                >
                  Custom
                </Button>
              </div>
            </motion.div>
            
            {/* Custom scan options - accordion style for mobile */}
            {activeTab === "all" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="basic-scans">
                    <AccordionTrigger className="text-sm font-semibold text-slate-700 py-2">
                      Basic Scans
                    </AccordionTrigger>
                    <div className="flex gap-1 px-4 pb-2">
                      <button 
                        type="button" 
                        className="inline-flex h-6 items-center justify-center rounded-md border border-slate-200 bg-white px-2 text-xs font-medium shadow-sm transition-colors hover:bg-slate-100"
                        onClick={() => toggleCategory(basicScans, true)}
                      >
                        Select All
                      </button>
                      <button 
                        type="button" 
                        className="inline-flex h-6 items-center justify-center rounded-md border border-slate-200 bg-white px-2 text-xs font-medium shadow-sm transition-colors hover:bg-slate-100"
                        onClick={() => toggleCategory(basicScans, false)}
                      >
                        Clear
                      </button>
                    </div>
                    <AccordionContent className="pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-2">
                        {renderScanOption("dns", "DNS Records", scanDescriptions.dns)}
                        {renderScanOption("ssl", "SSL Certificate", scanDescriptions.ssl)}
                        {renderScanOption("whois", "WHOIS Information", scanDescriptions.whois)}
                        {renderScanOption("http", "HTTP Headers", scanDescriptions.http)}
                        {renderScanOption("security", "Security Analysis", scanDescriptions.security)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="advanced-scans">
                    <AccordionTrigger className="text-sm font-semibold text-slate-700 py-2">
                      Advanced Scans
                    </AccordionTrigger>
                    <div className="flex gap-1 px-4 pb-2">
                      <button 
                        type="button" 
                        className="inline-flex h-6 items-center justify-center rounded-md border border-slate-200 bg-white px-2 text-xs font-medium shadow-sm transition-colors hover:bg-slate-100"
                        onClick={() => toggleCategory(advancedScans, true)}
                      >
                        Select All
                      </button>
                      <button 
                        type="button" 
                        className="inline-flex h-6 items-center justify-center rounded-md border border-slate-200 bg-white px-2 text-xs font-medium shadow-sm transition-colors hover:bg-slate-100"
                        onClick={() => toggleCategory(advancedScans, false)}
                      >
                        Clear
                      </button>
                    </div>
                    <AccordionContent className="pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                        {renderScanOption("ports", "Port Scanning", scanDescriptions.ports)}
                        {renderScanOption("technologies", "Technology Detection", scanDescriptions.technologies)}
                        {renderScanOption("subdomains", "Subdomain Discovery", scanDescriptions.subdomains)}
                        {renderScanOption("contentAnalysis", "Content Analysis", scanDescriptions.contentAnalysis)}
                        {renderScanOption("networkAnalysis", "Network Analysis", scanDescriptions.networkAnalysis)}
                        {renderScanOption("domainHealth", "Domain Health", scanDescriptions.domainHealth)}
                        {renderScanOption("enhancedSsl", "Enhanced SSL Analysis", scanDescriptions.enhancedSsl)}
                        {renderScanOption("malwareAnalysis", "Malware Analysis", scanDescriptions.malwareAnalysis)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            )}
            
            <Separator className="my-4" />
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <Button 
                type="submit" 
                className="w-full inline-flex items-center justify-center py-3 bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-700 shadow-md hover:shadow-lg transition-all"
                disabled={isLoading}
              >
                <Search className="h-5 w-5 mr-2" />
                {isLoading ? 'Scanning...' : 'Scan Domain'}
              </Button>
            </motion.div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
