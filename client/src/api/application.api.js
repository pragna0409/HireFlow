import api from './axios';

export const applicationApi = {
  apply: (data) => api.post('/applications', data).then((r) => r.data),
  mine: (params = {}) => api.get('/applications/my', { params }).then((r) => r.data),
  byJob: (jobId, params = {}) =>
    api.get(`/applications/job/${jobId}`, { params }).then((r) => r.data),
  updateStatus: (id, status, note) =>
    api.patch(`/applications/${id}/status`, { status, note }).then((r) => r.data),
  remove: (id) => api.delete(`/applications/${id}`).then((r) => r.data),
};
