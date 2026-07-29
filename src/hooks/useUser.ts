import useSWR, { mutate } from "swr";
import { userService } from "../services/user.service";
import { useAuthStore } from "../stores/auth";

export const useUser = (userId?: string) => {
  const currentUserId = useAuthStore((s) => s.user?.id);
  const finalId = userId ?? currentUserId;

  const fetcher = async () => {
    if (!finalId) return null;
    return userService.getUserById(finalId);
  };

  const { data: profile, isLoading, error } = useSWR(
    finalId ? ["user", finalId] : null,
    fetcher
  );

  const mutateUser = () => mutate(["user", finalId]);
  const isOwnProfile = currentUserId === finalId;

  const isFollowing =
    profile?.followers?.some((u: any) => u.id === currentUserId) ?? false;

  return {
    profile,
    isLoading,
    error,
    isOwnProfile,
    isFollowing,
    mutateUser,
  };
};
