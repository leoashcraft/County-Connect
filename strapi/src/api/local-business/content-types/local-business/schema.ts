export default {
  "kind": "collectionType",
  "collectionName": "local_businesses",
  "info": {
    "singularName": "local-business",
    "pluralName": "local-businesses",
    "displayName": "Local Business",
    "description": "Generic local businesses of any type"
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
    "businessType": {
      "type": "string",
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
    "hours": {
      "type": "json"
    },
    "specialties": {
      "type": "json"
    },
    "priceRange": {
      "type": "enumeration",
      "enum": ["budget", "moderate", "upscale", "luxury"]
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
    }
  }
};
