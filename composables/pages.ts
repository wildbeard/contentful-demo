import { Node } from '@contentful/rich-text-types';

type SectionBlockFields = {
  sectionTitle?: String,
  sectionSubTitle?: String,
  sectionDivider?: String,
  sectionImage: String,
  sectionContent: Node,
};

type SectionBlock = {
  fields: SectionBlockFields,
  metadata: Object,
  sys: Object,
};

type Page = {
  fields: {
    slug: String,
    title: String,
    sectionBlock: SectionBlock[],
  },
};

type Pages = {
  items: Page[],
};

export const usePages = () => useState<Pages>('pages');
