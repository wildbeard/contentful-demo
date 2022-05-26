import { defineNuxtConfig } from 'nuxt'
import { createClient } from 'contentful';
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  generate: {
    // routes: async () => {
    //  const pages = await client.getEntries({ content_type: 'marketingPage' });
    //  return Promise.resolve([]);
    // },
    // routes() {
    //  return Promise.all([
    //    client.getEntries({
    //      content_type: 'marketingPage',
    //    })
    //  ])
    //    .then(([entries]) => {
    //      return [...entries.items.map(e => e.fields.slug)];
    //    });
    // },
    async routes(callback) {
      const pages = await client.getEntries({ content_type: 'marketingPage' });
      const routes = pages.items.map(p => `/${p.fields.slug}`);
      callback(null, routes);
    },
  },
  runtimeConfig: {
    public: {
      CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
      CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
      CONTENTFUL_ENVIRONMENT: 'master',
    },
  },
  ssr: false,
  target: 'static',
})
