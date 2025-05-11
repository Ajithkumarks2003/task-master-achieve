
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  CheckSquare, 
  Calendar, 
  Trophy, 
  Users, 
  Settings, 
  X 
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  
  const isAdmin = user?.role === "admin";
  
  const navItems = [
    { 
      path: "/dashboard", 
      label: "Dashboard", 
      icon: <Home size={18} /> 
    },
    { 
      path: "/tasks", 
      label: "My Tasks", 
      icon: <CheckSquare size={18} /> 
    },
    { 
      path: "/calendar", 
      label: "Calendar", 
      icon: <Calendar size={18} /> 
    },
    { 
      path: "/achievements", 
      label: "Achievements", 
      icon: <Trophy size={18} /> 
    },
    ...(isAdmin ? [
      { 
        path: "/admin/users", 
        label: "User Management", 
        icon: <Users size={18} /> 
      },
      { 
        path: "/admin/settings", 
        label: "System Settings", 
        icon: <Settings size={18} /> 
      }
    ] : [])
  ];
  
  return (
    <div>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)} 
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="h-16 border-b border-sidebar-border px-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-semibold text-lg text-sidebar-foreground">
              Task Manager
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X size={18} />
          </Button>
        </div>
        
        <nav className="py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {user && (
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="bg-sidebar-accent rounded-md p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default Sidebar;
