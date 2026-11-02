import { createApp } from '../server/app.js'
import { openDatabase } from '../server/db.js'

export async function fixture(filename = ':memory:') {
  const db = openDatabase(filename)
  const server = createApp(db).listen(0, '127.0.0.1')
  await new Promise<void>(resolve => server.once('listening', resolve))
  const address = server.address() as { port: number }
  async function request(path: string, method = 'GET', body?: unknown, cookie = '', headers: Record<string, string> = {}) {
    const response = await fetch(`http://127.0.0.1:${address.port}/api${path}`, {
      method, headers: { 'Content-Type': 'application/json', 'X-SkillSync-Client': 'web', Cookie: cookie, ...headers },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    })
    return { status: response.status, body: await response.json(), cookie: response.headers.get('set-cookie')?.split(';')[0] ?? '', headers: response.headers }
  }
  return { db, request, close: async () => {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
    db.close()
  } }
}
