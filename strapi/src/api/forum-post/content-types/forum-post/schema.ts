export default {
  "kind": "collectionType",
  "collectionName": "forum_posts",
  "info": {
    "singularName": "forum-post",
    "pluralName": "forum-posts",
    "displayName": "Forum Post",
    "description": "Community forum posts and discussions"
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
    "content": {
      "type": "richtext",
      "required": true
    },
    "category": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::forum-category.forum-category",
      "inversedBy": "posts"
    },
    "author": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "isPinned": {
      "type": "boolean",
      "default": false
    },
    "isLocked": {
      "type": "boolean",
      "default": false
    },
    "viewCount": {
      "type": "integer",
      "default": 0
    }
  }
};
