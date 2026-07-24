"use client";

import React, { Suspense } from "react";
import { TrabajoDetail } from "../components/trabajo-detail";
import { TrabajoDetailSkeleton } from "@/components/ui/skeletons";

interface TrabajoDetailContentProps {
  id: string;
}

export function TrabajoDetailContent({ id }: TrabajoDetailContentProps) {
  return (
    <Suspense fallback={<TrabajoDetailSkeleton />}>
      <TrabajoDetail id={id} />
    </Suspense>
  );
}
