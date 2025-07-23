import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  currentUser: string | null;
  login: (username: string) => void;
  logout: () => void;
  getUserStorageKey: (key: string) => string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('growmind-current-user');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const login = (username: string) => {
    setCurrentUser(username);
    localStorage.setItem('growmind-current-user', username);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('growmind-current-user');
  };

  const getUserStorageKey = (key: string) => {
    return currentUser ? `${key}-${currentUser}` : key;
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout, getUserStorageKey }}>
      {children}
    </UserContext.Provider>
  );
};
