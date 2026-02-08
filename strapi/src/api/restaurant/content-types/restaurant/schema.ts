export default {
  "kind": "collectionType",
  "collectionName": "restaurants",
  "info": {
    "singularName": "restaurant",
    "pluralName": "restaurants",
    "displayName": "Restaurant",
    "description": "Local restaurants and eateries"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "name",
      "required": true
    },
    "description": {
      "type": "richtext"
    },
    "address": {
      "type": "string"
    },
    "city": {
      "type": "string"
    },
    "state": {
      "type": "string",
      "default": "TX"
    },
    "zipCode": {
      "type": "string"
    },
    "phone": {
      "type": "string"
    },
    "email": {
      "type": "email"
    },
    "website": {
      "type": "string"
    },
    "cuisine": {
      "type": "string"
    },
    "priceRange": {
      "type": "enumeration",
      "enum": ["budget", "moderate", "upscale", "luxury"]
    },
    "hours": {
      "type": "json"
    },
    "town": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::town.town"
    },
    "images": {
      "type": "media",
      "allowedTypes": ["images"],
      "multiple": true
    },
    "owner": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "status": {
      "type": "enumeration",
      "enum": ["active", "pending", "inactive"],
      "default": "active"
    },
    "searchKeywords": {
      "type": "string",
      "description": "Comma-separated search synonyms (up to 3)"
    },
    "viewCount": {
      "type": "integer",
      "default": 0
    }
  }
};
