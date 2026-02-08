export default {
  "kind": "collectionType",
  "collectionName": "featured_spots",
  "info": {
    "singularName": "featured-spot",
    "pluralName": "featured-spots",
    "displayName": "Featured Spot",
    "description": "Featured placement spots for businesses and listings"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "entityType": {
      "type": "string",
      "required": true
    },
    "entityId": {
      "type": "string",
      "required": true
    },
    "page": {
      "type": "string"
    },
    "position": {
      "type": "string"
    },
    "startDate": {
      "type": "datetime",
      "required": true
    },
    "endDate": {
      "type": "datetime",
      "required": true
    },
    "paymentStatus": {
      "type": "enumeration",
      "enum": ["pending", "paid", "expired"],
      "default": "pending"
    },
    "amount": {
      "type": "decimal"
    },
    "advertiser": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    }
  }
};
