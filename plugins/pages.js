import { createClient } from 'contentful';
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app';
import { usePages } from '../composables/pages';

export default defineNuxtPlugin(async () => {
  const rtConfig = useRuntimeConfig();
  const client = createClient({
    space: rtConfig.CONTENTFUL_SPACE_ID,
    accessToken: rtConfig.CONTENTFUL_ACCESS_TOKEN,
  });
  const pages = usePages();
  const entriesRaw = await client.getEntries({
    include: 10,
    content_type: 'marketingPage',
  });
  const entries = client.parseEntries(entriesRaw);
  pages.value = entries;
});
