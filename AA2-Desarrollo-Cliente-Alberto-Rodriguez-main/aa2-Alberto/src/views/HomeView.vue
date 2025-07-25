<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router';

//v-if is loggued -> x; if not -> y
</script>

<template>
  <v-app>
    <v-main class=" text-white align-center">
      <v-container
        fluid
        class="pa-0 fill-height d-flex align-center justify-space-around background"
      >
        <v-row class="ma-0 pa-0" align="center" justify="space-around" no-gutters>
          <!-- Texto -->
          <v-col cols="12" md="5" class="text-center text-content">
            <h1 class="text-h3 font-weight-bold">{{ $t('title') }}</h1>
            <p class="text-subtitle-1">{{ $t('description1') }}</p>
            <p class="text-subtitle-1">{{ $t('description2') }}</p>
            <p class="highlight">{{ $t('highlight') }}</p>

            <RouterLink to="/register">
              <v-btn
                class="register-btn mt-4"
                color="warning"
                variant="flat"
                size="large"
              >
                {{ $t('register') }}
              </v-btn>
            </RouterLink>
          </v-col>
          <v-col cols="12" md="5" class="image-content">
            <v-img
              src="../assets/imgs/People.png"     
              alt="Entrenamiento"
              class="training-img"
              width="80%"
              cover
              rounded="lg"
              :elevation="10"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.background {
  background-image: url('../assets/imgs/gimansio-fondo.jpg');
  background-size: cover;
  background-position: center;
}

.text-content p {
  font-size: 1.2rem;
}

.highlight {
  font-weight: bold;
  font-size: 1.3rem;
  margin-top: 1rem;
}

.training-img {
  box-shadow: 2px 2px 15px rgba(255, 255, 255, 0.3);
}

.register-btn {
  color: black;
  font-weight: bold;
  border: 4px solid #0D6EFD;
  border-radius: 10px;
  text-transform: none;
}

.register-btn:hover {
  filter: brightness(1.1);
}
</style>
