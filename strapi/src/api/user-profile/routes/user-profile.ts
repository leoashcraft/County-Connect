/**
 * User profile routes
 */

export default {
  routes: [
    {
      method: 'PUT',
      path: '/user-profile/me',
      handler: 'user-profile.update',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: ['find'],
        },
      },
    },
  ],
};
