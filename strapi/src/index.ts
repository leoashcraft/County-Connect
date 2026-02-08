export default {
  register({ strapi }: { strapi: any }) {
    // Extend the users-permissions User content type with custom fields
    const userSchema = strapi.contentType('plugin::users-permissions.user');

    userSchema.attributes.full_name = { type: 'string' };
    userSchema.attributes.phone = { type: 'string' };
    userSchema.attributes.preferred_town = {
      type: 'relation',
      relation: 'manyToOne',
      target: 'api::town.town',
    };
    userSchema.attributes.street_address = { type: 'string' };
    userSchema.attributes.city = { type: 'string' };
    userSchema.attributes.state = { type: 'string', default: 'TX' };
    userSchema.attributes.zip_code = { type: 'string' };
    userSchema.attributes.bio = { type: 'text' };
    userSchema.attributes.is_admin = { type: 'boolean', default: false };
    userSchema.attributes.is_verified_vendor = { type: 'boolean', default: false };
    userSchema.attributes.verification_requested = { type: 'boolean', default: false };
    userSchema.attributes.profile_completed = { type: 'boolean', default: false };
    userSchema.attributes.oauth_provider = { type: 'string' };
    userSchema.attributes.oauth_id = { type: 'string' };
    userSchema.attributes.external_id = { type: 'string' };
    userSchema.attributes.picture = { type: 'string' };
  },
  bootstrap(/* { strapi } */) {},
  destroy(/* { strapi } */) {},
};
