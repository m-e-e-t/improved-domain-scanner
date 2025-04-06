import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { BatchDomainScanRequest } from '@shared/schema';

// Form schema
const formSchema = z.object({
  domains: z.string().min(1, 'Please enter at least one domain'),
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

interface BatchScanFormProps {
  onScan: (data: BatchDomainScanRequest) => void;
  isLoading: boolean;
}

export default function BatchScanForm({ onScan, isLoading }: BatchScanFormProps) {
  const [domainCount, setDomainCount] = useState<number>(0);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domains: '',
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

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    // The batchDomainScanRequestSchema will transform the string to an array
    // in the API layer, so we're safe to pass the form data directly
    onScan(data as unknown as BatchDomainScanRequest);
  };

  const updateDomainCount = (value: string) => {
    if (!value.trim()) {
      setDomainCount(0);
      return;
    }
    
    const domains = value
      .split(/[\n,]/)
      .map(d => d.trim())
      .filter(d => d.length > 0);
      
    setDomainCount(domains.length);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Batch Domain Scanner</CardTitle>
        <CardDescription>
          Scan multiple domains at once. Enter domains separated by commas or newlines.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="domains"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domains</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="example.com, example.org&#10;domain.net"
                      className="h-32 font-mono"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        updateDomainCount(e.target.value);
                      }}
                    />
                  </FormControl>
                  <div className="flex justify-between">
                    <FormDescription>
                      Enter domains separated by commas or new lines
                    </FormDescription>
                    <Badge variant="outline" className="ml-auto">
                      {domainCount} {domainCount === 1 ? 'domain' : 'domains'}
                    </Badge>
                  </div>
                </FormItem>
              )}
            />

            <div>
              <h3 className="text-lg font-medium mb-2">Scan Options</h3>
              <Separator className="mb-4" />
              <h4 className="text-md font-medium mb-2 text-slate-700">Basic Scans</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <FormField
                  control={form.control}
                  name="options.dns"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 border">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel className="font-medium">DNS Records</FormLabel>
                        <FormDescription>
                          Retrieve DNS records (A, AAAA, MX, TXT, etc.)
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="options.ssl"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 border">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel className="font-medium">SSL Certificate</FormLabel>
                        <FormDescription>
                          Check SSL/TLS certificate validity and details
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="options.whois"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 border">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel className="font-medium">WHOIS Information</FormLabel>
                        <FormDescription>
                          Retrieve domain registration details
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="options.http"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 border">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel className="font-medium">HTTP Headers</FormLabel>
                        <FormDescription>
                          Analyze security headers and configurations
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="options.security"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 border">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel className="font-medium">Security Analysis</FormLabel>
                        <FormDescription>
                          Detect security vulnerabilities and provide recommendations
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <h4 className="text-md font-medium mb-2 text-slate-700">Advanced Scans</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="options.ports"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 border">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel className="font-medium">Port Scanning</FormLabel>
                        <FormDescription>
                          Detect open ports and services
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="options.technologies"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 border">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel className="font-medium">Technology Detection</FormLabel>
                        <FormDescription>
                          Identify web technologies and frameworks
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="options.subdomains"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 border">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel className="font-medium">Subdomain Discovery</FormLabel>
                        <FormDescription>
                          Find and validate subdomains
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="options.contentAnalysis"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 border">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel className="font-medium">Content Analysis</FormLabel>
                        <FormDescription>
                          Analyze webpage content and screenshot
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="options.networkAnalysis"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 border">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel className="font-medium">Network Analysis</FormLabel>
                        <FormDescription>
                          Analyze IP, geolocation, and network paths
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="options.domainHealth"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 border">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel className="font-medium">Domain Health</FormLabel>
                        <FormDescription>
                          Check domain status, expiration and propagation
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="options.enhancedSsl"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 border">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel className="font-medium">Enhanced SSL Analysis</FormLabel>
                        <FormDescription>
                          Detailed SSL/TLS security and vulnerabilities
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="options.malwareAnalysis"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 border">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel className="font-medium">Malware Analysis</FormLabel>
                        <FormDescription>
                          Check for malware, blacklists and threats
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading || domainCount === 0 || domainCount > 20}>
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Scanning...
                  </>
                ) : (
                  'Scan Domains'
                )}
              </Button>
            </div>
            
            {domainCount > 20 && (
              <p className="text-red-500 text-sm">
                Maximum 20 domains can be scanned at once.
              </p>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t px-6 py-3">
        <p className="text-sm text-gray-500">
          Batch scanning allows you to check multiple domains in a single operation.
          Results will be available in the History page.
        </p>
      </CardFooter>
    </Card>
  );
}