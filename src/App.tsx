
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { GamificationProvider } from "@/contexts/GamificationContext";
import ProtectedRoute from "@/routes/ProtectedRoute";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Dashboard from "@/pages/Dashboard";
import Tasks from "@/pages/Tasks";
import CalendarView from "@/pages/CalendarView";
import Achievements from "@/pages/Achievements";
import UserManagement from "@/pages/admin/UserManagement";
import AdminSettings from "@/pages/admin/AdminSettings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TaskProvider>
        <GamificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/tasks" 
                  element={
                    <ProtectedRoute>
                      <Tasks />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/calendar" 
                  element={
                    <ProtectedRoute>
                      <CalendarView />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/achievements" 
                  element={
                    <ProtectedRoute>
                      <Achievements />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/admin/users" 
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <UserManagement />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/admin/settings" 
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminSettings />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </GamificationProvider>
      </TaskProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
