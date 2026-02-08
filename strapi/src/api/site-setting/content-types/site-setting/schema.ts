export default {
  "kind": "singleType",
  "collectionName": "site_settings",
  "info": {
    "singularName": "site-setting",
    "pluralName": "site-settings",
    "displayName": "Site Setting",
    "description": "Global site configuration and settings"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "siteName": {
      "type": "string",
      "default": "CountyConnect"
    },
    "siteTagline": {
      "type": "string"
    },
    "contactEmail": {
      "type": "email"
    },
    "contactPhone": {
      "type": "string"
    },
    "address": {
      "type": "string"
    },
    "socialLinks": {
      "type": "json"
    },
    "analyticsId": {
      "type": "string"
    },
    "logoLight": {
      "type": "media",
      "allowedTypes": ["images"],
      "multiple": false
    },
    "logoDark": {
      "type": "media",
      "allowedTypes": ["images"],
      "multiple": false
    },
    "favicon": {
      "type": "media",
      "allowedTypes": ["images"],
      "multiple": false
    }
  }
};
