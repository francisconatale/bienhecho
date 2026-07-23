import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService, Profile } from "@/services/profile.service";
import { useAuth } from "@/contexts/auth-context";

export function useProfile() {
  const { user, loading: authLoading } = useAuth();

  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: profileService.get,
    enabled: !!user && !authLoading,
  });

  return {
    profile,
    isLoading: isLoading || authLoading,
    error,
    refetchProfile: refetch,
  };
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<Pick<Profile, "nombre" | "rubro">>) =>
      profileService.update(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
