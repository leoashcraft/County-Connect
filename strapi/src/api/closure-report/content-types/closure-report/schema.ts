export default {
  "kind": "collectionType",
  "collectionName": "closure_reports",
  "info": {
    "singularName": "closure-report",
    "pluralName": "closure-reports",
    "displayName": "Closure Report",
    "description": "Reports of permanent or temporary business closures"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "listingName": {
      "type": "string",
      "required": true
    },
    "listingType": {
      "type": "string",
      "required": true
    },
    "listingId": {
      "type": "string",
      "required": true
    },
    "closureType": {
      "type": "enumeration",
      "enum": ["permanent", "temporary", "unsure"],
      "required": true
    },
    "reporterName": {
      "type": "string"
    },
    "reporterEmail": {
      "type": "email"
    },
    "reporterPhone": {
      "type": "string"
    },
    "details": {
      "type": "text"
    },
    "lastVisitDate": {
      "type": "string"
    },
    "status": {
      "type": "enumeration",
      "enum": ["pending", "verified", "rejected", "resolved"],
      "default": "pending"
    },
    "adminNotes": {
      "type": "text"
    }
  }
};
