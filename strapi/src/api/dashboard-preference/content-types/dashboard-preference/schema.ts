export default {
  "kind": "collectionType",
  "collectionName": "dashboard_preferences",
  "info": {
    "singularName": "dashboard-preference",
    "pluralName": "dashboard-preferences",
    "displayName": "Dashboard Preference",
    "description": "User dashboard customization preferences"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "user": {
      "type": "relation",
      "relation": "oneToOne",
      "target": "plugin::users-permissions.user",
      "unique": true
    },
    "visibleSections": {
      "type": "json",
      "required": false
    },
    "sectionOrder": {
      "type": "json",
      "required": false
    }
  }
};
