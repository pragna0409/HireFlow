import api from './axios';

export const jobApi = {
  list: (params = {}) => api.get('/jobs', { params }).then((r) => r.data),
  get: (id) => api.get(`/jobs/${id}`).then((r) => r.data),
  create: (data) => api.post('/jobs', data).then((r) => r.data),
  update: (id, data) => api.put(`/jobs/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/jobs/${id}`).then((r) => r.data),
  updateStatus: (id, status) =>
    api.patch(`/jobs/${id}/status`, { status }).then((r) => r.data),
  toggleSave: (id) => api.post(`/jobs/${id}/save`).then((r) => r.data),
  myPosted: (params = {}) =>
    api.get('/jobs/my/posted', { params }).then((r) => r.data),
  mySaved: (params = {}) =>
    api.get('/jobs/my/saved', { params }).then((r) => r.data),
};
