import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-slate max-w-none">
        <p className="text-muted-foreground mb-6">Last Updated: April 6, 2025</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Welcome to Domain Scanner ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, 
            and safeguard your information when you use our domain scanning application and related services (collectively, the "Service").
          </p>
          <p>
            We respect your privacy and are committed to protecting your personal information. Please read this Privacy Policy 
            carefully to understand our practices regarding your information and how we will treat it.
          </p>
          <p>
            By using the Service, you agree to the collection and use of information in accordance with this Privacy Policy. 
            If you do not agree with our policies and practices, do not use the Service.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <p>We collect several types of information from and about users of our Service, including:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Scan Data:</strong> When you use our domain scanning features, we collect and store information 
              about the domains you scan, including domain names, scan results, and timestamps.
            </li>
            <li>
              <strong>Usage Information:</strong> Information about your use of the Service, including your browser type, 
              access times, pages viewed, and the page you visited before navigating to our Service.
            </li>
            <li>
              <strong>Device Information:</strong> Information about the computer or mobile device you use to access our 
              Service, including hardware model, operating system, IP address, and unique device identifiers.
            </li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p>We use the information we collect about you for various purposes, including to:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Provide, maintain, and improve our Service</li>
            <li>Process and complete your domain scanning requests</li>
            <li>Send you technical notices, updates, security alerts, and support messages</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our Service</li>
            <li>Detect, prevent, and address technical issues</li>
            <li>Respond to your comments, questions, and requests</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Sharing of Information</h2>
          <p>We may share the information we collect in various ways, including:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>With Service Providers:</strong> We may share information with third-party vendors, 
              consultants, and other service providers who need access to such information to carry out 
              work on our behalf.
            </li>
            <li>
              <strong>For Legal Reasons:</strong> We may disclose information if we believe that disclosure 
              is necessary to comply with any applicable law, regulation, legal process, or governmental request.
            </li>
            <li>
              <strong>To Protect Rights and Safety:</strong> We may disclose information when we believe it is 
              necessary to protect our rights, property, or safety and that of our users and others.
            </li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your personal information from loss, theft, 
            misuse, unauthorized access, disclosure, alteration, and destruction. However, no internet or 
            electronic storage system is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
          <p>
            We store the information we collect for as long as is necessary for the purpose(s) for which 
            we collected it or for other legitimate business purposes, including to meet our legal, 
            regulatory, or other compliance obligations.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Changes to Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes to our practices or for 
            other operational, legal, or regulatory reasons. The updated policy will be posted on this page 
            with a revised "Last Updated" date. Your continued use of the Service after we make changes is 
            deemed to be acceptance of those changes, so please check the policy periodically for updates.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or our data practices, please 
            contact us at: support@domainscanner.example.com
          </p>
        </section>
      </div>
    </div>
  );
}