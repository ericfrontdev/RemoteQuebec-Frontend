import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Jobs API
export const jobsApi = {
  getAll: () => api.get('/jobs'),
  getById: (id: string) => api.get(`/jobs/${id}`),
  create: (data: any) => api.post('/jobs', data),
  update: (id: string, data: any) => api.put(`/jobs/${id}`, data),
  delete: (id: string) => api.delete(`/jobs/${id}`),
}

// Applications API
export const applicationsApi = {
  submit: (data: FormData) =>
    api.post('/applications', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getByJobId: (jobId: string) => api.get(`/applications/job/${jobId}`),
}
