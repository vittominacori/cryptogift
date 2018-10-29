<template>
    <div class="main">
        <site-header />
        <b-container class="mt-5">
            <transition name="fade" mode="out-in">
                <component v-if="page" :is="page" :key="page"></component>
            </transition>
        </b-container>
        <site-footer />
    </div>
</template>
<script>
  import SiteHeader from './Header.vue';
  import SiteFooter from './Footer.vue';

  export default {
    components: {
      SiteHeader,
      SiteFooter,
    },
    computed: {
      page() {
        return this.$page.frontmatter.component || null;
      },
    },
  };
</script>
<style src="../scss/main.scss" lang="scss"></style>
