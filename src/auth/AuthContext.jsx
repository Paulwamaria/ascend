/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { http, tokenStore } from "../api/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  // Attach access token on requests
  useEffect(() => {
    const reqId = http.interceptors.request.use((config) => {
      if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    });
    return () => http.interceptors.request.eject(reqId);
  }, [accessToken]);

  // Refresh-on-401 once
  useEffect(() => {
    const resId = http.interceptors.response.use(
      (res) => res,
      async (error) => {
        const original = error.config || {};
        if (error?.response?.status === 401 && !original._retry) {
          original._retry = true;

          const refresh = tokenStore.getRefresh();
          if (!refresh) {
            await logout();
            return Promise.reject(error);
          }

          try {
            const { data } = await http.post("/auth/refresh/", { refresh });
            setAccessToken(data.access);
            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${data.access}`;
            return http(original);
          } catch {
            await logout();
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => http.interceptors.response.eject(resId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchMe(tokenOverride) {
    try {
      const { data } = await http.get("/me/", tokenOverride);
      setUser(data);
      return data;
    } catch (e) {
      setUser(null);
      return null;
    }
  }


  async function boot() {
    const refresh = tokenStore.getRefresh();
    if (!refresh) {
      setBooting(false);
      return;
    }
    try {
      const { data } = await http.post("/auth/refresh/", { refresh });
      setAccessToken(data.access);
      const me = await http.get("/me/", {
        headers: { Authorization: `Bearer ${data.access}` },
      });
      setUser(me.data);
    } catch {
      tokenStore.clearRefresh();
      setAccessToken(null);
      setUser(null);
    } finally {
      setBooting(false);
    }
  }

  useEffect(() => {
    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(username, password) {
    const { data } = await http.post("/auth/login/", { username, password });
    setAccessToken(data.access);
    tokenStore.setRefresh(data.refresh);
    // ✅ fetch /me with the token immediately (no race)
    const me = await http.get("/me/", {
      headers: { Authorization: `Bearer ${data.access}` },
    });
    setUser(me.data);

    return me.data;
  }

  async function register(username, email, password) {
    await http.post("/auth/register/", { username, email, password });
    await login(username, password);
  }

  async function logout() {
    tokenStore.clearRefresh();
    setAccessToken(null);
    setUser(null);
  }

  const value = {
    booting,
    isAuthed: !!accessToken,
    user,
    login,
    register,
    logout,
    refreshMe: fetchMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}
