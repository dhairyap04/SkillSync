import { resolve } from 'node:path'
import { createApp } from './app.js'
import { openDatabase } from './db.js'

const port = Number(process.env.PORT ?? 3001)
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT')
const production = process.env.NODE_ENV === 'production'
const origin = process.env.APP_ORIGIN ?? 'http://localhost:5173'
if (production && !origin.startsWith('https://')) throw new Error('APP_ORIGIN must use HTTPS in production')
const db = openDatabase(resolve(process.env.DATABASE_PATH ?? 'data/skillsync.sqlite'))
const app = createApp(db, { origin, secure: production })
const server = app.listen(port, process.env.HOST ?? '127.0.0.1', () => console.log(`SkillSync API listening on port ${port}`))
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => server.close(() => { db.close(); process.exit(0) }))
