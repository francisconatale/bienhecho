"use server";

import { profileService } from "@/services/profile.service";

export const profileService_get: typeof profileService.get = async (...args) =>
  profileService.get(...args);

export const profileService_upsert: typeof profileService.upsert = async (...args) =>
  profileService.upsert(...args);

export const profileService_update: typeof profileService.update = async (...args) =>
  profileService.update(...args);
