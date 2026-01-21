import axios from "axios"
const baseURL = import.meta.env.VITE_API_BASE;

export const http = axios.create({
    baseURL,
    headers:{"Content-Type": "application/json"}
});

export const tokenStore = {
    getRefresh:()=> localStorage.getItem("refresh_token"), 
    setRefresh:(token)=> localStorage.setItem("refresh_token", token),
    clearRefresh:()=> localStorage.removeItem("refresh_token"),

}
