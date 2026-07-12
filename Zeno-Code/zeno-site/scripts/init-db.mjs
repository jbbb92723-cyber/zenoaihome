import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const { Client } = pg

const client = new Client({
  connectionString: 'postgresql://postgres.mvpbqkdqsziwxrkhgvzq:OVH4CTd55LOnxnwd@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000,
  statement_timeout: 30000,
})

async function run() {
  try {
    await client.connect()
    console.log('Connected.')

    const sql = fs.readFileSync(path.join(__dirname, '..', 'prisma', 'full-schema.sql'), 'utf8')

    // Split into individual statements by semicolons, preserving multi-line statements
    const statements = []
    let current = ''
    for (const line of sql.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('--')) continue
      current += line + '\n'
      if (trimmed.endsWith(';')) {
        statements.push(current.trim())
        current = ''
      }
    }
    if (current.trim()) statements.push(current.trim())

    console.log(`Statements to execute: ${statements.length}`)

    let ok = 0
    let skip = 0
    let errs = 0
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i]
      try {
        await client.query(stmt)
        ok++
        if (ok % 10 === 0) process.stdout.write('.')
      } catch (err) {
        if (err.code === '42P07' || err.code === '42710' || err.code === '42P16') {
          skip++ // Already exists, fine
        } else {
          process.stdout.write(`\n  [${i}] ${err.code}: ${err.message.slice(0, 100)}`)
          errs++
        }
      }
    }

    // Verify
    const result = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    )

    console.log(`\n\nOK: ${ok}, Skipped: ${skip}, Errors: ${errs}`)
    console.log(`Tables: ${result.rows.length}`)
    for (const row of result.rows) {
      console.log(`  ${row.table_name}`)
    }

    await client.end()
    console.log('\nDone.')
  } catch (err) {
    console.error('Fatal:', err.message)
    process.exit(1)
  }
}

run()
