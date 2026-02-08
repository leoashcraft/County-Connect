export default {
  "kind": "collectionType",
  "collectionName": "service_categories",
  "info": {
    "singularName": "service-category",
    "pluralName": "service-categories",
    "displayName": "Service Category",
    "description": "Categories for service pages"
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
    "icon": {
      "type": "string"
    },
    "description": {
      "type": "text"
    },
    "service_pages": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::service-page.service-page",
      "mappedBy": "category"
    }
  }
};
