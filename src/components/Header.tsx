import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useTimer } from '@/contexts/TimerContext';
import { LogOut, User, TreePine, Timer, Play, Pause } from 'lucide-react';

export const Header = () => {
  const { currentUser, logout } = useUser();
  const { isRunning, timeLeft, formatTime, pauseTimer, startTimer } = useTimer();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur border-b border-green-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TreePine className="text-green-600" size={24} />
          <h1 className="text-xl font-bold text-green-800">Mind Garden</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Timer indicator */}
          {(isRunning || timeLeft < 25 * 60) && (
            <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
              <Timer size={16} className={isRunning ? 'text-green-600 animate-pulse' : 'text-green-400'} />
              <span className="font-mono text-sm font-medium text-green-700">
                {formatTime(timeLeft)}
              </span>
              <Button
                onClick={isRunning ? pauseTimer : startTimer}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
              >
                {isRunning ? (
                  <Pause size={12} className="text-green-600" />
                ) : (
                  <Play size={12} className="text-green-600" />
                )}
              </Button>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-green-700">
            <User size={16} />
            <span className="font-medium">Welcome, {currentUser}</span>
          </div>
          
          <Button 
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
