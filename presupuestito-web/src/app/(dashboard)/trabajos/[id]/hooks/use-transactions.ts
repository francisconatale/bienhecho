import { useQuery } from "@tanstack/react-query";
import { transactionsService_getByJobId } from "@/actions/transactions.actions";

export function useTransactions(jobId: string) {
  const { data: transacciones = [], isLoading, error } = useQuery({
    queryKey: ["transactions", jobId],
    queryFn: () => transactionsService_getByJobId(jobId),
  });

  return {
    transacciones,
    isLoading,
    error,
  };
}
