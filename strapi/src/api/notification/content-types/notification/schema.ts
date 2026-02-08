export default {
  "kind": "collectionType",
  "collectionName": "notifications",
  "info": {
    "singularName": "notification",
    "pluralName": "notifications",
    "displayName": "Notification",
    "description": "User notifications"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "user": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "type": {
      "type": "enumeration",
      "enum": ["message", "order", "claim", "save", "forum_reply", "event_reminder", "listing_inquiry", "review", "system"],
      "required": true
    },
    "title": {
      "type": "string",
      "required": true
    },
    "body": {
      "type": "text"
    },
    "linkUrl": {
      "type": "string"
    },
    "isRead": {
      "type": "boolean",
      "default": false
    },
    "metadata": {
      "type": "json"
    }
  }
};
