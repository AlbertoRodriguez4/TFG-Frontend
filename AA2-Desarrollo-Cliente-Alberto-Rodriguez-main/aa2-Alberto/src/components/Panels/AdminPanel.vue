<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useItemStore } from '@/stores/itemStore'
import EditUserPopup from '../PopUps/EditUserPopup.vue'
import EditItemPopup from '../PopUps/EditItemPopup.vue'
import type { User } from '@/components/Models/User'
import type { Item } from '@/components/Models/Item'
import router from '@/router'
import { useI18n } from 'vue-i18n'

const store = useUserStore()
const loggedUser = computed(() => store.loggedUser)
const itemStore = useItemStore()
const selectedUser = defineModel<User | null>('selectedUser')
const selectedItem = defineModel<Item | null>('selectedItem')
const showPopup = ref(false);

const userSearch = ref('')
const itemSearch = ref('')
const { t, locale } = useI18n()
locale.value = 'es'
onMounted(async () => {
    if (loggedUser.value?.email && loggedUser.value.passwordhash) {
        await store.getItems(loggedUser.value.email, loggedUser.value.passwordhash)
    }
    if (loggedUser.value?.role === 'userMaster') {
        await store.fetchUser()
        await itemStore.fetchItems()
    }
})
watch(
    () => store.loggedUser,
    (newUser) => {
        if (!newUser || !newUser.email) {
            router.push({ name: 'home' })
        }
    },
    { immediate: true }
)
const openPopup = (item: Item) => {
    selectedItem.value = item;
    showPopup.value = true;
};

const closePopup = () => {
    showPopup.value = false;
    selectedItem.value = null;
};

const openUserPopup = (user: User) => {
    selectedUser.value = user;
    showPopup.value = true;
};

const closeUserPopup = () => {
    showPopup.value = false;
    selectedUser.value = null;
};


const filteredUsers = computed(() =>
    store.user.filter(user => user.name.toLowerCase().includes(userSearch.value.toLowerCase()))
)

const filteredItems = computed(() =>
    itemStore.items.filter(item => item.name.toLowerCase().includes(itemSearch.value.toLowerCase()))
)
</script>

<template>
  <v-container fluid class="pa-6">
    <!-- Encabezado del panel -->
    <v-row justify="center" class="mb-6">
      <v-col cols="12" md="8">
        <v-card class="pa-4" color="primary" dark>
          <v-card-title>{{ $t('panel') }} {{ loggedUser?.name }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sección de usuarios e ítems -->
    <v-row class="admin-content" justify="center" align="start" dense>
      <!-- USUARIOS -->
      <v-col cols="12" md="5">
        <v-card class="pa-4">
          <v-card-title>{{ $t('users') }}</v-card-title>
          <v-text-field
            v-model="userSearch"
            :label="$t('Buscar usuario...')"
            prepend-inner-icon="mdi-account-search"
            class="mb-3"
            density="compact"
            variant="outlined"
          />
          <v-list dense>
            <v-list-item
              v-for="user in filteredUsers"
              :key="user.id"
              class="d-flex justify-space-between align-center"
            >
              <v-list-item-title>
                {{ user.name }} - {{ user.email }}
              </v-list-item-title>
              <v-btn
                color="secondary"
                size="small"
                @click="openUserPopup(user)"
              >
                {{ $t('Editar') }}
              </v-btn>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- ITEMS -->
      <v-col cols="12" md="5">
        <v-card class="pa-4">
          <v-card-title>{{ $t('items') }}</v-card-title>
          <v-text-field
            v-model="itemSearch"
            :label="$t('Buscar ítem...')"
            prepend-inner-icon="mdi-magnify"
            class="mb-3"
            density="compact"
            variant="outlined"
          />
          <v-list dense>
            <v-list-item
              v-for="item in filteredItems"
              :key="item.id"
              class="d-flex justify-space-between align-center"
            >
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
              <v-btn
                color="secondary"
                size="small"
                @click="openPopup(item)"
              >
                {{ $t('Editar') }}
              </v-btn>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Popups -->
    <EditItemPopup
      v-if="selectedItem"
      :visible="showPopup"
      :item="selectedItem"
      @close="closePopup"
      @edit="(item) => console.log('Editando', item)"
    />
    <EditUserPopup
      v-if="selectedUser"
      :visible="showPopup"
      :user="selectedUser"
      @close="closeUserPopup"
      @edit="(user) => console.log('Editando', user)"
    />
  </v-container>
</template>


<style scoped>
.admin-container {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    margin: 20px auto;
    width: 2000px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.admin-header {
    text-align: center;
    margin-bottom: 20px;
    color: black;
}
h2 {
    color: white;
}
.admin-content {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.admin-section {
    flex: 1 1 45%;
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 8px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
    color: black;
}

.search-bar {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.item-list {
    list-style: none;
    padding: 0;
}

.item-list li {
    padding: 6px 0;
    border-bottom: 1px solid #ddd;
}

.edit-button {
    margin-left: 1rem;
    padding: 0.2rem 0.6rem;
    background-color: #444;
    border: none;
    color: white;
    border-radius: 4px;
    cursor: pointer;
}

.edit-button:hover {
    background-color: #666;
}
</style>
