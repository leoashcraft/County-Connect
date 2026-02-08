export default {
  "kind": "collectionType",
  "collectionName": "support_tickets",
  "info": {
    "singularName": "support-ticket",
    "pluralName": "support-tickets",
    "displayName": "Support Ticket",
    "description": "Customer support tickets"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "subject": {
      "type": "string",
      "required": true
    },
    "description": {
      "type": "richtext",
      "required": true
    },
    "status": {
      "type": "enumeration",
      "enum": ["open", "in-progress", "resolved", "closed"],
      "default": "open"
    },
    "priority": {
      "type": "enumeration",
      "enum": ["low", "medium", "high", "urgent"],
      "default": "medium"
    },
    "category": {
      "type": "string"
    },
    "submitter": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "assignedTo": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    }
  }
};
