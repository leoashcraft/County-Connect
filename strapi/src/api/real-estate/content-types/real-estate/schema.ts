export default {
  "kind": "collectionType",
  "collectionName": "real_estates",
  "info": {
    "singularName": "real-estate",
    "pluralName": "real-estates",
    "displayName": "Real Estate",
    "description": "Real estate listings and properties"
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
    "slug": {
      "type": "uid",
      "targetField": "title",
      "required": true
    },
    "description": {
      "type": "richtext",
      "required": true
    },
    "listingType": {
      "type": "enumeration",
      "enum": ["sale", "rent", "lease"],
      "required": true
    },
    "propertyType": {
      "type": "enumeration",
      "enum": ["house", "apartment", "condo", "land", "commercial", "farm"]
    },
    "price": {
      "type": "decimal",
      "required": true
    },
    "address": {
      "type": "string"
    },
    "city": {
      "type": "string"
    },
    "zipCode": {
      "type": "string"
    },
    "bedrooms": {
      "type": "integer"
    },
    "bathrooms": {
      "type": "float"
    },
    "squareFeet": {
      "type": "integer"
    },
    "lotSize": {
      "type": "string"
    },
    "yearBuilt": {
      "type": "integer"
    },
    "features": {
      "type": "json"
    },
    "images": {
      "type": "media",
      "allowedTypes": ["images"],
      "multiple": true
    },
    "town": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::town.town"
    },
    "agent": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "status": {
      "type": "enumeration",
      "enum": ["active", "pending", "sold", "rented", "draft"],
      "default": "active"
    }
  }
};
