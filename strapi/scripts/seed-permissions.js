/**
 * Seed script to configure Strapi user permissions
 *
 * Run: cd strapi && node scripts/seed-permissions.js
 *
 * Requires Strapi to be running and admin credentials in .env:
 *   ADMIN_EMAIL=admin@navarrocounty.com
 *   ADMIN_PASSWORD=Admin123!
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@navarrocounty.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';

// Public role permissions (role ID 2)
const PUBLIC_PERMISSIONS = {
  // Forms that anyone can submit
  'api::featured-spot-inquiry.featured-spot-inquiry': ['create'],
  'api::closure-report.closure-report': ['create'],

  // Read-only access to directory content
  'api::restaurant.restaurant': ['find', 'findOne'],
  'api::church.church': ['find', 'findOne'],
  'api::school.school': ['find', 'findOne'],
  'api::event.event': ['find', 'findOne'],
  'api::local-business.local-business': ['find', 'findOne'],
  'api::job.job': ['find', 'findOne'],
  'api::real-estate.real-estate': ['find', 'findOne'],
  'api::service-page.service-page': ['find', 'findOne'],
  'api::service-page-category.service-page-category': ['find', 'findOne'],
  'api::marketplace-listing.marketplace-listing': ['find', 'findOne'],
  'api::marketplace-category.marketplace-category': ['find', 'findOne'],
  'api::service-listing.service-listing': ['find', 'findOne'],
  'api::service-listing-category.service-listing-category': ['find', 'findOne'],
  'api::town.town': ['find', 'findOne'],
  'api::review.review': ['find', 'findOne'],

  // Deals and promotions
  'api::deal.deal': ['find', 'findOne'],

  // Emergency alerts
  'api::emergency-alert.emergency-alert': ['find', 'findOne'],

  // Activity logs (public read-only for transparency)
  'api::activity-log.activity-log': ['find'],
};

// Authenticated role permissions (role ID 1)
const AUTHENTICATED_PERMISSIONS = {
  // User can update their own profile
  'plugin::users-permissions.user': ['me'],
  'api::user-profile.user-profile': ['update'],

  // Dashboard preferences
  'api::dashboard-preference.dashboard-preference': ['find', 'findOne', 'create', 'update'],

  // Saved items (wishlist) and collections
  'api::wishlist-item.wishlist-item': ['find', 'findOne', 'create', 'update', 'delete'],
  'api::wishlist-collection.wishlist-collection': ['find', 'findOne', 'create', 'update', 'delete'],

  // Claim requests
  'api::claim-request.claim-request': ['find', 'findOne', 'create'],

  // Shopping cart
  'api::cart-item.cart-item': ['find', 'findOne', 'create', 'update', 'delete'],

  // Support tickets
  'api::support-ticket.support-ticket': ['find', 'findOne', 'create'],
  'api::support-message.support-message': ['find', 'findOne', 'create'],

  // User messaging
  'api::message.message': ['find', 'findOne', 'create', 'update'],

  // Orders
  'api::order.order': ['find', 'findOne', 'create'],

  // User can create listings
  'api::marketplace-listing.marketplace-listing': ['find', 'findOne', 'create', 'update'],
  'api::service-listing.service-listing': ['find', 'findOne', 'create', 'update'],

  // Reviews
  'api::review.review': ['find', 'findOne', 'create'],

  // Notifications (user can view and delete their own)
  'api::notification.notification': ['find', 'findOne', 'delete'],

  // Event RSVPs
  'api::event-rsvp.event-rsvp': ['find', 'findOne', 'create', 'update', 'delete'],

  // Content reporting
  'api::content-report.content-report': ['create'],

  // Newsletter subscriptions
  'api::newsletter-subscriber.newsletter-subscriber': ['create'],

  // Saved searches
  'api::saved-search.saved-search': ['find', 'findOne', 'create', 'update', 'delete'],

  // Activity logs (authenticated users can view and create)
  'api::activity-log.activity-log': ['find', 'create'],

  // All public permissions too
  ...PUBLIC_PERMISSIONS,
};

async function getAdminToken() {
  console.log('🔐 Logging in as admin...');

  const response = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Admin login failed: ${error}`);
  }

  const data = await response.json();
  return data.data.token;
}

async function getRole(token, roleId) {
  const response = await fetch(`${STRAPI_URL}/users-permissions/roles/${roleId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Failed to get role ${roleId}`);
  }

  return response.json();
}

async function updateRole(token, roleId, permissions) {
  const response = await fetch(`${STRAPI_URL}/users-permissions/roles/${roleId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ permissions }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update role ${roleId}: ${error}`);
  }

  return response.json();
}

function buildPermissionsObject(existingPermissions, newPermissions) {
  // Start with existing permissions
  const result = { ...existingPermissions };

  for (const [contentType, actions] of Object.entries(newPermissions)) {
    // Parse the content type
    // "api::restaurant.restaurant" -> api name: restaurant, controller: restaurant
    // "plugin::users-permissions.user" -> api name: users-permissions, controller: user
    const parts = contentType.split('.');
    const controllerName = parts[parts.length - 1];
    let apiName = parts[0].replace('api::', '').replace('plugin::', '');

    // Ensure the api structure exists
    if (!result[apiName]) {
      result[apiName] = { controllers: {} };
    }
    if (!result[apiName].controllers) {
      result[apiName].controllers = {};
    }
    if (!result[apiName].controllers[controllerName]) {
      result[apiName].controllers[controllerName] = {};
    }

    // Set each action
    for (const action of actions) {
      result[apiName].controllers[controllerName][action] = { enabled: true };
    }
  }

  return result;
}

async function seedPermissions() {
  console.log('🌱 Seeding Strapi permissions...\n');

  try {
    const token = await getAdminToken();
    console.log('✅ Admin login successful\n');

    // Update Public role (ID 2)
    console.log('📝 Updating Public role permissions...');
    const publicRole = await getRole(token, 2);
    const publicPermissions = buildPermissionsObject(
      publicRole.role?.permissions || {},
      PUBLIC_PERMISSIONS
    );
    await updateRole(token, 2, publicPermissions);
    console.log('✅ Public role updated\n');

    // Update Authenticated role (ID 1)
    console.log('📝 Updating Authenticated role permissions...');
    const authRole = await getRole(token, 1);
    const authPermissions = buildPermissionsObject(
      authRole.role?.permissions || {},
      AUTHENTICATED_PERMISSIONS
    );
    await updateRole(token, 1, authPermissions);
    console.log('✅ Authenticated role updated\n');

    console.log('🎉 Permissions seeded successfully!\n');
    console.log('Public role can now:');
    console.log('  - Submit featured spot inquiries');
    console.log('  - Submit closure reports');
    console.log('  - Browse all directory content');
    console.log('  - View deals and promotions');
    console.log('  - View emergency alerts');
    console.log('  - View activity logs\n');
    console.log('Authenticated role can now:');
    console.log('  - Save/unsave items (wishlist)');
    console.log('  - Submit claim requests');
    console.log('  - Manage cart items');
    console.log('  - Create support tickets');
    console.log('  - Send messages');
    console.log('  - Create listings and reviews');
    console.log('  - Manage notifications');
    console.log('  - RSVP to events');
    console.log('  - Report content');
    console.log('  - Subscribe to newsletters');
    console.log('  - Save and manage searches');
    console.log('  - View and create activity logs');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedPermissions();
