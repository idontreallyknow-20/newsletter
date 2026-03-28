import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from './schema'

type DB = NeonHttpDatabase<typeof schema>

let _db: DB | undefined

function getDb(): DB {
  if (!_db) {
    _db = drizzle(neon(process.env.DATABASE_URL!), { schema })
  }
  return _db
}

export const db = new Proxy({} as DB, {
  get(_target, prop: string | symbol) {
    return getDb()[prop as keyof DB]
  },
})
