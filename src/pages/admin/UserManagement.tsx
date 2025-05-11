
import React, { useState } from "react";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth, User } from "@/contexts/AuthContext";
import { useTask } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle, Search, User as UserIcon } from "lucide-react";

const UserManagement = () => {
  const { user } = useAuth();
  const { tasks } = useTask();
  const [searchQuery, setSearchQuery] = useState("");
  
  // In a real app, we would fetch this from an API
  const mockUsers: User[] = [
    {
      id: "1",
      email: "admin@taskmanager.com",
      name: "Admin User",
      role: "admin",
      points: 1500,
      level: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      email: "user@taskmanager.com",
      name: "Demo User",
      role: "user",
      points: 750,
      level: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      email: "jane@example.com",
      name: "Jane Smith",
      role: "user",
      points: 320,
      level: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      email: "john@example.com",
      name: "John Brown",
      role: "user",
      points: 980,
      level: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: "5",
      email: "sarah@example.com",
      name: "Sarah Johnson",
      role: "user",
      points: 1250,
      level: 5,
      createdAt: new Date().toISOString(),
    },
    ...(user?.id !== "1" ? [] : [{ ...user }]),
  ];
  
  // Filter users based on search query
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Count user tasks
  const getUserTaskCount = (userId: string) => {
    return tasks.filter(task => task.userId === userId).length;
  };
  
  // Get completion percentage
  const getCompletionPercentage = (userId: string) => {
    const userTasks = tasks.filter(task => task.userId === userId);
    if (userTasks.length === 0) return 0;
    
    const completed = userTasks.filter(task => task.completed).length;
    return Math.round((completed / userTasks.length) * 100);
  };
  
  const handleImpersonate = (userId: string) => {
    toast.info("User impersonation is not implemented in this demo");
  };
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage users and their permissions
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button variant="outline">
          Add User
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Tasks</TableHead>
              <TableHead>Completion</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
                      <UserIcon size={14} />
                    </div>
                    {user.name}
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{getUserTaskCount(user.id)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${getCompletionPercentage(user.id)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">{getCompletionPercentage(user.id)}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleImpersonate(user.id)}>
                    Impersonate
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
};

export default UserManagement;
