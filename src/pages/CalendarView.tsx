
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useTask, Task } from "@/contexts/TaskContext";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Edit, Trash2 } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import TaskCard from "@/components/tasks/TaskCard";
import { DayProps } from "react-day-picker";
import type * as React from 'react';

type TasksByDate = {
  [date: string]: Task[];
};

const CalendarView = () => {
  const { tasks, getUserTasks, completeTask, deleteTask } = useTask();
  const navigate = useNavigate();
  
  const userTasks = getUserTasks();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Group tasks by date
  const tasksByDate = userTasks.reduce((acc: TasksByDate, task) => {
    if (!task.dueDate) return acc;
    
    const dateKey = task.dueDate.split('T')[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(task);
    return acc;
  }, {});
  
  // Get tasks for the selected date
  const getTasksForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    return userTasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    );
  };
  
  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];
  
  // Custom day renderer
  const renderDay = (day: DayProps) => {
    const date = day.date;
    if (!date) return <div>{day.displayText || ""}</div>;
    
    const dateKey = format(date, "yyyy-MM-dd");
    const tasksOnDay = tasksByDate[dateKey] || [];
    const hasTasks = tasksOnDay.length > 0;
    const hasUncompletedTasks = tasksOnDay.some(task => !task.completed);
    
    return (
      <div className={`relative ${hasTasks ? 'font-semibold' : ''}`}>
        {day.displayText || date.getDate()}
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
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          View your tasks scheduled over time
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border w-full"
              components={{
                Day: renderDay
              }}
            />
            
            <div className="mt-6 space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/tasks")}
              >
                View All Tasks
              </Button>
              <Button 
                className="w-full justify-start"
                onClick={() => navigate("/tasks?create=true")}
              >
                Create New Task
              </Button>
            </div>
            
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Legend:</p>
              <div className="flex items-center mb-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm">Pending tasks</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">Completed tasks</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedDate ? (
                `Tasks for ${format(selectedDate, "MMMM d, yyyy")}`
              ) : (
                "Select a date"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateTasks.length > 0 ? (
              <div className="space-y-4">
                {selectedDateTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={() => completeTask(task.id)}
                    onEdit={() => navigate(`/tasks?edit=${task.id}`)}
                    onDelete={() => deleteTask(task.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No tasks scheduled for this day
                </p>
                <Button 
                  className="mt-4"
                  onClick={() => navigate("/tasks?create=true")}
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
