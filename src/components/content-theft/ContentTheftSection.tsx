
import { Shield } from "lucide-react";

export const ContentTheftSection = () => {
  return (
    <section id="content-theft">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Shield className="h-6 w-6 mr-2 text-blue-500" />
        Content Theft
      </h2>
      <p className="mb-4 text-muted-foreground">
        <strong className="text-foreground">Definition:</strong> The unauthorized copying or use of digital content (e.g., blog posts, images, videos).
      </p>
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Scope:</h3>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>Often overlaps with copyright infringement but can also include non-copyrighted content.</li>
          <li>Focuses on the act of stealing rather than the legal implications.</li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">Examples:</h3>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>Scraping a website and republishing its content.</li>
          <li>Downloading and redistributing paid digital products.</li>
          <li>Taking screenshots of membership content and sharing them.</li>
        </ul>
      </div>
    </section>
  );
};
