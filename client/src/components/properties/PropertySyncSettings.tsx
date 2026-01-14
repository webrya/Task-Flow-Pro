import { useState } from "react";
import { useUpdateProperty, useSyncBookings } from "@/hooks/use-sync";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCw, Link as LinkIcon } from "lucide-react";

export function PropertySyncSettings({ property }: { property: any }) {
  const [iCalUrl, setICalUrl] = useState(property.iCalUrl || "");
  const updateProperty = useUpdateProperty();
  const syncBookings = useSyncBookings();

  const handleUpdate = () => {
    updateProperty.mutate({ id: property.id, iCalUrl });
  };

  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden mb-6">
      <CardHeader className="bg-slate-50 border-b border-slate-100">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-primary" />
          Booking Sync (iCal)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">iCal URL</label>
          <div className="flex gap-2">
            <Input
              placeholder="https://www.airbnb.com/calendar/ical/..."
              value={iCalUrl}
              onChange={(e) => setICalUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleUpdate} 
              disabled={updateProperty.isPending}
            >
              {updateProperty.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </div>
          <p className="text-xs text-slate-500">
            Paste your Airbnb, VRBO or Booking.com iCal link here to automatically import bookings.
          </p>
        </div>

        {property.iCalUrl && (
          <Button
            variant="outline"
            className="w-full border-primary/20 text-primary hover:bg-primary/5"
            onClick={() => syncBookings.mutate(property.id)}
            disabled={syncBookings.isPending}
          >
            {syncBookings.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Sync Bookings Now
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
