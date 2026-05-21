"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useDataStore } from "@/lib/store";
import { Client } from "@/types";
import { useEffect } from "react";

const clientSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
});

export type ClientFormValues = z.infer<typeof clientSchema>;

export function useClientForm(initialClient?: Client | null, onSuccess?: (clientId: string) => void) {
  const router = useRouter();
  const { addClient, updateClient } = useDataStore();
  
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: initialClient?.name || "",
      email: initialClient?.email || "",
      phone: initialClient?.phone || "",
      category: (initialClient as any)?.category || "",
    },
  });

  useEffect(() => {
    form.reset({
      name: initialClient?.name || "",
      email: initialClient?.email || "",
      phone: initialClient?.phone || "",
      category: (initialClient as any)?.category || "",
    });
  }, [initialClient, form]);

  const onSubmit = (data: ClientFormValues) => {
    if (initialClient) {
      updateClient(initialClient.id, {
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        category: data.category || undefined,
      } as any);
      
      if (onSuccess) {
        onSuccess(initialClient.id);
      } else {
        router.push("/clientes");
      }
    } else {
      const newClient = addClient({
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        category: data.category || undefined,
        status: "Activo",
      } as any);
      
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
