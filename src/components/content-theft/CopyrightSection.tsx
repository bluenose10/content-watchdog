
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
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>Applies to original works fixed in a tangible medium (e.g., written, recorded, or saved digitally).</li>
          <li>Protected under copyright law (e.g., DMCA in the U.S.).</li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">Examples:</h3>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>Copying and republishing an article without permission.</li>
          <li>Using a photograph in a commercial project without a license.</li>
          <li>Sharing digital products without authorization.</li>
        </ul>
      </div>
    </section>
  );
};
