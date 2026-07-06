import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

/**
 * ═══════════════════════════════════════════════════════════
 * AUFGABE 1.3d — Settings-Tabelle (Sebastians Use Case!)
 * ═══════════════════════════════════════════════════════════
 *
 * Key-Value-Store für Konfigurationsdaten, die bisher über
 * das C#-BFF verwaltet wurden.
 *
 * | Spalte      | Typ       | Constraints              |
 * |-------------|-----------|--------------------------|
 * | key         | text      | Primary Key              |
 * | value       | text      | NOT NULL                 |
 * | description | text      | (optional)               |
 * | updatedAt   | timestamp | NOT NULL, DEFAULT now()  |
 *
 * Denkaufgabe: Warum value als text und nicht als jsonb
 * oder typisierte Spalten? Welche Trade-offs gibt es?
 */

export const settings = pgTable('settings', {
  // TODO: Spalten definieren
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  description: text('description'),
  updatedAt: timestamp('updatedAt').notNull().defaultNow()
})

export type Setting = typeof settings.$inferSelect
export type NewSetting = typeof settings.$inferInsert
