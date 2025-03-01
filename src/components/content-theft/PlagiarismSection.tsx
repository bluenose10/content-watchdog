
import { FileText } from "lucide-react";

export const PlagiarismSection = () => {
  return (
    <section id="plagiarism">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FileText className="h-6 w-6 mr-2 text-amber-500" />
        Plagiarism
      </h2>
      <p className="mb-4 text-muted-foreground">
        <strong className="text-foreground">Definition:</strong> Presenting someone else's work or ideas as your own without proper attribution.
      </p>
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Scope:</h3>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>More about ethics and academic integrity than legal rights.</li>
          <li>Can occur even if the work is not copyright-protected (e.g., copying public domain content without credit).</li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">Examples:</h3>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>Submitting someone else's essay as your own.</li>
          <li>Using a quote without citing the source.</li>
          <li>Repurposing ideas without acknowledging the original creator.</li>
        </ul>
      </div>
    </section>
  );
};
