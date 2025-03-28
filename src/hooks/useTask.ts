import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAuth } from "../contexts/AuthContext";
import { fetchTasks, createTask, updateTask, deleteTask } from "../api/tasks";

export const useTasks = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data: tasks, isLoading, error } = useQuery("tasks", () => fetchTasks(token!), { enabled: !!token });

  const createTaskMutation = useMutation((taskData: any) => createTask(token!, taskData), {
    onSuccess: () => queryClient.invalidateQueries("tasks"),
  });

  const updateTaskMutation = useMutation(({ id, taskData }: { id: string; taskData: any }) => updateTask(token!, id, taskData), {
    onSuccess: () => queryClient.invalidateQueries("tasks"),
  });

  const deleteTaskMutation = useMutation((id: string) => deleteTask(token!, id), {
    onSuccess: () => queryClient.invalidateQueries("tasks"),
  });

  return {
    tasks,
    isLoading,
    error,
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
  };
};
