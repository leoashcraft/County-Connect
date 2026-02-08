export default {
  "kind": "collectionType",
  "collectionName": "bulletin_posts",
  "info": {
    "singularName": "bulletin-post",
    "pluralName": "bulletin-posts",
    "displayName": "Bulletin Post",
    "description": "Community bulletin board posts"
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
    "category": {
      "type": "enumeration",
      "enum": ["general", "free_swap", "rideshare", "babysitters", "church_nonprofit", "volunteers"],
      "default": "general"
    },
    "contactName": {
      "type": "string"
    },
    "contactEmail": {
      "type": "email"
    },
    "contactPhone": {
      "type": "string"
    },
    "eventDate": {
      "type": "datetime"
    },
    "expiresAt": {
      "type": "datetime"
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
      "enum": ["active", "expired", "removed"],
      "default": "active"
    }
  }
};
