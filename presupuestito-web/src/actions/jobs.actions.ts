"use server";

import { jobsService } from "@/services/jobs.service";

export const jobsService_getAll: typeof jobsService.getAll = async (...args) =>
  jobsService.getAll(...args);

export const jobsService_getDashboardStats: typeof jobsService.getDashboardStats = async (...args) =>
  jobsService.getDashboardStats(...args);

export const jobsService_getPaginated: typeof jobsService.getPaginated = async (...args) =>
  jobsService.getPaginated(...args);

export const jobsService_getById: typeof jobsService.getById = async (...args) =>
  jobsService.getById(...args);

export const jobsService_create: typeof jobsService.create = async (...args) =>
  jobsService.create(...args);

export const jobsService_update: typeof jobsService.update = async (...args) =>
  jobsService.update(...args);

export const jobsService_delete: typeof jobsService.delete = async (...args) =>
  jobsService.delete(...args);
