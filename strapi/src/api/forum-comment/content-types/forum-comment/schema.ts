export default {
  "kind": "collectionType",
  "collectionName": "forum_comments",
  "info": {
    "singularName": "forum-comment",
    "pluralName": "forum-comments",
    "displayName": "Forum Comment",
    "description": "Comments on forum posts"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "content": {
      "type": "richtext",
      "required": true
    },
    "post": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::forum-post.forum-post"
    },
    "author": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "parentComment": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::forum-comment.forum-comment"
    }
  }
};
