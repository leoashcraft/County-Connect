export default {
  "kind": "collectionType",
  "collectionName": "jobs",
  "info": {
    "singularName": "job",
    "pluralName": "jobs",
    "displayName": "Job",
    "description": "Job listings and employment opportunities"
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
      "targetField": "title",
      "required": true
    },
    "company": {
      "type": "string"
    },
    "description": {
      "type": "richtext",
      "required": true
    },
    "jobType": {
      "type": "enumeration",
      "enum": ["full-time", "part-time", "contract", "temporary", "internship"]
    },
    "salary": {
      "type": "string"
    },
    "location": {
      "type": "string"
    },
    "requirements": {
      "type": "richtext"
    },
    "benefits": {
      "type": "richtext"
    },
    "contactEmail": {
      "type": "email"
    },
    "contactPhone": {
      "type": "string"
    },
    "applicationUrl": {
      "type": "string"
    },
    "town": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::town.town"
    },
    "postedBy": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "expiresAt": {
      "type": "datetime"
    },
    "status": {
      "type": "enumeration",
      "enum": ["active", "filled", "expired", "draft"],
      "default": "active"
    }
  }
};
