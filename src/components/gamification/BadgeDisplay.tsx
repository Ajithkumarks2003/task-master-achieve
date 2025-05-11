
import React from "react";
import { Badge as UIBadge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Award } from "lucide-react";

interface BadgeProps {
  name: string;
  description: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
}

const BadgeDisplay: React.FC<BadgeProps> = ({
  name,
  description,
  imageUrl,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 48,
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center gap-2">
            <div
              className={`${sizeClasses[size]} rounded-full bg-primary/10 flex items-center justify-center relative group`}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <Award
                  className="text-primary"
                  size={iconSizes[size]}
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                <span className="text-white text-xs font-medium">View</span>
              </div>
            </div>
            <UIBadge variant="outline" className="text-xs whitespace-nowrap">
              {name}
            </UIBadge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-semibold">{name}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BadgeDisplay;
