<template>
  <div class="security-settings">
    <!-- Password Section -->
    <v-card class="settings-card" elevation="0" border>
      <v-card-title class="card-title">
        <v-icon>mdi-shield-lock</v-icon>
        Change Password
      </v-card-title>

      <v-divider class="card-divider" />

      <v-card-text>
        <v-form ref="passwordForm" class="settings-form">
          <!-- Current Password -->
          <div class="form-group">
            <label class="form-label">Current Password</label>
            <v-text-field
              v-model="passwordData.current"
              type="password"
              variant="outlined"
              density="comfortable"
              placeholder="Enter current password"
              class="form-input"
              :rules="[rules.required]"
            />
          </div>

          <!-- New Password -->
          <div class="form-group">
            <label class="form-label">New Password</label>
            <v-text-field
              v-model="passwordData.new"
              type="password"
              variant="outlined"
              density="comfortable"
              placeholder="Enter new password"
              class="form-input"
              :rules="[rules.required, rules.minLength]"
              counter
              maxlength="32"
            />
            <p class="password-hint">At least 8 characters with uppercase, lowercase, and numbers</p>
          </div>

          <!-- Confirm Password -->
          <div class="form-group">
            <label class="form-label">Confirm New Password</label>
            <v-text-field
              v-model="passwordData.confirm"
              type="password"
              variant="outlined"
              density="comfortable"
              placeholder="Confirm new password"
              class="form-input"
              :rules="[rules.required, rules.passwordMatch]"
            />
          </div>

          <!-- Action Buttons -->
          <div class="form-actions">
            <v-btn
              color="#ffcc00"
              text-color="#000"
              variant="flat"
              size="large"
              class="save-btn"
            >
              <v-icon start>mdi-check</v-icon>
              Update Password
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>



    <!-- Login History -->

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const passwordForm = ref()
const twoFAEnabled = ref(false)

const passwordData = reactive({
  current: '',
  new: '',
  confirm: '',
})

const rules = {
  required: (value: string) => !!value || 'This field is required',
  minLength: (value: string) => value?.length >= 8 || 'Password must be at least 8 characters',
  passwordMatch: (value: string) => value === passwordData.new || 'Passwords do not match',
}

const activeSessions = [
  {
    id: 1,
    icon: 'mdi-monitor',
    device: 'Chrome on Windows 11',
    location: 'Zaragoza, Spain',
    lastActive: '5 minutes ago',
    current: true,
  },
  {
    id: 2,
    icon: 'mdi-tablet',
    device: 'Safari on iPad',
    location: 'Barcelona, Spain',
    lastActive: '2 hours ago',
    current: false,
  },
  {
    id: 3,
    icon: 'mdi-phone',
    device: 'Chrome on Android',
    location: 'Valencia, Spain',
    lastActive: '1 day ago',
    current: false,
  },
]

const loginHistory = [
  {
    date: 'Today at 10:45 AM',
    location: 'Zaragoza, Spain',
    ip: '192.168.1.1',
    success: true,
  },
  {
    date: 'Yesterday at 8:30 PM',
    location: 'Barcelona, Spain',
    ip: '192.168.1.45',
    success: true,
  },
  {
    date: '2 days ago at 3:15 PM',
    location: 'Valencia, Spain',
    ip: '192.168.1.78',
    success: false,
  },
]
</script>

<style scoped>
.security-settings {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-card {
  background: rgba(20, 20, 20, 0.5) !important;
  border: 1px solid rgba(255, 204, 0, 0.15) !important;
  border-radius: 12px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #ffcc00;
  font-weight: 700;
  font-size: 1.2rem;
  padding: 1.5rem;
  padding-bottom: 0;
}

.card-divider {
  margin: 1rem 0;
  border-color: rgba(255, 204, 0, 0.1) !important;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 0.95rem;
}

.password-hint {
  margin: 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}

.form-input :deep(.v-field) {
  background: rgba(255, 204, 0, 0.03) !important;
  border-color: rgba(255, 204, 0, 0.15) !important;
}

.form-input :deep(.v-field:hover) {
  background: rgba(255, 204, 0, 0.05) !important;
  border-color: rgba(255, 204, 0, 0.25) !important;
}

.form-input :deep(.v-field--focused) {
  background: rgba(255, 204, 0, 0.08) !important;
  border-color: rgba(255, 204, 0, 0.4) !important;
}

.form-input :deep(.v-field__input) {
  color: rgba(255, 255, 255, 0.9) !important;
}

.form-actions {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 204, 0, 0.1);
}

.save-btn {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Two-Factor Authentication */
.twofa-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 204, 0, 0.15);
  background: rgba(255, 204, 0, 0.03);
}

.twofa-status.enabled {
  background: rgba(74, 222, 128, 0.08);
  border-color: rgba(74, 222, 128, 0.2);
}

.status-info {
  flex: 1;
}

.status-title {
  margin: 0 0 0.3rem 0;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
  font-size: 1rem;
}

.status-desc {
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

/* Sessions */
.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.session-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 204, 0, 0.1);
  background: rgba(255, 204, 0, 0.02);
}

.session-info {
  display: flex;
  gap: 2rem;
  flex: 1;
}

.session-device {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.session-device :deep(.v-icon) {
  color: #ffcc00;
  font-size: 1.5rem;
}

.device-name {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

.device-location {
  margin: 0.2rem 0 0 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
}

.session-time {
  text-align: right;
}

.time-label {
  margin: 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.time-value {
  margin: 0.2rem 0 0 0;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

.logout-btn {
  color: rgba(255, 255, 255, 0.5) !important;
}

.current-chip {
  background: rgba(74, 222, 128, 0.15) !important;
  color: #4ade80 !important;
}

/* Login History */
.login-item {
  padding: 0.5rem 0;
}

.login-time {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

.login-location {
  margin: 0.2rem 0 0 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.login-ip {
  margin: 0.2rem 0 0 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
}

/* Responsive */
@media (max-width: 600px) {
  .twofa-status {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .session-info {
    flex-direction: column;
    gap: 0.8rem;
  }

  .session-time {
    text-align: left;
  }
}
</style>