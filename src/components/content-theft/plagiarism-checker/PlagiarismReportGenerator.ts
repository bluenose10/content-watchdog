
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { PlagiarismResult } from "./PlagiarismChecker";
import { useToast } from "@/hooks/use-toast";

export const usePlagiarismReport = () => {
  const { toast } = useToast();

  const generatePdfReport = async (results: PlagiarismResult, fileName: string) => {
    if (!results) return;
    
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text("Plagiarism Check Report", 14, 22);
      
      // Add file name
      doc.setFontSize(12);
      doc.text(`File: ${fileName}`, 14, 32);
      
      // Add date
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 39);
      
      // Add overall score
      doc.setFontSize(14);
      doc.text(`Similarity Score: ${results.score.toFixed(1)}%`, 14, 49);
      
      // Add match details header
      doc.setFontSize(14);
      doc.text("Potential Matches:", 14, 59);
      
      // Add matches table
      if (results.matches.length > 0) {
        const tableData = results.matches.map((match, index) => [
          index + 1,
          match.text.length > 50 ? match.text.substring(0, 50) + "..." : match.text,
          match.source,
          `${(match.similarity * 100).toFixed(1)}%`
        ]);
        
        autoTable(doc, {
          startY: 65,
          head: [["#", "Text", "Source", "Similarity"]],
          body: tableData,
          styles: { overflow: 'linebreak' },
          columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 80 },
            2: { cellWidth: 50 },
            3: { cellWidth: 20 }
          },
        });
      } else {
        doc.setFontSize(12);
        doc.text("No significant matches found.", 14, 65);
      }
      
      // Save the PDF
      doc.save(`plagiarism-report-${fileName.split('.')[0]}.pdf`);
      
      toast({
        title: "Report downloaded",
        description: "Plagiarism check report has been downloaded.",
        variant: "success"
      });
      
      return true;
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        title: "Error",
        description: "Failed to download PDF report",
        variant: "destructive"
      });
      return false;
    }
  };

  return { generatePdfReport };
};
