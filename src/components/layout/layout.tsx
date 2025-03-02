
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PreFetchInitializer } from "@/components/PreFetchInitializer";
import { ThemeProvider } from "@/components/theme-provider";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="flex min-h-screen flex-col">
        <PreFetchInitializer />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
