export default {
  routes: [
    {
      method: 'GET',
      path: '/notifications',
      handler: 'notification.find',
      config: { policies: [] },
    },
    {
      method: 'GET',
      path: '/notifications/unread-count',
      handler: 'notification.unreadCount',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/notifications/:id/read',
      handler: 'notification.markRead',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/notifications/read-all',
      handler: 'notification.markAllRead',
      config: { policies: [] },
    },
    {
      method: 'DELETE',
      path: '/notifications/:id',
      handler: 'notification.delete',
      config: { policies: [] },
    },
  ],
};
