import { useLocation, useNavigate, useNavigation } from 'react-router-dom';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { UserSession } from '../types/UserSessionType';
import { logout } from '../apis/logout';
import { getSession } from '../apis/getSession';
import { useLocalStorage } from './LocalStorageProvider';

interface AuthContextType {
  user: UserSession | null;
}

interface AuthUpdateType {
  onLogout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
const AuthUpdateContext = createContext<AuthUpdateType>({} as AuthUpdateType);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { removeItem } = useLocalStorage();

  const [user, setUser] = useState<UserSession | null>(null);

  const onLogout = async () => {
    await logout();
    // setUser(null);
    removeItem('userInfo');
    navigate('/');
  };

  useEffect(() => {
    getSession().then((data) => {
      if (data) {
        setUser(data);
      } else {
        setUser(null);
      }
    });
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ user }}>
      <AuthUpdateContext.Provider value={{ onLogout }}>
        {children}
      </AuthUpdateContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return context;
};

export const useAuthUpdateContext = (): AuthUpdateType => {
  const context = useContext(AuthUpdateContext);
  if (!context) {
    throw new Error('useAuthUpdateContext must be used within a AuthProvider');
  }
  return context;
};
