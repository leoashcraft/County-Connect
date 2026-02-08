export default {
  "kind": "collectionType",
  "collectionName": "marketplace_categories",
  "info": {
    "singularName": "marketplace-category",
    "pluralName": "marketplace-categories",
    "displayName": "Marketplace Category",
    "description": "Categories for marketplace listings"
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
    "description": {
      "type": "text"
    },
    "icon": {
      "type": "string"
    },
    "listings": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::marketplace-listing.marketplace-listing",
      "mappedBy": "category"
    }
  }
};
