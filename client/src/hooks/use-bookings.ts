import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertBooking } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useBookings(propertyId: number) {
  return useQuery({
    queryKey: [api.bookings.list.path, propertyId],
    queryFn: async () => {
      if (!propertyId) return [];
      const url = buildUrl(api.bookings.list.path, { propertyId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return api.bookings.list.responses[200].parse(await res.json());
    },
    enabled: !!propertyId,
  });
}

export function useCreateBooking(propertyId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<InsertBooking, "propertyId">) => {
      const url = buildUrl(api.bookings.create.path, { propertyId });
      const res = await fetch(url, {
        method: api.bookings.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to create booking");
      return api.bookings.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.bookings.list.path, propertyId] });
      toast({
        title: "Booking created",
        description: "New booking added to the property.",
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

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, propertyId }: { id: number; propertyId: number }) => {
      const url = buildUrl(api.bookings.delete.path, { id });
      const res = await fetch(url, {
        method: api.bookings.delete.method,
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to delete booking");
      return { id, propertyId };
    },
    onSuccess: ({ propertyId }) => {
      queryClient.invalidateQueries({ queryKey: [api.bookings.list.path, propertyId] });
      toast({
        title: "Booking deleted",
        description: "Booking has been removed.",
      });
    },
  });
}
