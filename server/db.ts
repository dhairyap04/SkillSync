import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

export function openDatabase(filename: string) {
  if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true })
  const db = new DatabaseSync(filename)
  db.exec('PRAGMA foreign_keys = ON')
  db.exec('PRAGMA journal_mode = WAL')
  db.exec('PRAGMA busy_timeout = 5000')
  const version = Number(db.prepare('PRAGMA user_version').get()!.user_version)
  if (version > 2) { db.close(); throw new Error('Database schema is newer than this server supports') }
  db.exec(`
    BEGIN;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL,
      profile TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS mentor_profiles (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, data TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS records (
      id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      kind TEXT NOT NULL CHECK(kind IN ('skills', 'goals')), data TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS records_owner ON records(owner_id, kind);
    CREATE TABLE IF NOT EXISTS mentorships (
      id TEXT PRIMARY KEY, student_id TEXT NOT NULL REFERENCES users(id),
      mentor_id TEXT NOT NULL REFERENCES users(id), status TEXT NOT NULL,
      created_at TEXT NOT NULL, UNIQUE(student_id, mentor_id)
    );
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY, sender_id TEXT NOT NULL REFERENCES users(id),
      receiver_id TEXT NOT NULL REFERENCES users(id), content TEXT NOT NULL, created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS messages_participants ON messages(sender_id, receiver_id, created_at);

    CREATE TABLE IF NOT EXISTS learning_profiles (
      user_id TEXT PRIMARY KEY REFERENCES users(id), data TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS challenges (
      id TEXT PRIMARY KEY, mentorship_id TEXT NOT NULL REFERENCES mentorships(id),
      mentor_id TEXT NOT NULL REFERENCES users(id), student_id TEXT NOT NULL REFERENCES users(id), data TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS challenges_participants ON challenges(mentor_id, student_id);
    CREATE TABLE IF NOT EXISTS passports (
      user_id TEXT PRIMARY KEY REFERENCES users(id), share_token TEXT UNIQUE
    );
    CREATE TABLE IF NOT EXISTS roadmaps (
      id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES users(id), data TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS exchange_offers (
      id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES users(id), data TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS exchange_requests (
      id TEXT PRIMARY KEY, requester_id TEXT NOT NULL REFERENCES users(id),
      recipient_id TEXT NOT NULL REFERENCES users(id), pair_key TEXT NOT NULL UNIQUE, data TEXT NOT NULL
    );
    PRAGMA user_version = 2;
    COMMIT;
  `)
  return db
}
