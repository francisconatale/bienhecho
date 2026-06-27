import React from "react";

interface ListGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function ListGroup({ children, className = "" }: ListGroupProps) {
  return (
    <div className={`bg-surface/80 rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
