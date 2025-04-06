import React from 'react';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose prose-slate max-w-none">
        <p className="text-muted-foreground mb-6">Last Updated: April 6, 2025</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Domain Scanner application and related services (collectively, the "Service"), 
            you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.
          </p>
          <p>
            We reserve the right to modify these Terms at any time. Your continued use of the Service following the 
            posting of any changes constitutes your acceptance of such changes.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p>
            Domain Scanner is a web-based tool that allows users to analyze and gather information about domains, websites, 
            and web servers. Our Service includes domain scanning features that collect and analyze various aspects of 
            domains, including but not limited to DNS records, SSL certificates, WHOIS information, HTTP headers, security 
            vulnerabilities, network attributes, and technology stacks.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">3. Prohibited Uses and Disclaimer of Liability</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="font-semibold text-red-700 mb-2">WARNING:</p>
            <p className="mb-2 text-red-800">
              This Service is provided for legitimate cybersecurity research, network administration, and educational purposes ONLY. 
              The Service owner disclaims all responsibility for any illegal activity conducted using this tool.
            </p>
            <p className="text-red-800">
              You are solely responsible for your use of the Service and must comply with all applicable laws and regulations.
            </p>
          </div>
          <p>You agree not to use the Service for any illegal or unauthorized purposes, including but not limited to:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Unauthorized access to systems, networks, or data (hacking)</li>
            <li>Denial of service attacks or other disruptive activities</li>
            <li>Any activity that violates the Computer Fraud and Abuse Act (CFAA) or similar laws</li>
            <li>Scanning domains, systems, or networks without proper authorization</li>
            <li>Collecting personal information in violation of privacy laws</li>
            <li>Any activity intended to bypass security measures</li>
            <li>Using the Service to harm, threaten, or harass others</li>
            <li>Any activity that could damage, disable, or impair the Service</li>
          </ul>
          <p className="font-semibold">
            The owner of this Service expressly disclaims all liability for how users utilize this tool. You assume 
            full responsibility for ensuring your use of the Service complies with all applicable laws and regulations.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Authorization Requirement</h2>
          <p>
            You may only use the Service to scan domains, systems, or networks for which you have explicit authorization to scan. 
            By using the Service, you represent and warrant that you have the legal right and authority to scan any target domain.
          </p>
          <p>
            You acknowledge that scanning domains without proper authorization may violate various laws, including 
            but not limited to computer crime statutes, cybersecurity regulations, and terms of service agreements.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by the Service provider and are 
            protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. User Data</h2>
          <p>
            We may collect and store data related to your use of the Service, including the domains you scan and the 
            results of those scans. This information is subject to our Privacy Policy, which is incorporated by reference into these Terms.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL THE SERVICE PROVIDER, ITS AFFILIATES, OFFICERS, 
            DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, 
            OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR 
            OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO YOUR USE OF, OR INABILITY TO USE, THE SERVICE.
          </p>
          <p>
            THE SERVICE PROVIDER MAKES NO WARRANTY THAT THE SERVICE WILL MEET YOUR REQUIREMENTS, BE AVAILABLE ON AN 
            UNINTERRUPTED, SECURE, OR ERROR-FREE BASIS, OR THAT THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE 
            SERVICE WILL BE ACCURATE OR RELIABLE.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless the Service provider, its affiliates, licensors, and 
            service providers, and its and their respective officers, directors, employees, contractors, agents, 
            licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, 
            awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating 
            to your violation of these Terms or your use of the Service, including, but not limited to, any use of the 
            Service that violates applicable laws or regulations.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the 
            Service provider is established, without regard to its conflict of law provisions.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
          <p>
            We may terminate or suspend your access to the Service immediately, without prior notice or liability, 
            for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will 
            provide notice of any changes by posting the new Terms on this page. Your continued use of the Service 
            after any such changes constitutes your acceptance of the new Terms.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at: legal@domainscanner.example.com
          </p>
        </section>
        
        <div className="mt-10 p-4 border-t">
          <p className="font-semibold">By using this Service, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
        </div>
      </div>
    </div>
  );
}