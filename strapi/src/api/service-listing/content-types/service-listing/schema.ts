export default {
  "kind": "collectionType",
  "collectionName": "service_listings",
  "info": {
    "singularName": "service-listing",
    "pluralName": "service-listings",
    "displayName": "Service Listing",
    "description": "Services and rentals offered by local providers"
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
    "slug": {
      "type": "uid",
      "targetField": "title"
    },
    "description": {
      "type": "richtext",
      "required": true
    },
    "category": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::service-listing-category.service-listing-category",
      "inversedBy": "serviceListings"
    },
    "listingType": {
      "type": "enumeration",
      "enum": ["service", "rental"],
      "default": "service",
      "required": true
    },
    "priceType": {
      "type": "enumeration",
      "enum": ["fixed", "hourly", "daily", "weekly", "monthly", "negotiable", "free", "contact"],
      "default": "contact"
    },
    "price": {
      "type": "decimal"
    },
    "images": {
      "type": "media",
      "allowedTypes": ["images"],
      "multiple": true
    },
    "location": {
      "type": "string"
    },
    "town": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::town.town"
    },
    "contactName": {
      "type": "string"
    },
    "contactPhone": {
      "type": "string"
    },
    "contactEmail": {
      "type": "email"
    },
    "website": {
      "type": "string"
    },
    "availability": {
      "type": "text"
    },
    "serviceArea": {
      "type": "string"
    },
    "yearsInBusiness": {
      "type": "integer"
    },
    "licensed": {
      "type": "boolean",
      "default": false
    },
    "insured": {
      "type": "boolean",
      "default": false
    },
    "provider": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "status": {
      "type": "enumeration",
      "enum": ["active", "pending", "paused", "expired", "draft"],
      "default": "active"
    },
    "featured": {
      "type": "boolean",
      "default": false
    },
    "searchKeywords": {
      "type": "string"
    },
    "viewCount": {
      "type": "integer",
      "default": 0
    }
  }
};
