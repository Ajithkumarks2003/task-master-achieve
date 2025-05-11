
import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  showPercentage?: boolean;
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "default" | "success" | "warning" | "danger";
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showPercentage = false,
  label,
  className,
  size = "md",
  color = "default",
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };
  
  const colorClasses = {
    default: "",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    danger: "bg-red-600",
  };
  
  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between mb-1 text-sm">
          {label && <span>{label}</span>}
          {showPercentage && <span>{percentage}%</span>}
        </div>
      )}
      <Progress 
        value={percentage} 
        className={cn(sizeClasses[size], {
          "bg-primary": color === "default",
          "bg-green-600": color === "success",
          "bg-yellow-600": color === "warning",
          "bg-red-600": color === "danger"
        })} 
      />
    </div>
  );
};

export default ProgressBar;
