
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProgressBar from "./ProgressBar";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface LevelCardProps {
  level: number;
  levelName: string;
  points: number;
  nextLevelPoints: number;
  progressPercentage: number;
  className?: string;
}

const LevelCard: React.FC<LevelCardProps> = ({
  level,
  levelName,
  points,
  nextLevelPoints,
  progressPercentage,
  className,
}) => {
  const getBadgeClass = () => {
    if (level <= 2) return "badge-beginner";
    if (level <= 4) return "badge-intermediate";
    if (level <= 5) return "badge-advanced";
    return "badge-master";
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Level {level}</h3>
              <Badge className={getBadgeClass()}>{levelName}</Badge>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold">{points}</span>
            <p className="text-xs text-muted-foreground">Total points</p>
          </div>
        </div>
        
        <ProgressBar 
          value={progressPercentage} 
          label="Progress to next level" 
          showPercentage 
        />
        
        <div className="mt-3 text-sm text-muted-foreground flex justify-between">
          <span>Current: {levelName}</span>
          {level < 6 && (
            <span>{nextLevelPoints - points} points to next level</span>
          )}
          {level >= 6 && (
            <span>Maximum level reached</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LevelCard;
