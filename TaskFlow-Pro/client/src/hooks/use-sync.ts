import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number; iCalUrl?: string }) => {
      const url = buildUrl(api.properties.update.path, { id });
      const res = await fetch(url, {
        method: api.properties.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update property");
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.properties.get.path, { id: data.id }] });
      queryClient.invalidateQueries({ queryKey: [api.properties.list.path] });
      toast({
        title: "Property updated",
        description: "Your changes have been saved.",
      });
    },
  });
}

export function useSyncBookings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.properties.sync.path, { id });
      const res = await fetch(url, {
        method: api.properties.sync.method,
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to sync bookings");
      }
      return await res.json();
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: [api.bookings.list.path, id] });
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path, id] });
      toast({
        title: "Sync complete",
        description: `Imported ${data.newBookings} new bookings and created ${data.newTasks} cleaning tasks.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Sync failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
