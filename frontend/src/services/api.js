import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('cipher_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Assignment APIs
export const getAssignments = (params = {}) =>
    api.get('/assignments', { params });

export const getAssignment = (id) =>
    api.get(`/assignments/${id}`);

// Query Execution
export const executeQuery = (assignmentId, sql) =>
    api.post('/query/execute', { assignmentId, sql });

// Hint
export const getHint = ({ question, userSql, sampleTables }) =>
    api.post('/hint', { question, userSql, sampleTables });

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Progress
export const getProgress = (assignmentId) =>
    api.get(`/progress/${assignmentId}`);

export const saveProgress = (data) =>
    api.post('/progress/save', data);

export const getAllProgress = () =>
    api.get('/progress');

export default api;
