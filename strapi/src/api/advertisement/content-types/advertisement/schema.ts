export default {
  "kind": "collectionType",
  "collectionName": "advertisements",
  "info": {
    "singularName": "advertisement",
    "pluralName": "advertisements",
    "displayName": "Advertisement",
    "description": "Advertisements and sponsored content"
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
    "content": {
      "type": "richtext"
    },
    "imageUrl": {
      "type": "string"
    },
    "linkUrl": {
      "type": "string"
    },
    "placement": {
      "type": "enumeration",
      "enum": ["sidebar", "banner", "inline", "footer"]
    },
    "startDate": {
      "type": "datetime"
    },
    "endDate": {
      "type": "datetime"
    },
    "isActive": {
      "type": "boolean",
      "default": true
    },
    "impressions": {
      "type": "integer",
      "default": 0
    },
    "clicks": {
      "type": "integer",
      "default": 0
    },
    "advertiser": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    }
  }
};
