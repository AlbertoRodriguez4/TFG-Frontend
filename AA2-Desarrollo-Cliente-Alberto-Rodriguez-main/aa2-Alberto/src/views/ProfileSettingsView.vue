<template>
  <div class="profile-settings">
    <!-- Hero Section -->
    <profile-header />

    <!-- Main Content -->
    <v-container class="settings-container">
      <v-row class="mt-4">
        <!-- Sidebar Navigation -->
        <v-col cols="12" md="3">
          <profile-sidebar v-model="activeTab" />
        </v-col>

        <!-- Content Area -->
        <v-col cols="12" md="9">
          <!-- Personal Information -->
          <profile-form v-show="activeTab === 'personal'" />

          <!-- Security Settings -->
          <security-settings v-show="activeTab === 'security'" />

          <!-- Notification Preferences -->
          <notification-settings v-show="activeTab === 'notifications'" />

          <!-- Subscription & Billing -->
          <subscription-card v-show="activeTab === 'subscription'" />

          <!-- Preferences -->
          <preferences-settings v-show="activeTab === 'preferences'" />

          <!-- Inventory -->
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProfileHeader from '../components/ProfileSettings/ProfileHeader.vue'
import ProfileSidebar from '../components/ProfileSettings/ProfileSidebar.vue'
import ProfileForm from '../components/ProfileSettings/ProfileForm.vue'
import SecuritySettings from '../components/ProfileSettings/SecuritySettings.vue'
import NotificationSettings from '../components/ProfileSettings/NotificationSettings.vue'
import SubscriptionCard from '../components/ProfileSettings/SubscriptionCard.vue'
import PreferencesSettings from '../components/ProfileSettings/PreferencesSettings.vue'

const activeTab = ref('personal')
</script>

<style scoped>
.profile-settings {
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(15, 15, 15, 0.95) 100%);
}

.settings-container {
  max-width: 1400px;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .settings-container {
    padding: 0 16px;
  }
}

@media (max-width: 600px) {
  .settings-container {
    padding: 0 12px;
  }
}
</style>