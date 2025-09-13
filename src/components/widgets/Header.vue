<template>
  <header class="header">
    <ul v-if="user" class="boards-list">
      <li v-for="b in board.boards" :key="b.id" @click="() => onSwitchBoard(b.id)">
        {{ b.title }}
      </li>
      <li @click="onAddBoard"></li>
    </ul>
    <UiButton v-if="!user" @click="loginGithub">Войти через GitHub</UiButton>
    <UiButton v-if="user" @click="logout">Выйти</UiButton>
  </header>

  <UiModal
    v-if="addTaskOpen"
    confirmText="Добавить"
    cancelText="Отмена"
    confirmVariant="primary"
    :showConfirm="true"
    @confirm="createBoard"
    @cancel="addTaskOpen = false"
    @close="addTaskOpen = false"
  >
    <template #title><h2>Новая доска</h2></template>
    <UiInput v-model="newBoardTitle" placeholder="Название доски" autofocus />
  </UiModal>
</template>

<script setup lang="ts">
import { supabase } from '@/lib/supabase'
import { useBoardStore } from '@/stores/board'
import type { User } from '@supabase/supabase-js'
import { UiButton, UiInput, UiModal } from '../ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const addTaskOpen = ref(false)
const newBoardTitle = ref('')

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

const onAddBoard = () => {
  newBoardTitle.value = ''
  addTaskOpen.value = true
}

const createBoard = () => {
  const title = newBoardTitle.value.trim() || 'Без названия'
  board.addBoard(title)
  addTaskOpen.value = false
}

const onSwitchBoard = (id: string) => {
  router.push({ name: 'board', params: { id } })
}
</script>

<style scoped>
.header {
  padding: var(--space-l);
  border-bottom: 2px solid #ecbb9a;
  width: 90%;
  margin: 0 auto;
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
  position: relative;
}

.boards-list li:hover:not(:last-child) {
  opacity: 0.5;
}

.boards-list li:last-child {
  height: auto;
  min-width: 40px;
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
}

.boards-list li:last-child::before {
  content: '+';
}

.boards-list li:last-child:hover::before {
  content: 'Создать доску';
}
</style>
