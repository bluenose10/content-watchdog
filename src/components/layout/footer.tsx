
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { Facebook, Github, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300">
      <div className="container px-4 md:px-6 py-8 md:py-12 flex flex-col gap-6 md:gap-8 md:flex-row">
        {/* Brand and social section */}
        <div className="flex flex-col gap-3 md:gap-4 md:w-1/3">
          <Link to="/" className="flex items-center gap-2">
            <img src="/lovable-uploads/822ca5bd-71ae-4f2a-b354-b4182a9f42d7.png" alt="Logo" className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover" />
            <span className="text-lg md:text-xl font-bold tracking-tight">{APP_NAME}</span>
          </Link>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">
            Protecting your digital content across the web with advanced monitoring technology.
          </p>
          <div className="flex gap-3 mt-2 md:mt-4">
            <Button variant="outline" size="icon" className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 dark:hover:bg-purple-800 border-purple-300 dark:border-purple-700" asChild>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-3 w-3 md:h-4 md:w-4 text-purple-600 dark:text-purple-400" />
              </a>
            </Button>
            <Button variant="outline" size="icon" className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-800 border-blue-300 dark:border-blue-700" asChild>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-3 w-3 md:h-4 md:w-4 text-blue-600 dark:text-blue-400" />
              </a>
            </Button>
            <Button variant="outline" size="icon" className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-pink-100 hover:bg-pink-200 dark:bg-pink-900/40 dark:hover:bg-pink-800 border-pink-300 dark:border-pink-700" asChild>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-3 w-3 md:h-4 md:w-4 text-pink-600 dark:text-pink-400" />
              </a>
            </Button>
            <Button variant="outline" size="icon" className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800 border-blue-300 dark:border-blue-700" asChild>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-3 w-3 md:h-4 md:w-4 text-blue-700 dark:text-blue-400" />
              </a>
            </Button>
          </div>
        </div>

        {/* Links Grid - now 3 columns on mobile and tablet/desktop */}
        <div className="grid grid-cols-3 gap-2 md:gap-8 md:w-2/3">
          <div className="flex flex-col gap-2 md:gap-3">
            <div className="font-medium text-xs md:text-sm mb-1">Product</div>
            <Link to="/#features" className="text-muted-foreground hover:text-foreground text-[10px] md:text-sm">Features</Link>
            <Link to="/#pricing" className="text-muted-foreground hover:text-foreground text-[10px] md:text-sm">Pricing</Link>
            <Link to="/search" className="text-muted-foreground hover:text-foreground text-[10px] md:text-sm">Search</Link>
          </div>
          <div className="flex flex-col gap-2 md:gap-3">
            <div className="font-medium text-xs md:text-sm mb-1">Company</div>
            <Link to="/#about" className="text-muted-foreground hover:text-foreground text-[10px] md:text-sm">About</Link>
            <Link to="/blog" className="text-muted-foreground hover:text-foreground text-[10px] md:text-sm">Blog</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground text-[10px] md:text-sm">Contact</Link>
          </div>
          <div className="flex flex-col gap-2 md:gap-3">
            <div className="font-medium text-xs md:text-sm mb-1">Legal</div>
            <Link to="/terms-of-service" className="text-muted-foreground hover:text-foreground text-[10px] md:text-sm">Terms</Link>
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground text-[10px] md:text-sm">Privacy</Link>
            <Link to="/cookie-policy" className="text-muted-foreground hover:text-foreground text-[10px] md:text-sm">Cookies</Link>
          </div>
        </div>
      </div>
      <Separator />
      <div className="container px-4 md:px-6 py-4 md:py-6 text-center text-xs md:text-sm text-muted-foreground">
        <p>&copy; {currentYear} {APP_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
}
