"use client";

import React, { Suspense } from "react";
import { TrabajoDetail } from "../components/trabajo-detail";

interface TrabajoPageProps {
  params: Promise<{ id: string }>;
}

export default function TrabajoPage({ params }: TrabajoPageProps) {
  const { id } = React.use(params);
  return (
    <Suspense fallback={<div className="flex-1 min-h-screen bg-transparent" />}>
      <TrabajoDetail id={id} />
    </Suspense>
  );
}
