export default {
  "kind": "collectionType",
  "collectionName": "churches",
  "info": {
    "singularName": "church",
    "pluralName": "churches",
    "displayName": "Church",
    "description": "Local churches and places of worship"
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
    "denomination": {
      "type": "string"
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
    "phone": {
      "type": "string"
    },
    "email": {
      "type": "email"
    },
    "website": {
      "type": "string"
    },
    "servicesTimes": {
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
    }
  }
};
