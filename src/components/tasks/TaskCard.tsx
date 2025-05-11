
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Edit, Trash2 } from "lucide-react";
import { Task } from "@/contexts/TaskContext";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onEdit, onDelete }) => {
  const priorityClass = 
    task.priority === "high" 
      ? "task-priority-high" 
      : task.priority === "medium" 
        ? "task-priority-medium" 
        : "task-priority-low";
        
  const formattedDate = task.dueDate 
    ? format(new Date(task.dueDate), "MMM d, yyyy")
    : "No due date";
    
  return (
    <Card className={cn("overflow-hidden", priorityClass, task.completed && "opacity-70")}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className={cn("font-medium", task.completed && "line-through")}>{task.title}</h3>
          <Badge variant={getCategoryVariant(task.category)}>{task.category}</Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          {task.description}
        </p>
        
        <div className="flex items-center justify-between text-xs">
          <span>Due: {formattedDate}</span>
          <Badge variant="outline">+{task.pointsReward} pts</Badge>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex justify-end gap-2 border-t bg-muted/20">
        {!task.completed && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onComplete(task.id)}
          >
            <CheckSquare className="h-4 w-4 mr-1" />
            Complete
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onEdit(task)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-destructive hover:text-destructive" 
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

function getCategoryVariant(category: string) {
  switch (category) {
    case "work": return "default";
    case "personal": return "secondary";
    case "study": return "outline";
    case "health": return "destructive";
    default: return "secondary";
  }
}

export default TaskCard;
