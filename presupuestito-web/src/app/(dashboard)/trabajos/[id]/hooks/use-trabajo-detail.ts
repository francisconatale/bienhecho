import { useState, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsService } from "@/services/jobs.service";
import { clientsService } from "@/services/clients.service";
import { tasksService } from "@/services/tasks.service";
import { cobrosService } from "@/services/cobros.service";;
import { useBudgetPDF } from '@/hooks/use-budget-pdf';

export function useTrabajoDetail(id: string) {
  const queryClient = useQueryClient();
  const { data: job, isLoading: isLoadingJob } = useQuery({ 
    queryKey: ['job', id], 
    queryFn: () => jobsService.getById(id) 
  });
  const { data: client } = useQuery({ 
    queryKey: ['client', job?.cliente_id], 
    queryFn: () => clientsService.getById(job!.cliente_id),
    enabled: !!job?.cliente_id 
  });
  const { data: jobTasks = [] } = useQuery({ 
    queryKey: ['tasks', id], 
    queryFn: () => tasksService.getByJobId(id) 
  });
  const { data: cobros = [] } = useQuery({ queryKey: ['cobros', id], queryFn: () => cobrosService.getByJobId(id) });

  const updateJobMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) => jobsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', id] });
    }
  });

  const addCobroMutation = useMutation({
    mutationFn: cobrosService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cobros', id] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', id] });
    },
  });

  const { downloadPDF } = useBudgetPDF();
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [showPdfDialog, setShowPdfDialog] = useState(false);
  const [generatingAction, setGeneratingAction] = useState<'guardar' | 'emitir' | null>(null);

  const doGeneratePDF = useCallback(async (emitir: boolean) => {
    setGeneratingAction(emitir ? 'emitir' : 'guardar');
    if (!job) {
      setGeneratingAction(null);
      return;
    }
    try {
      downloadPDF(job.id);
      if (emitir && job.estado !== 'presupuestado') {
        await updateJobMutation.mutateAsync({
          id: job.id,
          data: { estado: 'presupuestado' },
        });
      }
      setShowPdfDialog(false);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      setPdfError(error instanceof Error ? error.message : 'Error al generar el PDF');
      setShowPdfDialog(false);
    } finally {
      setGeneratingAction(null);
    }
  }, [job, downloadPDF, updateJobMutation]);

  return {
    job,
    isLoadingJob,
    client,
    jobTasks,
    cobros,
    updateJobMutation,
    addCobroMutation,
    pdfError,
    setPdfError,
    showPdfDialog,
    setShowPdfDialog,
    generatingAction,
    doGeneratePDF,
    downloadPDF
  };
}
