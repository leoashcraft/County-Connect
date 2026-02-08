export default {
  "kind": "collectionType",
  "collectionName": "marketplace_listings",
  "info": {
    "singularName": "marketplace-listing",
    "pluralName": "marketplace-listings",
    "displayName": "Marketplace Listing",
    "description": "Items for sale in the marketplace"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "title",
      "required": true
    },
    "description": {
      "type": "richtext",
      "required": true
    },
    "price": {
      "type": "decimal",
      "required": true
    },
    "condition": {
      "type": "enumeration",
      "enum": ["new", "like-new", "good", "fair", "poor"]
    },
    "category": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::marketplace-category.marketplace-category",
      "inversedBy": "listings"
    },
    "images": {
      "type": "media",
      "allowedTypes": ["images"],
      "multiple": true
    },
    "location": {
      "type": "string"
    },
    "seller": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "status": {
      "type": "enumeration",
      "enum": ["active", "sold", "pending", "draft"],
      "default": "active"
    },
    "viewCount": {
      "type": "integer",
      "default": 0
    }
  }
};
