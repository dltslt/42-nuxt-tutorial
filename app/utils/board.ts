export type BoardTask = {
  id: string
  title: string
  level: string
  state: string
  column_id: string
  lead: string | null
  parent_title: string | null
}

export type BoardColumn = {
  id: string
  title: string
  state: string
  tasks: BoardTask[]
}

export type Board = {
  columns: BoardColumn[]
  blockers: Array<{
    id: string
    severity: string
    blocker_title: string
    blocked_title: string
  }>
}

export function placeTask(board: Board, task: BoardTask) {
  for (const column of board.columns) {
    const index = column.tasks.findIndex(item => item.id === task.id)
    if (index !== -1) column.tasks.splice(index, 1)
  }
  board.columns.find(column => column.id === task.column_id)?.tasks.push(task)
}
