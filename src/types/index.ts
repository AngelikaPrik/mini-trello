export interface ITask {
  id: string
  title: string
  description?: string
  order: number
}

export interface IColumn {
  id: string
  title: string
  tasks: ITask[]
  order: number
}
