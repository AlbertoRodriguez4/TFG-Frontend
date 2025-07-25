<script setup lang="ts">
import { useRoomStore } from '@/stores/RoomStore';
import HeaderView from './HeaderView.vue';
import FooterView from './FooterView.vue';
import RoomRender from '../components/Renders/RoomRender.vue';
const store = useRoomStore()
store.fetchRoom()

</script>


<template>
  <v-app>
    <v-main class="bg-black text-white main">
      <v-container class="fill-height d-flex flex-column align-center pa-6">
        <v-row class="w-100 justify-center">
          <v-col cols="12" md="8" class="text-center">
            <h1 class="welcome">{{ $t('rooms') }}</h1>
          </v-col>
        </v-row>
        <v-row class="w-100" id="inventarios">
          <RoomRender />
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>


<style scoped>
.min-h-screen {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
}

.room-name {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
}

.welcome-container {
    display: flex;
    justify-content: flex-end;
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
    justify-content: flex-start;
    align-items: stretch;
    overflow: hidden;
}


</style>
