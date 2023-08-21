class TokenService {
    getLocalRefreshToken() {
      const user = JSON.parse(localStorage.getItem("artis_user"));
      return user?.refresh;
    }
  
    getLocalAccessToken() {
      const user = JSON.parse(localStorage.getItem("artis_user"));
      return user?.access;
    }
  
    updateLocalTokens(token, refresh) {
      let user = JSON.parse(localStorage.getItem("artis_user"));
      user.access = token;
      user.refresh = refresh;
      localStorage.setItem("artis_user", JSON.stringify(user));
    }

    getUserName() {
      let user = JSON.parse(localStorage.getItem("artis_user"));
      return user?.username || null;
    }
  
    getUser() {
      return JSON.parse(localStorage.getItem("artis_user"));
    }
  
    setUser(user) {
      localStorage.setItem("artis_user", JSON.stringify(user));
    }
  
    removeUser() {
      localStorage.removeItem("artis_user");
    }
  }
  
  export default new TokenService();