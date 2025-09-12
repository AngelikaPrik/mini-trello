export interface IBoard {
  id: string
  title: string
}
export interface IColumn {
  id: string
  title: string
  tasks: ITask[]
  order: number
}

export interface ITask {
  id: string
  title: string
  description?: string
  order: number
  columnId: string
  tag?: string
}
