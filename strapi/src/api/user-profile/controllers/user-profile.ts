/**
 * User profile controller
 * Allows authenticated users to update their own profile
 */

export default {
  async update(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in to update your profile');
    }

    const { id } = user;
    const data = ctx.request.body;

    // Remove sensitive fields that users shouldn't be able to update
    const sanitizedData = { ...data };
    delete sanitizedData.role;
    delete sanitizedData.provider;
    delete sanitizedData.password;
    delete sanitizedData.resetPasswordToken;
    delete sanitizedData.confirmationToken;
    delete sanitizedData.confirmed;
    delete sanitizedData.blocked;
    delete sanitizedData.is_admin;
    delete sanitizedData.email; // Don't allow email changes via this endpoint

    try {
      const updatedUser = await strapi.entityService.update(
        'plugin::users-permissions.user',
        id,
        { data: sanitizedData }
      );

      // Remove sensitive data from response
      const responseUser = { ...updatedUser };
      delete responseUser.password;
      delete responseUser.resetPasswordToken;
      delete responseUser.confirmationToken;

      ctx.body = responseUser;
    } catch (error: any) {
      // Log full error server-side, return generic message to client
      strapi.log.error('Profile update error:', error);
      ctx.badRequest('Failed to update profile');
    }
  },
};
