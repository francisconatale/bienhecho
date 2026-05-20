"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";

const clientSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
});

export type ClientFormValues = z.infer<typeof clientSchema>;

export function useClientForm() {
  const router = useRouter();
  
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      category: "",
    },
  });

  const onSubmit = (data: ClientFormValues) => {
    console.log("Nuevo cliente:", data);
    // Simular guardado
    router.push("/clientes");
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting,
  };
}
