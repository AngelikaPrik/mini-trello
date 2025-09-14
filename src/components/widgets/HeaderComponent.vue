<template>
  <header class="header">
    <div v-if="user" class="user">
      <img class="user-img" width="40" height="40" :src="user?.user_metadata.avatar_url" alt="" />
      <p>{{ user?.user_metadata.name }}</p>
    </div>
    <UiButton v-if="!user" @click="loginGithub">Войти через GitHub</UiButton>
    <UiButton v-if="user" @click="logout">Выйти</UiButton>
  </header>
</template>

<script setup lang="ts">
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { UiButton } from '../ui'

defineProps<{ user: User | null }>()

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
.header {
  padding: var(--space-l) 0;
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user {
  display: flex;
  align-items: center;
  gap: var(--space-m);
}

.user-img {
  border-radius: 40px;
}
</style>
