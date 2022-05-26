import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app';
import c from 'contentful';
const { createClient } = c;

export default defineNuxtPlugin(() => {
  const rtConfig = useRuntimeConfig();
  const contentfulConfig = {
    space: rtConfig.CONTENTFUL_SPACE_ID,
    accessToken: rtConfig.CONTENTFUL_ACCESS_TOKEN,
    removeUnresolved: true,
  };
  const client = createClient(contentfulConfig);

  return {
    provide: {
      contentful: client,
    },
  };
});
