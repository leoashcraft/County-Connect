export default {
  "kind": "collectionType",
  "collectionName": "featured_spot_inquiries",
  "info": {
    "singularName": "featured-spot-inquiry",
    "pluralName": "featured-spot-inquiries",
    "displayName": "Featured Spot Inquiry",
    "description": "Inquiries from businesses wanting to claim featured spots"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "businessName": {
      "type": "string",
      "required": true
    },
    "yearsInBusiness": {
      "type": "string"
    },
    "contactName": {
      "type": "string",
      "required": true
    },
    "email": {
      "type": "email",
      "required": true
    },
    "phone": {
      "type": "string",
      "required": true
    },
    "website": {
      "type": "string"
    },
    "streetAddress": {
      "type": "string"
    },
    "city": {
      "type": "string",
      "required": true
    },
    "businessDescription": {
      "type": "text",
      "required": true
    },
    "valueProposition": {
      "type": "text"
    },
    "spotType": {
      "type": "enumeration",
      "enum": ["homepage-featured", "service-page", "directory-featured"],
      "default": "homepage-featured"
    },
    "pageSlug": {
      "type": "string"
    },
    "status": {
      "type": "enumeration",
      "enum": ["pending", "contacted", "approved", "rejected"],
      "default": "pending"
    },
    "adminNotes": {
      "type": "text"
    },
    "agreedToTerms": {
      "type": "boolean",
      "default": false,
      "required": true
    }
  }
};
