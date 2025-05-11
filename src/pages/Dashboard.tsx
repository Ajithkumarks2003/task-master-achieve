
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useTask } from "@/contexts/TaskContext";
import { useGamification } from "@/contexts/GamificationContext";
import StatCard from "@/components/dashboard/StatCard";
import LevelCard from "@/components/gamification/LevelCard";
import BadgeDisplay from "@/components/gamification/BadgeDisplay";
import TaskCard from "@/components/tasks/TaskCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckSquare, Calendar, Award, List, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, getUserTasks, completeTask, deleteTask } = useTask();
  const { getUserLevel, getUserBadges, getLevelProgress } = useGamification();
  const navigate = useNavigate();
  
  const userTasks = getUserTasks();
  const completedTasks = userTasks.filter(task => task.completed);
  const pendingTasks = userTasks.filter(task => !task.completed);
  
  const userLevel = getUserLevel();
  const userBadges = getUserBadges();
  const levelProgress = getLevelProgress();
  
  const todaysDueDate = new Date().toISOString().split('T')[0];
  const dueTodayTasks = pendingTasks.filter(task => 
    task.dueDate && task.dueDate.startsWith(todaysDueDate)
  );
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard 
          title="Total Tasks" 
          value={userTasks.length} 
          icon={<List size={20} />}
        />
        
        <StatCard 
          title="Completed Tasks" 
          value={completedTasks.length} 
          icon={<CheckSquare size={20} />}
        />
        
        <StatCard 
          title="Due Today" 
          value={dueTodayTasks.length} 
          icon={<Calendar size={20} />}
        />
        
        <StatCard 
          title="Points Earned" 
          value={user?.points || 0} 
          icon={<Award size={20} />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <LevelCard
          level={userLevel.level}
          levelName={userLevel.name}
          points={user?.points || 0}
          nextLevelPoints={userLevel.maxPoints + 1}
          progressPercentage={levelProgress.percentage}
          className="lg:col-span-2"
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              {userBadges.slice(0, 3).map((badge, index) => (
                <BadgeDisplay key={index} name={badge.name} description={badge.description} />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-4 text-xs"
              onClick={() => navigate("/achievements")}
            >
              View all badges <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Tasks</h2>
        <Button onClick={() => navigate("/tasks")}>
          <Plus className="h-4 w-4 mr-1" /> New Task
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pendingTasks.slice(0, 6).map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={completeTask}
            onEdit={() => navigate(`/tasks?edit=${task.id}`)}
            onDelete={deleteTask}
          />
        ))}
        
        {pendingTasks.length === 0 && (
          <div className="col-span-full py-8 text-center">
            <p className="text-muted-foreground">You have no pending tasks</p>
            <Button onClick={() => navigate("/tasks")} className="mt-4">
              Create your first task
            </Button>
          </div>
        )}
        
        {pendingTasks.length > 0 && (
          <Button 
            variant="outline" 
            className="col-span-full mt-4"
            onClick={() => navigate("/tasks")}
          >
            View all tasks <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
