"use server";

import { clientsService } from "@/services/clients.service";

export const clientsService_getAll: typeof clientsService.getAll = async (...args) =>
  clientsService.getAll(...args);

export const clientsService_getPaginated: typeof clientsService.getPaginated = async (...args) =>
  clientsService.getPaginated(...args);

export const clientsService_getById: typeof clientsService.getById = async (...args) =>
  clientsService.getById(...args);

export const clientsService_create: typeof clientsService.create = async (...args) =>
  clientsService.create(...args);

export const clientsService_update: typeof clientsService.update = async (...args) =>
  clientsService.update(...args);

export const clientsService_delete: typeof clientsService.delete = async (...args) =>
  clientsService.delete(...args);
