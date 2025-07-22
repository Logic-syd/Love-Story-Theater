import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', // 你的后端地址
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;