export default {
  "kind": "collectionType",
  "collectionName": "towns",
  "info": {
    "singularName": "town",
    "pluralName": "towns",
    "displayName": "Town",
    "description": "Towns and cities in the county"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "name": {
      "type": "string",
      "required": true,
      "unique": true
    },
    "slug": {
      "type": "uid",
      "targetField": "name",
      "required": true
    },
    "county": {
      "type": "string",
      "default": "Navarro"
    },
    "state": {
      "type": "string",
      "default": "TX"
    },
    "population": {
      "type": "integer"
    },
    "description": {
      "type": "richtext"
    },
    "latitude": {
      "type": "float"
    },
    "longitude": {
      "type": "float"
    },
    "zipCodes": {
      "type": "json"
    },
    "image": {
      "type": "media",
      "allowedTypes": ["images"],
      "multiple": false
    }
  }
};
