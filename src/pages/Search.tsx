
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ContentSearchSection } from "@/components/home/content-search-section";

const Search = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow pt-16 pb-16">
        <div className="container px-4 md:px-6 pt-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Search For Content</h1>
          <p className="text-muted-foreground mb-8">
            Use our powerful search engine to find unauthorized uses of your content across the web.
          </p>
        </div>
        <ContentSearchSection />
      </main>
      <Footer />
    </div>
  );
};

export default Search;
