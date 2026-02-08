export default {
  "kind": "collectionType",
  "collectionName": "service_pages",
  "info": {
    "singularName": "service-page",
    "pluralName": "service-pages",
    "displayName": "Service Page",
    "description": "Service pages for county services and information"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "slug": {
      "type": "uid",
      "targetField": "title",
      "required": true
    },
    "title": {
      "type": "string",
      "required": true
    },
    "category": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::service-category.service-category",
      "inversedBy": "service_pages"
    },
    "subcategory": {
      "type": "string"
    },
    "layout": {
      "type": "integer",
      "default": 1,
      "min": 1,
      "max": 5
    },
    "icon": {
      "type": "string",
      "default": "Briefcase"
    },
    "iconColor": {
      "type": "string",
      "default": "blue"
    },
    "metaTitle": {
      "type": "string"
    },
    "metaDescription": {
      "type": "text"
    },
    "metaKeywords": {
      "type": "text"
    },
    "heroContent": {
      "type": "richtext",
      "required": true
    },
    "localContext": {
      "type": "richtext"
    },
    "sections": {
      "type": "component",
      "repeatable": true,
      "component": "shared.content-section"
    },
    "faqs": {
      "type": "component",
      "repeatable": true,
      "component": "shared.faq"
    },
    "relatedServices": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::service-page.service-page"
    },
    "externalResources": {
      "type": "component",
      "repeatable": true,
      "component": "shared.external-resource"
    },
    "claimedBusinessId": {
      "type": "string"
    },
    "status": {
      "type": "enumeration",
      "enum": ["active", "draft", "archived"],
      "default": "active"
    }
  }
};
