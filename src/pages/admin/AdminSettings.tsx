
import React from "react";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const generalSettingsSchema = z.object({
  appName: z.string().min(1, "App name is required"),
  allowRegistration: z.boolean(),
  userTaskLimit: z.coerce.number().int().positive(),
});

const gamificationSettingsSchema = z.object({
  enableGamification: z.boolean(),
  pointsPerTaskCompletion: z.coerce.number().int().positive(),
  enableLeaderboard: z.boolean(),
});

const AdminSettings = () => {
  const { user } = useAuth();
  
  const generalForm = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      appName: "Task Manager",
      allowRegistration: true,
      userTaskLimit: 100,
    },
  });
  
  const gamificationForm = useForm<z.infer<typeof gamificationSettingsSchema>>({
    resolver: zodResolver(gamificationSettingsSchema),
    defaultValues: {
      enableGamification: true,
      pointsPerTaskCompletion: 20,
      enableLeaderboard: true,
    },
  });
  
  const onSaveGeneral = (values: z.infer<typeof generalSettingsSchema>) => {
    console.log("General settings:", values);
    toast.success("General settings updated");
  };
  
  const onSaveGamification = (values: z.infer<typeof gamificationSettingsSchema>) => {
    console.log("Gamification settings:", values);
    toast.success("Gamification settings updated");
  };
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">
          Configure application settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="gamification">Gamification</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic application settings
              </CardDescription>
            </CardHeader>
            <Form {...generalForm}>
              <form onSubmit={generalForm.handleSubmit(onSaveGeneral)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={generalForm.control}
                    name="appName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the name displayed throughout the application
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalForm.control}
                    name="allowRegistration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Allow User Registration
                          </FormLabel>
                          <FormDescription>
                            Enable or disable new user registration
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalForm.control}
                    name="userTaskLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User Task Limit</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Maximum number of tasks a user can create
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        <TabsContent value="gamification">
          <Card>
            <CardHeader>
              <CardTitle>Gamification Settings</CardTitle>
              <CardDescription>
                Configure gamification features and rewards
              </CardDescription>
            </CardHeader>
            <Form {...gamificationForm}>
              <form onSubmit={gamificationForm.handleSubmit(onSaveGamification)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={gamificationForm.control}
                    name="enableGamification"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Enable Gamification
                          </FormLabel>
                          <FormDescription>
                            Enable or disable all gamification features
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={gamificationForm.control}
                    name="pointsPerTaskCompletion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Points Per Task Completion</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Base points awarded for completing a task
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={gamificationForm.control}
                    name="enableLeaderboard"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Enable Leaderboard
                          </FormLabel>
                          <FormDescription>
                            Show or hide the leaderboard feature
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default AdminSettings;
