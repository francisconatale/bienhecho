"use server";

import { taskPhotosService } from "@/services/task-photos.service";

export const taskPhotosService_getByTaskId: typeof taskPhotosService.getByTaskId = async (...args) =>
  taskPhotosService.getByTaskId(...args);

export const taskPhotosService_uploadFile: typeof taskPhotosService.uploadFile = async (...args) =>
  taskPhotosService.uploadFile(...args);

export const taskPhotosService_create: typeof taskPhotosService.create = async (...args) =>
  taskPhotosService.create(...args);

export const taskPhotosService_delete: typeof taskPhotosService.delete = async (...args) =>
  taskPhotosService.delete(...args);
