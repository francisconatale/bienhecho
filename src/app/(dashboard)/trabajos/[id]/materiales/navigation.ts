export function getBackUrl(
  from: string | null,
  jobId: string,
  clienteId?: string
): string {
  // Materiales siempre vuelve al detalle del trabajo
  // Preserva from y clienteId para que el trabajo detail
  // sepa a dónde volver después
  const params = new URLSearchParams();
  params.set("id", jobId);
  if (from) params.set("from", from);
  if (from === "/clientes" && clienteId) params.set("clienteId", clienteId);
  return `/trabajos?${params.toString()}`;
}
