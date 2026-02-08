export default {
  "kind": "collectionType",
  "collectionName": "cart_items",
  "info": {
    "singularName": "cart-item",
    "pluralName": "cart-items",
    "displayName": "Cart Item",
    "description": "Shopping cart items"
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
    "product": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::marketplace-listing.marketplace-listing"
    },
    "quantity": {
      "type": "integer",
      "default": 1
    },
    "addedAt": {
      "type": "datetime"
    }
  }
};
