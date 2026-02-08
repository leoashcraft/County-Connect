export default {
  "kind": "collectionType",
  "collectionName": "schools",
  "info": {
    "singularName": "school",
    "pluralName": "schools",
    "displayName": "School",
    "description": "Local schools and educational institutions"
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
    "schoolType": {
      "type": "enumeration",
      "enum": ["elementary", "middle", "high", "k12", "private", "charter", "college", "preschool", "daycare", "headstart"]
    },
    "district": {
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
    "phone": {
      "type": "string"
    },
    "website": {
      "type": "string"
    },
    "grades": {
      "type": "string"
    },
    "enrollment": {
      "type": "integer"
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
    "status": {
      "type": "enumeration",
      "enum": ["active", "pending", "inactive"],
      "default": "active"
    },
    "owner": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "searchKeywords": {
      "type": "string",
      "description": "Comma-separated search synonyms (up to 3)"
    }
  }
};
