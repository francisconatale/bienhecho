"use client";

import { Work } from "@/types";
import { ListItem } from "@/components/ui/list-item";
import { useRouter } from "next/navigation";
import { Briefcase } from "lucide-react";

const STATUS_CONFIG: Record<Work['status'], { label: string; color: string; bg: string }> = {
  Pendiente: { label: "Pendiente", color: "#8E8E93", bg: "rgba(142,142,147,0.15)" },
  'En Progreso': { label: "En Progreso", color: "#3B82F6", bg: "rgba(59,130,246,0.15)" },
  Finalizado: { label: "Finalizado", color: "#34D399", bg: "rgba(52,211,153,0.15)" },
};

interface WorkRowProps {
  work: Work;
}

export function WorkRow({ work }: WorkRowProps) {
  const router = useRouter();
  const cfg = STATUS_CONFIG[work.status];
  
  return (
    <ListItem
      icon={<Briefcase className="w-5 h-5 opacity-70" />}
      title={work.name}
      onClick={() => router.push(`/trabajos/${work.id}`)}
      trailing={
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide"
          style={{ color: cfg.color, background: cfg.bg }}
        >
          {cfg.label}
        </span>
      }
    />
  );
}