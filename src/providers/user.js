import { useState, createContext, useEffect } from 'react';
import TokenService from '../api/token';

export const UserContext = createContext({ user: null, setUser: () => null });

const Provider = ({ children }) => {
  const storedUser = localStorage.getItem('artis_user', null);
  const [user, setUser] = useState(JSON.parse(storedUser));

  useEffect(() => {
    if (!user?.access) localStorage.setItem('artis_user', null);
    else if (user?.access) {
      TokenService.setUser(user);
      TokenService.updateLocalTokens(user.access, user.refresh);
    };
  }, [user?.access, user]);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export default Provider;