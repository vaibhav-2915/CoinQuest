import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('coinquest_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Auth ──────────────────────────────────────────────────────────────────────
export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)
export const getMe = () => api.get('/auth/me')

// ── Wallet ────────────────────────────────────────────────────────────────────
export const getWallet = () => api.get('/wallet')
export const deposit = (data) => api.post('/wallet/deposit', data)
export const withdraw = (data) => api.post('/wallet/withdraw', data)
export const applyInterest = () => api.post('/wallet/interest')

// ── Transactions ──────────────────────────────────────────────────────────────
export const getTransactions = () => api.get('/transactions')

// ── Missions ──────────────────────────────────────────────────────────────────
export const getMissions = () => api.get('/missions')
export const completeMission = (id) => api.post(`/missions/${id}/complete`)

// ── Learning ──────────────────────────────────────────────────────────────────
export const getModules = () => api.get('/learning/modules')
export const getModule = (id) => api.get(`/learning/modules/${id}`)
export const submitQuiz = (id, data) => api.post(`/learning/modules/${id}/quiz`, data)

// ── Parent ────────────────────────────────────────────────────────────────────
export const getChildren = () => api.get('/parent/children')
export const getChildAnalytics = (id) => api.get(`/parent/children/${id}/analytics`)
export const assignMission = (data) => api.post('/parent/missions', data)

// ── Admin ─────────────────────────────────────────────────────────────────────
export const getAdminStats = () => api.get('/admin/stats')
export const getAllUsers = () => api.get('/admin/users')
export const createModule = (data) => api.post('/admin/modules', data)
export const deleteAdminModule = (id) => api.delete(`/admin/modules/${id}`)

export default api
