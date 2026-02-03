import express from 'express';
import { EntityModel } from '../models/Entity.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Helper function to normalize entity type (handle camelCase like FoodTruck, TruckStop)
function normalizeEntityType(entityType) {
  // Map of lowercase -> proper case for multi-word entity types
  const entityTypeMap = {
    'foodtruck': 'FoodTruck',
    'truckstop': 'TruckStop',
    'menusection': 'MenuSection',
    'menuitem': 'MenuItem',
    'operatinghours': 'OperatingHours',
    'sitesetting': 'SiteSetting',
    'chatchannel': 'ChatChannel',
    'chatmessage': 'ChatMessage',
    'chatrole': 'ChatRole',
    'chatmoderationaction': 'ChatModerationAction',
    'communityresource': 'CommunityResource',
    'sportsteam': 'SportsTeam',
    'claimrequest': 'ClaimRequest',
    'bulletinpost': 'BulletinPost',
    'lostandfound': 'LostAndFound',
    'blogpost': 'BlogPost',
    'supportticket': 'SupportTicket',
    'newslettersubscriber': 'NewsletterSubscriber',
    'storeinvitation': 'StoreInvitation',
    'storepage': 'StorePage',
    'storenavigationitem': 'StoreNavigationItem',
    'productvariation': 'ProductVariation',
    'wishlistcollection': 'WishlistCollection',
    'page': 'Page',
    'navigationitem': 'NavigationItem',
  };

  const lower = entityType.toLowerCase();
  if (entityTypeMap[lower]) {
    return entityTypeMap[lower];
  }

  // Default: capitalize first letter
  return entityType.charAt(0).toUpperCase() + entityType.slice(1).toLowerCase();
}

// GET /api/entities/:entityType - List all entities of a type
router.get('/:entityType', optionalAuth, async (req, res) => {
  try {
    const entityType = normalizeEntityType(req.params.entityType);
    const { sort, limit, skip, fields } = req.query;

    const options = {
      sort,
      limit: limit ? parseInt(limit) : undefined,
      skip: skip ? parseInt(skip) : 0,
      fields,
    };

    // If there's a query parameter, filter instead of list
    if (req.query.q) {
      const query = JSON.parse(req.query.q);
      const entities = await EntityModel.filter(entityType, query, options);
      return res.json(entities);
    }

    const entities = await EntityModel.list(entityType, options);
    res.json(entities);
  } catch (error) {
    console.error('List entities error:', error);
    res.status(500).json({ message: 'Failed to fetch entities', error: error.message });
  }
});

// GET /api/entities/:entityType/:id - Get a single entity
router.get('/:entityType/:id', optionalAuth, async (req, res) => {
  try {
    const entityType = normalizeEntityType(req.params.entityType);
    const { id } = req.params;

    const entity = await EntityModel.findById(entityType, id);

    if (!entity) {
      return res.status(404).json({ message: 'Entity not found' });
    }

    res.json(entity);
  } catch (error) {
    console.error('Get entity error:', error);
    res.status(500).json({ message: 'Failed to fetch entity' });
  }
});

// POST /api/entities/:entityType - Create a new entity
router.post('/:entityType', authenticateToken, async (req, res) => {
  try {
    const entityType = normalizeEntityType(req.params.entityType);
    const data = req.body;

    const entity = await EntityModel.create(entityType, data, req.user.id);
    res.status(201).json(entity);
  } catch (error) {
    console.error('Create entity error:', error);
    res.status(500).json({ message: 'Failed to create entity', error: error.message });
  }
});

// POST /api/entities/:entityType/bulk - Bulk create entities
router.post('/:entityType/bulk', authenticateToken, async (req, res) => {
  try {
    const entityType = normalizeEntityType(req.params.entityType);
    const dataArray = req.body;

    if (!Array.isArray(dataArray)) {
      return res.status(400).json({ message: 'Request body must be an array' });
    }

    const entities = await EntityModel.bulkCreate(entityType, dataArray, req.user.id);
    res.status(201).json(entities);
  } catch (error) {
    console.error('Bulk create error:', error);
    res.status(500).json({ message: 'Failed to bulk create entities', error: error.message });
  }
});

// PUT /api/entities/:entityType/:id - Update an entity
router.put('/:entityType/:id', authenticateToken, async (req, res) => {
  try {
    const entityType = normalizeEntityType(req.params.entityType);
    const { id } = req.params;
    const data = req.body;

    // First, fetch the existing entity to check ownership
    const existing = await EntityModel.findById(entityType, id);

    if (!existing) {
      return res.status(404).json({ message: 'Entity not found' });
    }

    // Verify ownership: user must be the creator or an admin
    // Some entity types are admin-only (SiteSetting, etc.)
    const adminOnlyTypes = ['SiteSetting', 'Town', 'Page', 'NavigationItem'];
    const isAdmin = req.user.role === 'admin';
    const isOwner = existing.created_by === req.user.id;

    if (adminOnlyTypes.includes(entityType) && !isAdmin) {
      return res.status(403).json({ message: 'Admin access required for this entity type' });
    }

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to modify this entity' });
    }

    const entity = await EntityModel.update(entityType, id, data);
    res.json(entity);
  } catch (error) {
    console.error('Update entity error:', error);
    res.status(500).json({ message: 'Failed to update entity' });
  }
});

// DELETE /api/entities/:entityType/:id - Delete an entity
router.delete('/:entityType/:id', authenticateToken, async (req, res) => {
  try {
    const entityType = normalizeEntityType(req.params.entityType);
    const { id } = req.params;

    // First, fetch the existing entity to check ownership
    const existing = await EntityModel.findById(entityType, id);

    if (!existing) {
      return res.status(404).json({ message: 'Entity not found' });
    }

    // Verify ownership: user must be the creator or an admin
    const adminOnlyTypes = ['SiteSetting', 'Town', 'Page', 'NavigationItem'];
    const isAdmin = req.user.role === 'admin';
    const isOwner = existing.created_by === req.user.id;

    if (adminOnlyTypes.includes(entityType) && !isAdmin) {
      return res.status(403).json({ message: 'Admin access required for this entity type' });
    }

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this entity' });
    }

    await EntityModel.delete(entityType, id);
    res.status(204).send();
  } catch (error) {
    console.error('Delete entity error:', error);
    res.status(500).json({ message: 'Failed to delete entity' });
  }
});

// DELETE /api/entities/:entityType - Delete many entities (admin only)
router.delete('/:entityType', authenticateToken, async (req, res) => {
  try {
    // Bulk delete is admin-only to prevent accidental mass deletion
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required for bulk delete' });
    }

    const entityType = normalizeEntityType(req.params.entityType);
    const query = req.body;

    const deletedCount = await EntityModel.deleteMany(entityType, query);

    res.json({ deletedCount });
  } catch (error) {
    console.error('Delete many error:', error);
    res.status(500).json({ message: 'Failed to delete entities' });
  }
});

// POST /api/entities/:entityType/import - Import entities from file (placeholder)
router.post('/:entityType/import', authenticateToken, async (req, res) => {
  try {
    // This would handle file uploads and CSV/JSON parsing
    // For now, just return a placeholder response
    res.status(501).json({ message: 'Import feature not yet implemented' });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ message: 'Failed to import entities' });
  }
});

export default router;
