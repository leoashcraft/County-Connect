export default {
  "kind": "collectionType",
  "collectionName": "support_messages",
  "info": {
    "singularName": "support-message",
    "pluralName": "support-messages",
    "displayName": "Support Message",
    "description": "Messages within support tickets"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "content": {
      "type": "richtext",
      "required": true
    },
    "ticket": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::support-ticket.support-ticket"
    },
    "sender": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "isStaffReply": {
      "type": "boolean",
      "default": false
    }
  }
};
