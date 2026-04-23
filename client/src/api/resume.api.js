import api from './axios';

export const resumeApi = {
  list: () => api.get('/users/me/resumes').then((r) => r.data),
  upload: (file, name) => {
    const fd = new FormData();
    fd.append('resume', file);
    if (name) fd.append('name', name);
    return api.post('/users/me/resumes', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
  },
  remove: (resumeId) => api.delete(`/users/me/resumes/${resumeId}`).then((r) => r.data),
};
