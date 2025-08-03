import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IColumn } from '@/types'

export const useBoardStore = defineStore('board', () => {
  const columns = ref<IColumn[]>([
    {
      id: 'ca5fdb63-c100-4a59-9e94-78c37ed5c67b',
      title: 'что сделать?',
      tasks: [],
    },
    {
      id: '48b490b3-af82-4f9f-a083-9d06b0313918',
      title: 'что в процессе?',
      tasks: [],
    },
    {
      id: 'e083be12-9351-43fb-b694-a52b93e0a49b',
      title: 'что сделано?',
      tasks: [],
    },
  ])

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
