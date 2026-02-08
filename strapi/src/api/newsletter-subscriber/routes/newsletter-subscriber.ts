export default {
  routes: [
    {
      method: 'POST',
      path: '/newsletter-subscribers',
      handler: 'newsletter-subscriber.create',
      config: { policies: [] },
    },
    {
      method: 'GET',
      path: '/newsletter-subscribers/unsubscribe/:token',
      handler: 'newsletter-subscriber.unsubscribe',
      config: { policies: [] },
    },
  ],
};
