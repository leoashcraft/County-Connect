export default {
  "kind": "collectionType",
  "collectionName": "deals",
  "info": {
    "singularName": "deal",
    "pluralName": "deals",
    "displayName": "Deal",
    "description": "Business deals and promotions"
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
    "description": {
      "type": "richtext"
    },
    "discountType": {
      "type": "enumeration",
      "enum": ["percentage", "fixed", "bogo", "free_item", "other"],
      "default": "percentage"
    },
    "discountValue": {
      "type": "string"
    },
    "code": {
      "type": "string"
    },
    "startDate": {
      "type": "datetime"
    },
    "endDate": {
      "type": "datetime"
    },
    "terms": {
      "type": "text"
    },
    "image": {
      "type": "media",
      "allowedTypes": ["images"],
      "multiple": false
    },
    "business": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::local-business.local-business"
    },
    "restaurant": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::restaurant.restaurant"
    },
    "status": {
      "type": "enumeration",
      "enum": ["active", "expired", "draft"],
      "default": "active"
    },
    "featured": {
      "type": "boolean",
      "default": false
    },
    "town": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::town.town"
    }
  }
};
