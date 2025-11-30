import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="h-screen flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden h-screen">
        <MobileNav />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
