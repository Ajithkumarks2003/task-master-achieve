
import React, { createContext, useState, useContext, ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

export type TaskPriority = "low" | "medium" | "high";
export type TaskCategory = "work" | "personal" | "study" | "health" | "other";

export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string | null;
  createdAt: string;
  userId: string;
  pointsReward: number;
};

type TaskContextType = {
  tasks: Task[];
  isLoading: boolean;
  createTask: (task: Omit<Task, "id" | "createdAt" | "userId" | "pointsReward">) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
  getUserTasks: (userId?: string) => Task[];
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Mock tasks for demo purposes
const generateMockTasks = (): Task[] => {
  return [
    {
      id: "1",
      title: "Complete project proposal",
      description: "Draft and finalize the proposal for the new client project",
      completed: false,
      priority: "high",
      category: "work",
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
      createdAt: new Date().toISOString(),
      userId: "1",
      pointsReward: 50
    },
    {
      id: "2",
      title: "Morning workout",
      description: "30 minutes cardio and strength training",
      completed: true,
      priority: "medium",
      category: "health",
      dueDate: new Date().toISOString(),
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      userId: "1",
      pointsReward: 20
    },
    {
      id: "3",
      title: "Read chapter 5",
      description: "Continue reading 'The Psychology of Money'",
      completed: false,
      priority: "low",
      category: "personal",
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
      createdAt: new Date().toISOString(),
      userId: "2",
      pointsReward: 30
    },
    {
      id: "4",
      title: "Team meeting",
      description: "Weekly sync with the development team",
      completed: false,
      priority: "medium",
      category: "work",
      dueDate: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
      createdAt: new Date().toISOString(),
      userId: "2",
      pointsReward: 40
    }
  ];
};

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("taskManagerTasks");
    return savedTasks ? JSON.parse(savedTasks) : generateMockTasks();
  });
  const [isLoading, setIsLoading] = useState(false);

  // Save tasks to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem("taskManagerTasks", JSON.stringify(tasks));
  }, [tasks]);

  const createTask = async (task: Omit<Task, "id" | "createdAt" | "userId" | "pointsReward">) => {
    setIsLoading(true);
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!user) {
        throw new Error("You must be logged in to create tasks");
      }
      
      const pointsReward = calculatePointsReward(task.priority);
      
      const newTask: Task = {
        ...task,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
        userId: user.id,
        pointsReward,
        completed: false,
      };
      
      setTasks(prevTasks => [...prevTasks, newTask]);
      toast.success("Task created successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to create task");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id: string, updatedFields: Partial<Task>) => {
    setIsLoading(true);
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? { ...task, ...updatedFields } : task
        )
      );
      toast.success("Task updated successfully");
    } catch (error) {
      toast.error("Failed to update task");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    setIsLoading(true);
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeTask = async (id: string) => {
    setIsLoading(true);
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const taskToComplete = tasks.find(task => task.id === id);
      
      if (!taskToComplete) {
        throw new Error("Task not found");
      }
      
      if (taskToComplete.completed) {
        throw new Error("Task is already completed");
      }
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? { ...task, completed: true } : task
        )
      );
      
      toast.success(`Task completed! +${taskToComplete.pointsReward} points`);
      
      // Update user points (in a real app, this would be done via an API)
      if (user && taskToComplete.userId === user.id) {
        const updatedUser = {
          ...user,
          points: user.points + taskToComplete.pointsReward,
          level: calculateLevel(user.points + taskToComplete.pointsReward)
        };
        localStorage.setItem("taskManagerUser", JSON.stringify(updatedUser));
        // Note: In a real app, we would update the user context here
      }
      
    } catch (error: any) {
      toast.error(error.message || "Failed to complete task");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTaskById = (id: string) => {
    return tasks.find(task => task.id === id);
  };

  const getUserTasks = (userId?: string) => {
    if (!userId && user) {
      userId = user.id;
    }
    
    return userId 
      ? tasks.filter(task => task.userId === userId)
      : [];
  };

  // Helper functions
  const calculatePointsReward = (priority: TaskPriority): number => {
    switch (priority) {
      case "high": return 50;
      case "medium": return 30;
      case "low": return 20;
      default: return 10;
    }
  };

  const calculateLevel = (points: number): number => {
    if (points >= 2000) return 6;
    if (points >= 1000) return 5;
    if (points >= 500) return 4;
    if (points >= 250) return 3;
    if (points >= 100) return 2;
    return 1;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        createTask,
        updateTask,
        deleteTask,
        completeTask,
        getTaskById,
        getUserTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
