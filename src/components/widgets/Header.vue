<template>
  <header class="header">
    <ul v-if="user" class="boards-list">
      <li v-for="b in board.boards" :key="b.id">
        {{ b.title }}
      </li>
    </ul>
    <button v-if="!user" @click="loginGithub">Войти через GitHub</button>
    <button v-if="user" @click="logout">Выйти</button>
  </header>
</template>

<script setup lang="ts">
import { supabase } from '@/lib/supabase'
import { useBoardStore } from '@/stores/board'
import type { User } from '@supabase/supabase-js'

defineProps<{ user: User | null }>()

const board = useBoardStore()

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
  padding: var(--space-l);
  background: #a4c7f053;
  width: 90%;
  margin: 0 auto;
  border-radius: 0 0 10px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.boards-list {
  display: flex;
  gap: var(--space-s);
}

.boards-list li {
  padding: var(--space-xs) var(--space-s);
  border-radius: var(--space-s);
  background: #ffffff;
  cursor: pointer;
}

.boards-list li:hover {
  opacity: 0.5;
}
</style>
