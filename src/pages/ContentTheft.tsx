
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Copyright, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Search,
  ArrowRight
} from "lucide-react";

const ContentTheft = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container px-4 md:px-6 pt-16 pb-16">
        {/* Hero Section */}
        <div className="py-12 md:py-16 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-4">
            <Copyright className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-4">
            Understanding Content Theft & Copyright Infringement
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Learn the differences between plagiarism, content theft, and copyright infringement to better protect your intellectual property.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link to="/search">Protect Your Content</Link>
            </Button>
            <Button asChild variant="outline">
              <a href="#differences">Learn More</a>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
          {/* Sidebar with Key Concepts */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Key Concepts</h2>
              <div className="space-y-4">
                <Card className="hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-2 text-red-600 dark:text-red-400">
                        <Copyright className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Copyright Infringement</h3>
                        <p className="text-sm text-muted-foreground">Legal violation of exclusive rights</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-amber-100 dark:bg-amber-900/20 p-2 text-amber-600 dark:text-amber-400">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Plagiarism</h3>
                        <p className="text-sm text-muted-foreground">Using work without attribution</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-2 text-blue-600 dark:text-blue-400">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Content Theft</h3>
                        <p className="text-sm text-muted-foreground">Unauthorized use of digital content</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-2 text-green-600 dark:text-green-400">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">DMCA Protection</h3>
                        <p className="text-sm text-muted-foreground">Legal framework for digital rights</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300 mb-2">Protect Your Work Now</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400 mb-4">
                  Don't wait until your content is stolen. Start monitoring and protecting your intellectual property today.
                </p>
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                  <Link to="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
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
            
            <section id="plagiarism">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-amber-500" />
                Plagiarism
              </h2>
              <p className="mb-4 text-muted-foreground">
                <strong className="text-foreground">Definition:</strong> Presenting someone else's work or ideas as your own without proper attribution.
              </p>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Scope:</h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>More about ethics and academic integrity than legal rights.</li>
                  <li>Can occur even if the work is not copyright-protected (e.g., copying public domain content without credit).</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Examples:</h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Submitting someone else's essay as your own.</li>
                  <li>Using a quote without citing the source.</li>
                  <li>Repurposing ideas without acknowledging the original creator.</li>
                </ul>
              </div>
            </section>
            
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
            
            <section id="overlaps">
              <h2 className="text-2xl font-bold mb-4">How They Overlap</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-medium mb-2">Plagiarism Can Lead to Copyright Infringement</h3>
                  <p className="text-muted-foreground">If the plagiarized work is copyright-protected, it may also be a legal violation.</p>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-medium mb-2">Content Theft Often Involves Copyright Infringement</h3>
                  <p className="text-muted-foreground">Most stolen content is protected by copyright, making it both theft and infringement.</p>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-medium mb-2">Not All Plagiarism is Copyright Infringement</h3>
                  <p className="text-muted-foreground">If the work is in the public domain or not copyright-protected, it's plagiarism but not infringement.</p>
                </div>
              </div>
            </section>
            
            <section id="why-this-matters" className="border-t border-gray-200 dark:border-gray-800 pt-12">
              <h2 className="text-2xl font-bold mb-6">Why This Matters For Your Business</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all">
                  <div className="rounded-full w-12 h-12 flex items-center justify-center bg-red-100 dark:bg-red-900/20 mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Copyright Infringement</h3>
                  <p className="text-muted-foreground">
                    Our services directly address this legal issue through DMCA takedowns and copyright enforcement tools.
                  </p>
                </div>
                
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all">
                  <div className="rounded-full w-12 h-12 flex items-center justify-center bg-amber-100 dark:bg-amber-900/20 mb-4">
                    <Search className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Plagiarism</h3>
                  <p className="text-muted-foreground">
                    We offer tools for detecting copied content and ensuring proper attribution for your work.
                  </p>
                </div>
                
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all">
                  <div className="rounded-full w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/20 mb-4">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Content Theft</h3>
                  <p className="text-muted-foreground">
                    Our platform helps monitor, detect, and stop unauthorized use of your digital content.
                  </p>
                </div>
              </div>
              
              <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="text-xl font-medium text-purple-800 dark:text-purple-300 mb-4">How Influence Guard Protects Your Work</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Advanced content monitoring to detect unauthorized use</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Automated DMCA takedown tools for swift action</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Plagiarism detection across websites and social media</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Digital fingerprinting to track your intellectual property</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                    <Link to="/search" className="flex items-center justify-center">
                      Start Protecting Your Content
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContentTheft;
