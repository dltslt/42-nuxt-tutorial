import type { H3Event } from 'h3'

// The same columns the board prints, for one row, so a create or a move can be followed like a word on a card.
export function readTask(event: H3Event, id: string) {
  return query(event, 'tasks')`
    SELECT
      tasks.id,
      tasks.title,
      tasks.level,
      tasks.state,
      tasks.column_id,
      leads.name AS lead,
      parents.title AS parent_title
    FROM tasks
    LEFT JOIN actors AS leads ON leads.id = tasks.lead
    LEFT JOIN tasks AS parents ON parents.id = tasks.parent_id
    WHERE tasks.id = ${id}
  `
}
