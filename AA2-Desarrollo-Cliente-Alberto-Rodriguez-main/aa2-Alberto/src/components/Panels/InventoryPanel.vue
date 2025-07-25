<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { computed, onMounted, watch } from 'vue'

const store = useUserStore()
const loggedUser = computed(() => store.loggedUser)

onMounted(() => {
  if (loggedUser.value?.email && loggedUser.value?.passwordhash) {
    store.getItems(loggedUser.value.email, loggedUser.value.passwordhash)
  }
})

watch(loggedUser, (newUser) => {
  if (newUser?.email && newUser?.passwordhash) {
    store.getItems(newUser.email, newUser.passwordhash)
  }
})
</script>

<template>
  <v-container
    v-if="loggedUser?.role !== 'userMaster'"
    class="inventory"
    fluid
  >
    <h2 class="text-h4 text-center mb-6">{{ $t('inventario') }}</h2>

    <v-row justify="center">
      <v-col
        v-for="item in store.purchasedItems"
        :key="item.purchaseId"
        cols="6"
        sm="4"
        md="2"
      >
        <v-card
          :title="`${$t('tipo')}: ${item.itemType}, Bonus: ${item.itemBonus}`"
          class="item-card"
          outlined
          elevation="2"
        >
          <v-card-text class="text-center">
            <div class="item-name">{{ item.itemName }}</div>
            <div class="item-type">{{ item.itemType }}</div>
            <div class="item-bonus">+{{ item.itemBonus }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.inventory {
  margin: 2rem auto;
  background: white;
  padding: 2rem;
  border-radius: 100px;
  color: black;
  width: 90%;
  border: 10px solid #0D6EFD;
  box-sizing: border-box;
}

.item-card {
  background-color: #eee;
  text-align: center;
  border-radius: 16px;
}

.item-name {
  font-weight: bold;
  color: black;
  font-size: 1rem;
}

.item-type {
  font-style: italic;
  color: #888;
  margin-top: 0.25rem;
}

.item-bonus {
  color: #0f0;
  font-weight: bold;
  margin-top: 0.25rem;
}
</style>
