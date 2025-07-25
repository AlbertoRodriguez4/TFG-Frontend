<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'
import { useUserStore } from '@/stores/userStore'
import type { User } from '@/components/Models/User'

const store = useUserStore()
const errorMessage = ref('') // referencia reactiva al mensaje de error

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')

const register = async () => {
  errorMessage.value = ''

  const emailTrimmed = email.value.trim()
  const passwordTrimmed = password.value.trim()
  const confirmPasswordTrimmed = confirmPassword.value.trim()
  const nameTrimmed = name.value.trim()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailTrimmed || !passwordTrimmed || !confirmPasswordTrimmed || !nameTrimmed) {
    errorMessage.value = 'Por favor, completa todos los campos.'
    return
  }

  if (!emailRegex.test(emailTrimmed)) {
    errorMessage.value = 'Introduce un correo electrónico válido.'
    return
  }

  if (nameTrimmed.length < 3) {
    errorMessage.value = 'El nombre debe tener al menos 3 caracteres.'
    return
  }

  if (passwordTrimmed.length < 6) {
    errorMessage.value = 'La contraseña debe tener al menos 6 caracteres.'
    return
  }

  if (passwordTrimmed !== confirmPasswordTrimmed) {
    errorMessage.value = 'Las contraseñas no coinciden.'
    return
  }

  const user: User = {
    id: 0,
    name: nameTrimmed,
    passwordhash: passwordTrimmed,
    email: emailTrimmed,
    level: 0,
    strength: 0,
    endurance: 0,
    consistencystreak: 0,
    gold: 0,
    role: 'userNormal'
  }

  try {
    const result = await store.createUser(user)
    if (!result) {
      errorMessage.value = 'No se pudo crear el usuario. Puede que el correo ya esté registrado.'
      return
    }

    const loginResult = await store.loginUser(emailTrimmed, passwordTrimmed)
    if (loginResult && store.loggedUser?.email === emailTrimmed) {
      alert('Registro exitoso')
      router.push({ name: 'homeLogged' })
    } else {
      errorMessage.value = 'El registro fue exitoso, pero hubo un error al iniciar sesión.'
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Error inesperado. Intenta más tarde.'
  }
}
</script>

<template>
  <div class="register-container">
    <!-- Panel Izquierdo -->
    <div class="left-panel">
      <p class="slogan">{{ $t('slogan') }}</p>
      <hr />
      <img src="@/assets/imgs/Logo.png" alt="The Training Hub logo" class="logo" />
    </div>

    <!-- Panel Derecho -->
    <div class="right-panel">
      <h2 class="title">{{ $t('register_title') }}</h2>
      <form class="register-form" @submit.prevent="register">
        <v-text-field
          v-model="email"
          type="email"
          :placeholder="$t('email_placeholder')"
          class="input"
          hide-details
          solo
        />
        <v-text-field
          v-model="password"
          type="password"
          :placeholder="$t('password_placeholder')"
          class="input"
          hide-details
          solo
        />
        <v-text-field
          v-model="confirmPassword"
          type="password"
          :placeholder="$t('confirm_password_placeholder')"
          class="input"
          hide-details
          solo
        />
        <v-text-field
          v-model="name"
          type="text"
          :placeholder="$t('username_placeholder')"
          class="input"
          hide-details
          solo
        />

        <button type="submit" class="register-btn">
          {{ $t('register_button') }}
        </button>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <div id="content">
          <p class="login-text">{{ $t('already_have_account') }}</p>
          <RouterLink to="/login" class="login-btn">
            {{ $t('login_button') }}
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  height: 100vh;
  font-family: 'Patrick Hand', cursive;
}

.error-message {
  color: red;
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
}

.left-panel {
  width: 40%;
  background-color: #fff;
  text-align: center;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 2px solid #ccc;
}

.logo {
  width: 60%;
  height: auto;
  margin-top: 2rem;
}

hr {
  width: 80%;
  border: 5px solid #000;
  margin: 1rem 0;
}

.slogan {
  font-size: 2.5rem;
  color: black;
  font-weight: bold;
  width: 70%;
}

.right-panel {
  width: 60%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  z-index: 1;
}

.right-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background: url('../assets/imgs/gimansio-fondo.jpg') center center / cover no-repeat;
  filter: blur(6px) brightness(1.5);
  z-index: -1;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #000;
}

.register-form {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 60%;
  background-color: #ffc107;
}

.input {
  margin-bottom: 1rem;
  width: 100%;
}

.register-btn,
.login-btn {
  background-color: #ffc107;
  border: 2px solid #007bff;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: bold;
  text-decoration: underline;
  color: #000;
}

.login-text {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  font-size: 1rem;
  color: #000;
  text-align: center;
  background-color: white;
  width: 70%;
  height: 40px;
}

.login-btn {
  margin-left: 0.5rem;
}

#content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
}
</style>
