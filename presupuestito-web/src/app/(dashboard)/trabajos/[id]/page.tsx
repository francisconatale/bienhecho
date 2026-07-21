"use client";

import React, { Suspense } from "react";
import { TrabajoDetail } from "../components/trabajo-detail";
import { TrabajoDetailSkeleton } from "@/components/ui/skeletons";

interface TrabajoPageProps {
  params: Promise<{ id: string }>;
}

export default function TrabajoPage({ params }: TrabajoPageProps) {
  const { id } = React.use(params);
  return (
    <Suspense fallback={<TrabajoDetailSkeleton />}>
      <TrabajoDetail id={id} />
    </Suspense>
  );
}
