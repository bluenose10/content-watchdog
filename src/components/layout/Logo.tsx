
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <div className="flex items-center">
      <Link 
        to="/"
        className="flex items-center gap-2 font-bold text-xl"
      >
        <img 
          src="/lovable-uploads/72940714-67ad-4d39-a726-825cccfb266f.png" 
          alt="BlockSyde Logo" 
          className="h-9 w-9" 
        />
        <span className="text-gradient">BlockSyde</span>
      </Link>
    </div>
  );
}
