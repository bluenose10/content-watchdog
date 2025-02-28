
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { Facebook, Github, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300">
      <div className="container px-4 md:px-6 py-12 flex flex-col gap-8 md:flex-row">
        <div className="flex flex-col gap-4 md:w-1/3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold">IG</div>
            <span className="text-xl font-bold tracking-tight">{APP_NAME}</span>
          </Link>
          <p className="text-sm text-muted-foreground mt-2">
            Protecting your digital content across the web with advanced monitoring technology.
          </p>
          <div className="flex gap-4 mt-4">
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 md:w-2/3">
          <div className="flex flex-col gap-3">
            <div className="font-medium mb-1">Product</div>
            <Link to="/#features" className="text-muted-foreground hover:text-foreground text-sm">Features</Link>
            <Link to="/#pricing" className="text-muted-foreground hover:text-foreground text-sm">Pricing</Link>
            <Link to="/search" className="text-muted-foreground hover:text-foreground text-sm">Search</Link>
          </div>
          <div className="flex flex-col gap-3">
            <div className="font-medium mb-1">Company</div>
            <Link to="/#about" className="text-muted-foreground hover:text-foreground text-sm">About Us</Link>
            <Link to="/blog" className="text-muted-foreground hover:text-foreground text-sm">Blog</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground text-sm">Contact</Link>
          </div>
          <div className="flex flex-col gap-3">
            <div className="font-medium mb-1">Legal</div>
            <Link to="/terms-of-service" className="text-muted-foreground hover:text-foreground text-sm">Terms of Service</Link>
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground text-sm">Privacy Policy</Link>
            <Link to="/cookie-policy" className="text-muted-foreground hover:text-foreground text-sm">Cookie Policy</Link>
          </div>
        </div>
      </div>
      <Separator />
      <div className="container px-4 md:px-6 py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} {APP_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
}
