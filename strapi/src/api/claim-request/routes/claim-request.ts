export default {
  routes: [
    {
      method: 'POST',
      path: '/claim-requests',
      handler: 'claim-request.create',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/claim-requests',
      handler: 'claim-request.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/claim-requests/:id',
      handler: 'claim-request.findOne',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/claim-requests/:id/approve',
      handler: 'claim-request.approve',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/claim-requests/:id/reject',
      handler: 'claim-request.reject',
      config: {
        policies: [],
      },
    },
  ],
};
