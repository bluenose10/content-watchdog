
export const KeyDifferencesSection = () => {
  return (
    <section id="differences" className="pt-6">
      <h2 className="text-2xl font-bold mb-6">Key Differences</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border p-3 text-left">Aspect</th>
              <th className="border p-3 text-left">Plagiarism</th>
              <th className="border p-3 text-left">Content Theft</th>
              <th className="border p-3 text-left">Copyright Infringement</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-3 font-medium">Focus</td>
              <td className="border p-3 text-muted-foreground">Ethical (attribution)</td>
              <td className="border p-3 text-muted-foreground">Act of stealing</td>
              <td className="border p-3 text-muted-foreground">Legal (rights violation)</td>
            </tr>
            <tr>
              <td className="border p-3 font-medium">Applies To</td>
              <td className="border p-3 text-muted-foreground">Any work (even non-copyrighted)</td>
              <td className="border p-3 text-muted-foreground">Digital content</td>
              <td className="border p-3 text-muted-foreground">Copyright-protected works</td>
            </tr>
            <tr>
              <td className="border p-3 font-medium">Consequences</td>
              <td className="border p-3 text-muted-foreground">Academic or professional</td>
              <td className="border p-3 text-muted-foreground">Loss of revenue, reputation</td>
              <td className="border p-3 text-muted-foreground">Legal action, fines, DMCA takedowns</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
