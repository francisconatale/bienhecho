"use server";

import { visitsService } from "@/services/visits.service";

export const visitsService_getAll: typeof visitsService.getAll = async (...args) =>
  visitsService.getAll(...args);

export const visitsService_getUpcoming: typeof visitsService.getUpcoming = async (...args) =>
  visitsService.getUpcoming(...args);

export const visitsService_getByRange: typeof visitsService.getByRange = async (...args) =>
  visitsService.getByRange(...args);

export const visitsService_create: typeof visitsService.create = async (...args) =>
  visitsService.create(...args);

export const visitsService_update: typeof visitsService.update = async (...args) =>
  visitsService.update(...args);

export const visitsService_delete: typeof visitsService.delete = async (...args) =>
  visitsService.delete(...args);

export const visitsService_getVisitaTareas: typeof visitsService.getVisitaTareas = async (...args) =>
  visitsService.getVisitaTareas(...args);
