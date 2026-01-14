import { type Booking } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Trash2, ExternalLink } from "lucide-react";
import { useDeleteBooking } from "@/hooks/use-bookings";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface BookingListProps {
  bookings: Booking[];
  propertyId: number;
}

export function BookingList({ bookings, propertyId }: BookingListProps) {
  const deleteBooking = useDeleteBooking();

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-4">
          <CalendarIcon className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700">No bookings yet</h3>
        <p className="text-slate-500 max-w-sm mx-auto mt-1">
          Add bookings to track your property's availability and rental sources.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).map((booking) => (
        <div 
          key={booking.id}
          className="group flex items-center justify-between p-4 bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-medium text-slate-900">
                {format(new Date(booking.startDate), "MMM d, yyyy")} - {format(new Date(booking.endDate), "MMM d, yyyy")}
              </span>
              <Badge variant="secondary" className="capitalize">
                {booking.source}
              </Badge>
            </div>
            {booking.externalUid && (
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                UID: {booking.externalUid}
              </p>
            )}
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-400 hover:text-destructive"
            onClick={() => deleteBooking.mutate({ id: booking.id, propertyId })}
            disabled={deleteBooking.isPending}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
