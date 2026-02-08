export default {
  "kind": "collectionType",
  "collectionName": "emergency_alerts",
  "info": {
    "singularName": "emergency-alert",
    "pluralName": "emergency-alerts",
    "displayName": "Emergency Alert",
    "description": "Site-wide emergency alerts and announcements"
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
    "message": {
      "type": "text",
      "required": true
    },
    "severity": {
      "type": "enumeration",
      "enum": ["info", "warning", "critical"],
      "default": "info"
    },
    "linkUrl": {
      "type": "string"
    },
    "linkText": {
      "type": "string"
    },
    "startDate": {
      "type": "datetime"
    },
    "endDate": {
      "type": "datetime"
    },
    "isDismissible": {
      "type": "boolean",
      "default": true
    },
    "towns": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::town.town"
    },
    "isActive": {
      "type": "boolean",
      "default": true
    }
  }
};
