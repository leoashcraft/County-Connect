export default {
  "kind": "collectionType",
  "collectionName": "events",
  "info": {
    "singularName": "event",
    "pluralName": "events",
    "displayName": "Event",
    "description": "Local events and activities"
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
    "startDate": {
      "type": "datetime",
      "required": true
    },
    "endDate": {
      "type": "datetime"
    },
    "location": {
      "type": "string"
    },
    "address": {
      "type": "string"
    },
    "eventType": {
      "type": "string"
    },
    "price": {
      "type": "string"
    },
    "contactInfo": {
      "type": "string"
    },
    "website": {
      "type": "string"
    },
    "image": {
      "type": "media",
      "allowedTypes": ["images"],
      "multiple": false
    },
    "town": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::town.town"
    },
    "organizer": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "status": {
      "type": "enumeration",
      "enum": ["upcoming", "ongoing", "completed", "cancelled"],
      "default": "upcoming"
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
