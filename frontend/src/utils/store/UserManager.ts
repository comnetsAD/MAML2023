class TokenManager {
    static setToken(token: string, email: string) {
      sessionStorage.setItem("user_token", token);
      sessionStorage.setItem("user_email", email);
    }
  
    static getToken(): string {
      return sessionStorage.getItem("user_token") || "";
    }

    static getEmail(): string {
      return sessionStorage.getItem("user_email") || "";
    }
  
    static logout() {
      sessionStorage.removeItem("user_token");
      sessionStorage.removeItem("user_email");
    }

    static isLoggedIn(): boolean {
      return !!TokenManager.getToken();
    }
  }
  
  export default TokenManager;
  