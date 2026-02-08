export default {
  "kind": "collectionType",
  "collectionName": "event_rsvps",
  "info": {
    "singularName": "event-rsvp",
    "pluralName": "event-rsvps",
    "displayName": "Event RSVP",
    "description": "User RSVPs for events"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "user": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "event": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::event.event"
    },
    "status": {
      "type": "enumeration",
      "enum": ["interested", "going"],
      "required": true
    }
  }
};
