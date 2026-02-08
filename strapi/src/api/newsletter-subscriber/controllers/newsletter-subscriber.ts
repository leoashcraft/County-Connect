import { factories } from '@strapi/strapi';
import crypto from 'crypto';

export default factories.createCoreController('api::newsletter-subscriber.newsletter-subscriber', ({ strapi }) => ({
  async create(ctx) {
    const { email, name, town, interests, frequency } = ctx.request.body.data || ctx.request.body;

    // Check if already subscribed
    const existing = await strapi.documents('api::newsletter-subscriber.newsletter-subscriber').findMany({
      filters: { email: { $eqi: email } },
    });

    if (existing.length > 0) {
      // Reactivate if inactive
      if (!existing[0].isActive) {
        await strapi.documents('api::newsletter-subscriber.newsletter-subscriber').update({
          documentId: existing[0].documentId,
          data: { isActive: true } as any,
        });
        return { data: existing[0], message: 'Subscription reactivated' };
      }
      return ctx.badRequest('Email already subscribed');
    }

    const unsubscribeToken = crypto.randomBytes(32).toString('hex');

    const subscriber = await strapi.documents('api::newsletter-subscriber.newsletter-subscriber').create({
      data: {
        email,
        name,
        town,
        interests,
        frequency: frequency || 'weekly',
        isActive: true,
        unsubscribeToken,
      },
    });

    return { data: subscriber };
  },

  async unsubscribe(ctx) {
    const { token } = ctx.params;

    const subscribers = await strapi.documents('api::newsletter-subscriber.newsletter-subscriber').findMany({
      filters: { unsubscribeToken: token },
    });

    if (subscribers.length === 0) {
      return ctx.notFound('Invalid unsubscribe link');
    }

    await strapi.documents('api::newsletter-subscriber.newsletter-subscriber').update({
      documentId: subscribers[0].documentId,
      data: { isActive: false } as any,
    });

    return { success: true, message: 'Successfully unsubscribed' };
  },
}));
