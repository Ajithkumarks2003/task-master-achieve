import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useTask, Task, TaskCategory } from "@/contexts/TaskContext";
import TaskCard from "@/components/tasks/TaskCard";
import TaskForm from "@/components/tasks/TaskForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Tasks = () => {
  const { tasks, getUserTasks, completeTask, createTask, updateTask, deleteTask, getTaskById } = useTask();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<TaskCategory | "all">("all");
  
  const userTasks = getUserTasks();
  const completedTasks = userTasks.filter(task => task.completed);
  const pendingTasks = userTasks.filter(task => !task.completed);
  
  const editTaskId = searchParams.get("edit");
  
  // Handle search params for editing
  useEffect(() => {
    if (editTaskId) {
      const task = getTaskById(editTaskId);
      if (task) {
        setCurrentTask(task);
        setIsEditDialogOpen(true);
      }
    }
  }, [editTaskId, getTaskById]);
  
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setCurrentTask(null);
    
    // Remove the edit param from URL
    navigate("/tasks");
  };
  
  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsEditDialogOpen(true);
    
    // Add task ID to URL for sharing/refreshing purposes
    navigate(`/tasks?edit=${task.id}`);
  };
  
  const handleCreateSubmit = async (data: any) => {
    await createTask(data);
    setIsCreateDialogOpen(false);
  };
  
  const handleEditSubmit = async (data: any) => {
    if (currentTask) {
      await updateTask(currentTask.id, data);
      handleCloseEditDialog();
    }
  };
  
  const handleDeleteConfirm = async () => {
    if (currentTask) {
      await deleteTask(currentTask.id);
      setIsDeleteDialogOpen(false);
      setCurrentTask(null);
      
      // If we were editing the task, close that dialog too
      if (isEditDialogOpen) {
        handleCloseEditDialog();
      }
    }
  };
  
  const handleDeleteRequest = (task: Task) => {
    setCurrentTask(task);
    setIsDeleteDialogOpen(true);
  };
  
  const filteredTasks = (tasks: Task[]) => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "all" || task.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    });
  };
  
  return (
    <MainLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage and track your tasks
          </p>
        </div>
        
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> New Task
        </Button>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="w-full sm:w-48 flex items-center">
          <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
          <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as TaskCategory | "all")}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="study">Study</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({filteredTasks(pendingTasks).length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({filteredTasks(completedTasks).length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-6">
          {filteredTasks(pendingTasks).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTasks(pendingTasks).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={() => completeTask(task.id)}
                  onEdit={() => handleEditTask(task)}
                  onDelete={() => handleDeleteRequest(task)}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No pending tasks found</p>
              {filterCategory !== "all" || searchQuery ? (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterCategory("all");
                  }}
                >
                  Clear filters
                </Button>
              ) : (
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="mt-4"
                >
                  Create your first task
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          {filteredTasks(completedTasks).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTasks(completedTasks).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={() => completeTask(task.id)}
                  onEdit={() => handleEditTask(task)}
                  onDelete={() => handleDeleteRequest(task)}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No completed tasks found</p>
              {filterCategory !== "all" || searchQuery ? (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterCategory("all");
                  }}
                >
                  Clear filters
                </Button>
              ) : null}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Create Task Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new task
            </DialogDescription>
          </DialogHeader>
          <TaskForm 
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update task details
            </DialogDescription>
          </DialogHeader>
          {currentTask && (
            <TaskForm 
              defaultValues={currentTask}
              onSubmit={handleEditSubmit}
              onCancel={handleCloseEditDialog}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Tasks;
