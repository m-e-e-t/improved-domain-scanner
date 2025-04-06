import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DomainScanResults } from "@shared/schema"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Export scan results in different formats
 */
export function exportScanResults(results: {
  domain: string;
  scannedAt: string;
  results: DomainScanResults;
}, format: 'json' | 'csv' | 'pdf') {
  const filename = `domain-scan-${results.domain}-${new Date().toISOString().slice(0, 10)}`
  
  switch (format) {
    case 'json':
      // Format the JSON with 2-space indentation for readability
      const jsonContent = JSON.stringify(results, null, 2)
      downloadFile(jsonContent, `${filename}.json`, 'application/json')
      break
      
    case 'csv':
      // Create CSV content from the results
      // First, flatten the results structure for CSV format
      const flatData: Record<string, string> = {
        domain: results.domain,
        scanned_at: results.scannedAt,
      }
      
      // DNS Records
      if (results.results.dns && results.results.dns.records && results.results.dns.records.length) {
        flatData.dns_records_count = String(results.results.dns.records.length)
        results.results.dns.records.forEach((record, i) => {
          flatData[`dns_record_${i+1}_type`] = record.type
          flatData[`dns_record_${i+1}_name`] = record.name
          flatData[`dns_record_${i+1}_value`] = record.value
        })
      }
      
      // SSL Certificate
      if (results.results.ssl) {
        const ssl = results.results.ssl
        flatData.ssl_valid = String(ssl.isValid)
        flatData.ssl_issuer = ssl.issuer
        flatData.ssl_valid_from = ssl.validFrom
        flatData.ssl_valid_to = ssl.validTo
        flatData.ssl_days_to_expiration = String(ssl.daysToExpiration)
      }
      
      // WHOIS Info
      if (results.results.whois) {
        const whois = results.results.whois
        flatData.registrar = whois.registrar?.name || ''
        flatData.creation_date = whois.creationDate
        flatData.expiration_date = whois.expirationDate
        flatData.updated_date = whois.updatedDate
      }
      
      // Convert the flat data to CSV
      const csvHeader = Object.keys(flatData).join(',')
      const csvValues = Object.values(flatData).map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')
      const csvContent = `${csvHeader}\n${csvValues}`
      
      downloadFile(csvContent, `${filename}.csv`, 'text/csv')
      break
      
    case 'pdf':
      // Alert the user that PDF export requires downloading a PDF library
      alert('PDF export is not yet implemented. Please use JSON or CSV format.')
      break
  }
}

/**
 * Helper function to download a file
 */
function downloadFile(content: string, filename: string, contentType: string) {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 0)
}
