<template>
  <div>
    <button v-if="!user" @click="loginGithub">Войти через GitHub</button>

    <div v-if="user">
      <BoardPage />
      <button class="btn-logout" @click="logout">Выйти</button>
    </div>

  </div>
</template>

<script setup lang="ts">
import BoardPage from './pages/BoardPage.vue';
import { supabase } from '@/lib/supabase'
import { ref, onMounted } from 'vue'

const user = ref<any>(null)

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  user.value = data.user

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
  })
})

async function loginGithub() {
  await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: window.location.origin },
  })
}

async function logout() {
  await supabase.auth.signOut()
}

</script>

<style scoped>
.btn-logout {
  position: absolute;
  top: 0;
  left: 0;
}
</style>