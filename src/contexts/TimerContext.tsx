import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useUser } from './UserContext';

interface TimerSession {
  id: string;
  duration: number; // minutes
  completedAt: Date;
  type: 'small' | 'medium' | 'large'; // based on duration
}

interface TimerContextType {
  // Timer state
  duration: number;
  timeLeft: number;
  isRunning: boolean;
  isCompleted: boolean;
  
  // Timer controls
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setDuration: (minutes: number) => void;
  
  // Session data
  sessions: number;
  streak: number;
  totalMinutes: number;
  completedSessions: TimerSession[];
  
  // Helper functions
  formatTime: (seconds: number) => string;
  getProgress: () => number;
  getTreeGrowth: () => number;
  downloadSessionsCSV: () => void;
  exportSessionHistory: () => string;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

interface TimerProviderProps {
  children: ReactNode;
}

export const TimerProvider = ({ children }: TimerProviderProps) => {
  const { getUserStorageKey } = useUser();
  
  const [duration, setDurationState] = useState(25); // minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Load from localStorage
  const [sessions, setSessions] = useState(() => {
    const key = getUserStorageKey('growmind-sessions');
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : 0;
  });
  
  const [streak, setStreak] = useState(() => {
    const key = getUserStorageKey('growmind-streak');
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : 0;
  });
  
  const [totalMinutes, setTotalMinutes] = useState(() => {
    const key = getUserStorageKey('growmind-total-minutes');
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : 0;
  });
  
  const [completedSessions, setCompletedSessions] = useState<TimerSession[]>(() => {
    const key = getUserStorageKey('growmind-completed-sessions');
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved).map((s: any) => ({
      ...s,
      completedAt: new Date(s.completedAt)
    })) : [];
  });

  const intervalRef = useRef<NodeJS.Timeout>();

  // Save to localStorage whenever values change
  useEffect(() => {
    const key = getUserStorageKey('growmind-sessions');
    localStorage.setItem(key, JSON.stringify(sessions));
  }, [sessions, getUserStorageKey]);

  useEffect(() => {
    const key = getUserStorageKey('growmind-streak');
    localStorage.setItem(key, JSON.stringify(streak));
  }, [streak, getUserStorageKey]);

  useEffect(() => {
    const key = getUserStorageKey('growmind-total-minutes');
    localStorage.setItem(key, JSON.stringify(totalMinutes));
  }, [totalMinutes, getUserStorageKey]);

  useEffect(() => {
    const key = getUserStorageKey('growmind-completed-sessions');
    localStorage.setItem(key, JSON.stringify(completedSessions));
  }, [completedSessions, getUserStorageKey]);

  // Timer effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            
            // Create new session
            const getTreeType = (minutes: number): 'small' | 'medium' | 'large' => {
              if (minutes < 15) return 'small';
              if (minutes <= 45) return 'medium';
              return 'large';
            };
            
            const newSession: TimerSession = {
              id: Date.now().toString(),
              duration,
              completedAt: new Date(),
              type: getTreeType(duration)
            };
            
            // Update states
            setSessions(prev => prev + 1);
            setStreak(prev => prev + 1);
            setTotalMinutes(prev => prev + duration);
            setCompletedSessions(prev => [...prev, newSession]);
            
            // Save to CSV (download will be triggered)
            // Note: CSV will be generated on demand, not automatically downloaded
            
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
  }, [isRunning, timeLeft, duration]);

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

  const setDuration = (minutes: number) => {
    if (!isRunning) {
      setDurationState(minutes);
      setTimeLeft(minutes * 60);
      setIsCompleted(false);
    }
  };

  const getProgress = () => {
    return ((duration * 60 - timeLeft) / (duration * 60)) * 100;
  };

  const getTreeGrowth = () => {
    return Math.min(100, getProgress());
  };

  const downloadSessionsCSV = () => {
    const csvContent = exportSessionHistory();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `focus-sessions-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportSessionHistory = () => {
    const headers = ['Date', 'Time', 'Duration (minutes)', 'Tree Type', 'Session ID'];
    const rows = completedSessions.map(session => [
      new Date(session.completedAt).toLocaleDateString(),
      new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      session.duration.toString(),
      session.type,
      session.id
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  };

  return (
    <TimerContext.Provider
      value={{
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
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
