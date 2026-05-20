import React from "react";

interface ListGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function ListGroup({ children, className = "" }: ListGroupProps) {
  return (
    <div className={`bg-white/80 dark:bg-[#1A1C20]/60 backdrop-blur-3xl rounded-[32px] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)] border border-black/5 dark:border-white/[0.08] overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
