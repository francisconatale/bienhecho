"use client";

import { WorkRow } from "./work-row";
import { ListGroup } from "@/components/ui/list-group";
import { useDataStore } from "@/lib/store";

import { useShallow } from 'zustand/react/shallow';

interface WorkListProps {
  projectId: string;
}

export function WorkList({ projectId }: WorkListProps) {
  const works = useDataStore(
    useShallow((state) => state.works.filter((w) => w.projectId === projectId))
  );

  return (
    <ListGroup>
      {works.length > 0 ? (
        works.map((work) => <WorkRow key={work.id} work={work} />)
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-on-surface-variant">
          <p className="text-sm font-medium">No hay trabajos en este proyecto.</p>
          <p className="text-xs opacity-60 mt-1">Crea un trabajo para empezar a presupuestar.</p>
        </div>
      )}
    </ListGroup>
  );
}
