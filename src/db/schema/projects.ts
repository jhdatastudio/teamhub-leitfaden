import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './users'

/**
 * ═══════════════════════════════════════════════════════════
 * AUFGABE 1.3b — Projects-Tabelle
 * ═══════════════════════════════════════════════════════════
 *
 * | Spalte      | Typ       | Constraints                              |
 * |-------------|-----------|-------------------------------------------|
 * | id          | uuid      | Primary Key, DEFAULT random               |
 * | name        | text      | NOT NULL                                  |
 * | description | text      | (optional)                                |
 * | ownerId     | text      | FK → users.id, ON DELETE CASCADE          |
 * | createdAt   | timestamp | NOT NULL, DEFAULT now()                   |
 * | updatedAt   | timestamp | NOT NULL, DEFAULT now()                   |
 *
 * Denkaufgabe (im Plenum besprechen):
 *  - Warum uuid statt fortlaufender Integer?
 * 
 *      UUID statt Integer: verhindert, dass jemand einfach IDs 
 *      hochzählt und erratbare URLs wie /projects/1, /projects/2 durchprobiert 
 *      sicherheitsrelevant, sobald IDs in URLs auftauchen.
 *  - Was bewirkt onDelete: 'cascade' genau — und wann wäre
 *    'set null' die bessere Wahl?
 * 
 *      onDelete: 'cascade' heißt: wird der User gelöscht, werden alle 
 *      seine Projekte automatisch mitgelöscht. 'set null' wäre besser, 
 *      wenn die Projekte auch ohne Owner weiterexistieren sollen 
 *      (z.B. bei einem Team-Tool, wo das Projekt bleibt, auch wenn der 
 *      Ersteller die Firma verlässt).
 *
 * Foreign-Key-Syntax:
 *   spalte: text('spalte').references(() => andereTabelle.id, { onDelete: '...' })
 */

export const projects = pgTable('projects', {
  // TODO: alle Spalten laut Tabelle definieren
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  ownerId: text('ownerId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow()
})

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
