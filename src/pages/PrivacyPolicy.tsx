import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Check, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";

export default function PrivacyPolicy() {
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
                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid gap-10">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
              <div className="prose dark:prose-invert max-w-none">
                <p className="lead">This Privacy Policy describes how your personal information is collected, used, and shared when you visit or use ContentShield.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
                <p>When you use our platform, we collect several types of information:</p>
                
                <h3 className="text-lg font-medium mt-6 mb-3">Personal Information</h3>
                <p>When you create an account, we collect information such as:</p>
                <ul className="list-disc pl-5 space-y-2 my-4">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Password (stored in encrypted form)</li>
                  <li>Profile information you choose to provide</li>
                  <li>Payment information (processed securely through our payment processors)</li>
                </ul>
                
                <h3 className="text-lg font-medium mt-6 mb-3">Content Information</h3>
                <p>When you use our services to monitor and protect your content, we collect:</p>
                <ul className="list-disc pl-5 space-y-2 my-4">
                  <li>Images, text, or other content you upload for monitoring</li>
                  <li>Search queries and parameters you use</li>
                  <li>Information about matches found for your content</li>
                </ul>
                
                <h3 className="text-lg font-medium mt-6 mb-3">Usage Information</h3>
                <p>We collect information about how you use our platform, including:</p>
                <ul className="list-disc pl-5 space-y-2 my-4">
                  <li>Log data (IP address, browser type, pages visited, time spent)</li>
                  <li>Device information (type, operating system, unique identifiers)</li>
                  <li>Actions taken on the platform</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-5 space-y-2 my-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and manage your account</li>
                  <li>Monitor and protect your content as requested</li>
                  <li>Send notifications about matches and potential infringements</li>
                  <li>Communicate with you about our services, updates, and promotions</li>
                  <li>Respond to your comments, questions, and customer service requests</li>
                  <li>Analyze usage patterns to improve user experience</li>
                  <li>Protect the security and integrity of our platform</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">3. Information Sharing and Disclosure</h2>
                <p>We may share your information in the following circumstances:</p>
                <ul className="list-disc pl-5 space-y-2 my-4">
                  <li><strong>Service Providers:</strong> We share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf (e.g., payment processors, cloud hosting providers).</li>
                  <li><strong>Compliance with Laws:</strong> We may disclose information if required to do so by law or in response to valid requests by public authorities.</li>
                  <li><strong>Business Transfers:</strong> If we're involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</li>
                  <li><strong>With Your Consent:</strong> We may share information with third parties when you explicitly consent to such sharing.</li>
                </ul>
                <p>We do not sell your personal information to third parties.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Security</h2>
                <p>We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">5. Your Rights and Choices</h2>
                <p>Depending on your location, you may have certain rights regarding your personal information:</p>
                <ul className="list-disc pl-5 space-y-2 my-4">
                  <li><strong>Access:</strong> You can request copies of your personal information.</li>
                  <li><strong>Correction:</strong> You can request that we correct inaccurate information.</li>
                  <li><strong>Deletion:</strong> You can request that we delete your personal information.</li>
                  <li><strong>Restriction:</strong> You can request that we restrict the processing of your data.</li>
                  <li><strong>Data Portability:</strong> You can request a copy of your data in a structured, commonly used, and machine-readable format.</li>
                  <li><strong>Object:</strong> You can object to our processing of your personal information.</li>
                </ul>
                <p>To exercise these rights, please contact us at privacy@contentshield.com.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">6. Data Retention</h2>
                <p>We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need to process your information, we will either delete or anonymize it.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">7. Children's Privacy</h2>
                <p>Our platform is not directed to children under the age of 16, and we do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">8. International Data Transfers</h2>
                <p>Your information may be transferred to, and processed in, countries other than the country in which you reside. These countries may have data protection laws that are different from the laws of your country. We employ appropriate safeguards to protect your information when transferred internationally.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">9. Changes to this Privacy Policy</h2>
                <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">10. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@contentshield.com.</p>
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
