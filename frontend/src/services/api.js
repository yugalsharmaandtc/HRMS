import axios from 'axios'

// Set your backend URL - defaults to localhost for local development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Employees
export const employeeAPI = {
  getAll:   ()         => api.get('/api/employees/'),
  getOne:   (id)       => api.get(`/api/employees/${id}`),
  getStats: ()         => api.get('/api/employees/stats'),
  create:   (data)     => api.post('/api/employees/', data),
  update:   (id, data) => api.put(`/api/employees/${id}`, data),
  delete:   (id)       => api.delete(`/api/employees/${id}`),
}

// Attendance
export const attendanceAPI = {
  getAll:     (params) => api.get('/api/attendance/', { params }),
  getSummary: (empId)  => api.get(`/api/attendance/summary/${empId}`),
  mark:       (data)   => api.post('/api/attendance/', data),
  update:     (id, data) => api.put(`/api/attendance/${id}`, data),
  delete:     (id)     => api.delete(`/api/attendance/${id}`),
}

export default api