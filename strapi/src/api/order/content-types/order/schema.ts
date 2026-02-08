export default {
  "kind": "collectionType",
  "collectionName": "orders",
  "info": {
    "singularName": "order",
    "pluralName": "orders",
    "displayName": "Order",
    "description": "Marketplace orders"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "buyer": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "seller": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "items": {
      "type": "json"
    },
    "totalAmount": {
      "type": "decimal"
    },
    "status": {
      "type": "enumeration",
      "enum": ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      "default": "pending"
    },
    "shippingAddress": {
      "type": "text"
    },
    "notes": {
      "type": "text"
    }
  }
};
