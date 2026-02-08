import { factories } from '@strapi/strapi';

const ENTITY_TYPE_MAP: Record<string, string> = {
  restaurant: 'api::restaurant.restaurant',
  church: 'api::church.church',
  school: 'api::school.school',
  event: 'api::event.event',
  'local-business': 'api::local-business.local-business',
};

export default factories.createCoreController('api::claim-request.claim-request', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to submit a claim request');
    }

    const { entityType, entityId, yourRole, verificationInfo, businessPhone, businessEmail, additionalNotes } = ctx.request.body?.data || {};

    if (!entityType || !entityId || !yourRole || !verificationInfo) {
      return ctx.badRequest('Missing required fields: entityType, entityId, yourRole, verificationInfo');
    }

    const uid = ENTITY_TYPE_MAP[entityType];
    if (!uid) {
      return ctx.badRequest('Invalid entityType');
    }

    // Check entity exists
    const entity = await (strapi.documents(uid as any) as any).findOne({
      documentId: entityId,
      populate: entityType === 'event' ? ['organizer'] : ['owner'],
    });

    if (!entity) {
      return ctx.notFound('Entity not found');
    }

    // Check entity is not already claimed
    const ownerField = entityType === 'event' ? 'organizer' : 'owner';
    if (entity[ownerField]) {
      return ctx.badRequest('This listing is already claimed');
    }

    // Check no pending claim exists for this entity
    const existingClaim = await strapi.documents('api::claim-request.claim-request').findMany({
      filters: {
        entityType: { $eq: entityType },
        entityId: { $eq: entityId },
        status: { $eq: 'pending' },
      } as any,
    });

    if (existingClaim.length > 0) {
      return ctx.badRequest('A pending claim already exists for this listing');
    }

    // Create the claim request
    const claimRequest = await strapi.documents('api::claim-request.claim-request').create({
      data: {
        entityType,
        entityId,
        claimant: user.id,
        yourRole,
        verificationInfo,
        businessPhone,
        businessEmail,
        additionalNotes,
        status: 'pending',
      } as any,
    });

    return { data: claimRequest };
  },

  async find(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    // If admin, return all claims; otherwise just user's own
    const filters = user.is_admin
      ? ctx.query.filters || {}
      : { claimant: { id: { $eq: user.id } } };

    const claims = await strapi.documents('api::claim-request.claim-request').findMany({
      filters: filters as any,
      populate: ['claimant', 'reviewedBy'],
      sort: { createdAt: 'desc' } as any,
    });

    return { data: claims };
  },

  async findOne(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    const { id } = ctx.params;

    const claim = await strapi.documents('api::claim-request.claim-request').findOne({
      documentId: id,
      populate: ['claimant', 'reviewedBy'],
    });

    if (!claim) {
      return ctx.notFound('Claim request not found');
    }

    // Only allow admin or the claimant to view
    if (!user.is_admin && (claim as any).claimant?.id !== user.id) {
      return ctx.forbidden('You do not have permission to view this claim');
    }

    return { data: claim };
  },

  async approve(ctx) {
    const user = ctx.state.user;
    if (!user?.is_admin) {
      return ctx.forbidden('Only administrators can approve claims');
    }

    const { id } = ctx.params;

    const claim = await strapi.documents('api::claim-request.claim-request').findOne({
      documentId: id,
      populate: ['claimant'],
    });

    if (!claim) {
      return ctx.notFound('Claim request not found');
    }

    if ((claim as any).status !== 'pending') {
      return ctx.badRequest('This claim has already been processed');
    }

    const uid = ENTITY_TYPE_MAP[(claim as any).entityType];
    if (!uid) {
      return ctx.badRequest('Invalid entityType');
    }

    // Update the entity to set owner/organizer
    const ownerField = (claim as any).entityType === 'event' ? 'organizer' : 'owner';
    await (strapi.documents(uid as any) as any).update({
      documentId: (claim as any).entityId,
      data: {
        [ownerField]: (claim as any).claimant.id,
      },
    });

    // Update claim status
    const updatedClaim = await strapi.documents('api::claim-request.claim-request').update({
      documentId: id,
      data: {
        status: 'approved',
        reviewedBy: user.id,
        reviewedAt: new Date().toISOString(),
      } as any,
    });

    return { data: updatedClaim };
  },

  async reject(ctx) {
    const user = ctx.state.user;
    if (!user?.is_admin) {
      return ctx.forbidden('Only administrators can reject claims');
    }

    const { id } = ctx.params;
    const { rejectionReason } = ctx.request.body?.data || {};

    const claim = await strapi.documents('api::claim-request.claim-request').findOne({
      documentId: id,
    });

    if (!claim) {
      return ctx.notFound('Claim request not found');
    }

    if ((claim as any).status !== 'pending') {
      return ctx.badRequest('This claim has already been processed');
    }

    const updatedClaim = await strapi.documents('api::claim-request.claim-request').update({
      documentId: id,
      data: {
        status: 'rejected',
        rejectionReason: rejectionReason || 'Claim verification failed',
        reviewedBy: user.id,
        reviewedAt: new Date().toISOString(),
      } as any,
    });

    return { data: updatedClaim };
  },
}));
