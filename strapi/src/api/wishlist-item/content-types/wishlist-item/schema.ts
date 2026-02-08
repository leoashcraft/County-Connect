export default {
  "kind": "collectionType",
  "collectionName": "wishlist_items",
  "info": {
    "singularName": "wishlist-item",
    "pluralName": "wishlist-items",
    "displayName": "Saved Item",
    "description": "Saved items for users (products, restaurants, guides, services, etc.)"
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
    "itemType": {
      "type": "enumeration",
      "enum": [
        "product",
        "service",
        "guide",
        "restaurant",
        "church",
        "school",
        "event",
        "local-business"
      ],
      "required": true
    },
    "itemId": {
      "type": "string",
      "required": true
    },
    "itemName": {
      "type": "string",
      "required": true
    },
    "itemImage": {
      "type": "string"
    },
    "itemUrl": {
      "type": "string"
    },
    "addedAt": {
      "type": "datetime"
    },
    "collection": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::wishlist-collection.wishlist-collection"
    }
  }
};
