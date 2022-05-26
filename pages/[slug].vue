<template>
  <div>
    <div v-for="(block, index) in blocks" :key="index">
      <div
        v-if="block.sectionDivider"
        class="section-divider w-full mt-8 mb-10 py-5 bg-primary text-center text-white text-3xl font-bold">
        <div class="container mx-auto !my-0">
          {{ block.sectionDivider }}
        </div>
      </div>
      <div class="section-container lg:w-1/2 2xl:w-2/6 mx-auto !my-0 px-6">
        <h1
          v-if="block.sectionTitle"
          class="text-3xl lg:text-4xl font-semibold">
          {{ block.sectionTitle }}
        </h1>
        <h3
          v-if="block.sectionSubTitle"
          class="text-3xl lg:text-3xl font-serif py-5">
          {{ block.sectionSubTitle }}
        </h3>
      </div>
      <div class="section-container mx-auto lg:w-1/2 2xl:w-2/6 !my-0 px-6">
        <img
          v-if="block.sectionImage"
          :src="block.sectionImage"
          class="w-full mb-6">
        <div
          v-if="block.html"
          v-html="block.html"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BLOCKS, Node } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { usePages } from '@@/composables/pages';

const pages = usePages();
const route = useRoute();

if (!pages.value.items.length) {
  navigateTo('/');
}
const page = pages.value.items.find(p => p.fields.slug === route.params.slug);

const objectHasProperty = (obj:Object, prop:String): boolean => {
  const has = Object.prototype.hasOwnProperty;
  return has.call(obj, prop);
};

const blocks = [];
const heir = {
  top: ['sectionDivider', 'sectionImage', 'sectionTitle', 'sectionSubTitle'],
};
const renderOpts = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: (node:Node) => {
      if (objectHasProperty(node.data.target.fields, 'buttonText')) {
        const { buttonText, buttonColor, buttonUrl } = node.data.target.fields;
        return `<p class="text-center"><a href="${buttonUrl}" class="btn bg-${buttonColor}">${buttonText}</a></p>`;
      }
    },
  },
};

type RenderSection = {
  html?: String,
  sectionImage?: String,
  sectionTitle?: String,
  sectionDivider?: String,
  sectionSubTitle?: String,
};

// @ts-ignore
page.fields.sectionBlock.forEach((block) => {
  const section:RenderSection = {};
  const fieldsArr = Object.keys(block.fields);

  fieldsArr.filter(f => heir.top.includes(f))
    .forEach(field => (section[field] = block.fields[field]));
  if (block.fields.sectionContent) {
    const content = { ...block.fields.sectionContent };
    // @ts-ignore
    section.html = documentToHtmlString(content, renderOpts);
  }
  blocks.push(section);
});
</script>

<style scoped>
.content-container {
  max-width: 1140px;
}
</style>
<style>
.btn {
  @apply inline-block text-white tracking-wider uppercase p-3.5;
}
h2, h3 {
  @apply font-serif;
}
h2 > b {
  @apply text-2xl font-light mb-4;
}
p {
  @apply mb-4;
}
ol {
  @apply list-decimal mt-4 pl-6;
}
.bg-orange {
  @apply bg-danger;
}
</style>
