"use client";

import { Project } from "@/types";
import { ListItem } from "@/components/ui/list-item";
import { useRouter } from "next/navigation";

const STATUS_CONFIG: Record<Project['status'], { label: string; classes: string }> = {
  Activo: { label: "Activo", classes: "text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10 border border-emerald-200/50 dark:border-emerald-400/20" },
  Completado: { label: "Completado", classes: "text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-400/10 border border-blue-200/50 dark:border-blue-400/20" },
  Pausado: { label: "Pausado", classes: "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/10" },
};

interface ProjectRowProps {
  project: Project;
  clientName: string;
}

export function ProjectRow({ project, clientName }: ProjectRowProps) {
  const router = useRouter();
  const status = STATUS_CONFIG[project.status];
  
  return (
    <ListItem
      icon={project.name.charAt(0)}
      title={project.name}
      subtitle={clientName}
      onClick={() => router.push(`/proyectos/${project.id}`)}
      trailing={
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${status.classes}`}>
          {status.label}
        </span>
      }
    />
  );
}
