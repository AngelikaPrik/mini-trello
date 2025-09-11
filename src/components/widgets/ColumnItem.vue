<template>
  <div>
    <div class="column" @mouseenter="hovered = true" @mouseleave="hovered = false">
      <div>
        <div
          v-if="hovered"
          class="column-menu"
          @mouseenter="dropdownVisible = true"
          @mouseleave="dropdownVisible = false"
        >
          <button class="dots" @click.stop="toggleDropdown">⋮</button>
          <div v-if="dropdownVisible" class="dropdown">
            <button @click="emit('rename', column.id)">Переименовать</button>
            <button @click="emit('color', column.id)">Сменить цвет</button>
            <button @click="emit('remove', column.id)">Удалить</button>
          </div>
        </div>

        <h2 class="title">{{ column.title }}</h2>

        <draggable
          v-model="column.tasks"
          :group="{ name: 'tasks', pull: true, put: true }"
          class="list"
          :animation="400"
          item-key="id"
          @end="emit('reorder-tasks')"
        >
          <template #item="{ element: task }">
            <li class="task">{{ task.title }}</li>
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

const props = defineProps<{ column: IColumn }>()

const emit = defineEmits<{
  (e: 'add-task', payload: { columnId: string; title: string }): void
  (e: 'rename', id: string): void
  (e: 'remove', id: string): void
  (e: 'color', id: string): void
  (e: 'reorder-tasks'): void
}>()

const hovered = ref(false)
const dropdownVisible = ref(false)
const addTaskOpen = ref(false)
const newTaskTitle = ref('')

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value
}

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
  padding: 1rem;
  width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  row-gap: var(--space-l);
}

.column-menu {
  position: relative;
}

.dots {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
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
  border: 1px solid #ccc;
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

.dropdown button:hover {
  background: rgba(0, 0, 0, 0.05);
}

.list {
  list-style: none;
  padding: var(--space-m) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-s);
}

.task {
  padding: var(--space-s) var(--space-m);
  border-radius: var(--radius-m);
  background: #fff;
}
</style>
