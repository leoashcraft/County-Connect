import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::notification.notification', ({ strapi }) => ({
  // Mark notification as read
  async markRead(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    const notification = await strapi.documents('api::notification.notification').findOne({
      documentId: id,
      populate: ['user'],
    });

    if (!notification || notification.user?.id !== user.id) {
      return ctx.notFound('Notification not found');
    }

    const updated = await strapi.documents('api::notification.notification').update({
      documentId: id,
      data: { isRead: true } as any,
    });

    return { data: updated };
  },

  // Mark all as read
  async markAllRead(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    const notifications = await strapi.documents('api::notification.notification').findMany({
      filters: { user: { id: user.id }, isRead: false },
    });

    for (const notif of notifications) {
      await strapi.documents('api::notification.notification').update({
        documentId: notif.documentId,
        data: { isRead: true } as any,
      });
    }

    return { success: true, count: notifications.length };
  },

  // Get unread count
  async unreadCount(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    const count = await strapi.documents('api::notification.notification').count({
      filters: { user: { id: user.id }, isRead: false },
    });

    return { count };
  },
}));
