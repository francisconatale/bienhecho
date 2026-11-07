"use server";

import { transaccionesService } from "@/services/transacciones.service";

export const transaccionesService_getByClientId: typeof transaccionesService.getByClientId = async (...args) =>
  transaccionesService.getByClientId(...args);

export const transaccionesService_create: typeof transaccionesService.create = async (...args) =>
  transaccionesService.create(...args);
