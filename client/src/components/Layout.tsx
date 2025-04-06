import React, { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Globe, BarChart2, History, Search, Menu, X, Scale,
  Home, Shield, Settings, HelpCircle, Download, List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const isMobile = useIsMobile();

  // Define navigation items
  const navItems = [
    { href: '/', label: 'Scanner', icon: <Search className="h-4 w-4 mr-2" /> },
    { href: '/dashboard', label: 'Dashboard', icon: <BarChart2 className="h-4 w-4 mr-2" /> },
    { href: '/history', label: 'History', icon: <History className="h-4 w-4 mr-2" /> },
    { href: '/legal', label: 'Legal', icon: <Scale className="h-4 w-4 mr-2" /> },
  ];
  
  const footerItems = [
    { href: '/privacy-policy', label: 'Privacy Policy', icon: <Shield className="h-4 w-4 mr-2" /> },
    { href: '/terms-of-service', label: 'Terms of Service', icon: <HelpCircle className="h-4 w-4 mr-2" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white shadow z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer group">
              <div className="bg-gradient-to-r from-primary to-blue-600 p-2 rounded-lg transition-transform group-hover:scale-105">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 inline-block text-transparent bg-clip-text">
                  DomainScanner
                </h1>
                <div className="text-xs text-slate-500 -mt-1">Advanced Web Infrastructure Analysis</div>
              </div>
            </div>
          </Link>
          
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader className="mb-4">
                  <SheetTitle>
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-primary to-blue-600 p-1.5 rounded-lg">
                        <Globe className="h-5 w-5 text-white" />
                      </div>
                      <span className="ml-2 font-semibold">DomainScanner</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Navigation</h3>
                    <div className="space-y-1.5">
                      {navItems.map(item => (
                        <Link href={item.href} key={item.label}>
                          <Button 
                            variant={location === item.href ? "default" : "ghost"} 
                            className="w-full justify-start"
                            size="sm"
                          >
                            {React.cloneElement(item.icon, { className: "h-4 w-4 mr-2" })}
                            {item.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Legal</h3>
                    <div className="space-y-1.5">
                      {footerItems.map(item => (
                        <Link href={item.href} key={item.label}>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            size="sm"
                          >
                            {React.cloneElement(item.icon, { className: "h-4 w-4 mr-2" })}
                            {item.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <a 
                      href="https://github.com/m-e-e-t/domain-scanner" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center"
                    >
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub Repository
                      </Button>
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <nav className="hidden md:block">
            <ul className="flex items-center space-x-1">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>
                    <Button 
                      variant={location === item.href ? "default" : "ghost"} 
                      size="sm"
                      className="flex items-center"
                    >
                      {item.icon}
                      {item.label}
                    </Button>
                  </Link>
                </li>
              ))}
              <li className="ml-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a 
                        href="https://github.com/m-e-e-t/domain-scanner" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="icon" className="rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </Button>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View on GitHub</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </li>
            </ul>
          </nav>
        </div>

      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-primary to-blue-600 p-1.5 rounded-lg">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <h2 className="ml-2 text-lg font-semibold bg-gradient-to-r from-primary to-blue-600 inline-block text-transparent bg-clip-text">
                  DomainScanner
                </h2>
              </div>
              <p className="text-slate-400 text-sm mt-2 max-w-md">
                A comprehensive domain analysis tool for security professionals and web administrators
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-center md:text-left">
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">Tools</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/" className="text-slate-300 hover:text-white transition-colors">Domain Scanner</Link></li>
                  <li><Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link></li>
                  <li><Link href="/history" className="text-slate-300 hover:text-white transition-colors">Scan History</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">About</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/legal" className="text-slate-300 hover:text-white transition-colors">Legal Information</Link></li>
                  <li><Link href="/privacy-policy" className="text-slate-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms-of-service" className="text-slate-300 hover:text-white transition-colors">Terms of Service</Link></li>
                  <li>
                    <a 
                      href="https://github.com/m-e-e-t/domain-scanner" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700/50 mt-8 pt-6 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} DomainScanner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
