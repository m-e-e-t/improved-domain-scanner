declare module 'wappalyzer-core' {
  interface TechnologyAttribute {
    version?: string;
    categories?: string[] | number[];
    confidence?: number;
    [key: string]: any;
  }

  interface AnalysisOptions {
    url: string;
    html?: string;
    headers?: Record<string, string>;
    cookies?: Record<string, string>;
    scripts?: string[];
  }

  interface AnalysisResult {
    technologies: Record<string, TechnologyAttribute>;
    [key: string]: any;
  }

  export class Wappalyzer {
    constructor();
    analyze(options: AnalysisOptions): AnalysisResult;
  }
}