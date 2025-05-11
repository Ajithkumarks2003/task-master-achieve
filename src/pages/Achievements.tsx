
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useGamification } from "@/contexts/GamificationContext";
import LevelCard from "@/components/gamification/LevelCard";
import BadgeDisplay from "@/components/gamification/BadgeDisplay";
import ProgressBar from "@/components/gamification/ProgressBar";
import LeaderboardItem from "@/components/gamification/LeaderboardItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Achievements = () => {
  const { user } = useAuth();
  const { getUserLevel, getUserBadges, getLeaderboard, getLevelProgress } = useGamification();
  
  const userLevel = getUserLevel();
  const userBadges = getUserBadges();
  const leaderboard = getLeaderboard();
  const levelProgress = getLevelProgress();
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Achievements</h1>
        <p className="text-muted-foreground">
          Track your progress and earn rewards
        </p>
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
            <CardTitle>Your Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Total Points</span>
                  <span>{user?.points || 0}</span>
                </div>
                <ProgressBar value={user?.points || 0} max={2000} />
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Badges Earned</span>
                  <span>{userBadges.length}</span>
                </div>
                <ProgressBar 
                  value={userBadges.length} 
                  max={5} 
                  color="success"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Current Level</span>
                  <span>{userLevel.level} / 6</span>
                </div>
                <ProgressBar 
                  value={userLevel.level} 
                  max={6}
                  color="warning" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="badges">
        <TabsList>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="badges" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 py-4">
                {userBadges.map((badge, index) => (
                  <BadgeDisplay 
                    key={index}
                    name={badge.name}
                    description={badge.description}
                    size="md"
                  />
                ))}
                
                {userBadges.length === 0 && (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-muted-foreground">
                      You haven't earned any badges yet
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leaderboard" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((leaderboardUser, index) => (
                  <LeaderboardItem
                    key={leaderboardUser.id}
                    user={leaderboardUser}
                    rank={index + 1}
                    isCurrentUser={user?.id === leaderboardUser.id}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Achievements;
