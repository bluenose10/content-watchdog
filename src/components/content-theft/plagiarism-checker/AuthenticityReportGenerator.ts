
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { AuthenticityCheck } from "./PlagiarismChecker";

// Function to generate a PDF report of authenticity verification results
export const generateAuthenticityPdfReport = async (
  authenticityCheck: AuthenticityCheck, 
  fileName: string,
  toast: (props: { title: string; description: string; variant?: "default" | "destructive" | "success" }) => void
): Promise<void> => {
  try {
    const doc = new jsPDF();
    
    // Add report title
    doc.setFontSize(18);
    doc.text("Content Authenticity Verification Report", 14, 22);
    
    // Add file info
    doc.setFontSize(12);
    doc.text(`File: ${fileName}`, 14, 32);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 39);
    
    // Add verification result
    doc.setFontSize(14);
    const result = authenticityCheck.isAuthentic ? "Authentic Content" : "Suspicious Content";
    doc.text(`Result: ${result}`, 14, 49);
    
    // Add scores section
    doc.setFontSize(14);
    doc.text("Verification Scores:", 14, 59);
    
    // Create table for scores
    const scoresData = [
      ["AI Generated Probability", `${Math.round(authenticityCheck.aiGeneratedProbability * 100)}%`],
      ["Manipulation Probability", `${Math.round(authenticityCheck.manipulationProbability * 100)}%`],
      ["Originality Score", `${Math.round(authenticityCheck.originalityScore * 100)}%`],
    ];
    
    autoTable(doc, {
      startY: 65,
      head: [["Metric", "Score"]],
      body: scoresData,
      theme: 'grid',
      headStyles: { fillColor: [75, 75, 250] }
    });
    
    // Add verification details if available
    if (authenticityCheck.detailsText) {
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.text("Verification Details:", 14, finalY);
      
      doc.setFontSize(12);
      // Split text to handle multi-line content
      const splitDetails = doc.splitTextToSize(authenticityCheck.detailsText, 180);
      doc.text(splitDetails, 14, finalY + 10);
    }
    
    // Add verification method
    const methodY = doc.internal.pageSize.height - 20;
    doc.setFontSize(10);
    doc.text(`Verification Method: ${authenticityCheck.verificationMethod || "combined"}`, 14, methodY);
    
    // Save the generated PDF
    doc.save(`authenticity-report-${fileName.split('.')[0]}.pdf`);
    
    toast({
      title: "Report downloaded",
      description: "Authenticity verification report has been downloaded.",
      variant: "success"
    });
  } catch (error) {
    console.error("Error downloading PDF:", error);
    toast({
      title: "Error",
      description: "Failed to download PDF report",
      variant: "destructive"
    });
    throw error;
  }
};
