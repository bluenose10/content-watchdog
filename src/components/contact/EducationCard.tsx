
export function EducationCard() {
  return (
    <div className="bg-muted/50 rounded-lg p-5 md:p-6 border border-purple-100 dark:border-purple-900/40 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 max-w-3xl mx-auto">
      <h2 className="text-lg font-semibold mb-3">Educational Background</h2>
      <ul className="space-y-3">
        <li>
          <div className="font-medium text-sm">Master's Degree in Cyber Security</div>
          <div className="text-xs text-muted-foreground">Edge Hill University, UK</div>
        </li>
        <li>
          <div className="font-medium text-sm">BSc (Hons) In Computing</div>
          <div className="text-xs text-muted-foreground">Edge Hill University, UK</div>
        </li>
      </ul>
    </div>
  );
}
