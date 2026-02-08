export default {
  "kind": "collectionType",
  "collectionName": "forum_categories",
  "info": {
    "singularName": "forum-category",
    "pluralName": "forum-categories",
    "displayName": "Forum Category",
    "description": "Categories for forum posts"
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
    "posts": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::forum-post.forum-post",
      "mappedBy": "category"
    }
  }
};
