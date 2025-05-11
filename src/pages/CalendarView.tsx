
import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MainLayout from "@/components/layout/MainLayout";
import { useTask, Task } from "@/contexts/TaskContext";
import { useNavigate } from "react-router-dom";
import { DayPicker } from "react-day-picker";

type TasksByDate = {
  [date: string]: Task[];
};

const CalendarView = () => {
  const { tasks, getUserTasks, completeTask, deleteTask } = useTask();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const userTasks = getUserTasks();
  
  // Group tasks by their due date
  const tasksByDate = useMemo(() => {
    return userTasks.reduce((acc: TasksByDate, task) => {
      if (task.dueDate && typeof task.dueDate === 'string') {
        const dateKey = task.dueDate.split('T')[0];
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(task);
      }
      return acc;
    }, {});
  }, [userTasks]);
  
  const getTasksForDate = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return tasksByDate[dateKey] || [];
  };
  
  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];
  
  // Custom day renderer that properly uses the DayPicker component types
  const renderDay = (day: Date, modifiers: Record<string, boolean>) => {
    const dateKey = format(day, "yyyy-MM-dd");
    const tasksOnDay = tasksByDate[dateKey] || [];
    const hasTasks = tasksOnDay.length > 0;
    const hasUncompletedTasks = tasksOnDay.some(task => !task.completed);
    
    return (
      <div className={`relative ${hasTasks ? 'font-semibold' : ''}`}>
        <div>{day.getDate()}</div>
        {hasTasks && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
            <div 
              className={`w-1.5 h-1.5 rounded-full ${hasUncompletedTasks ? 'bg-blue-500' : 'bg-green-500'}`}
            ></div>
            {tasksOnDay.length > 1 && (
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Calendar View</h1>
        <p className="text-muted-foreground">
          Visualize your tasks on a calendar
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Task Calendar</CardTitle>
            <CardDescription>
              All your tasks organized by due date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border pointer-events-auto"
              components={{
                Day: ({ date, ...props }) => date ? renderDay(date, props.modifiers || {}) : null
              }}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>
                  {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "No Date Selected"}
                </CardTitle>
                <CardDescription>
                  {selectedDateTasks.length} tasks scheduled
                </CardDescription>
              </div>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      onClick={() => navigate(`/tasks`)}
                    >
                      Add Task
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create a new task for this date</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            {selectedDateTasks.length > 0 ? (
              <div className="space-y-4">
                {selectedDateTasks.map(task => (
                  <div key={task.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{task.title}</h3>
                      <Badge variant={task.completed ? "outline" : "default"}>
                        {task.completed ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                    <div className="flex justify-between">
                      <Badge variant="outline">{task.priority}</Badge>
                      <div className="space-x-2">
                        {!task.completed && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => completeTask(task.id)}
                          >
                            Complete
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/tasks?edit=${task.id}`)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No tasks for this date</p>
                <Button 
                  onClick={() => navigate("/tasks")}
                  className="mt-4"
                >
                  Create a task
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CalendarView;
