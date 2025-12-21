import React, { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Full-width wrapper + centered inner content.
 * This avoids the Tailwind `container` class shrinking the header/background area.
 */
const Container: React.FC<ContainerProps> = ({ children, className = "" }) => {
  return (
    <div className="w-full">
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default Container;
