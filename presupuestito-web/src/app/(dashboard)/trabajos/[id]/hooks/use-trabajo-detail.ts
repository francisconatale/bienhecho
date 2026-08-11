import { useState, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsService_getById, jobsService_update } from "@/actions/jobs.actions";
import { tasksService_getByJobId } from "@/actions/tasks.actions";
import { cobrosService_getByJobId, cobrosService_create } from "@/actions/cobros.actions";
import { useBudgetPDF } from '@/hooks/use-budget-pdf';

export function useTrabajoDetail(id: string) {
  const queryClient = useQueryClient();
  const { data: job, isLoading: isLoadingJob } = useQuery({ 
    queryKey: ['job', id], 
    queryFn: () => jobsService_getById(id) 
  });
  const client = job?.clientes ?? null;
  const { data: jobTasks = [], isLoading: isLoadingTasks } = useQuery({ 
    queryKey: ['tasks', id], 
    queryFn: () => tasksService_getByJobId(id) 
  });
  const { data: cobros = [] } = useQuery({ queryKey: ['cobros', id], queryFn: () => cobrosService_getByJobId(id) });

  const updateJobMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) => jobsService_update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', id] });
    }
  });

  const addCobroMutation = useMutation({
    mutationFn: cobrosService_create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cobros', id] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
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
    isLoadingTasks,
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
