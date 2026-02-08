export default {
  "kind": "collectionType",
  "collectionName": "newsletter_subscribers",
  "info": {
    "singularName": "newsletter-subscriber",
    "pluralName": "newsletter-subscribers",
    "displayName": "Newsletter Subscriber",
    "description": "Email newsletter subscribers"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "email": {
      "type": "email",
      "required": true,
      "unique": true
    },
    "name": {
      "type": "string"
    },
    "town": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::town.town"
    },
    "interests": {
      "type": "json"
    },
    "frequency": {
      "type": "enumeration",
      "enum": ["daily", "weekly", "monthly"],
      "default": "weekly"
    },
    "isActive": {
      "type": "boolean",
      "default": true
    },
    "unsubscribeToken": {
      "type": "string"
    }
  }
};
