export default ({ env }) => ({
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
      providers: {
        google: {
          enabled: true,
          icon: 'google',
          key: env('GOOGLE_CLIENT_ID', ''),
          secret: env('GOOGLE_CLIENT_SECRET', ''),
          callback: env('GOOGLE_CALLBACK_URL', '/api/connect/google/callback'),
          scope: ['openid', 'email', 'profile'],
        },
      },
    },
  },
});
