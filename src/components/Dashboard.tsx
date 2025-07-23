import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotesModule } from './NotesModule';
import { TaskTracker } from './TaskTracker';
import { FocusTimer } from './FocusTimer';
import { TreeGrowth } from './TreeGrowth';
import { useTimer } from '@/contexts/TimerContext';
import { 
  FileText, 
  CheckSquare, 
  Timer, 
  TreePine,
  Target,
  Brain,
  Zap
} from 'lucide-react';
import forestBg from '@/assets/forest-background.jpg';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [todayTasks, setTodayTasks] = useState(0);
  const [notes, setNotes] = useState(0);
  const { sessions: focusSessions } = useTimer();

  return (
    <div 
      className="relative"
      style={{
        backgroundImage: `url(${forestBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Forest Overlay */}
      <div className="absolute inset-0 bg-background/80" />
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
            <TreePine className="text-primary" size={36} />
            GrowMind
          </h1>
          <p className="text-muted-foreground">Cultivate your productivity forest</p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-card/90 backdrop-blur shadow-glow border border-primary/20">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 transition-magical hover:shadow-magical"
            >
              <TreePine size={16} />
              Forest
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              className="flex items-center gap-2 transition-magical hover:shadow-magical"
            >
              <FileText size={16} />
              Notes
            </TabsTrigger>
            <TabsTrigger 
              value="tasks" 
              className="flex items-center gap-2 transition-magical hover:shadow-magical"
            >
              <CheckSquare size={16} />
              Tasks
            </TabsTrigger>
            <TabsTrigger 
              value="focus" 
              className="flex items-center gap-2 transition-magical hover:shadow-magical"
            >
              <Timer size={16} />
              Focus
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tree Growth Visualization */}
              <Card className="lg:col-span-2 bg-card/90 backdrop-blur shadow-growth">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TreePine className="text-primary" />
                    Your Growth Forest
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TreeGrowth />
                </CardContent>
              </Card>

              {/* Stats */}
              <div className="space-y-4">
                <Card className="bg-card/90 backdrop-blur shadow-magical border border-primary/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Target className="text-primary animate-float" size={24} />
                      <div>
                        <p className="text-2xl font-bold">{todayTasks}</p>
                        <p className="text-sm text-muted-foreground">Tasks Completed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/90 backdrop-blur shadow-magical border border-primary/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Zap className="text-primary animate-sparkle" size={24} />
                      <div>
                        <p className="text-2xl font-bold">{focusSessions}</p>
                        <p className="text-sm text-muted-foreground">Focus Sessions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/90 backdrop-blur shadow-magical border border-primary/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Brain className="text-primary animate-pulse-growth" size={24} />
                      <div>
                        <p className="text-2xl font-bold">{notes}</p>
                        <p className="text-sm text-muted-foreground">Notes Created</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <Card className="bg-card/90 backdrop-blur shadow-glow animate-magical-pulse">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setActiveTab('notes')}
                    className="h-16 bg-gradient-forest hover:bg-primary/90 hover:shadow-magical transition-magical hover:scale-105"
                  >
                    <FileText className="mr-2" />
                    Create Note
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('tasks')}
                    className="h-16 bg-gradient-growth hover:bg-accent/90 hover:shadow-magical transition-magical hover:scale-105"
                    variant="secondary"
                  >
                    <CheckSquare className="mr-2" />
                    Add Task
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('focus')}
                    className="h-16 bg-gradient-sunrise hover:bg-primary-glow/90 hover:shadow-magical transition-magical hover:scale-105"
                    variant="outline"
                  >
                    <Timer className="mr-2" />
                    Start Focus
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes">
            <NotesModule onNotesChange={setNotes} />
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <TaskTracker onTasksChange={setTodayTasks} />
          </TabsContent>

          {/* Focus Tab */}
          <TabsContent value="focus">
            <FocusTimer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};