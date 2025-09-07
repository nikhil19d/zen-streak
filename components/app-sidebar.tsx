'use client'

import { useState } from "react";
import { User, Moon, Sun, Target, Plus } from "lucide-react";
import { useTheme } from "next-themes";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddTaskForm } from "@/components/add-task-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Cred {
  name: string,
  email: string,
  img: string
}

interface AppSidebarProps {
  onAddTask: (task: string) => void;
  cred: Cred
}

export function AppSidebar({ cred, onAddTask }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { theme, setTheme } = useTheme();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = async () => {
    await fetch("/api/tasks", {
      method: "DELETE"
    })
    await fetch("/api/streak", {
      method: "DELETE"
    })
    await fetch("/api/profile", {
      method: "DELETE"
    })
    window.location.href = "/";
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-80"}
      collapsible="icon"
    >
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent className="p-4 space-y-6">
        {/* Profile Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {!collapsed && "Profile"}
          </SidebarGroupLabel>

          {!collapsed && (
            <SidebarGroupContent>
              <Card>
                <CardContent className="cursor-default p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={cred.img} />
                      <AvatarFallback className="text-white" style={{ backgroundImage: "var(--colort-gradient-zen)" }}>
                        {cred.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <>
                        <div className="flex items-center gap-1">
                          <h3 className="font-medium text-sm truncate">{cred.name}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{cred.email}</p>
                      </>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            {!collapsed && "Add Tasks"}
          </SidebarGroupLabel>

          {!collapsed && (
            <SidebarGroupContent className="space-y-4">
              {/* Quick Add Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center cursor-default gap-2">
                    <Plus className="h-4 w-4 cursor-pointer" />
                    Quick Add
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <AddTaskForm onAdd={onAddTask} placeholder="Add bonus task..." />
                  </div>
                </CardContent>
              </Card>

              {/* Delete Account */}
              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteAccount}
                  className="w-full"
                >
                  Delete Account
                </Button>
              </div>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        {/* Quick Actions */}
        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={toggleTheme}
                    className="flex items-center gap-2"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="h-4 w-4 cursor-default" />
                        Switch to Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4 cursor-default" />
                        Switch to Dark Mode
                      </>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Confirmation Dialogs */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you absolutely sure? This will permanently delete your account and remove all your data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}
