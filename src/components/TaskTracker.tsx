import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckSquare, Plus, Calendar, AlertCircle, Leaf, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  category: 'Health' | 'Study' | 'Personal' | 'Work';
  priority: 'Low' | 'Medium' | 'High';
  deadline?: Date;
  completed: boolean;
  completedAt?: Date;
}

interface TaskTrackerProps {
  onTasksChange: (count: number) => void;
}

export const TaskTracker = ({ onTasksChange }: TaskTrackerProps) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('growmind-tasks', []);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'Personal' as Task['category'],
    priority: 'Medium' as Task['priority'],
    deadline: ''
  });

  const todayCompletedTasks = tasks.filter(task => 
    task.completed && 
    task.completedAt && 
    new Date(task.completedAt).toDateString() === new Date().toDateString()
  ).length;

  useEffect(() => {
    onTasksChange(todayCompletedTasks);
  }, [todayCompletedTasks, onTasksChange]);

  const createTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      category: newTask.category,
      priority: newTask.priority,
      deadline: newTask.deadline ? new Date(newTask.deadline) : undefined,
      completed: false
    };

    setTasks(prev => [task, ...prev]);
    setNewTask({ title: '', category: 'Personal', priority: 'Medium', deadline: '' });
    setIsCreateDialogOpen(false);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const isCompleting = !task.completed;
        return {
          ...task,
          completed: isCompleting,
          completedAt: isCompleting ? new Date() : undefined
        };
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const getCategoryColor = (category: Task['category']) => {
    const colors = {
      Health: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      Study: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      Personal: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      Work: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    };
    return colors[category];
  };

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      Low: 'text-muted-foreground',
      Medium: 'text-primary',
      High: 'text-destructive'
    };
    return colors[priority];
  };

  const isOverdue = (deadline: Date) => {
    return new Date() > deadline;
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-card/90 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="text-primary" />
              Daily Tasks
            </CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-growth">
                  <Plus className="mr-2" size={16} />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card">
                <DialogHeader>
                  <DialogTitle>Plant a New Goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Task description..."
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <select
                        className="w-full p-2 border rounded-md bg-background mt-1"
                        value={newTask.category}
                        onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value as Task['category'] }))}
                      >
                        <option value="Health">Health</option>
                        <option value="Study">Study</option>
                        <option value="Personal">Personal</option>
                        <option value="Work">Work</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <select
                        className="w-full p-2 border rounded-md bg-background mt-1"
                        value={newTask.priority}
                        onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Deadline (optional)</label>
                    <Input
                      type="datetime-local"
                      value={newTask.deadline}
                      onChange={(e) => setNewTask(prev => ({ ...prev, deadline: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={createTask} className="w-full bg-gradient-growth">
                    Create Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{todayCompletedTasks}</p>
              <p className="text-sm text-muted-foreground">Completed Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{pendingTasks.length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{tasks.length}</p>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-glow">
                {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
              </p>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Lists */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <Card className="bg-card/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg">🌱 Growing Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckSquare className="mx-auto mb-4 text-muted-foreground" size={48} />
                <p className="text-muted-foreground">All tasks completed! Great work! 🎉</p>
              </div>
            ) : (
              pendingTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:shadow-growth transition-all animate-fade-in-up"
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getCategoryColor(task.category)}>
                        {task.category}
                      </Badge>
                      <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.deadline && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar size={12} />
                          <span className={isOverdue(task.deadline) ? 'text-destructive' : ''}>
                            {task.deadline.toLocaleDateString()}
                          </span>
                          {isOverdue(task.deadline) && <AlertCircle size={12} className="text-destructive" />}
                        </div>
                      )}
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Task</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{task.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteTask(task.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        <Card className="bg-card/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              🌳 Grown Tasks
              {completedTasks.length > 7 && (
                <Badge variant="secondary" className="text-xs">
                  Showing 7 of {completedTasks.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedTasks.length === 0 ? (
              <div className="text-center py-8">
                <Leaf className="mx-auto mb-4 text-muted-foreground" size={48} />
                <p className="text-muted-foreground">Complete tasks to see them flourish here!</p>
              </div>
            ) : (
              completedTasks
                .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
                .slice(0, 7)
                .map(task => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-accent/20 animate-leaf-fall"
                  >
                    <Checkbox 
                      checked={true} 
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-1" 
                    />
                    <div className="flex-1">
                      <p className="font-medium line-through text-muted-foreground">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getCategoryColor(task.category)}>
                          {task.category}
                        </Badge>
                        {task.completedAt && (
                          <span className="text-xs text-muted-foreground">
                            Completed {new Date(task.completedAt).toLocaleDateString()} at{' '}
                            {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Completed Task</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to permanently delete "{task.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteTask(task.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};