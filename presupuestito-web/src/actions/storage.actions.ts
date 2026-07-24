"use server";

import { storageService } from "@/services/storage.service";

export const storageService_uploadCompanyLogo: typeof storageService.uploadCompanyLogo = async (...args) =>
  storageService.uploadCompanyLogo(...args);

export const storageService_deleteCompanyLogo: typeof storageService.deleteCompanyLogo = async (...args) =>
  storageService.deleteCompanyLogo(...args);

// Note: getPublicUrl is synchronous and uses client-side supabase, so it stays client-side.
// Re-export it here for convenience but it doesn't need "use server".
