<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'

interface User {
  id: number;
  name: string;
  email: string;
  passwordhash: string;
  level: number;
  strength: number;
  endurance: number;
  consistencystreak: number;
  gold: number;
  role: string;
}

const store = useUserStore()
const loggedUser = computed<User | null>(() => store.loggedUser)

const statList = ['strength', 'endurance', 'gold'] as const
type StatKey = typeof statList[number]

const colorMap: Record<StatKey, string> = {
  strength: 'red',
  endurance: 'blue',
  gold: 'gold',
}
</script>

<template>
  <div v-if="loggedUser && loggedUser.role !== 'userMaster'">
<v-container
  fluid
  class="d-flex flex-row align-end justify-center pa-8 ga-12"
  style="min-height: 45vh;"
>
      
      <!-- Perfil -->
      <v-card class="d-flex flex-column align-center pa-4" elevation="4" width="250">
        <v-avatar size="200">
          <img src="@/assets/imgs/usuario.png" alt="Avatar" />
        </v-avatar>
        <v-chip class="mt-4" color="primary" size="x-large" label>
          LVL: {{ loggedUser.level }}
        </v-chip>
      </v-card>

      <!-- Estadísticas -->
      <v-card class="pa-6" elevation="4" width="700" color="white" rounded="xl">
        <v-row dense>
          <v-col
            v-for="stat in statList"
            :key="stat"
            cols="12"
            class="mb-4"
          >
            <div class="text-subtitle-1 font-weight-bold mb-1">
              {{ stat.charAt(0).toUpperCase() + stat.slice(1) }}
            </div>
            <v-progress-linear
              :model-value="loggedUser[stat]"
              height="10"
              :color="colorMap[stat]"
              rounded
              striped
              >
              <template #default>
                <div class="text-body-2 font-weight-bold text-center" style="position: absolute; width: 100%">
                  {{ loggedUser[stat] }}
                </div>
              </template>
            </v-progress-linear>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>


<style scoped>
#user-stats {
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    margin-left: 3rem;
}


.profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 10%;
}

.avatar .circle {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: white;
}

.avatar-img {
    width: 10%;
    height: 10%;
    object-fit: cover;
}

.level {
    margin-top: 1rem;
    padding: 1rem;
    background: white;
    color: black;
    font-weight: bold;
    width: 100%;
    border: 8px solid #0D6EFD;
    border-radius: 100px;
    font-size: 20px;
}

.stats {
    display: flex;
    width: 60%;
    height: 80%;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin: 2rem auto;
    flex-wrap: wrap;
    background: white;
    padding: 1rem;
    border-radius: 100px;
    color: black;
    flex-direction: column;
    border: 10px solid #0D6EFD;
}

.stat {
    display: flex;
    width: 100%;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.5rem;
}

.division {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    width: 100%;
    font-size: 2rem;
    margin-left: 2rem;
    font-weight: bold;
}

.barra {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    font-size: 1.5rem;
    font-weight: bold;
}

.bar {
    height: 10px;
    border-radius: 5px;
}

.red {
    background: red;
}

.blue {
    background: blue;
}

.gold {
    background: gold;
}
</style>
