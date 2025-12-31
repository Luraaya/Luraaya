import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative flex w-full min-h-[100svh] flex-col bg-zinc-50">
      <Header />
      <main className="flex-grow pt-[56px]">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
