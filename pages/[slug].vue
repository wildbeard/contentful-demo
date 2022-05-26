<template>
  <div class="container">
    <div v-for="(block, index) in blocks" :key="index">
      <div v-if="block.sectionDivider" class="section-divider">
        {{ block.sectionDivider }}
      </div>
      <h1 v-if="block.sectionTitle">
        {{ block.sectionTitle }}
      </h1>
      <h3 v-if="block.sectionSubTitle">
        {{ block.sectionSubTitle }}
      </h3>
      <img v-if="block.sectionImage" :src="block.sectionImage">
      <div v-if="block.html" v-html="block.html"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BLOCKS } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { usePages } from '@@/composables/pages';

const pages = usePages();
const route = useRoute();

if (!pages.value.items.length) {
  navigateTo('/');
}
const page = pages.value.items.find(p => p.fields.slug === route.params.slug);

const objectHasProperty = (obj, prop) => {
  const has = Object.prototype.hasOwnProperty;
  return has.call(obj, prop);
};

const blocks = [];
const heir = {
  top: ['sectionDivider', 'sectionImage', 'sectionTitle', 'sectionSubTitle'],
};
const renderOpts = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      if (objectHasProperty(node.data.target.fields, 'buttonText')) {
        const { buttonText, buttonColor, buttonUrl } = node.data.target.fields;
        return `<p class="text-center"><a href="${buttonUrl}" class="btn btn-${buttonColor}">${buttonText}</a></p>`;
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
* {
  box-sizing: border-box;
}
.container {
  width: 800px;
  margin: 50px auto 0;
}
.container img {
  width: 100%;
}
.section-divider {
  width: 100%;
  margin: 25px 0;
  padding: 10px 0;
  font-size: 1.5rem;
  color: white;
  text-align: center;
  background-color: blue;
}
</style>
<style>
.btn {
  padding: 18px 24px;
  text-align: center;
  text-decoration: none;
  line-height: 1;
}
.btn:hover,
.btn:active,
.btn:visited {
  text-decoration: none;
}
.btn-orange {
  color: white;
  background-color: #ed6226;
}
.text-center {
  text-align: center;
}
</style>
