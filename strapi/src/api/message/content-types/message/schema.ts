export default {
  "kind": "collectionType",
  "collectionName": "messages",
  "info": {
    "singularName": "message",
    "pluralName": "messages",
    "displayName": "Message",
    "description": "User-to-user messaging"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "sender": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "recipient": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "subject": {
      "type": "string"
    },
    "content": {
      "type": "text",
      "required": true
    },
    "isRead": {
      "type": "boolean",
      "default": false
    },
    "relatedListingType": {
      "type": "string"
    },
    "relatedListingId": {
      "type": "string"
    }
  }
};
