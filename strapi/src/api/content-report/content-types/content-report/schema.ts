export default {
  "kind": "collectionType",
  "collectionName": "content_reports",
  "info": {
    "singularName": "content-report",
    "pluralName": "content-reports",
    "displayName": "Content Report",
    "description": "User reports of inappropriate content"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "reporter": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "contentType": {
      "type": "enumeration",
      "enum": ["listing", "forum_post", "forum_comment", "review", "message", "event", "service"],
      "required": true
    },
    "contentId": {
      "type": "string",
      "required": true
    },
    "reason": {
      "type": "enumeration",
      "enum": ["spam", "inappropriate", "harassment", "misinformation", "scam", "other"],
      "required": true
    },
    "details": {
      "type": "text"
    },
    "status": {
      "type": "enumeration",
      "enum": ["pending", "reviewed", "actioned", "dismissed"],
      "default": "pending"
    },
    "reviewedBy": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "reviewNotes": {
      "type": "text"
    }
  }
};
