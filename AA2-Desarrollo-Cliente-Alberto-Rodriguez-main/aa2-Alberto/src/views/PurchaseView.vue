<script setup lang="ts">
import HeaderView from './HeaderView.vue';
import FooterView from './FooterView.vue';
import ItemRender from '../components/Renders/ItemRender.vue';
import { useUserStore } from '@/stores/userStore';
import { ref, watchEffect } from 'vue';

const store = useUserStore()
const loggedUser = ref(store.loggedUser)

watchEffect(() => {
  loggedUser.value = store.loggedUser
})
</script>

<template>
  <v-app>
    <v-main class="bg-black text-white main">
      <v-container class="fill-height d-flex flex-column align-center pa-6">
        <v-row class="w-100 justify-center">
          <v-col cols="12" md="8" class="text-center">
            <h1 class="welcome">
              {{ $t('tienda') }} | Gold: {{ loggedUser?.gold }}
            </h1>
          </v-col>
        </v-row>

        <v-row class="w-100 justify-center">
          <ItemRender />
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
html,
body {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.min-h-screen {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

.welcome-container {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  width: 100%;
  padding-right: 4rem;
}

.welcome {
  font-size: 2.5rem;
  color: #ffcc00;
  font-weight: bold;
  margin: 0;
  text-align: center;
}

/* MAIN como columna */
.main {
  padding: 2rem;
  background-image: url('../assets/imgs/gimansio-fondo.jpg');
  background-size: cover;
  background-position: center;
  color: #fff;
  text-align: center;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
}



</style>
