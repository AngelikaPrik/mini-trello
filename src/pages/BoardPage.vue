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
          <button @click="onRemoveColumn(col.id)">✖</button>
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
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { useBoardStore } from '@/stores/board'
import UiButton from '@/components/ui/UiButton.vue'

const board = useBoardStore()

const onAddColumn = () => {
  board.addColumn(prompt('Название колонки?') || 'Без названия')
}

const onAddTask = (columnId: string) => {
  board.addTask(columnId, prompt('Название задачи?') || 'Без названия')
}

const onRemoveColumn = (id: string) => {
  if (confirm('Удалить колонку?')) {
    board.removeColumn(id)
  }
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
