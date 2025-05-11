
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b px-4 flex items-center justify-between bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
              <Menu size={20} />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 ml-2">
              Task Manager
            </h1>
          </div>
          
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:inline">
                {user.name}
              </span>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                <LogOut size={18} />
              </Button>
            </div>
          )}
        </header>
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
        
        <footer className="h-12 border-t px-4 flex items-center justify-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Task Manager. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
