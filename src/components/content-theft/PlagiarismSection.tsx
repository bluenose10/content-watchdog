
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
        <p className="mb-2 text-muted-foreground">Plagiarism is primarily about ethics and academic integrity rather than legal rights. It can occur even if the work is not copyright-protected, such as when copying public domain content without giving proper credit.</p>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">Examples:</h3>
        <p className="text-muted-foreground">Submitting someone else's essay as your own, using quotes without citing the source, or repurposing ideas without acknowledging the original creator are all examples of plagiarism that can have serious consequences in academic and professional settings.</p>
      </div>
    </section>
  );
};
