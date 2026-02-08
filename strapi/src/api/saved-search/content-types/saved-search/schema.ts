export default {
  "kind": "collectionType",
  "collectionName": "saved_searches",
  "info": {
    "singularName": "saved-search",
    "pluralName": "saved-searches",
    "displayName": "Saved Search",
    "description": "User saved searches for alerts"
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
    "name": {
      "type": "string",
      "required": true
    },
    "searchType": {
      "type": "enumeration",
      "enum": ["jobs", "marketplace", "services", "real-estate", "events", "all"],
      "required": true
    },
    "query": {
      "type": "string"
    },
    "filters": {
      "type": "json"
    },
    "town": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::town.town"
    },
    "alertFrequency": {
      "type": "enumeration",
      "enum": ["instant", "daily", "weekly", "none"],
      "default": "daily"
    },
    "lastAlertSent": {
      "type": "datetime"
    },
    "isActive": {
      "type": "boolean",
      "default": true
    }
  }
};
