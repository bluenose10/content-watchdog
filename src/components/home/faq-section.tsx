
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

export function FAQSection() {
  return (
    <div className="py-16 bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-4">
            <HelpCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get answers to the most common questions about our content protection platform
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-6">
            <AccordionItem value="item-1" className="relative bg-white dark:bg-gray-800 rounded-xl px-6 shadow-md 
              before:absolute before:inset-0 before:rounded-xl before:p-[3px] before:bg-gradient-to-r before:from-purple-500 before:via-purple-400 before:to-purple-600 dark:before:from-purple-700 dark:before:via-purple-500 dark:before:to-purple-800 before:-z-10
              after:absolute after:inset-[3px] after:rounded-[calc(0.75rem-3px)] after:bg-white dark:after:bg-gray-800 after:-z-10
              hover:shadow-lg transition-all duration-300">
              <AccordionTrigger className="text-base md:text-lg font-medium py-5 hover:no-underline">
                How does the content monitoring system work?
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-muted-foreground">
                Our platform uses advanced algorithms to scan the web for content that matches yours. When you upload content or provide links, we create a digital fingerprint and search for matches across social media platforms, websites, and other digital spaces. Our system continuously monitors for new matches and alerts you when unauthorized usage is detected.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="relative bg-white dark:bg-gray-800 rounded-xl px-6 shadow-md 
              before:absolute before:inset-0 before:rounded-xl before:p-[3px] before:bg-gradient-to-r before:from-purple-500 before:via-purple-400 before:to-purple-600 dark:before:from-purple-700 dark:before:via-purple-500 dark:before:to-purple-800 before:-z-10
              after:absolute after:inset-[3px] after:rounded-[calc(0.75rem-3px)] after:bg-white dark:after:bg-gray-800 after:-z-10
              hover:shadow-lg transition-all duration-300">
              <AccordionTrigger className="text-base md:text-lg font-medium py-5 hover:no-underline">
                What types of content can I protect using your service?
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-muted-foreground">
                Our platform can protect a wide variety of digital content, including images, videos, text articles, blog posts, music, podcasts, and other digital creations. Whether you're a photographer, writer, musician, or digital creator, our tools can help you monitor and protect your intellectual property across the internet.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="relative bg-white dark:bg-gray-800 rounded-xl px-6 shadow-md 
              before:absolute before:inset-0 before:rounded-xl before:p-[3px] before:bg-gradient-to-r before:from-purple-500 before:via-purple-400 before:to-purple-600 dark:before:from-purple-700 dark:before:via-purple-500 dark:before:to-purple-800 before:-z-10
              after:absolute after:inset-[3px] after:rounded-[calc(0.75rem-3px)] after:bg-white dark:after:bg-gray-800 after:-z-10
              hover:shadow-lg transition-all duration-300">
              <AccordionTrigger className="text-base md:text-lg font-medium py-5 hover:no-underline">
                How do I initiate a takedown request for unauthorized content?
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-muted-foreground">
                When our system detects unauthorized use of your content, you can initiate a takedown request directly from your dashboard. Select the infringing content, choose the "Request Takedown" option, and our system will generate appropriate DMCA notices or platform-specific takedown requests. Premium subscribers also have access to assisted takedown services where our team handles the process for you.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="relative bg-white dark:bg-gray-800 rounded-xl px-6 shadow-md 
              before:absolute before:inset-0 before:rounded-xl before:p-[3px] before:bg-gradient-to-r before:from-purple-500 before:via-purple-400 before:to-purple-600 dark:before:from-purple-700 dark:before:via-purple-500 dark:before:to-purple-800 before:-z-10
              after:absolute after:inset-[3px] after:rounded-[calc(0.75rem-3px)] after:bg-white dark:after:bg-gray-800 after:-z-10
              hover:shadow-lg transition-all duration-300">
              <AccordionTrigger className="text-base md:text-lg font-medium py-5 hover:no-underline">
                What's the difference between the free and premium plans?
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-muted-foreground">
                Our free plan allows limited content monitoring with basic search capabilities and up to 5 searches per month. Premium plans offer unlimited searches, continuous monitoring, advanced analytics, automated takedown requests, priority support, and additional features like real-time alerts and comprehensive reporting. Premium subscribers also get access to our API for integration with existing workflows.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="relative bg-white dark:bg-gray-800 rounded-xl px-6 shadow-md 
              before:absolute before:inset-0 before:rounded-xl before:p-[3px] before:bg-gradient-to-r before:from-purple-500 before:via-purple-400 before:to-purple-600 dark:before:from-purple-700 dark:before:via-purple-500 dark:before:to-purple-800 before:-z-10
              after:absolute after:inset-[3px] after:rounded-[calc(0.75rem-3px)] after:bg-white dark:after:bg-gray-800 after:-z-10
              hover:shadow-lg transition-all duration-300">
              <AccordionTrigger className="text-base md:text-lg font-medium py-5 hover:no-underline">
                How accurate is your content matching technology?
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-muted-foreground">
                Our content matching technology achieves over 95% accuracy in detecting exact matches and maintains high accuracy even for partial matches or content that has been slightly modified. We use a combination of digital fingerprinting, AI-based recognition, and pattern matching algorithms to ensure comprehensive protection. Each match is assigned a confidence score to help you prioritize your review and response efforts.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6" className="relative bg-white dark:bg-gray-800 rounded-xl px-6 shadow-md 
              before:absolute before:inset-0 before:rounded-xl before:p-[3px] before:bg-gradient-to-r before:from-purple-500 before:via-purple-400 before:to-purple-600 dark:before:from-purple-700 dark:before:via-purple-500 dark:before:to-purple-800 before:-z-10
              after:absolute after:inset-[3px] after:rounded-[calc(0.75rem-3px)] after:bg-white dark:after:bg-gray-800 after:-z-10
              hover:shadow-lg transition-all duration-300">
              <AccordionTrigger className="text-base md:text-lg font-medium py-5 hover:no-underline">
                Can I use this service internationally?
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-muted-foreground">
                Yes, our content protection service works globally. We scan content across international platforms and can assist with takedown processes in different jurisdictions. Our system supports multiple languages and adapts to regional requirements for DMCA notices and copyright claims. Premium subscribers get access to specialized support for international copyright protection and enforcement.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}
