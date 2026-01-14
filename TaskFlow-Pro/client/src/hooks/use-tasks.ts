import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertTask } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useTasks(propertyId: number) {
  return useQuery({
    queryKey: [api.tasks.list.path, propertyId],
    queryFn: async () => {
      if (!propertyId) return [];
      const url = buildUrl(api.tasks.list.path, { propertyId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return api.tasks.list.responses[200].parse(await res.json());
    },
    enabled: !!propertyId,
  });
}

export function useCreateTask(propertyId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<InsertTask, "propertyId">) => {
      const url = buildUrl(api.tasks.create.path, { propertyId });
      const res = await fetch(url, {
        method: api.tasks.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to create task");
      return api.tasks.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path, propertyId] });
      toast({
        title: "Task created",
        description: "New task added to the property.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertTask>) => {
      const url = buildUrl(api.tasks.update.path, { id });
      const res = await fetch(url, {
        method: api.tasks.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update task");
      return api.tasks.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path, data.propertyId] });
      toast({
        title: "Task updated",
        description: "Task changes saved successfully.",
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, propertyId }: { id: number; propertyId: number }) => {
      const url = buildUrl(api.tasks.delete.path, { id });
      const res = await fetch(url, {
        method: api.tasks.delete.method,
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to delete task");
      return { id, propertyId };
    },
    onSuccess: ({ propertyId }) => {
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path, propertyId] });
      toast({
        title: "Task deleted",
        description: "Task has been removed.",
      });
    },
  });
}
