<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const store = useUserStore()
const router = useRouter()

async function handleLogin() {
  errorMessage.value = '' // Limpiar errores anteriores

  const emailTrimmed = email.value.trim()
  const passwordTrimmed = password.value.trim()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailTrimmed || !passwordTrimmed) {
    errorMessage.value = 'Por favor, completa todos los campos.'
    return
  }

  if (!emailRegex.test(emailTrimmed)) {
    errorMessage.value = 'Introduce un correo electrónico válido.'
    return
  }

  try {
    const loginResult = await store.loginUser(emailTrimmed, passwordTrimmed)

    if (loginResult && store.loggedUser?.email === emailTrimmed) { //si el login es correcto, nos redirige a la pagina principal con el usuario logueado
      router.push('/homeLogged')
      alert('Login exitoso')
    } else {
      errorMessage.value = 'Usuario o contraseña incorrectos.'
    }
  } catch (error) {
    console.error('Login failed:', error)
    errorMessage.value = 'Error inesperado al iniciar sesión. Intenta más tarde.'
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
      <h2 class="title">{{ $t('title_login') }}</h2>
      <form class="register-form" @submit.prevent="handleLogin">
        <v-text-field
          v-model="email"
          type="email"
          :placeholder="$t('placeholder_email')"
          class="input"
          hide-details
          solo
        />
        <v-text-field
          v-model="password"
          type="password"
          :placeholder="$t('placeholder_password')"
          class="input"
          hide-details
          solo
        />

        <button type="submit" class="register-btn">
          {{ $t('login_button') }}
        </button>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <div id="content">
          <p class="login-text">{{ $t('no_account') }}</p>
          <RouterLink to="/register" class="login-btn">
            {{ $t('register_button') }}
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
}

.input {
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 2px solid #007bff;
  border-radius: 5px;
  background-color: #ffc107;
  color: #000;
  font-size: 1rem;
  text-align: center;
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