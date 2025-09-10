import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IColumn } from '@/types'
import { supabase } from '@/lib/supabase'
import type { UserResponse } from '@supabase/supabase-js'

export const useBoardStore = defineStore('board', () => {
  const boardId = ref<string | null>(null)
  const columns = ref<IColumn[]>([])

  const loadBoard = async () => {
    const res: UserResponse = await supabase.auth.getUser()
    const user = res.data.user

    if (!user) {
      columns.value = []
      return
    }

    const { data: boards, error: boardError } = await supabase
      .from('boards')
      .select('id')
      .eq('owner_id', user.id)
      .limit(1)

    if (boardError) throw boardError

    if (!boards || boards.length === 0) {
      const { data: createdBoard, error: createError } = await supabase
        .from('boards')
        .insert({ owner_id: user.id, title: 'Моя доска' })
        .select('id')
        .single()
      if (createError) throw createError
      boardId.value = createdBoard.id
    } else {
      boardId.value = boards[0].id
    }

    const { data: cols, error: colError } = await supabase
      .from('columns')
      .select('id, title, order')
      .eq('board_id', boardId.value)
      .order('order', { ascending: true })
    if (colError) throw colError

    const { data: tasks, error: taskError } = await supabase
      .from('tasks')
      .select('id, title, column_id, order')
      .in('column_id', cols?.map((c) => c.id) ?? [])
      .order('order', { ascending: true })
    if (taskError) throw taskError

    columns.value = (cols ?? []).map((col) => ({
      id: col.id,
      title: col.title,
      tasks: (tasks ?? []).filter((t) => t.column_id === col.id),
      order: col.order,
    }))
  }

  const addColumn = async (title: string) => {
    if (!boardId.value) return

    const order = (columns.value.at(-1)?.order ?? -1) + 1

    const { data, error } = await supabase
      .from('columns')
      .insert({ board_id: boardId.value, title, order })
      .select('id, title')
      .single()
    if (error) throw error

    columns.value.push({ id: data.id, title: data.title, tasks: [], order })
  }

  const addTask = async (column_id: string, taskTitle: string) => {
    const column = columns.value.find((c) => c.id === column_id)
    if (!column) return
    const order = (column.tasks.at(-1)?.order ?? -1) + 1

    const { data, error } = await supabase
      .from('tasks')
      .insert({ column_id, title: taskTitle, order })
      .select('id, title, column_id')
      .single()
    if (error) throw error

    column.tasks.push({ id: data.id, title: data.title, order })
  }

  const renameColumn = async (columnId: string, columnTitle: string) => {
    const { error } = await supabase
      .from('columns')
      .update({ title: columnTitle })
      .eq('id', columnId)
    if (error) throw error

    const col = columns.value.find((c) => c.id === columnId)
    if (col) col.title = columnTitle
  }

  const removeColumn = async (columnId: string) => {
    const { error } = await supabase.from('columns').delete().eq('id', columnId)
    if (error) throw error

    columns.value = columns.value.filter((c) => c.id !== columnId)
  }

  return { columns, loadBoard, addColumn, addTask, renameColumn, removeColumn }
})
