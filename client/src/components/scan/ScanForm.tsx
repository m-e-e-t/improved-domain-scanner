import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ScanFormData } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

const formSchema = z.object({
  domains: z.string().min(1, "Please enter at least one domain"),
  options: z.object({
    whois: z.boolean().default(true),
    dns: z.boolean().default(true),
    http: z.boolean().default(true),
    ssl: z.boolean().default(true),
  }),
  advancedOptions: z.object({
    subdomains: z.boolean().default(false),
    ports: z.boolean().default(false),
    technologies: z.boolean().default(false),
    screenshots: z.boolean().default(false),
  }),
});

type ScanFormProps = {
  onScanStart: () => void;
};

export default function ScanForm({ onScanStart }: ScanFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ScanFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domains: "",
      options: {
        whois: true,
        dns: true,
        http: true,
        ssl: true,
      },
      advancedOptions: {
        subdomains: false,
        ports: false,
        technologies: false,
        screenshots: false,
      },
    },
  });
  
  const handleSubmit = async (data: ScanFormData) => {
    try {
      setIsSubmitting(true);
      const domains = data.domains
        .split("\n")
        .map(d => d.trim())
        .filter(d => d);
      
      if (domains.length === 0) {
        toast({
          title: "Error",
          description: "Please enter at least one domain",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Combine options
      const options = {
        ...data.options,
        ...data.advancedOptions,
      };
      
      // Call scan API
      await apiRequest("POST", "/api/scan", { domains, options });
      
      // Invalidate scan results query to trigger refresh
      queryClient.invalidateQueries({ queryKey: ["/api/scan/results"] });
      
      toast({
        title: "Scan started",
        description: `Started scanning ${domains.length} domain${domains.length > 1 ? 's' : ''}`,
      });
      
      onScanStart();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to start the scan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const clearForm = () => {
    form.reset({
      domains: "",
      options: {
        whois: true,
        dns: true,
        http: true,
        ssl: true,
      },
      advancedOptions: {
        subdomains: false,
        ports: false,
        technologies: false,
        screenshots: false,
      },
    });
  };
  
  return (
    <Card className="bg-white shadow rounded-lg p-2 mb-8">
      <CardContent className="pt-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Scan Domains</h2>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div>
            <label htmlFor="domainInput" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Domains
            </label>
            <Textarea
              id="domainInput"
              placeholder="Enter one domain per line (e.g., example.com)"
              rows={3}
              {...form.register("domains")}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            {form.formState.errors.domains && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.domains.message}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">Enter one domain per line. Do not include http:// or https://</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <fieldset>
                <legend className="text-sm font-medium text-gray-700 mb-2">Scan Options</legend>
                <div className="space-y-2">
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <Checkbox 
                        id="whois" 
                        checked={form.watch("options.whois")}
                        onCheckedChange={(checked) => 
                          form.setValue("options.whois", checked as boolean)
                        }
                        className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="whois" className="font-medium text-gray-700">WHOIS Information</label>
                      <p className="text-gray-500">Domain registration details</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <Checkbox
                        id="dns"
                        checked={form.watch("options.dns")}
                        onCheckedChange={(checked) => 
                          form.setValue("options.dns", checked as boolean)
                        }
                        className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="dns" className="font-medium text-gray-700">DNS Records</label>
                      <p className="text-gray-500">A, AAAA, MX, NS, TXT records</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <Checkbox
                        id="http"
                        checked={form.watch("options.http")}
                        onCheckedChange={(checked) => 
                          form.setValue("options.http", checked as boolean)
                        }
                        className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="http" className="font-medium text-gray-700">HTTP Headers</label>
                      <p className="text-gray-500">Security headers, server info</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <Checkbox
                        id="ssl"
                        checked={form.watch("options.ssl")}
                        onCheckedChange={(checked) => 
                          form.setValue("options.ssl", checked as boolean)
                        } 
                        className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="ssl" className="font-medium text-gray-700">SSL/TLS Certificate</label>
                      <p className="text-gray-500">Validity, encryption details</p>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
            
            <div>
              <fieldset>
                <legend className="text-sm font-medium text-gray-700 mb-2">Advanced Options</legend>
                <div className="space-y-2">
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <Checkbox
                        id="subdomains"
                        checked={form.watch("advancedOptions.subdomains")}
                        onCheckedChange={(checked) => 
                          form.setValue("advancedOptions.subdomains", checked as boolean)
                        }
                        className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="subdomains" className="font-medium text-gray-700">Subdomain Discovery</label>
                      <p className="text-gray-500">Find common subdomains</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <Checkbox
                        id="ports"
                        checked={form.watch("advancedOptions.ports")}
                        onCheckedChange={(checked) => 
                          form.setValue("advancedOptions.ports", checked as boolean)
                        }
                        className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="ports" className="font-medium text-gray-700">Port Scanning</label>
                      <p className="text-gray-500">Check common open ports</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <Checkbox
                        id="technologies"
                        checked={form.watch("advancedOptions.technologies")}
                        onCheckedChange={(checked) => 
                          form.setValue("advancedOptions.technologies", checked as boolean)
                        }
                        className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="technologies" className="font-medium text-gray-700">Technology Detection</label>
                      <p className="text-gray-500">Identify web technologies</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <Checkbox
                        id="screenshots"
                        checked={form.watch("advancedOptions.screenshots")}
                        onCheckedChange={(checked) => 
                          form.setValue("advancedOptions.screenshots", checked as boolean)
                        }
                        className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="screenshots" className="font-medium text-gray-700">Capture Screenshots</label>
                      <p className="text-gray-500">Take screenshots of sites</p>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={clearForm}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 mr-3"
            >
              Clear
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-secondary text-white"
              disabled={isSubmitting}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
              {isSubmitting ? "Starting scan..." : "Start Scan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
