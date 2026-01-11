import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('quotations migration', () => {
  it('contains quotations table creation', () => {
    const file = path.resolve(__dirname, '../../../../apps/v4/db/migrations/001_create_quotations.sql')
    const sql = fs.readFileSync(file, 'utf8')
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS quotations')
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS quotation_items')
  })
})
