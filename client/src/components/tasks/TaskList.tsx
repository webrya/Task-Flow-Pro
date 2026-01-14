import { type Task } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Clock, Trash2, MoreVertical } from "lucide-react";
import { useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TaskListProps {
  tasks: Task[];
  propertyId: number;
}

export function TaskList({ tasks, propertyId }: TaskListProps) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-4">
          <CheckCircle2 className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700">No tasks yet</h3>
        <p className="text-slate-500 max-w-sm mx-auto mt-1">
          Create your first task to start tracking maintenance and to-dos for this property.
        </p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 mr-1" />;
      case 'in_progress': return <Clock className="w-4 h-4 mr-1" />;
      default: return <Circle className="w-4 h-4 mr-1" />;
    }
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div 
          key={task.id}
          className="group flex items-start justify-between p-4 bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h4 className={cn(
                "font-medium text-slate-900",
                task.status === 'completed' && "text-slate-500 line-through"
              )}>
                {task.title}
              </h4>
              <Badge variant="outline" className={cn("capitalize font-normal", getStatusColor(task.status))}>
                {getStatusIcon(task.status)}
                {task.status.replace('_', ' ')}
              </Badge>
            </div>
            {task.description && (
              <p className="text-sm text-slate-500 line-clamp-2">{task.description}</p>
            )}
            <div className="text-xs text-slate-400 mt-2">
              Created {new Date(task.createdAt!).toLocaleDateString()}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => updateTask.mutate({ id: task.id, status: 'open' })}>
                <Circle className="w-4 h-4 mr-2" /> Mark as Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateTask.mutate({ id: task.id, status: 'in_progress' })}>
                <Clock className="w-4 h-4 mr-2" /> Mark In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateTask.mutate({ id: task.id, status: 'completed' })}>
                <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Completed
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => deleteTask.mutate({ id: task.id, propertyId })}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
}
