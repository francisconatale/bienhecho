"use server";

import { tasksService } from "@/services/tasks.service";

export const tasksService_getAll: typeof tasksService.getAll = async (...args) =>
  tasksService.getAll(...args);

export const tasksService_getPaginated: typeof tasksService.getPaginated = async (...args) =>
  tasksService.getPaginated(...args);

export const tasksService_getResumen: typeof tasksService.getResumen = async (...args) =>
  tasksService.getResumen(...args);

export const tasksService_getCounts: typeof tasksService.getCounts = async (...args) =>
  tasksService.getCounts(...args);

export const tasksService_getByJobId: typeof tasksService.getByJobId = async (...args) =>
  tasksService.getByJobId(...args);

export const tasksService_getById: typeof tasksService.getById = async (...args) =>
  tasksService.getById(...args);

export const tasksService_create: typeof tasksService.create = async (...args) =>
  tasksService.create(...args);

export const tasksService_update: typeof tasksService.update = async (...args) =>
  tasksService.update(...args);

export const tasksService_delete: typeof tasksService.delete = async (...args) =>
  tasksService.delete(...args);
