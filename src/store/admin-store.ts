import { AdminStore } from "../types/Store";
import { create } from "zustand";

const adminStore = create<AdminStore>((set) => {
  const storedAdmin = localStorage.getItem("admin");
  const storedToken = localStorage.getItem("token");

  const initialState = {
    token: storedToken || "",
    admin: storedAdmin ? JSON.parse(storedAdmin) : {},
    isAuthenticated: !!storedToken,
  };

  return {
    ...initialState,
    login: (token, admin) => {
      set(() => {
        localStorage.setItem("token", token);
        localStorage.setItem("admin", JSON.stringify(admin));
        return {
          token,
          admin,
          isAuthenticated: true,
        };
      });
    },
    logout: () => {
      set(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        return {
          token: "",
          admin: {
            email: "",
            id: "",
            name: "",
          },
          isAuthenticated: false,
        };
      });
    },
  };
});

export default adminStore;
