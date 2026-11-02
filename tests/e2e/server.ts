// A fresh in-memory API for browser tests; never opens the development database.
import { createApp } from '../../server/app.js'
import { openDatabase } from '../../server/db.js'
const db = openDatabase(':memory:')
const server = createApp(db, { origin: 'http://127.0.0.1:5175' }).listen(3101, '127.0.0.1')
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => server.close(() => { db.close(); process.exit(0) }))
