
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <div className="flex items-center">
      <Link 
        to="/"
        className="flex items-center gap-2 font-bold text-xl"
      >
        <img 
          src="/lovable-uploads/822ca5bd-71ae-4f2a-b354-b4182a9f42d7.png" 
          alt="Influence Guard Logo" 
          className="h-9 w-9" 
        />
        <span className="text-gradient">Influence Guard</span>
      </Link>
    </div>
  );
}
