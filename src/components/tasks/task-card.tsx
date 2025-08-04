'use client';

import { Task } from "@/app/types/tasks";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

const priorityClasses: Record<Task['priority'], string> = {
    low: 'border-transparent bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-500/30',
    medium: 'border-transparent bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/30',
    high: 'border-transparent bg-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-500/30',
};

type TaskCardProps = {
    task: Task;
    onRemove: (id: string) => void;
}

export function TaskCard({ task, onRemove }: TaskCardProps) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="h-[100px] w-full rounded-lg border-2 border-primary bg-card"
            />
        );
    }

    return (
        <Card 
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="group cursor-grab active:cursor-grabbing touch-none"
        >
            <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between">
                    <h3 className="font-semibold flex-1 pr-2">{task.title}</h3>
                    {task.assignee && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Avatar className="h-7 w-7">
                                        <AvatarFallback>{getInitials(task.assignee.name)}</AvatarFallback>
                                    </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Assigned to {task.assignee.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            </CardHeader>
             <CardContent className="p-4 pt-2">
                <Badge variant="outline" className={priorityClasses[task.priority]}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </Badge>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <p className="text-xs text-muted-foreground">Created by {task.creator}</p>
                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this task
                        and remove its data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onRemove(task.id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
}
