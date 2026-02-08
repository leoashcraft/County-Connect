export default {
  "kind": "collectionType",
  "collectionName": "service_listing_categories",
  "info": {
    "singularName": "service-listing-category",
    "pluralName": "service-listing-categories",
    "displayName": "Service Listing Category",
    "description": "Categories for service and rental listings"
  },
  "options": {
    "draftAndPublish": false
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
    "serviceListings": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::service-listing.service-listing",
      "mappedBy": "category"
    },
    "sortOrder": {
      "type": "integer",
      "default": 0
    }
  }
};
