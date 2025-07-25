<script setup lang="ts">

import { usePlanStore } from '@/stores/PlanStore'

const store = usePlanStore()
store.fetchPlan()
const advantages = ['planCustomization', 'coachTracking', 'premiumAccess']

</script>

<template>
  <v-container class="py-8 planes-container" fluid>
    <v-row justify="center" align="stretch" dense>
      <v-col
        v-for="plan in store.plan"
        :key="plan.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          class="plan-card"
          elevation="6"
        >
          <v-card-title class="headline font-weight-bold blue--text text--darken-2 justify-center">
            {{ $t('plan de tier') }} {{ plan.id }}
          </v-card-title>

          <v-card-text>
            <p>{{ plan.description }}</p>

            <p class="mt-4 font-weight-medium">
              <strong>{{ $t('ventajas') }}:</strong>
            </p>

            <v-list dense class="pa-0">
              <v-list-item v-for="(item, index) in advantages" :key="index">
                <v-list-item-icon class="mr-2">
                  <v-icon color="primary" size="18">mdi-check</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="text-body-2">
                    {{ $t(item) }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <p class="mt-4 font-weight-bold">
              {{ $t('price') }}: 30€
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.plan-card {
  border: 3px solid #0D6EFD;
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
}

.plan-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.planes-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>