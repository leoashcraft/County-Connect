export default {
  "kind": "collectionType",
  "collectionName": "up_users",
  "info": {
    "name": "user",
    "description": "",
    "singularName": "user",
    "pluralName": "users",
    "displayName": "User"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "full_name": {
      "type": "string"
    },
    "phone": {
      "type": "string"
    },
    "preferred_town": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::town.town"
    },
    "street_address": {
      "type": "string"
    },
    "city": {
      "type": "string"
    },
    "state": {
      "type": "string",
      "default": "TX"
    },
    "zip_code": {
      "type": "string"
    },
    "bio": {
      "type": "text"
    },
    "is_admin": {
      "type": "boolean",
      "default": false
    },
    "is_verified_vendor": {
      "type": "boolean",
      "default": false
    },
    "verification_requested": {
      "type": "boolean",
      "default": false
    },
    "profile_completed": {
      "type": "boolean",
      "default": false
    },
    "oauth_provider": {
      "type": "string"
    },
    "oauth_id": {
      "type": "string"
    },
    "external_id": {
      "type": "string"
    },
    "picture": {
      "type": "string"
    }
  }
};
