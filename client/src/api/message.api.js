import api from './axios';

export const messageApi = {
  threads: () => api.get('/messages/threads').then((r) => r.data),
  conversation: (userId) => api.get(`/messages/${userId}`).then((r) => r.data),
  send: (toUserId, body) => api.post('/messages', { toUserId, body }).then((r) => r.data),
  unreadCount: () => api.get('/messages/unread/count').then((r) => r.data),
};
