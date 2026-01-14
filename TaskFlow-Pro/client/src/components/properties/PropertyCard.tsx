import { Link } from "wouter";
import { type Property } from "@shared/schema";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Trash2 } from "lucide-react";
import { useDeleteProperty } from "@/hooks/use-properties";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const deleteProperty = useDeleteProperty();

  return (
    <Card className="group overflow-hidden border-border/60 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden bg-slate-100">
        {property.imageUrl ? (
          <img 
            src={property.imageUrl} 
            alt={property.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
            <BuildingIcon className="w-16 h-16" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="text-xl font-bold font-display truncate text-slate-800">{property.name}</h3>
        <div className="flex items-center text-sm text-muted-foreground gap-1">
          <MapPin size={14} className="text-primary" />
          <span className="truncate">{property.address}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Could add task summary stats here later */}
        <p className="text-sm text-slate-500">Manage tasks and maintenance for this property.</p>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between gap-2">
        <Link href={`/property/${property.id}`} className="flex-1">
          <Button className="w-full group/btn bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            View Details
            <ArrowRight size={16} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-destructive hover:bg-destructive/10">
              <Trash2 size={18} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Property?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{property.name}" and all associated tasks. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteProperty.mutate(property.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}
