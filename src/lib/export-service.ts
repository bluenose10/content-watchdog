
import { SearchResult } from './db-types';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export type ExportFormat = 'csv' | 'excel' | 'json' | 'pdf';

// Function to export search results in different formats
export const exportSearchResults = (
  results: SearchResult[], 
  format: ExportFormat, 
  filename: string = 'search-results'
) => {
  if (!results || results.length === 0) {
    throw new Error("No data to export");
  }

  // Prepare the data for export - creating a simpler structure 
  // that's more suitable for exporting
  const exportData = results.map(result => ({
    Title: result.title,
    URL: result.url,
    Source: result.source,
    'Match Level': result.match_level,
    'Found Date': new Date(result.found_at).toLocaleDateString(),
    'Similarity Score': result.similarity_score || 'N/A',
    'Relevance Score': result.relevance_score || 'N/A'
  }));
  
  const timestamp = new Date().toISOString().slice(0, 10);
  const fullFilename = `${filename}-${timestamp}`;

  switch (format) {
    case 'csv':
      exportToCsv(exportData, fullFilename);
      break;
    case 'excel':
      exportToExcel(exportData, fullFilename);
      break;
    case 'json':
      exportToJson(exportData, fullFilename);
      break;
    case 'pdf':
      exportToPdf(exportData, fullFilename);
      break;
    default:
      throw new Error(`Export format '${format}' not supported`);
  }
};

// CSV export implementation
const exportToCsv = (data: any[], filename: string) => {
  // Generate headers from first row
  const headers = Object.keys(data[0]);
  
  // Convert each object to a CSV row
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => {
      return headers.map(header => {
        // Handle commas and quotes in the data
        const cell = row[header]?.toString() || '';
        return `"${cell.replace(/"/g, '""')}"`;
      }).join(',');
    })
  ];
  
  // Create a CSV blob
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
};

// Excel export implementation
const exportToExcel = (data: any[], filename: string) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Convert data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Search Results');
  
  // Write the workbook and trigger a download
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// JSON export implementation
const exportToJson = (data: any[], filename: string) => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  saveAs(blob, `${filename}.json`);
};

// PDF export implementation
const exportToPdf = (data: any[], filename: string) => {
  // Initialize jsPDF
  const doc = new jsPDF();
  
  // Add a title
  doc.setFontSize(16);
  doc.text('Search Results', 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
  
  // Extract headers and rows for autoTable
  const headers = Object.keys(data[0]);
  const rows = data.map(item => headers.map(key => item[key]?.toString() || ''));
  
  // Generate the table
  (doc as any).autoTable({
    head: [headers],
    body: rows,
    startY: 25,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [100, 50, 150], textColor: 255 },
    columnStyles: { 
      0: { cellWidth: 'auto' }, // Title
      1: { cellWidth: 'auto' }, // URL
      2: { cellWidth: 20 }, // Source
      3: { cellWidth: 20 }, // Match Level
      4: { cellWidth: 20 }, // Found Date
      5: { cellWidth: 20 }, // Similarity Score
      6: { cellWidth: 20 }  // Relevance Score
    }
  });
  
  // Save the PDF
  doc.save(`${filename}.pdf`);
};
