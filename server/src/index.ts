#!/usr/bin/env node

import pgPromise, { QueryFile } from 'pg-promise'
import fs from 'fs'
import path from 'path'

let logEnable = false
const log = (s: any) => logEnable ?
  console.log(`${(new Date()).toLocaleString('ja-JP')} ${s}`) : null;

const pgp = pgPromise({query: (e) => log(`SQL: ${e.query}`)})

const db = pgp({
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

const MigrationsDirectory = path.join(__dirname, "../migrations/")


const makeMigrationsDirectoryUnlessExists = () => {
  if (!fs.existsSync(MigrationsDirectory)) {
    fs.mkdirSync(MigrationsDirectory, { recursive: true })
  }
}

const migrationFiles = () => {
  let migrations = fs.readdirSync(MigrationsDirectory)
  migrations.sort()
  return migrations
}

const makeMigrationsTableUnlessExists = async () => {
  logEnable = false
  await db.none(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT current_timestamp
  )`)
  logEnable = true
}

const maximumVersionFromTable = async ():Promise<string|null> => {
  logEnable = false
  const result = await db.one('SELECT MAX(version) FROM schema_migrations')
  logEnable = true
  return result.max
}

const insertVersionIntoTable = async (version: string) => {
  await db.none(`INSERT INTO schema_migrations(version) VALUES($1)`, version)
}

const readMigrationFile = (migration: string): QueryFile => {
  const sqlPath = MigrationsDirectory + migration
  console.log(`======= excute : ${sqlPath}`)
  return new QueryFile(sqlPath)
}

const executeMigrations = async () => {
  let migrations = migrationFiles()
  const version = await maximumVersionFromTable()
  if (version) {
    const ix = migrations.findIndex(v => v == version)
    if (ix < 0) {
      console.log(`*** schema_migrations corrupted: $(version), $(migrations)`)
      return
    }
    migrations = migrations.slice(ix + 1)
  }

  try {
    for(let m of migrations) {
      await db.none(readMigrationFile(m))
      await insertVersionIntoTable(m)
    }
  } catch (err) {
    console.error(err)
    return
  }
}

const createMigartionFile = (comment: string|null = null) => {
  const ts = (new Date()).toLocaleString('ja-JP')  // 2021/11/25 14:28:39

  const migartionPath = MigrationsDirectory +
    ts.replace(/[\/ :]/g, '') +
    (comment === null ? '' : '_' + comment) + '.sql'

  fs.closeSync(fs.openSync(migartionPath, 'wx'))
}

makeMigrationsDirectoryUnlessExists()
makeMigrationsTableUnlessExists()

if (process.argv.length == 3 && process.argv[2] == "up") {
  executeMigrations()
} else if (process.argv.length >= 3 && process.argv[2] == "create") {
  createMigartionFile(process.argv[3])
} else {
  console.log("Usage: migrate.js create [<commnet>]| up")
}