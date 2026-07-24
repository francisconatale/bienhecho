"use server";

import { cobrosService } from "@/services/cobros.service";

export const cobrosService_getByJobId: typeof cobrosService.getByJobId = async (...args) =>
  cobrosService.getByJobId(...args);

export const cobrosService_create: typeof cobrosService.create = async (...args) =>
  cobrosService.create(...args);

export const cobrosService_update: typeof cobrosService.update = async (...args) =>
  cobrosService.update(...args);

export const cobrosService_delete: typeof cobrosService.delete = async (...args) =>
  cobrosService.delete(...args);
