
import { ScrollArea } from "@/components/ui/scroll-area";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Check, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";

export default function CookiePolicy() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <div className="inline-flex items-center justify-center p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-2">
                <Check className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Cookie Policy</h1>
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid gap-10">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
              <div className="prose dark:prose-invert max-w-none">
                <p className="lead">This Cookie Policy explains how ContentShield uses cookies and similar technologies to recognize you when you visit our platform. It explains what these technologies are and why we use them, as well as your rights to control our use of them.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">1. What are Cookies?</h2>
                <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
                <p>Cookies set by the website owner (in this case, ContentShield) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">2. Types of Cookies We Use</h2>
                <p>We use several types of cookies for different purposes:</p>
                
                <h3 className="text-lg font-medium mt-6 mb-3">Essential Cookies</h3>
                <p>These cookies are essential for enabling user movement around our platform and providing access to features such as your account and other secure areas. These cookies don't gather information about you that could be used for marketing or remembering where you've been on the internet. This category of cookies cannot be disabled.</p>
                
                <h3 className="text-lg font-medium mt-6 mb-3">Performance and Functionality Cookies</h3>
                <p>These cookies collect information about how you use our platform, like which pages you visited and which links you clicked on. The information is used to optimize the platform and make it more user-friendly. They also allow us to remember your preferences and customize the platform accordingly. All information these cookies collect is aggregated and therefore anonymous.</p>
                
                <h3 className="text-lg font-medium mt-6 mb-3">Analytics and Customization Cookies</h3>
                <p>These cookies collect information that is used either in aggregate form to help us understand how our platform is being used or how effective our marketing campaigns are, or to help us customize our platform for you. They allow us to recognize and count the number of visitors and to see how visitors move around our platform when they are using it.</p>
                
                <h3 className="text-lg font-medium mt-6 mb-3">Advertising Cookies</h3>
                <p>These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests.</p>
                
                <h3 className="text-lg font-medium mt-6 mb-3">Social Media Cookies</h3>
                <p>These cookies are used to enable you to share pages and content that you find interesting on our platform through third-party social networking and other websites. These cookies may also be used for advertising purposes.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">3. Specific Cookies We Use</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full my-6 border border-gray-200 dark:border-gray-700">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cookie Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Purpose</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">session_id</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Essential</td>
                        <td className="px-6 py-4 text-sm">Used to maintain your session</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Session</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">auth_token</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Essential</td>
                        <td className="px-6 py-4 text-sm">Used to authenticate users</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">30 days</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">preferences</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Functionality</td>
                        <td className="px-6 py-4 text-sm">Stores user preferences</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">1 year</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">_ga</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Analytics</td>
                        <td className="px-6 py-4 text-sm">Used by Google Analytics to distinguish users</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">2 years</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">_fbp</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Advertising</td>
                        <td className="px-6 py-4 text-sm">Used by Facebook to deliver advertisements</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">3 months</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">4. How to Control Cookies</h2>
                <p>You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our platform though your access to some functionality and areas may be restricted. The means by which you can refuse cookies through your web browser controls vary from browser to browser, so you should visit your browser's help menu for more information.</p>
                
                <h3 className="text-lg font-medium mt-6 mb-3">Browser Controls</h3>
                <p>Most browsers allow you to control cookies through their settings preferences. Here's how to access cookie settings in various browsers:</p>
                <ul className="list-disc pl-5 space-y-2 my-4">
                  <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                  <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                  <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                </ul>
                
                <h3 className="text-lg font-medium mt-6 mb-3">Opting Out of Specific Cookies</h3>
                <p>For more information about specific cookies used for targeting and advertising, visit:</p>
                <ul className="list-disc pl-5 space-y-2 my-4">
                  <li><a href="http://www.aboutads.info/choices/" className="text-purple-600 dark:text-purple-400 hover:underline">Digital Advertising Alliance</a></li>
                  <li><a href="http://www.youronlinechoices.com/" className="text-purple-600 dark:text-purple-400 hover:underline">Your Online Choices (EU)</a></li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">5. Changes to this Cookie Policy</h2>
                <p>We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. Any changes will become effective when we post the revised Cookie Policy. You are advised to check this page regularly to stay informed of updates.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">6. Contact Us</h2>
                <p>If you have any questions about our use of cookies or this Cookie Policy, please contact us at privacy@contentshield.com.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
              <Button asChild variant="outline" className="flex items-center gap-2">
                <Link to="/terms-of-service">
                  <FileText className="h-4 w-4" />
                  Terms of Service
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex items-center gap-2">
                <Link to="/privacy-policy">
                  <Shield className="h-4 w-4" />
                  Privacy Policy
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
