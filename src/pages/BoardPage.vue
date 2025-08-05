<template>
  <draggable
    v-model="board.columns"
    :group="'columns'"
    item-key="id"
    :animation="500"
    class="board"
  >
    <template #item="{ element: col }">
      <div class="column">
        <h2>
          {{ col.title }}
          <UiButton danger @click="onRemoveColumn(col.id)">✖</UiButton>
        </h2>

        <draggable v-model="col.tasks" item-key="id" :group="'tasks'" :animation="200" class="list">
          <template #item="{ element: task }">
            <li>{{ task.title }}</li>
          </template>
        </draggable>
        <UiButton @click="onAddTask(col.id)">Добавить задачу</UiButton>
      </div>
    </template>
  </draggable>
  <button @click="onAddColumn">Добавить колонку</button>

  <UiModal
    v-if="modalOpen"
    @confirm="onConfirmRemoveColumn"
    @cancel="modalOpen = false"
    @close="modalOpen = false"
  >
    <template #title>
      <h2>Удалить колонку?</h2>
    </template>
    <p>Ты уверен, что хочешь удалить эту колонку?</p>
  </UiModal>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { useBoardStore } from '@/stores/board'
import UiButton from '@/components/ui/UiButton.vue'
import UiModal from '@/components/ui/UiModal.vue'
import { ref } from 'vue'

const modalOpen = ref(false)
const columnToRemove = ref<string | null>(null)

const board = useBoardStore()

const onAddColumn = () => {
  board.addColumn(prompt('Название колонки?') || 'Без названия')
}

const onAddTask = (columnId: string) => {
  board.addTask(columnId, prompt('Название задачи?') || 'Без названия')
}

const onRemoveColumn = (id: string) => {
  columnToRemove.value = id
  modalOpen.value = true
}
const onConfirmRemoveColumn = () => {
  if (columnToRemove.value) {
    board.removeColumn(columnToRemove.value)
    columnToRemove.value = null
  }
  modalOpen.value = false
}
</script>

<style scoped>
.board {
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.column {
  background: #f4f4f4;
  padding: 1rem;
  width: 250px;
  border-radius: 0.5rem;
  cursor: grab;
}

.list {
  list-style: none;
}
</style>
