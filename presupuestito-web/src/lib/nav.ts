import { ReadonlyURLSearchParams } from "next/navigation";

export function buildBackHref(
  searchParams: ReadonlyURLSearchParams,
  fallback = "/trabajos"
): string {
  const from = searchParams.get("from");
  if (!from) return fallback;

  const params = new URLSearchParams();
  const clienteId = searchParams.get("clienteId");
  if (clienteId) params.set("clienteId", clienteId);

  const qs = params.toString();
  return qs ? `${from}?${qs}` : from;
}

export function buildForwardParams(
  searchParams: ReadonlyURLSearchParams,
  jobId: string
): string {
  const from = searchParams.get("from");
  const clienteId = searchParams.get("clienteId");

  const params = new URLSearchParams();
  params.set("jobId", jobId);
  if (from) params.set("from", from);
  if (clienteId) params.set("clienteId", clienteId);

  return `?${params.toString()}`;
}
