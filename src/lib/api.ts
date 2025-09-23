import axios from 'axios';

const API_URL = "https://cajual-app.azurewebsites.net";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
});

export default api;