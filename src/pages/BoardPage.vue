<template>
  <draggable
    v-model="board.columns"
    :group="'columns'"
    item-key="id"
    :animation="400"
    class="board"
  >
    <template #item="{ element: col }">
      <ColumnItem
        :key="col.id"
        :column="col"
        @rename="onChangeColumnName"
        @remove="onRemoveColumn"
        @add-task="onAddTask"
      />
    </template>
  </draggable>
  <button @click="onAddColumn">Добавить колонку</button>

  <UiModal
    v-if="modalOpen"
    confirmText="Удалить"
    cancelText="Отмена"
    confirmVariant="danger"
    :showConfirm="true"
    @confirm="onConfirmRemoveColumn"
    @cancel="modalOpen = false"
    @close="modalOpen = false"
  >
    <template #title><h2>Удалить колонку?</h2></template>
    <p>Ты уверен, что хочешь удалить эту колонку?</p>
  </UiModal>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { useBoardStore } from '@/stores/board'

import { onMounted, ref } from 'vue'
import { UiModal } from '@/components/ui'
import { ColumnItem } from '@/components/widgets'
const modalOpen = ref(false)
const columnToRemove = ref<string | null>(null)
const activeDropdown = ref<string | null>(null)

const board = useBoardStore()

onMounted(() => {
  board.loadBoard()
})

const onAddColumn = () => {
  const title = prompt('Название колонки?')
  if (title !== null) {
    board.addColumn(title || 'Без названия')
  }
}

const onAddTask = ({ id, title }: { id: string; title: string }) => {
  board.addTask(id, title)
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

const onChangeColumnName = (id: string) => {
  const title = prompt('Новое название?')
  if (title) board.renameColumn(id, title)
  activeDropdown.value = null
}
</script>

<style scoped>
.board {
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-m);
  margin-top: var(--space-l);
}
</style>
