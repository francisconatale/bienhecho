import React from "react";

interface ListGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function ListGroup({ children, className = "" }: ListGroupProps) {
  return (
    <div className={`bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
