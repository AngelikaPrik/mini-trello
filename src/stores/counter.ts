import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IColumn } from '@/types'

export const useBoardStore = defineStore('board', () => {
  const columns = ref<IColumn[]>([]);

  const addColumn = (title: string) => {
    columns.value.push({
      id: crypto.randomUUID(),
      title,
      tasks: [],
    })
  }

  const addTask = (columnId: string, taskTitle: string) => {
    const currentColumn = columns.value.find(item => item.id === columnId);
    if (currentColumn) {
      currentColumn.tasks.push({ id: crypto.randomUUID(), title: taskTitle });
    }
  }

  return { columns, addColumn, addTask }
})
