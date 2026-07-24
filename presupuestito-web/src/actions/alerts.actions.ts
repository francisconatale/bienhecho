"use server";

import { alertsService } from "@/services/alerts.service";

export const alertsService_getDashboardAlerts: typeof alertsService.getDashboardAlerts = async (...args) =>
  alertsService.getDashboardAlerts(...args);
