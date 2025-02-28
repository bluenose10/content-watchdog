
import { ScrollArea } from "@/components/ui/scroll-area";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Check, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";

export default function TermsOfService() {
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
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid gap-10">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
              <div className="prose dark:prose-invert max-w-none">
                <p className="lead">Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the ContentShield platform operated by our company.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">1. Terms</h2>
                <p>By accessing our platform, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this platform. The materials contained in this platform are protected by applicable copyright and trademark law.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">2. Use License</h2>
                <p>Permission is granted to temporarily use the ContentShield platform for personal, non-commercial or business purposes only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul className="list-disc pl-5 space-y-2 my-4">
                  <li>Modify or copy the materials;</li>
                  <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial) beyond the functionality intended by the platform;</li>
                  <li>Attempt to decompile or reverse engineer any software contained on ContentShield;</li>
                  <li>Remove any copyright or other proprietary notations from the materials; or</li>
                  <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                </ul>
                <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by ContentShield at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">3. Service Description</h2>
                <p>ContentShield provides a platform for users to monitor and protect their digital content against unauthorized use. The service includes content scanning, match detection, and tools to assist with content protection. The specific features available depend on your subscription plan.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">4. User Accounts</h2>
                <p>To access certain features of the platform, you will need to register for an account. You must provide accurate and complete information and keep your account information updated. You are responsible for safeguarding the password that you use to access the platform and for any activities or actions under your password.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">5. Subscription and Payments</h2>
                <p>Some aspects of the service require payment of fees. ContentShield offers subscription plans with different features and limitations. By selecting a subscription plan, you agree to pay the subscription fees indicated. Payments are processed through secure third-party payment processors.</p>
                <ul className="list-disc pl-5 space-y-2 my-4">
                  <li>Subscriptions automatically renew unless cancelled before the renewal date.</li>
                  <li>You may cancel your subscription at any time from your account settings.</li>
                  <li>No refunds will be issued for partial subscription periods.</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">6. Disclaimer</h2>
                <p>The materials on ContentShield's platform are provided on an 'as is' basis. ContentShield makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                <p>Further, ContentShield does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its platform or otherwise relating to such materials or on any sites linked to this platform.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">7. Limitations</h2>
                <p>In no event shall ContentShield or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ContentShield's platform, even if ContentShield or a ContentShield authorized representative has been notified orally or in writing of the possibility of such damage.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">8. Content</h2>
                <p>Our platform allows you to upload and monitor content that you own or have rights to monitor. You retain all of your ownership rights to your content. By uploading content to our platform, you grant us a license to use, store, and process your content solely for the purpose of providing the service to you.</p>
                <p>You represent and warrant that:</p>
                <ul className="list-disc pl-5 space-y-2 my-4">
                  <li>You own the content or have the right to use it and grant us the rights and license as provided in these Terms.</li>
                  <li>The uploading and use of your content on or through the service does not violate the privacy rights, publicity rights, copyrights, contract rights, intellectual property rights, or any other rights of any person.</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">9. Service Modifications</h2>
                <p>ContentShield reserves the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice. You agree that ContentShield shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the service.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">10. Governing Law</h2>
                <p>These Terms shall be governed and construed in accordance with the laws applicable in the jurisdiction where our company is registered, without regard to its conflict of law provisions.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">11. Changes to Terms</h2>
                <p>ContentShield reserves the right, at its sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our platform after those revisions become effective, you agree to be bound by the revised terms.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">12. Contact Us</h2>
                <p>If you have any questions about these Terms, please contact us at support@contentshield.com.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
              <Button asChild variant="outline" className="flex items-center gap-2">
                <Link to="/privacy-policy">
                  <Shield className="h-4 w-4" />
                  Privacy Policy
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex items-center gap-2">
                <Link to="/cookie-policy">
                  <Check className="h-4 w-4" />
                  Cookie Policy
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
