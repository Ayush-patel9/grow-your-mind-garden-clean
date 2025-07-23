import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Timer, Play, Pause, Square, TreePine, Zap, Award } from 'lucide-react';

interface FocusTimerProps {
  onSessionComplete: () => void;
}

export const FocusTimer = ({ onSessionComplete }: FocusTimerProps) => {
  const [duration, setDuration] = useState(25); // minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessions, setSessions] = useLocalStorage('growmind-sessions', 0);
  const [streak, setStreak] = useLocalStorage('growmind-streak', 0);
  const [totalMinutes, setTotalMinutes] = useLocalStorage('growmind-total-minutes', 0);
  const intervalRef = useRef<NodeJS.Timeout>();

  const presetDurations = [
    { label: '25 min', value: 25, icon: '🌱' },
    { label: '50 min', value: 50, icon: '🌳' },
    { label: '90 min', value: 90, icon: '🏔️' }
  ];

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            setSessions(prev => prev + 1);
            setStreak(prev => prev + 1);
            setTotalMinutes(prev => prev + duration);
            onSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, onSessionComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsRunning(true);
    setIsCompleted(false);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
    setIsCompleted(false);
  };

  const selectDuration = (newDuration: number) => {
    if (!isRunning) {
      setDuration(newDuration);
      setTimeLeft(newDuration * 60);
      setIsCompleted(false);
    }
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;
  const treeGrowth = Math.min(100, progress);

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
            <div className="flex gap-2 justify-center">
              {presetDurations.map(preset => (
                <Button
                  key={preset.value}
                  variant={duration === preset.value ? "default" : "outline"}
                  onClick={() => selectDuration(preset.value)}
                  className="flex items-center gap-2"
                >
                  <span>{preset.icon}</span>
                  {preset.label}
                </Button>
              ))}
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
    </div>
  );
};