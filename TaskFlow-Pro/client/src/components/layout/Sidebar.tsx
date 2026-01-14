import { Link, useLocation } from "wouter";
import { LayoutDashboard, LogOut, Building2, Menu, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

export function Sidebar() {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useI18n();

  const NavContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          PropManage
        </h1>
        <p className="text-sm text-slate-400 mt-1">SaaS Task Manager</p>
      </div>

      <div className="flex-1 py-6 px-4 space-y-2">
        <Link href="/" className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
          location === "/" 
            ? "bg-primary text-white shadow-lg shadow-primary/25" 
            : "text-slate-400 hover:text-white hover:bg-slate-800"
        )} onClick={() => setIsOpen(false)}>
          <LayoutDashboard size={20} />
          <span className="font-medium">{t('sidebar.dashboard')}</span>
        </Link>

        <Link href="/settings" className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
          location === "/settings" 
            ? "bg-primary text-white shadow-lg shadow-primary/25" 
            : "text-slate-400 hover:text-white hover:bg-slate-800"
        )} onClick={() => setIsOpen(false)}>
          <Settings size={20} />
          <span className="font-medium">{t('sidebar.settings')}</span>
        </Link>
        
        {/* Placeholder for future links */}
        <div className="px-4 py-2 mt-8 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {t('sidebar.account')}
        </div>
        
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 cursor-not-allowed opacity-50">
          <Building2 size={20} />
          <span className="font-medium">{t('sidebar.properties')} (Pro)</span>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-inner">
            {((user?.name || user?.username) || "U").charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate text-white">{user?.name || user?.username}</p>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider truncate">
              {(user?.role || "Free Plan").replace("_", " ")}
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-xl"
          onClick={() => logout()}
        >
          <LogOut size={18} className="mr-2" />
          {t('sidebar.logout')}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shadow-lg bg-background">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80 border-r-slate-800">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50 border-r border-slate-200 shadow-xl bg-slate-900">
        <NavContent />
      </aside>
    </>
  );
}
