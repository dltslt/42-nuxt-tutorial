// A Nitro plugin runs once when the server starts, before it answers requests.
export default defineNitroPlugin(async () => {
  const db = useDatabase()

  await db.sql`CREATE TABLE IF NOT EXISTS actors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    password_hash TEXT
  )`
  // A database created before this column existed keeps its old shape.
  const info = await db.sql`PRAGMA table_info(actors)`
  const columns = (info.rows ?? []).map(row => String(row.name))
  if (!columns.includes('password_hash')) {
    // Two requests can pass the check together on the first boot. The second alter is a no-op.
    try {
      await db.sql`ALTER TABLE actors ADD COLUMN password_hash TEXT`
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause)
      if (!message.includes('duplicate column name')) throw cause
    }
  }
  await db.sql`CREATE TABLE IF NOT EXISTS columns (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    state TEXT NOT NULL,
    position INTEGER NOT NULL
  )`
  await db.sql`CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    level TEXT NOT NULL,
    column_id TEXT NOT NULL,
    state TEXT NOT NULL,
    lead TEXT,
    parent_id TEXT
  )`
  await db.sql`CREATE TABLE IF NOT EXISTS blockers (
    id TEXT PRIMARY KEY,
    blocker_item_id TEXT NOT NULL,
    blocked_item_id TEXT NOT NULL,
    severity TEXT NOT NULL
  )`

  const { rows } = await db.sql`SELECT COUNT(*) AS n FROM tasks`
  const count = Number(rows?.[0]?.n ?? 0)
  if (count === 0) {
    await db.sql`INSERT INTO actors (id, name) VALUES ('ada', 'Ada')`
    await db.sql`INSERT INTO actors (id, name) VALUES ('lin', 'Lin')`
  }

  // The chapter prints these passwords. The table stores a hash, and only when one is missing.
  const passwords: Record<string, string> = { ada: 'bread', lin: 'knife' }
  const stored = await db.sql`SELECT id, password_hash FROM actors`
  for (const row of stored.rows ?? []) {
    const id = String(row.id)
    const plain = passwords[id]
    if (!plain || row.password_hash) continue
    const hash = await hashPassword(plain)
    await db.sql`UPDATE actors SET password_hash = ${hash} WHERE id = ${id}`
  }

  if (count > 0) return

  await db.sql`INSERT INTO columns (id, title, state, position) VALUES ('col_backlog', 'backlog', 'unstarted', 1)`
  await db.sql`INSERT INTO columns (id, title, state, position) VALUES ('col_progress', 'in progress', 'started', 2)`
  await db.sql`INSERT INTO columns (id, title, state, position) VALUES ('col_done', 'done', 'done', 3)`

  await db.sql`INSERT INTO tasks (id, title, level, column_id, state, lead, parent_id) VALUES ('dinner', 'Dinner', 'project', 'col_backlog', 'unstarted', 'ada', NULL)`
  await db.sql`INSERT INTO tasks (id, title, level, column_id, state, lead, parent_id) VALUES ('cut_bread', 'cut the bread', 'task', 'col_backlog', 'unstarted', 'ada', 'dinner')`
  await db.sql`INSERT INTO tasks (id, title, level, column_id, state, lead, parent_id) VALUES ('buy_cutlery', 'Buy cutlery', 'project', 'col_backlog', 'unstarted', 'lin', NULL)`
  await db.sql`INSERT INTO tasks (id, title, level, column_id, state, lead, parent_id) VALUES ('bread_knife', 'bread knife', 'task', 'col_backlog', 'unstarted', 'lin', 'buy_cutlery')`

  await db.sql`INSERT INTO blockers (id, blocker_item_id, blocked_item_id, severity) VALUES ('blk_knife', 'bread_knife', 'cut_bread', 'cannot do anything')`
})
