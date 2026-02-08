import type { Schema, Struct } from '@strapi/strapi';

export interface SharedContentSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_content_sections';
  info: {
    description: 'A content section with heading and body';
    displayName: 'Content Section';
  };
  attributes: {
    content: Schema.Attribute.RichText & Schema.Attribute.Required;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedExternalResource extends Struct.ComponentSchema {
  collectionName: 'components_shared_external_resources';
  info: {
    description: 'An external link/resource';
    displayName: 'External Resource';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFaq extends Struct.ComponentSchema {
  collectionName: 'components_shared_faqs';
  info: {
    description: 'A frequently asked question';
    displayName: 'FAQ';
  };
  attributes: {
    answer: Schema.Attribute.RichText & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.content-section': SharedContentSection;
      'shared.external-resource': SharedExternalResource;
      'shared.faq': SharedFaq;
    }
  }
}
