export default {
  "kind": "collectionType",
  "collectionName": "reviews",
  "info": {
    "singularName": "review",
    "pluralName": "reviews",
    "displayName": "Review",
    "description": "User reviews for businesses and services"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "rating": {
      "type": "integer",
      "required": true,
      "min": 1,
      "max": 5
    },
    "title": {
      "type": "string"
    },
    "content": {
      "type": "richtext"
    },
    "entityType": {
      "type": "string",
      "required": true
    },
    "entityId": {
      "type": "string",
      "required": true
    },
    "author": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    }
  }
};
