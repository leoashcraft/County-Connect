export default {
  "kind": "collectionType",
  "collectionName": "navigation_menus",
  "info": {
    "singularName": "navigation-menu",
    "pluralName": "navigation-menus",
    "displayName": "Navigation Menu",
    "description": "Navigation menu items for site navigation"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "label": {
      "type": "string",
      "required": true
    },
    "url": {
      "type": "string",
      "required": true
    },
    "icon": {
      "type": "string"
    },
    "order": {
      "type": "integer",
      "default": 0
    },
    "isVisible": {
      "type": "boolean",
      "default": true
    },
    "linkType": {
      "type": "enumeration",
      "enum": ["internal", "external", "page"],
      "default": "internal"
    },
    "parent": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::navigation-menu.navigation-menu"
    }
  }
};
