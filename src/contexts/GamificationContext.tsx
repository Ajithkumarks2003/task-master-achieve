
import React, { createContext, useContext, ReactNode } from "react";
import { User, useAuth } from "./AuthContext";
import { useTask } from "./TaskContext";

type Badge = {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
};

type UserLevel = {
  level: number;
  name: string;
  minPoints: number;
  maxPoints: number;
};

type GamificationContextType = {
  getUserBadges: (userId?: string) => Badge[];
  getUserLevel: (user?: User) => UserLevel;
  getLeaderboard: () => User[];
  getLevelProgress: (user?: User) => { current: number; next: number; percentage: number };
};

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

// Define level thresholds
const LEVELS: UserLevel[] = [
  { level: 1, name: "Beginner", minPoints: 0, maxPoints: 99 },
  { level: 2, name: "Novice", minPoints: 100, maxPoints: 249 },
  { level: 3, name: "Apprentice", minPoints: 250, maxPoints: 499 },
  { level: 4, name: "Adept", minPoints: 500, maxPoints: 999 },
  { level: 5, name: "Expert", minPoints: 1000, maxPoints: 1999 },
  { level: 6, name: "Master", minPoints: 2000, maxPoints: Number.MAX_SAFE_INTEGER },
];

// Mock badges
const BADGES: Badge[] = [
  {
    id: "first-task",
    name: "First Steps",
    description: "Completed your first task",
  },
  {
    id: "five-tasks",
    name: "Getting Things Done",
    description: "Completed 5 tasks",
  },
  {
    id: "level-up",
    name: "Level Up",
    description: "Reached level 2",
  },
  {
    id: "streak-3",
    name: "On Fire",
    description: "Completed tasks for 3 days in a row",
  },
  {
    id: "high-priority",
    name: "Fire Fighter",
    description: "Completed a high priority task",
  },
];

export const GamificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { tasks } = useTask();

  const getUserBadges = (userId?: string): Badge[] => {
    if (!userId && user) {
      userId = user.id;
    }
    
    if (!userId) return [];
    
    // In a real app, we would fetch this from an API
    // For now, simulate some logic for badges based on tasks
    const userTasks = tasks.filter(task => task.userId === userId);
    const completedTasks = userTasks.filter(task => task.completed);
    const highPriorityCompleted = completedTasks.some(task => task.priority === "high");
    
    const earnedBadges: Badge[] = [];
    
    if (completedTasks.length >= 1) {
      earnedBadges.push(BADGES.find(badge => badge.id === "first-task")!);
    }
    
    if (completedTasks.length >= 5) {
      earnedBadges.push(BADGES.find(badge => badge.id === "five-tasks")!);
    }
    
    if (highPriorityCompleted) {
      earnedBadges.push(BADGES.find(badge => badge.id === "high-priority")!);
    }
    
    if (user && user.level >= 2) {
      earnedBadges.push(BADGES.find(badge => badge.id === "level-up")!);
    }
    
    // Mock the streak badge for demo purposes
    earnedBadges.push(BADGES.find(badge => badge.id === "streak-3")!);
    
    return earnedBadges;
  };

  const getUserLevel = (currentUser?: User): UserLevel => {
    const userToCheck = currentUser || user;
    if (!userToCheck) return LEVELS[0];
    
    return LEVELS.find(level => 
      userToCheck.points >= level.minPoints && userToCheck.points <= level.maxPoints
    ) || LEVELS[0];
  };

  const getLeaderboard = (): User[] => {
    // In a real app, we would fetch this from an API
    // For now, simulate with mock data
    // Get users from localStorage
    const savedUser = localStorage.getItem("taskManagerUser");
    const currentUser = savedUser ? JSON.parse(savedUser) : null;
    
    // Create a leaderboard with the current user and some mock users
    const leaderboard: User[] = [
      {
        id: "mock1",
        email: "sarah@example.com",
        name: "Sarah Johnson",
        role: "user",
        points: 1250,
        level: 5,
        createdAt: new Date().toISOString()
      },
      {
        id: "mock2",
        email: "mike@example.com",
        name: "Mike Smith",
        role: "user",
        points: 980,
        level: 4,
        createdAt: new Date().toISOString()
      },
      {
        id: "mock3",
        email: "alex@example.com",
        name: "Alex Wong",
        role: "user",
        points: 2350,
        level: 6,
        createdAt: new Date().toISOString()
      },
      {
        id: "mock4",
        email: "taylor@example.com",
        name: "Taylor Reed",
        role: "user",
        points: 420,
        level: 3,
        createdAt: new Date().toISOString()
      }
    ];
    
    if (currentUser && currentUser.role === "user") {
      leaderboard.push(currentUser);
    }
    
    // Sort by points in descending order
    return leaderboard.sort((a, b) => b.points - a.points);
  };

  const getLevelProgress = (currentUser?: User) => {
    const userToCheck = currentUser || user;
    if (!userToCheck) {
      return { current: 0, next: 100, percentage: 0 };
    }
    
    const currentLevel = getUserLevel(userToCheck);
    const points = userToCheck.points;
    
    // If at max level
    if (currentLevel.level === LEVELS[LEVELS.length - 1].level) {
      return { current: points, next: points, percentage: 100 };
    }
    
    const pointsInCurrentLevel = points - currentLevel.minPoints;
    const pointsNeededForNextLevel = currentLevel.maxPoints - currentLevel.minPoints + 1;
    const percentage = Math.min(Math.round((pointsInCurrentLevel / pointsNeededForNextLevel) * 100), 100);
    
    return {
      current: pointsInCurrentLevel,
      next: pointsNeededForNextLevel,
      percentage
    };
  };

  return (
    <GamificationContext.Provider
      value={{
        getUserBadges,
        getUserLevel,
        getLeaderboard,
        getLevelProgress,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error("useGamification must be used within a GamificationProvider");
  }
  return context;
};
