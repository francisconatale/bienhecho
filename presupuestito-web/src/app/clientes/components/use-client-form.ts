"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsService } from "@/services";
import { Client } from "@/types";
import { useEffect } from "react";
import { toast } from "sonner";

const clientSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  telefono: z.string().optional().or(z.literal("")),
  direccion: z.string().optional().or(z.literal("")),
});

export type ClientFormValues = z.infer<typeof clientSchema>;

export function useClientForm(
  initialClient?: Client | null,
  onSuccess?: (clientId: string) => void
) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: clientsService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) =>
      clientsService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nombre: initialClient?.nombre || "",
      email: initialClient?.email || "",
      telefono: initialClient?.telefono || "",
      direccion: initialClient?.direccion || "",
    },
  });

  useEffect(() => {
    form.reset({
      nombre: initialClient?.nombre || "",
      email: initialClient?.email || "",
      telefono: initialClient?.telefono || "",
      direccion: initialClient?.direccion || "",
    });
  }, [initialClient, form]);

  const onSubmit = async (data: ClientFormValues) => {
    try {
      if (initialClient) {
        await updateMutation.mutateAsync({
          id: initialClient.id,
          data: {
            nombre: data.nombre,
            email: data.email || null,
            telefono: data.telefono || null,
            direccion: data.direccion || "",
          },
        });
        toast.success("Cliente actualizado");
        if (onSuccess) {
          onSuccess(initialClient.id);
        } else {
          router.push("/clientes");
        }
      } else {
        const newClient = await createMutation.mutateAsync({
          nombre: data.nombre,
          email: data.email || null,
          telefono: data.telefono || null,
          direccion: data.direccion || "",
        });
        toast.success("Cliente creado");
        if (onSuccess) {
          onSuccess(newClient.id);
        } else {
          router.push("/clientes");
        }
      }
    } catch (error) {
      toast.error(initialClient ? "Error al actualizar cliente" : "Error al crear cliente");
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting || createMutation.isPending || updateMutation.isPending,
  };
}
