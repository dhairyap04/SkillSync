import { randomBytes, scrypt, timingSafeEqual, createHash } from 'node:crypto'
import { promisify } from 'node:util'

const deriveKey = promisify(scrypt)
export const tokenHash = (token: string) => createHash('sha256').update(token).digest('hex')
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const key = await deriveKey(password, salt, 64) as Buffer
  return `${salt}:${key.toString('hex')}`
}
export async function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(':')
  const actual = await deriveKey(password, salt, 64) as Buffer
  return timingSafeEqual(actual, Buffer.from(hash, 'hex'))
}
