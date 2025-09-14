<template>
  <div class="sidebar">
    <ul v-if="user" class="boards-list">
      <li
        v-for="b in board.boards"
        :class="{ active: b.id === board.activeBoard }"
        :key="b.id"
        @click="() => onSwitchBoard(b.id)"
      >
        {{ b.title }}

        <div class="edit" @click.stop="onDeleteBoard(b.id)">
          <svg
            width="16"
            height="18"
            viewBox="0 0 16 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 18C2.45 18 1.97933 17.8043 1.588 17.413C1.19667 17.0217 1.00067 16.5507 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.8043 17.021 14.413 17.413C14.0217 17.805 13.5507 18.0007 13 18H3ZM5 14H7V5H5V14ZM9 14H11V5H9V14Z"
              fill="black"
            />
          </svg>
        </div>
      </li>
      <li @click="onAddBoard"></li>
    </ul>
  </div>
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
import { useBoardStore } from '@/stores/board'
import type { User } from '@supabase/supabase-js'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { UiInput, UiModal } from '../ui'

const router = useRouter()
const route = useRoute()

const addTaskOpen = ref(false)
const newBoardTitle = ref('')

defineProps<{ user: User | null }>()

const board = useBoardStore()

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

const onDeleteBoard = async (id: string) => {
  await board.removeBoard(id)
  if (route.params.id === id) {
    router.push('/')
  }
}
</script>

<style scoped>
.sidebar {
  background: var(--color-bg);
  min-width: 280px;
  max-width: 280px;
  height: 80vh;
  border-radius: var(--radius-l);
  box-shadow: rgba(99, 99, 99, 0.05) 0px 2px 8px 0px;
  overflow: hidden;
  padding: var(--space-m);
}

.boards-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-s);
}

.boards-list li {
  padding: var(--space-s) var(--space-m);
  border-radius: var(--space-s);
  background: #ffffff;
  cursor: pointer;
  position: relative;
  transition: all 0.3s linear;
}

.edit {
  opacity: 0;
  position: absolute;
  width: 30px;
  height: 100%;
  top: 0;
  right: 0;
  transition: opacity 0.3s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
}

.edit svg path {
  fill: rgba(0, 0, 0, 0.534);
}

.edit:hover svg path {
  fill: rgb(0, 0, 0);
}

.boards-list li.active {
  font-weight: 600;
}

.boards-list li:hover:not(:last-child) {
  background: #ffffff1e;
}

.boards-list li:hover:not(:last-child) .edit {
  opacity: 1;
}

.boards-list li:last-child {
  position: relative;
  min-width: 40px;
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.boards-list li:last-child::before {
  content: '+';
  position: absolute;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.boards-list li:last-child::after {
  content: 'Создать доску';
  position: absolute;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.boards-list li:last-child:hover::before {
  opacity: 0;
}

.boards-list li:last-child:hover::after {
  opacity: 1;
}
</style>
