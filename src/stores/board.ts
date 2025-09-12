import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IBoard, IColumn } from '@/types'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useBoardStore = defineStore('board', () => {
  const user = ref<User | null>()
  const boardId = ref<string | null>(null)
  const boards = ref<IBoard[]>([])
  const columns = ref<IColumn[]>([])

  const loadBoards = async () => {
    const res = await supabase.auth.getUser()
    user.value = res.data.user
    if (!user.value) {
      boards.value = []
      return
    }

    const { data, error } = await supabase
      .from('boards')
      .select('id, title, created_at')
      .eq('owner_id', user.value.id)
      .order('created_at', { ascending: true })

    if (error) throw error
    boards.value = data ?? []

    await setBoard(boards.value[0].id)
  }

  const setBoard = async (id: string) => {
    boardId.value = id
    await loadBoard()
  }

  const loadBoard = async () => {
    if (!boardId.value) return

    const { data: cols, error: colError } = await supabase
      .from('columns')
      .select('id, title, order')
      .eq('board_id', boardId.value)
      .order('order', { ascending: true })
    if (colError) throw colError

    const { data: tasks, error: taskError } = await supabase
      .from('tasks')
      .select('id, title, column_id, order, tag')
      .in('column_id', cols?.map((c) => c.id) ?? [])
      .order('order', { ascending: true })
    if (taskError) throw taskError

    columns.value = (cols ?? []).map((col) => ({
      id: col.id,
      title: col.title,
      order: col.order,
      tasks: (tasks ?? [])
        .filter((t) => t.column_id === col.id)
        .map((t) => ({
          id: t.id,
          title: t.title,
          order: t.order,
          columnId: t.column_id,
          tag: t.tag,
        })),
    }))
  }

  const addBoard = async (title: string) => {
    if (!user.value) return

    const { data, error } = await supabase
      .from('boards')
      .insert({ owner_id: user.value.id, title })
      .select('id, title')
      .single()
    if (error) throw error

    boards.value.push(data)
    return data.id
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
      .select('id, title, column_id, order')
      .single()
    if (error) throw error

    column.tasks.push({
      id: data.id,
      title: data.title,
      order: data.order,
      columnId: column_id,
    })
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

  const changeColumnsOrder = async () => {
    if (!boardId.value) return

    const payload = columns.value.map((col, index) => ({
      id: col.id,
      board_id: boardId.value,
      order: index,
      title: col.title,
    }))

    const { error } = await supabase
      .from('columns')
      .upsert(payload, { onConflict: 'id', ignoreDuplicates: false })
    if (error) {
      console.error(error)
      await Promise.all(
        columns.value.map((col, i) =>
          supabase.from('columns').update({ order: i }).eq('id', col.id),
        ),
      )
    }

    columns.value.forEach((c, i) => (c.order = i))
  }

  const changeTasksOrder = async () => {
    await Promise.all(
      columns.value.flatMap((col) =>
        col.tasks.map((task, index) =>
          supabase.from('tasks').update({ order: index, column_id: col.id }).eq('id', task.id),
        ),
      ),
    )

    columns.value.forEach((col) => {
      col.tasks.forEach((task, i) => {
        task.order = i
        task.columnId = col.id
      })
    })
  }

  return {
    boards,
    columns,
    loadBoards,
    setBoard,
    loadBoard,
    addBoard,
    addColumn,
    addTask,
    renameColumn,
    removeColumn,
    changeColumnsOrder,
    changeTasksOrder,
  }
})
