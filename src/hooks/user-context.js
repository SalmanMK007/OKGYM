import { useState, createContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';

export const UserContext = createContext({ user: null, setUser: () => null });

const Provider = ({ children }) => {
  const [cookies] = useCookies([process.env.USER_COOKIE]);
  const storedUser = cookies?.[process.env.USER_COOKIE]?.user || null;

  const [user, setUser] = useState(storedUser);

  useEffect(() => {
    if (!user?.id) localStorage.setItem('token', null);
    else if (user?.token) localStorage.setItem('token', user?.token);
  }, [user?.id, user?.token]);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export default Provider;