"use server";

import { suggestionsService } from "@/services/suggestions.service";

export const suggestionsService_getSmartSuggestions: typeof suggestionsService.getSmartSuggestions = async (...args) =>
  suggestionsService.getSmartSuggestions(...args);
