import type { ContentAnalysis } from '@shared/schema';

/**
 * Content Analysis Scanner
 * This scanner analyzes the content of a website, including:
 * - Taking a screenshot (simulated here)
 * - Determining content type and category
 * - Detecting languages used on the site
 * - Extracting keywords and text content
 * - Identifying forms, social media links, and other elements
 * - Checking for suspicious content indicators
 */
export async function scanContent(domain: string): Promise<ContentAnalysis | null> {
  try {
    // In a real implementation, this would use headless browser like Puppeteer
    // For this demo, we'll simulate the content analysis
    
    // Simulated fetch to get basic content
    const fetchUrl = `https://${domain.replace(/^https?:\/\//i, '')}`;
    // Create an abort controller with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(fetchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      signal: controller.signal
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status} ${response.statusText}`);
    }
    
    const text = await response.text();
    
    // Extract and analyze text content
    const contentType = response.headers.get('Content-Type') || 'unknown';
    const textContent = extractTextContent(text);
    const languages = detectLanguages(textContent);
    const keywords = extractKeywords(textContent);
    const wordCount = countWords(textContent);
    
    // Form and social media detection
    const hasLoginForm = detectLoginForm(text);
    const hasSocialMedia = detectSocialMedia(text);
    const hasCookieConsent = detectCookieConsent(text);
    
    // Suspicious content detection
    const suspiciousIndicators = detectSuspiciousContent(text);
    
    // Create simulated screenshot (would be base64 encoded in real implementation)
    const screenshot = undefined; // We're not generating real screenshots in this demo
    
    // Content categorization (would use machine learning in real implementation)
    const contentCategory = categorizeContent(textContent);
    
    return {
      contentType,
      contentCategory,
      languages,
      keywords,
      textContent: textContent.substring(0, 1000) + (textContent.length > 1000 ? '...' : ''),
      wordCount,
      hasLoginForm,
      hasSocialMedia,
      hasCookieConsent,
      suspiciousIndicators,
      screenshot
    };
  } catch (error) {
    console.error(`Error during content analysis for ${domain}:`, error);
    return null;
  }
}

/**
 * Extract clean text content from HTML
 */
function extractTextContent(html: string): string {
  // In a real implementation, this would use a proper HTML parser
  // This is a simple regex-based approach for demonstration
  const stripped = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return stripped;
}

/**
 * Detect languages used on the page
 */
function detectLanguages(text: string): string[] {
  // In a real implementation, this would use a language detection library
  // For this demo, we'll make some assumptions based on common patterns
  
  // Very simplified language detection for demo
  const languages = ['en']; // Default to English
  
  // Check for some non-English character patterns
  if (/[\u0400-\u04FF]/.test(text)) languages.push('ru'); // Cyrillic (Russian)
  if (/[\u00C0-\u00FF]/.test(text)) languages.push('fr'); // French accents
  if (/[\u0600-\u06FF]/.test(text)) languages.push('ar'); // Arabic
  if (/[\u4E00-\u9FFF]/.test(text)) languages.push('zh'); // Chinese
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) languages.push('ja'); // Japanese

  return languages;
}

/**
 * Extract keywords from text
 */
function extractKeywords(text: string): string[] {
  // In a real implementation, this would use NLP techniques
  // For this demo, we'll use a simple frequency-based approach
  
  // Simple word frequency analysis
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word));
  
  // Count frequency
  const wordFreq = new Map<string, number>();
  words.forEach(word => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  });
  
  // Get top keywords
  return Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Detect login forms in HTML
 */
function detectLoginForm(html: string): boolean {
  const loginPatterns = [
    /<form[^>]*>[\s\S]*?<input[^>]*type=["']password["'][^>]*>[\s\S]*?<\/form>/i,
    /<input[^>]*type=["']password["'][^>]*>/i,
    /login|sign in|signin|log in|password/i
  ];
  
  return loginPatterns.some(pattern => pattern.test(html));
}

/**
 * Detect social media links
 */
function detectSocialMedia(html: string): boolean {
  const socialPatterns = [
    /facebook\.com|twitter\.com|instagram\.com|linkedin\.com|youtube\.com|pinterest\.com|tiktok\.com/i,
    /fb\.com|t\.co|pin\.it|lnkd\.in/i,
    /class=["']fa fa-facebook["']|class=["']fa fa-twitter["']|class=["']fa fa-instagram["']/i
  ];
  
  return socialPatterns.some(pattern => pattern.test(html));
}

/**
 * Detect cookie consent notices
 */
function detectCookieConsent(html: string): boolean {
  const cookiePatterns = [
    /cookie consent|cookie policy|cookie notice|gdpr|ccpa/i,
    /we use cookies|accept cookies|cookie settings/i,
    /class=["']cookie-banner["']|id=["']cookie-notice["']|cookie-consent/i
  ];
  
  return cookiePatterns.some(pattern => pattern.test(html));
}

/**
 * Detect suspicious content indicators
 */
function detectSuspiciousContent(html: string): {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}[] {
  const indicators: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[] = [];
  
  // Check for obfuscated JavaScript
  if (/eval\(function\(p,a,c,k,e,d\)/.test(html)) {
    indicators.push({
      type: 'ObfuscatedJS',
      description: 'Detected obfuscated JavaScript code which may hide malicious functionality',
      severity: 'medium'
    });
  }
  
  // Check for hidden iframes
  if (/<iframe[^>]*style=["'][^"']*opacity:\s*0|display:\s*none|visibility:\s*hidden/.test(html)) {
    indicators.push({
      type: 'HiddenIframe',
      description: 'Detected hidden iframe which may load malicious content',
      severity: 'high'
    });
  }
  
  // Check for suspicious redirects
  if (/window\.location\s*=|window\.location\.href\s*=|document\.location\s*=/.test(html)) {
    indicators.push({
      type: 'BrowserRedirect',
      description: 'Contains JavaScript redirects that could lead to malicious sites',
      severity: 'low'
    });
  }
  
  // Check for suspicious form actions
  const suspiciousFormEndpoints = /formaction=["'][^"']*\.(php|cgi)|action=["'][^"']*\.(php|cgi)/i;
  if (suspiciousFormEndpoints.test(html)) {
    indicators.push({
      type: 'SuspiciousForm',
      description: 'Forms submitting to potentially suspicious endpoints',
      severity: 'medium'
    });
  }
  
  return indicators;
}

/**
 * Categorize content based on text analysis
 */
function categorizeContent(text: string): string {
  // Very simple keyword-based categorization for demo purposes
  // In a real implementation, this would use machine learning classifiers
  
  // Convert to lowercase for case-insensitive matching
  const lowercaseText = text.toLowerCase();
  
  // Simple category detection based on keyword frequency
  const categories = [
    { name: 'e-commerce', keywords: ['shop', 'store', 'buy', 'cart', 'checkout', 'price', 'product', 'purchase', 'order', 'shipping'] },
    { name: 'business', keywords: ['company', 'business', 'service', 'professional', 'industry', 'enterprise', 'corporate', 'solution', 'client', 'partner'] },
    { name: 'blog', keywords: ['blog', 'post', 'article', 'author', 'comment', 'publishing', 'read', 'writing', 'story', 'content'] },
    { name: 'news', keywords: ['news', 'article', 'journalist', 'media', 'report', 'current', 'update', 'breaking', 'headlines', 'politics'] },
    { name: 'technology', keywords: ['software', 'technology', 'digital', 'tech', 'code', 'developer', 'app', 'data', 'cyber', 'internet'] },
    { name: 'entertainment', keywords: ['entertainment', 'movie', 'music', 'game', 'stream', 'video', 'play', 'show', 'watch', 'listen'] },
    { name: 'education', keywords: ['education', 'learn', 'course', 'student', 'school', 'university', 'training', 'class', 'knowledge', 'teach'] },
    { name: 'health', keywords: ['health', 'medical', 'doctor', 'patient', 'hospital', 'clinic', 'wellness', 'treatment', 'care', 'symptom'] }
  ];
  
  let bestMatchScore = 0;
  let bestMatchCategory = 'general';
  
  for (const category of categories) {
    const matchScore = category.keywords.reduce((score, keyword) => {
      const regex = new RegExp(keyword, 'gi');
      const matches = lowercaseText.match(regex);
      return score + (matches ? matches.length : 0);
    }, 0);
    
    if (matchScore > bestMatchScore) {
      bestMatchScore = matchScore;
      bestMatchCategory = category.name;
    }
  }
  
  return bestMatchCategory;
}

// Common English stop words to filter out
const stopWords = [
  'about', 'after', 'again', 'also', 'and', 'any', 'are', 'because', 'been', 'before', 'being', 'between',
  'both', 'but', 'came', 'can', 'come', 'could', 'did', 'does', 'each', 'else', 'for', 'from', 'get',
  'got', 'has', 'had', 'have', 'her', 'here', 'him', 'himself', 'his', 'how', 'into', 'its', 'just',
  'like', 'make', 'many', 'most', 'much', 'must', 'now', 'off', 'only', 'other', 'our', 'out',
  'over', 'said', 'same', 'see', 'should', 'since', 'some', 'still', 'such', 'take', 'than', 'that',
  'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'under',
  'very', 'was', 'way', 'well', 'were', 'what', 'where', 'which', 'while', 'who', 'with', 'would',
  'you', 'your', 'will', 'more', 'want', 'one', 'all'
];