import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, FileText, Shield, Scale } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Legal() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Legal Information</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Important legal documents governing the use of Domain Scanner application
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 mb-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Terms of Service</CardTitle>
            </div>
            <CardDescription>
              Rules and guidelines for using our application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Our Terms of Service outline the rules and guidelines for using the Domain Scanner application, 
              including your responsibilities, prohibited uses, and limitations of liability.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
              <p className="text-amber-800 text-sm">
                <strong>Important:</strong> Our Terms include specific prohibitions against illegal activities 
                and a disclaimer of liability. Users are solely responsible for ensuring they have proper 
                authorization to scan any domain.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/terms-of-service">
              <Button className="w-full">
                <span>Read Terms of Service</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Privacy Policy</CardTitle>
            </div>
            <CardDescription>
              How we collect, use, and protect your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Our Privacy Policy explains what information we collect when you use Domain Scanner, 
              how we use this information, and the steps we take to protect your privacy.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3">
              <p className="text-slate-800 text-sm">
                We value your privacy and are committed to being transparent about our data practices. 
                This document outlines how scan data is handled and your rights regarding your information.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/privacy-policy">
              <Button className="w-full">
                <span>Read Privacy Policy</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="mt-1">
            <Scale className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Legal Compliance Notice</h2>
            <p className="mb-3">
              Domain Scanner is designed for legitimate cybersecurity research, network administration, 
              and educational purposes only. The owner of this application expressly disclaims all 
              responsibility for any illegal activity conducted using this tool.
            </p>
            <p className="font-semibold text-sm">
              Users must ensure they have proper authorization before scanning any domains or systems 
              and must comply with all applicable laws and regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}