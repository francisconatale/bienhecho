"use server";

import { transactionsService } from "@/services/transactions.service";

export const transactionsService_getByJobId: typeof transactionsService.getByJobId = async (...args) =>
  transactionsService.getByJobId(...args);
