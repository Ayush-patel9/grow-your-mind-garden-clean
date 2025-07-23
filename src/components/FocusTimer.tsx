import { useState } from 'react';
import { useTimer } from '@/contexts/TimerContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Timer, Play, Pause, Square, TreePine, Zap, Award, Download, History, Calendar } from 'lucide-react';
import { Input } from './ui/input';

interface FocusTimerProps {
  onSessionComplete?: () => void;
}

export const FocusTimer = ({ onSessionComplete }: FocusTimerProps) => {
  const {
    duration,
    timeLeft,
    isRunning,
    isCompleted,
    startTimer,
    pauseTimer,
    resetTimer,
    setDuration,
    sessions,
    streak,
    totalMinutes,
    completedSessions,
    formatTime,
    getProgress,
    getTreeGrowth,
    downloadSessionsCSV,
    exportSessionHistory,
  } = useTimer();

  const [customDuration, setCustomDuration] = useState<number | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const presetDurations = [
    { label: '10 min', value: 10, icon: '🌱' },
    { label: '25 min', value: 25, icon: '🌱' },
    { label: '50 min', value: 50, icon: '🌳' },
    { label: '90 min', value: 90, icon: '🏔️' },
    { label: 'Custom', value: 'custom', icon: '🌲' }
  ];

  const selectDuration = (newDuration: number) => {
    if (!isRunning) {
      setDuration(newDuration);
    }
  };

  const progress = getProgress();
  const treeGrowth = getTreeGrowth();

  return (
    <div className="space-y-6">
      {/* Timer Card */}
      <Card className="bg-card/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="text-primary" />
            Focus Forest
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Duration Selection */}
          {!isRunning && !isCompleted && (
            <div className="flex flex-col gap-2 items-center justify-center">
              <div className="flex gap-2 justify-center">
                {presetDurations.map(preset => (
                  <Button
                    key={preset.value}
                    variant={
                      (preset.value === 'custom' && showCustomInput) || (typeof preset.value === 'number' && duration === preset.value && !showCustomInput)
                        ? "default"
                        : "outline"
                    }
                    onClick={() => {
                      if (preset.value === 'custom') {
                        setShowCustomInput(true);
                      } else {
                        setShowCustomInput(false);
                        selectDuration(preset.value as number);
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <span>{preset.icon}</span>
                    {preset.label}
                  </Button>
                ))}
              </div>
              {showCustomInput && (
                <form
                  className="flex gap-2 items-center mt-2"
                  onSubmit={e => {
                    e.preventDefault();
                    if (customDuration && customDuration > 0) {
                      selectDuration(customDuration);
                      setShowCustomInput(false);
                    }
                  }}
                >
                  <Input
                    type="number"
                    min={1}
                    placeholder="Enter minutes"
                    value={customDuration ?? ''}
                    onChange={e => setCustomDuration(Number(e.target.value))}
                    className="w-28"
                  />
                  <Button type="submit" variant="default">Set</Button>
                </form>
              )}
            </div>
          )}

          {/* Timer Display */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="text-6xl font-mono font-bold text-primary mb-4">
                {formatTime(timeLeft)}
              </div>
              
              {/* Tree Growth Visualization */}
              <div className="relative h-32 flex items-end justify-center">
                <TreePine 
                  size={60} 
                  className={`text-primary transition-all duration-500 ${isRunning ? 'animate-pulse-growth' : ''}`}
                  style={{
                    transform: `scale(${0.5 + (treeGrowth / 100) * 0.5})`,
                    filter: `hue-rotate(${treeGrowth * 0.5}deg)`,
                  }}
                />
                {isRunning && (
                  <div className="absolute inset-0 bg-primary-glow/20 rounded-full blur-xl animate-pulse-growth" />
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-muted-foreground">
                Tree Growth: {Math.round(treeGrowth)}%
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 justify-center">
            {!isRunning ? (
              <Button 
                onClick={startTimer} 
                className="bg-gradient-forest flex items-center gap-2"
                disabled={timeLeft === 0}
              >
                <Play size={16} />
                {timeLeft === duration * 60 ? 'Start Focus' : 'Resume'}
              </Button>
            ) : (
              <Button 
                onClick={pauseTimer} 
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Pause size={16} />
                Pause
              </Button>
            )}
            
            <Button 
              onClick={resetTimer} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Square size={16} />
              Reset
            </Button>
          </div>

          {/* Session Complete Message */}
          {isCompleted && (
            <div className="text-center p-4 bg-gradient-growth rounded-lg animate-grow">
              <Award className="mx-auto mb-2 text-primary-glow" size={32} />
              <h3 className="font-bold text-lg">🎉 Focus Session Complete!</h3>
              <p className="text-sm text-muted-foreground">
                Your tree has grown! Great focus session.
              </p>
            </div>
          )}

          {/* Tips */}
          {!isRunning && !isCompleted && (
            <div className="text-center p-4 bg-accent/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Focus Tip:</strong> Put away distractions and watch your tree grow with your concentration!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-card/90 backdrop-blur">
          <CardContent className="p-4 text-center">
            <Zap className="mx-auto mb-2 text-primary" size={24} />
            <p className="text-2xl font-bold">{sessions}</p>
            <p className="text-sm text-muted-foreground">Sessions Today</p>
          </CardContent>
        </Card>

        <Card className="bg-card/90 backdrop-blur">
          <CardContent className="p-4 text-center">
            <Award className="mx-auto mb-2 text-primary-glow" size={24} />
            <p className="text-2xl font-bold">{streak}</p>
            <p className="text-sm text-muted-foreground">Current Streak</p>
          </CardContent>
        </Card>

        <Card className="bg-card/90 backdrop-blur">
          <CardContent className="p-4 text-center">
            <TreePine className="mx-auto mb-2 text-primary" size={24} />
            <p className="text-2xl font-bold">{totalMinutes}</p>
            <p className="text-sm text-muted-foreground">Minutes Focused</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      {sessions > 0 && (
        <Card className="bg-card/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="text-primary-glow" />
              Today's Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {sessions >= 1 && <Badge className="bg-gradient-forest">🌱 First Sprout</Badge>}
              {sessions >= 3 && <Badge className="bg-gradient-growth">🌿 Growing Strong</Badge>}
              {sessions >= 5 && <Badge className="bg-gradient-sunrise">🌳 Forest Guardian</Badge>}
              {streak >= 7 && <Badge className="bg-gradient-forest">🔥 Week Streak</Badge>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Focus Session History */}
      {completedSessions.length > 0 && (
        <Card className="bg-card/90 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="text-primary" />
                Focus Session History
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  onClick={downloadSessionsCSV}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download size={14} />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {completedSessions
                .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                .slice(0, 20) // Show last 20 sessions
                .map((session) => {
                  const sessionDate = new Date(session.completedAt);
                  const isToday = sessionDate.toDateString() === new Date().toDateString();
                  
                  return (
                    <div 
                      key={session.id}
                      className="flex items-center justify-between p-3 bg-accent/20 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-lg">
                          {session.type === 'small' ? '🌱' : session.type === 'medium' ? '🌳' : '🏔️'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{session.duration} minutes</span>
                            <Badge variant={session.type === 'large' ? 'default' : 'secondary'} className="text-xs">
                              {session.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar size={12} />
                            {isToday ? 'Today' : sessionDate.toLocaleDateString()} at{' '}
                            {sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary">
                          {session.type === 'small' ? 'Quick Focus' : 
                           session.type === 'medium' ? 'Deep Work' : 'Power Session'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              
              {completedSessions.length > 20 && (
                <div className="text-center pt-2 text-sm text-muted-foreground">
                  Showing last 20 sessions. Export CSV to see all {completedSessions.length} sessions.
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">
                  {completedSessions.filter(s => s.type === 'small').length}
                </div>
                <div className="text-xs text-muted-foreground">🌱 Quick Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">
                  {completedSessions.filter(s => s.type === 'medium').length}
                </div>
                <div className="text-xs text-muted-foreground">🌳 Deep Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">
                  {completedSessions.filter(s => s.type === 'large').length}
                </div>
                <div className="text-xs text-muted-foreground">🏔️ Power Sessions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};