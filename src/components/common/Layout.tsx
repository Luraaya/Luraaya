import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { AuroraBackground } from "../ui/aurora-background";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AuroraBackground className="min-h-[100svh]">
      <div className="relative z-10 flex min-h-[100svh] flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </AuroraBackground>
  );
};

export default Layout;
