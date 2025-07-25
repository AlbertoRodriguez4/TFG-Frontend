<script setup lang="ts">
import HeaderView from './HeaderView.vue'
import FooterView from './FooterView.vue'
import PlanRender from '@/components/Renders/PlanRender.vue';
</script>

<template>
  <v-app>
    <v-main class="bg-white text-black d-flex flex-column justify-space-between align-center main">
      <v-container class="fill-height d-flex flex-column justify-start align-center pa-0">
        <h1 class="titulo my-8">Planes</h1>
        <PlanRender />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.min-h-screen {
    display: flex;
    flex-direction: column;
    height: 80vh;
    width: 100vw;
}

.main {
    background-image: url('../assets/imgs/gimansio-fondo.jpg');
    background-size: cover;
    background-position: center;
    width: 100%;
    padding: 2rem 0;
    height: 100%;
    overflow-y: auto;
}

.titulo {
    font-size: 2.5rem;
    color: #fcb900;
    font-weight: bold;
    text-align: right;
    width: 90%;
    margin-bottom: 1.5rem;
}



</style>
