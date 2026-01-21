import React, { useEffect, useState } from "react";
import AuthContext from "./authContext";
import { http, tokenStore } from "../api/http";

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
        const original = error.config;
        if (error?.response?.status === 401 && !original?._retry) {
          original._retry = true;
          const refresh = tokenStore.getRefresh();
          if (!refresh) {
            await logout();
            return Promise.reject(error);
          }
          try {
            const { data } = await http.post("/auth/refresh/", { refresh });
            setAccessToken(data.access);
            original.headers.Authorization = `Bearer ${data.access}`;
            return http(original);
          } catch (e) {
            await logout();
            return Promise.reject(e);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => http.interceptors.response.eject(resId);
  }, []);

  async function fetchMe() {
    const { data } = await http.get("/me/");
    setUser(data);
    return data;
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
      await fetchMe();
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
    await fetchMe();
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
