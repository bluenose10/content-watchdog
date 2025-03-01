
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
        <p className="mb-2 text-muted-foreground">Content theft often overlaps with copyright infringement but can also include non-copyrighted content. The focus is on the act of stealing rather than the specific legal implications involved.</p>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">Examples:</h3>
        <p className="text-muted-foreground">Common examples include scraping websites and republishing their content, downloading and redistributing paid digital products, or taking screenshots of membership content and sharing them without permission.</p>
      </div>
    </section>
  );
};
