import { useContext, useEffect } from 'react';
// import { useHistory } from 'react-router-dom';
import { AuthService } from '../api';
import { UserContext } from '../providers/user';

export const useUser = () => {
    const { user, setUser } = useContext(UserContext);

    const _handleLoad = () => {
      console.info('loading user');
    }

    // Load user on user changes
    useEffect(() => {
      if (user?.access) {
          _handleLoad();
      } else {
        setUser(null);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    /**
     * Login
     * @param email
     * @param password
     */
    const _handleLogin = async (email, password, website, bio, photoFile) => {
      const user = await AuthService.login(email, password);
      if (!user) {
        return 'Invalid credentials';
      }
      const { artist_bio, artist_website, photo } = user.profile;
      setUser({
        ...user,
        profile: { ...user.profile, artist_bio: artist_bio || bio, artist_website: artist_website || website, photo: photo || photoFile},
      });
      return 'Success!';
    };
  
    /**
     * Register
     * @param name
     * @param email
     * @param password
     */
    const _handleRegister = async (uid, inviteCode, username, email, password, profile) => {
      const user = await AuthService.signUp(uid, inviteCode, username, email, password, profile);
      
      setUser(user);
    };

    /**
     * Log out
     */
    const _handleLogout = async () => {
      setUser(null);
    }
  
    return { 
      user, setUser, 
      login: _handleLogin, 
      register: _handleRegister, 
      logout: _handleLogout,
    };
  };