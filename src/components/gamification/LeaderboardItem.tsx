
import React from "react";
import { Badge } from "@/components/ui/badge";
import { User } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface LeaderboardItemProps {
  user: User;
  rank: number;
  isCurrentUser?: boolean;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({
  user,
  rank,
  isCurrentUser = false,
}) => {
  return (
    <div 
      className={cn(
        "flex items-center p-3 rounded-md border",
        isCurrentUser ? "bg-primary/5 border-primary/20" : "bg-card border-border"
      )}
    >
      <div className="flex-shrink-0 w-8 text-center font-medium">
        {rank}
      </div>
      
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium mx-3">
        {user.name.charAt(0).toUpperCase()}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">
          {user.name}
          {isCurrentUser && (
            <span className="ml-2 text-xs text-muted-foreground">(You)</span>
          )}
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Level {user.level}
          </Badge>
          <span className="text-sm text-muted-foreground">{user.points} points</span>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardItem;
