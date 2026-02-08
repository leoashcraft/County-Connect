export default {
  "kind": "collectionType",
  "collectionName": "lost_and_found_posts",
  "info": {
    "singularName": "lost-and-found-post",
    "pluralName": "lost-and-found-posts",
    "displayName": "Lost & Found Post",
    "description": "Lost and found pet/item listings"
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
    "postType": {
      "type": "enumeration",
      "enum": ["lost_pet", "found_pet", "lost_item", "found_item"],
      "required": true
    },
    "description": {
      "type": "richtext",
      "required": true
    },
    "breed": {
      "type": "string"
    },
    "color": {
      "type": "string"
    },
    "distinguishingFeatures": {
      "type": "text"
    },
    "lastSeenLocation": {
      "type": "string"
    },
    "lastSeenDate": {
      "type": "datetime"
    },
    "contactName": {
      "type": "string"
    },
    "contactPhone": {
      "type": "string"
    },
    "contactEmail": {
      "type": "email"
    },
    "reward": {
      "type": "boolean",
      "default": false
    },
    "rewardAmount": {
      "type": "decimal"
    },
    "images": {
      "type": "media",
      "allowedTypes": ["images"],
      "multiple": true
    },
    "town": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::town.town"
    },
    "author": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "status": {
      "type": "enumeration",
      "enum": ["active", "reunited", "closed"],
      "default": "active"
    }
  }
};
