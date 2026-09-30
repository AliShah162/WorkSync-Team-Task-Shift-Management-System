import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000",
});
//Instead of calling axios.get('http://localhost:4000/auth/login') everywhere, you create a preconfigured copy of axios called api.
// baseURL: 'http://localhost:4000'  every request you make with api automatically prepends this URL.

// Add token automatically if we have one
api.interceptors.request.use((config) => {
  //"Before sending any request, look in localStorage for a token. If it exists, attach it to the request as an Authorization: Bearer <token> header. Then let the request continue."
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Backend wraps responses as { success, data } — unwrap to just data
api.interceptors.response.use((res) => res.data.data);
