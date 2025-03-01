
import { Copyright } from "lucide-react";

export const CopyrightSection = () => {
  return (
    <section id="copyright-infringement">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Copyright className="h-6 w-6 mr-2 text-red-500" />
        Copyright Infringement
      </h2>
      <p className="mb-4 text-muted-foreground">
        <strong className="text-foreground">Definition:</strong> The unauthorized use of someone else's copyright-protected work (e.g., text, images, videos, music) in a way that violates the owner's exclusive rights.
      </p>
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Scope:</h3>
        <p className="mb-2 text-muted-foreground">Copyright infringement applies to original works fixed in a tangible medium, such as written, recorded, or digitally saved content. These works are protected under copyright law, including the Digital Millennium Copyright Act (DMCA) in the United States.</p>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">Examples:</h3>
        <p className="text-muted-foreground">Common examples include copying and republishing an article without permission, using a photograph in a commercial project without a license, and sharing digital products without proper authorization from the creator.</p>
      </div>
    </section>
  );
};
