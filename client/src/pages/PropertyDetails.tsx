import { useRoute } from "wouter";
import { useProperty } from "@/hooks/use-properties";
import { useTasks } from "@/hooks/use-tasks";
import { useBookings } from "@/hooks/use-bookings";
import { Sidebar } from "@/components/layout/Sidebar";
import { TaskList } from "@/components/tasks/TaskList";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { BookingList } from "@/components/bookings/BookingList";
import { CreateBookingDialog } from "@/components/bookings/CreateBookingDialog";
import { PropertySyncSettings } from "@/components/properties/PropertySyncSettings";
import { Loader2, MapPin, ArrowLeft, ClipboardList, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PropertyDetails() {
  const [, params] = useRoute("/property/:id");
  const id = parseInt(params?.id || "0");
  const { data: property, isLoading: loadingProperty } = useProperty(id);
  const { data: tasks, isLoading: loadingTasks } = useTasks(id);
  const { data: bookings, isLoading: loadingBookings } = useBookings(id);

  if (loadingProperty) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Property Not Found</h1>
          <Link href="/">
            <Button className="mt-4" variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <main className="flex-1 md:ml-72 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" className="mb-6 pl-0 hover:pl-0 hover:bg-transparent hover:text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          {/* Hero Header */}
          <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-8 shadow-xl">
            {property.imageUrl ? (
              <img 
                src={property.imageUrl} 
                alt={property.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                <span className="text-slate-600 font-display text-4xl font-bold opacity-20">No Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full text-white">
              <h1 className="text-3xl md:text-5xl font-bold font-display mb-2">{property.name}</h1>
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{property.address}</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="tasks" className="space-y-6">
            <TabsList className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <TabsTrigger value="tasks" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                <ClipboardList className="w-4 h-4 mr-2" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="bookings" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold font-display text-slate-900">Tasks</h2>
                    <p className="text-slate-500">Manage maintenance and to-dos</p>
                  </div>
                  <CreateTaskDialog propertyId={id} />
                </div>

                <div className="p-6">
                  {loadingTasks ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                    </div>
                  ) : (
                    <TaskList tasks={tasks || []} propertyId={id} />
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bookings">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold font-display text-slate-900">Bookings</h2>
                    <p className="text-slate-500">Track property availability</p>
                  </div>
                  <CreateBookingDialog propertyId={id} />
                </div>

                <div className="p-6">
                  {loadingBookings ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                    </div>
                  ) : (
                    <BookingList bookings={bookings || []} propertyId={id} />
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <PropertySyncSettings property={property} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
