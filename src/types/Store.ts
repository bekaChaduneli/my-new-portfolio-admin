export interface AdminStore {
  token: string;
  admin: {
    email: string;
    id: string;
    name: string;
  };
  isAuthenticated: boolean;
  login: (token: string, admin: AdminStore["admin"]) => void;
  logout: () => void;
}
