import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAuth } from "../contexts/AuthContext";
import { fetchUsers, createUser, updateUser, deleteUser } from "../api/users";

export const useUsers = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery("users", () => fetchUsers(token!), { enabled: !!token, staleTime: 1000 * 60 * 5 });

  const createUserMutation = useMutation((userData: any) => createUser(token!, userData), {
    onSuccess: () => queryClient.invalidateQueries("users"),
  });

  const updateUserMutation = useMutation(({ id, userData }: { id: string; userData: any }) => updateUser(token!, id, userData), {
    onSuccess: () => queryClient.invalidateQueries("users"),
  });

  const deleteUserMutation = useMutation((id: string) => deleteUser(token!, id), {
    onSuccess: () => queryClient.invalidateQueries("users"),
  });

  return {
    users,
    isLoading,
    error,
    createUser: createUserMutation.mutateAsync,
    updateUser: updateUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
  };
};
