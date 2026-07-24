"use server";

import { materialsService } from "@/services/materials.service";

export const materialsService_getAll: typeof materialsService.getAll = async (...args) =>
  materialsService.getAll(...args);

export const materialsService_getByJobId: typeof materialsService.getByJobId = async (...args) =>
  materialsService.getByJobId(...args);

export const materialsService_create: typeof materialsService.create = async (...args) =>
  materialsService.create(...args);

export const materialsService_update: typeof materialsService.update = async (...args) =>
  materialsService.update(...args);

export const materialsService_delete: typeof materialsService.delete = async (...args) =>
  materialsService.delete(...args);
