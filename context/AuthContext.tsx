"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [malUser, setMalUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const token = Cookies.get("mal_access_token");
    if (!token) {
      setMalUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://api.myanimelist.net/v2/users/@me?fields=main_picture",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();

      if (!data.error) {
        setMalUser(data);
      } else {
        // Jika token tidak valid/expired, bersihkan cookie
        Cookies.remove("mal_access_token");
        setMalUser(null);
      }
    } catch (err) {
      console.error("Auth Context Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const logout = () => {
    Cookies.remove("mal_access_token");
    setMalUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        malUser,
        loading,
        refreshProfile: fetchProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
