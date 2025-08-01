import axios from 'axios';
import dotenv from 'dotenv';

const apiUrl = import.meta.env.VITE_API_BASE_URL; // fallback to localhost

const api = axios.create({
    baseURL: apiUrl,
    headers: {
    'Content-Type': 'application/json'
  }
});

console.log(apiUrl)

export default api; 