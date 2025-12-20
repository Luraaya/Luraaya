import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { AuroraBackground } from "../ui/aurora-background";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AuroraBackground className="min-h-screen">
      <div className="relative z-10 flex flex-col min-h-screen">
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
