"use client";

import React, { Suspense } from "react";
import { TrabajoDetail } from "../components/trabajo-detail";

interface TrabajoPageProps {
  params: Promise<{ id: string }>;
}

export default function TrabajoPage({ params }: TrabajoPageProps) {
  const { id } = React.use(params);
  return (
    <Suspense>
      <TrabajoDetail id={id} />
    </Suspense>
  );
}
