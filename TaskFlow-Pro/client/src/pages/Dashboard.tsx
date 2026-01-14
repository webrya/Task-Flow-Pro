import { useProperties } from "@/hooks/use-properties";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { CreatePropertyDialog } from "@/components/properties/CreatePropertyDialog";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

export default function Dashboard() {
  const { data: properties, isLoading, error } = useProperties();
  const [search, setSearch] = useState("");
  const { t } = useI18n();

  const filteredProperties = properties?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <main className="flex-1 md:ml-72 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-display text-slate-900">{t('dashboard.title')}</h1>
              <p className="text-slate-500 mt-1">{t('dashboard.subtitle')}</p>
            </div>
            <CreatePropertyDialog />
          </div>

          {/* Charts Section */}
          {properties && properties.length > 0 && (
            <DashboardCharts properties={properties} />
          )}

          {/* Search & Filter Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input 
              placeholder="Search properties..." 
              className="pl-10 h-11 bg-white rounded-xl border-slate-200 focus:border-primary shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Content Area */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20">
              Error loading properties. Please try again.
            </div>
          ) : filteredProperties?.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700">{t('dashboard.noProperties')}</h3>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                {search ? "Try adjusting your search terms." : "Get started by adding your first property."}
              </p>
              {!search && (
                <div className="mt-6">
                  <CreatePropertyDialog />
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties?.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
