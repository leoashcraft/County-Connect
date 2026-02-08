/**
 * Extension to users-permissions plugin
 * Adds updateMe action to allow users to update their own profile
 */

export default (plugin: any) => {
  // Add custom controller action for updating current user
  plugin.controllers.user.updateMe = async (ctx: any) => {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in to update your profile');
    }

    const { id } = user;
    const data = ctx.request.body;

    // Remove sensitive fields that users shouldn't be able to update
    delete data.role;
    delete data.provider;
    delete data.password;
    delete data.resetPasswordToken;
    delete data.confirmationToken;
    delete data.confirmed;
    delete data.blocked;
    delete data.is_admin;

    try {
      const updatedUser = await strapi.entityService.update(
        'plugin::users-permissions.user',
        id,
        { data }
      );

      // Remove sensitive data from response
      const sanitizedUser = { ...updatedUser };
      delete sanitizedUser.password;
      delete sanitizedUser.resetPasswordToken;
      delete sanitizedUser.confirmationToken;

      ctx.body = sanitizedUser;
    } catch (error: any) {
      ctx.badRequest('Failed to update profile', { error: error.message });
    }
  };

  // Add the route for updateMe
  plugin.routes['content-api'].routes.push({
    method: 'PUT',
    path: '/users/me',
    handler: 'user.updateMe',
    config: {
      prefix: '',
      policies: [],
    },
  });

  return plugin;
};
