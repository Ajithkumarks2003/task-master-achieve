
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckSquare, 
  Award, 
  Calendar, 
  TrendingUp, 
  Users, 
  Settings,
  ArrowRight
} from "lucide-react";

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  
  const features = [
    {
      title: "Task Management",
      description: "Create, organize, and track your tasks with ease. Set priorities, deadlines, and categories.",
      icon: <CheckSquare className="h-6 w-6" />,
    },
    {
      title: "Calendar View",
      description: "Visualize your tasks on a calendar to better manage your time and deadlines.",
      icon: <Calendar className="h-6 w-6" />,
    },
    {
      title: "Gamification",
      description: "Earn points and badges as you complete tasks. Level up and compete on leaderboards.",
      icon: <Award className="h-6 w-6" />,
    },
    {
      title: "Progress Tracking",
      description: "Track your productivity and see how you improve over time with detailed statistics.",
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      title: "User Management",
      description: "Administrators can manage users and monitor system activity.",
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Customizable",
      description: "Adjust settings and preferences to tailor the system to your needs.",
      icon: <Settings className="h-6 w-6" />,
    },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500 to-blue-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">
            Task Manager
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-slide-up">
            Boost your productivity with our gamified task management system. 
            Complete tasks, earn rewards, and track your progress.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up">
            <Button 
              size="lg" 
              className="bg-white text-blue-700 hover:bg-blue-50 text-base"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-white bg-transparent border-white hover:bg-white/10 text-base"
              onClick={() => navigate("/register")}
            >
              Create Account
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-gray-200">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 text-gray-600">
            Join thousands of users who have improved their productivity with Task Manager.
            Create your account today and start achieving your goals.
          </p>
          <Button 
            size="lg" 
            className="text-base"
            onClick={() => navigate("/register")}
          >
            Create Your Free Account <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Task Manager</h3>
              <p className="text-gray-400">Productivity & Task Management</p>
            </div>
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Task Manager. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
