import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { RunEntry, Stats } from './types'

let db: Database.Database

export function initDb() {
  const dbPath = join(app.getPath('userData'), 'hits.db')
  console.log(`[db] Opening database: ${dbPath}`)

  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS hits (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id       TEXT    NOT NULL,
      game          TEXT    NOT NULL,
      run           TEXT    NOT NULL,
      split         TEXT    NOT NULL,
      split_hits    INTEGER NOT NULL DEFAULT 0,
      total_hits    INTEGER NOT NULL DEFAULT 0,
      timestamp     TEXT    NOT NULL,
      attempt_count INTEGER NOT NULL DEFAULT 0,
      split_pb      INTEGER NOT NULL DEFAULT 0,
      total_pb      INTEGER NOT NULL DEFAULT 0,
      igt_ms        INTEGER NOT NULL DEFAULT 0,
      received_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_hits_received_at ON hits(received_at DESC);
    CREATE INDEX IF NOT EXISTS idx_hits_user_game   ON hits(user_id, game);
    CREATE INDEX IF NOT EXISTS idx_hits_game        ON hits(game);
  `)

  console.log('[db] Database initialized')
}

export function insertEntry(payload: Omit<RunEntry, 'id' | 'received_at'>): RunEntry {
  const stmt = db.prepare(`
    INSERT INTO hits
      (user_id, game, run, split, split_hits, total_hits, timestamp,
       attempt_count, split_pb, total_pb, igt_ms)
    VALUES
      (@user_id, @game, @run, @split, @split_hits, @total_hits, @timestamp,
       @attempt_count, @split_pb, @total_pb, @igt_ms)
  `)
  const result = stmt.run(payload)
  return getEntryById(result.lastInsertRowid as number)!
}

export function getEntryById(id: number): RunEntry | undefined {
  return db.prepare('SELECT * FROM hits WHERE id = ?').get(id) as RunEntry | undefined
}

export function getRecentEntries(limit = 50): RunEntry[] {
  return db
    .prepare('SELECT * FROM hits ORDER BY timestamp DESC LIMIT ?')
    .all(limit) as RunEntry[]
}

export function getStats(): Stats {
  const total        = (db.prepare('SELECT COUNT(*) as c FROM hits').get() as { c: number }).c
  const today        = (db.prepare(`SELECT COUNT(*) as c FROM hits WHERE date(timestamp) = date('now')`).get() as { c: number }).c
  const unique_users = (db.prepare('SELECT COUNT(DISTINCT user_id) as c FROM hits').get() as { c: number }).c
  const unique_games = (db.prepare('SELECT COUNT(DISTINCT game) as c FROM hits').get() as { c: number }).c
  const last         = db.prepare('SELECT timestamp FROM hits ORDER BY timestamp DESC LIMIT 1').get() as { timestamp: string } | undefined

  return { total, today, unique_users, unique_games, lastReceived: last?.timestamp ?? null }
}