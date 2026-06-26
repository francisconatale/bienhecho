import React from "react";

interface ListGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function ListGroup({ children, className = "" }: ListGroupProps) {
  return (
    <div className={`bg-surface/80 backdrop-blur-3xl rounded-[32px] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] border border-outline-variant/20 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
