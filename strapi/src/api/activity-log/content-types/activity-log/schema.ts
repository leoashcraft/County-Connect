export default {
  "kind": "collectionType",
  "collectionName": "activity_logs",
  "info": {
    "singularName": "activity-log",
    "pluralName": "activity-logs",
    "displayName": "Activity Log",
    "description": "Community activity feed entries"
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
    "actionType": {
      "type": "enumeration",
      "enum": ["listing_created", "event_created", "review_posted", "deal_posted", "forum_post", "rsvp", "saved_item"],
      "required": true
    },
    "entityType": {
      "type": "string",
      "required": true
    },
    "entityId": {
      "type": "string",
      "required": true
    },
    "entityTitle": {
      "type": "string"
    },
    "entityUrl": {
      "type": "string"
    },
    "town": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::town.town"
    },
    "isPublic": {
      "type": "boolean",
      "default": true
    }
  }
};
