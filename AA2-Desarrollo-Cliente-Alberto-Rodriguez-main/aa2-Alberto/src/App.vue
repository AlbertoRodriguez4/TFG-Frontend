<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import HeaderView from './views/HeaderView.vue';
import FooterView from './views/FooterView.vue';
import HomeView from './views/HomeView.vue';
</script>

<template>
  <v-app>
    <HeaderView class="header" />

    <v-main>
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>

    <FooterView />
  </v-app>
</template>

<style scoped>
.header {
  height: 100px;
  flex-shrink: 0;
  z-index: 1;
}
</style>
