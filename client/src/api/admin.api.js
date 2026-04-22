import api from './axios';

export const adminApi = {
  users: (params = {}) => api.get('/admin/users', { params }).then((r) => r.data),
  approveRecruiter: (id) =>
    api.patch(`/admin/approve-recruiter/${id}`).then((r) => r.data),
  banUser: (id) => api.patch(`/admin/ban-user/${id}`).then((r) => r.data),
  removeJob: (id) => api.delete(`/admin/job/${id}`).then((r) => r.data),
  analytics: () => api.get('/admin/analytics').then((r) => r.data),
};
