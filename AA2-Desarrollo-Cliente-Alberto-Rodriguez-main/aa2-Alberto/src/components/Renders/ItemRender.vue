<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useItemStore } from '@/stores/itemStore'
import { useUserStore } from '@/stores/userStore'
import { usePurchaseStore } from '@/stores/PurchaseStore'
import type { Item } from '@/components/Models/Item'

const itemStore = useItemStore()
const userStore = useUserStore()
const purchaseStore = usePurchaseStore()

const loggedUser = ref(userStore.loggedUser)
watchEffect(() => {
  loggedUser.value = userStore.loggedUser
})

onMounted(() => {
  itemStore.fetchDailyStrengthItems()
  itemStore.fetchDailyEnduranceItems()
  itemStore.fetchDailyGeneralItems()
})

const dailyRotation = computed(() => itemStore.generalItems)
const strengthItems = computed(() => itemStore.strengthItems)
const enduranceItems = computed(() => itemStore.enduranceItems)

const showDialog = ref(false)
const selectedItem = ref<Item | null>(null)

const openPopup = (item: Item) => {
  selectedItem.value = item
  showDialog.value = true
}

const closePopup = () => {
  showDialog.value = false
  selectedItem.value = null
}

const handleBuy = async () => {
  const userId = loggedUser.value?.id
  const item = selectedItem.value
  if (!userId || !item) return

  try {
        console.log(userId + " " + item.id + " " + item.price)

    const purchase = await purchaseStore.addPurchase(userId, item.id, item.price)
    if (purchase && purchase.id) {
      alert("Compra realizada correctamente")
      await userStore.refreshLoggedUser()
      closePopup()
    } else {
      throw new Error("Respuesta inválida del servidor")
    }
  } catch (error: any) {
    const message = error?.data?.message
    if (message?.includes("no tiene suficiente oro")) {
      alert("No tienes suficiente oro para realizar esta compra.")
    } else {
      alert(message || "Hubo un problema al realizar la compra.")
    }
    closePopup()
  }
}
</script>

<template>
  <v-container id="inventarios" fluid class="pa-6">
    <!-- Sección: Rotación diaria -->
    <section class="mb-12">
      <h2 class="text-h5 font-weight-bold mb-6">{{ $t('Rotacion Diaria') }}</h2>
      <v-row dense class="g-6">
        <v-col
          v-for="item in dailyRotation"
          :key="item.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card elevation="4" class="pa-4 d-flex flex-column justify-space-between" rounded hover>
            <div>
              <h3 class="text-subtitle-1 font-weight-bold mb-2">{{ item.name }}</h3>
              <p v-if="item.type === 'Strength'" class="text-body-2">+{{ item.bonus }} {{ $t('fuerza') }}</p>
              <p v-else-if="item.type === 'Endurance'" class="text-body-2">+{{ item.bonus }} {{ $t('resistencia') }}</p>
              <p class="text-body-2 text-yellow-darken-2">{{ item.price }} {{ $t('oro') }}</p>
            </div>
            <v-btn
              v-if="loggedUser?.role !== 'userMaster'"
              color="primary"
              variant="elevated"
              block
              class="mt-4"
              @click="openPopup(item)"
            >
              {{ $t('comprar') }}
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </section>

    <!-- Sección: Objetos de Fuerza -->
    <section class="mb-12">
      <h2 class="text-h5 font-weight-bold mb-6">{{ $t('Objetos de fuerza') }}</h2>
      <v-row dense class="g-6">
        <v-col
          v-for="item in strengthItems"
          :key="item.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card elevation="4" class="pa-4 d-flex flex-column justify-space-between" rounded hover>
            <div>
              <h3 class="text-subtitle-1 font-weight-bold mb-2">{{ item.name }}</h3>
              <p class="text-body-2">+{{ item.bonus }} {{ $t('fuerza') }}</p>
              <p class="text-body-2 text-yellow-darken-2">{{ item.price }} {{ $t('oro') }}</p>
            </div>
            <v-btn
              v-if="loggedUser?.role !== 'userMaster'"
              color="primary"
              variant="elevated"
              block
              class="mt-4"
              @click="openPopup(item)"
            >
              {{ $t('comprar') }}
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </section>

    <!-- Sección: Objetos de Resistencia -->
    <section>
      <h2 class="text-h5 font-weight-bold mb-6">{{ $t('Objetos de resistencia') }}</h2>
      <v-row dense class="g-6">
        <v-col
          v-for="item in enduranceItems"
          :key="item.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card elevation="4" class="pa-4 d-flex flex-column justify-space-between" rounded hover>
            <div>
              <h3 class="text-subtitle-1 font-weight-bold mb-2">{{ item.name }}</h3>
              <p class="text-body-2">+{{ item.bonus }} {{ $t('resistencia') }}</p>
              <p class="text-body-2 text-yellow-darken-2">{{ item.price }} {{ $t('oro') }}</p>
            </div>
            <v-btn
              v-if="loggedUser?.role !== 'userMaster'"
              color="primary"
              variant="elevated"
              block
              class="mt-4"
              @click="openPopup(item)"
            >
              {{ $t('comprar') }}
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </section>

    <!-- Diálogo de Compra -->
    <v-dialog v-model="showDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          {{ selectedItem?.name }}
        </v-card-title>
        <v-card-text>
          <p>
            {{ $t('comprarItems') }}
            <strong>{{ selectedItem?.price }}</strong> {{ $t('oro') }}?
          </p>
          <p v-if="selectedItem?.type === 'Strength'">
            +{{ selectedItem?.bonus }} {{ $t('fuerza') }}
          </p>
          <p v-else-if="selectedItem?.type === 'Endurance'">
            +{{ selectedItem?.bonus }} {{ $t('resistencia') }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="closePopup">{{ $t('cancelar') }}</v-btn>
          <v-btn color="primary" variant="elevated" @click="handleBuy">{{ $t('comprar') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
#inventarios {
  width: 100%;
  height: 100%;
  background-color: #f9f9f9;
}

section {
  padding-bottom: 2rem;
  border-bottom: 1px solid #e0e0e0;
}

h2 {
  color: #0D6EFD;
}

.v-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}
</style>
