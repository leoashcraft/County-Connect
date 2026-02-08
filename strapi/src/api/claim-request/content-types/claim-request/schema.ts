export default {
  kind: "collectionType",
  collectionName: "claim_requests",
  info: {
    singularName: "claim-request",
    pluralName: "claim-requests",
    displayName: "Claim Request",
    description: "Requests from users to claim ownership of listings"
  },
  options: {
    draftAndPublish: false
  },
  pluginOptions: {},
  attributes: {
    entityType: {
      type: "enumeration",
      enum: ["restaurant", "church", "local-business", "school", "event"],
      required: true
    },
    entityId: {
      type: "string",
      required: true
    },
    claimant: {
      type: "relation",
      relation: "manyToOne",
      target: "plugin::users-permissions.user"
    },
    yourRole: {
      type: "enumeration",
      enum: ["owner", "manager", "employee", "representative"],
      required: true
    },
    verificationInfo: {
      type: "text",
      required: true
    },
    businessPhone: {
      type: "string"
    },
    businessEmail: {
      type: "email"
    },
    additionalNotes: {
      type: "text"
    },
    status: {
      type: "enumeration",
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    reviewedBy: {
      type: "relation",
      relation: "manyToOne",
      target: "plugin::users-permissions.user"
    },
    reviewedAt: {
      type: "datetime"
    },
    rejectionReason: {
      type: "text"
    }
  }
};
