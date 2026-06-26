"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useDataStore } from "@/lib/store";
import { Client } from "@/types";
import { useEffect } from "react";

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
  const { addClient, updateClient } = useDataStore();

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

  const onSubmit = (data: ClientFormValues) => {
    if (initialClient) {
      updateClient(initialClient.id, {
        nombre: data.nombre,
        email: data.email || undefined,
        telefono: data.telefono || undefined,
        direccion: data.direccion || undefined,
      });

      if (onSuccess) {
        onSuccess(initialClient.id);
      } else {
        router.push("/clientes");
      }
    } else {
      const newClient = addClient({
        nombre: data.nombre,
        email: data.email || undefined,
        telefono: data.telefono || undefined,
        direccion: data.direccion || undefined,
      });

      if (onSuccess) {
        onSuccess(newClient.id);
      } else {
        router.push("/clientes");
      }
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting,
  };
}
