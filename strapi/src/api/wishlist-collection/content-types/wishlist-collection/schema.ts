export default {
  "kind": "collectionType",
  "collectionName": "wishlist_collections",
  "info": {
    "singularName": "wishlist-collection",
    "pluralName": "wishlist-collections",
    "displayName": "Wishlist Collection",
    "description": "User-created collections for organizing saved items"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "user": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "sortOrder": {
      "type": "integer",
      "default": 0
    }
  }
};
