<template>
  <div>
    <div class="column" @mouseenter="hovered = true" @mouseleave="hovered = false">
      <div>
        <div class="top">
          <h2 class="title">{{ column.title }}</h2>
          <div class="column-menu">
            <button class="dots">
              <svg
                width="18"
                height="4"
                viewBox="0 0 18 4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 2C1 2.26522 1.10536 2.51957 1.29289 2.70711C1.48043 2.89464 1.73478 3 2 3C2.26522 3 2.51957 2.89464 2.70711 2.70711C2.89464 2.51957 3 2.26522 3 2C3 1.73478 2.89464 1.48043 2.70711 1.29289C2.51957 1.10536 2.26522 1 2 1C1.73478 1 1.48043 1.10536 1.29289 1.29289C1.10536 1.48043 1 1.73478 1 2ZM8 2C8 2.26522 8.10536 2.51957 8.29289 2.70711C8.48043 2.89464 8.73478 3 9 3C9.26522 3 9.51957 2.89464 9.70711 2.70711C9.89464 2.51957 10 2.26522 10 2C10 1.73478 9.89464 1.48043 9.70711 1.29289C9.51957 1.10536 9.26522 1 9 1C8.73478 1 8.48043 1.10536 8.29289 1.29289C8.10536 1.48043 8 1.73478 8 2ZM15 2C15 2.26522 15.1054 2.51957 15.2929 2.70711C15.4804 2.89464 15.7348 3 16 3C16.2652 3 16.5196 2.89464 16.7071 2.70711C16.8946 2.51957 17 2.26522 17 2C17 1.73478 16.8946 1.48043 16.7071 1.29289C16.5196 1.10536 16.2652 1 16 1C15.7348 1 15.4804 1.10536 15.2929 1.29289C15.1054 1.48043 15 1.73478 15 2Z"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <div class="dropdown">
              <button @click="emit('rename', column.id)">Переименовать</button>
              <button @click="emit('color', column.id)">Сменить цвет</button>
              <button @click="emit('remove', column.id)">Удалить</button>
            </div>
          </div>
        </div>

        <draggable
          v-model="column.tasks"
          :group="{ name: 'tasks', pull: true, put: true }"
          class="list"
          :animation="400"
          item-key="id"
          @end="emit('reorder-tasks')"
        >
          <template #item="{ element: task }">
            <TaskItem :task="task" />
          </template>
        </draggable>
      </div>
      <UiButton @click="openAddTaskModal">＋</UiButton>
    </div>

    <UiModal
      v-if="addTaskOpen"
      confirmText="Добавить"
      cancelText="Отмена"
      confirmVariant="primary"
      :showConfirm="true"
      @confirm="createTask"
      @cancel="addTaskOpen = false"
      @close="addTaskOpen = false"
    >
      <template #title><h2>Новая задача</h2></template>
      <UiInput v-model="newTaskTitle" placeholder="Название задачи" autofocus />
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { UiButton, UiModal, UiInput } from '@/components/ui'
import type { IColumn } from '@/types'
import { ref } from 'vue'
import TaskItem from './TaskItem.vue'

const props = defineProps<{ column: IColumn }>()

const emit = defineEmits<{
  (e: 'add-task', payload: { columnId: string; title: string }): void
  (e: 'rename', id: string): void
  (e: 'remove', id: string): void
  (e: 'color', id: string): void
  (e: 'reorder-tasks'): void
}>()

const hovered = ref(false)
const addTaskOpen = ref(false)
const newTaskTitle = ref('')

const openAddTaskModal = () => {
  newTaskTitle.value = ''
  addTaskOpen.value = true
}

const createTask = () => {
  const title = newTaskTitle.value.trim() || 'Без названия'
  emit('add-task', { columnId: props.column.id, title })
  addTaskOpen.value = false
}
</script>

<style scoped>
.title {
  text-transform: lowercase;
  font-size: var(--font-size-l);
}

.title::first-letter {
  text-transform: capitalize;
}

.column {
  width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  row-gap: var(--space-s);
}

.column:hover .column-menu {
  display: inline-block;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.column-menu {
  display: none;
  position: relative;
  width: fit-content;
  width: 18px;
  height: 18px;
}

.column-menu .dropdown {
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px 0;
  z-index: 10;
}

/* показываем при наведении */
.column-menu:hover .dropdown {
  display: block;
}

.dots {
  background: none;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--color-bg);
  border-radius: var(--radius-s);

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  z-index: var(--z-index-dropdown, 1000);
}

.dropdown button {
  padding: var(--space-xs) var(--space-s);
}

.list {
  list-style: none;
  padding: var(--space-m) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-s);
}
</style>
