'use client';

import { Task } from "@/app/types/tasks";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

export function TaskCard({ task }: { task: Task }) {
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
            className="cursor-grab active:cursor-grabbing touch-none"
        >
            <CardHeader className="p-4 pb-0">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{task.title}</h3>
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
             <CardContent className="p-4">
                <Badge variant="outline" className={priorityClasses[task.priority]}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </Badge>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <p className="text-xs text-muted-foreground">Created by {task.creator}</p>
            </CardFooter>
        </Card>
    );
}
