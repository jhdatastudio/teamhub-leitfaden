import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

/**
 * ═══════════════════════════════════════════════════════════
 * AUFGABE 1.3c — Tasks-Tabelle
 * ═══════════════════════════════════════════════════════════
 *
 * 1) Definiere zuerst ein Status-Enum:
 *    statusEnum mit den Werten 'todo' | 'in_progress' | 'done'
 *
 * 2) Definiere die tasks-Tabelle:
 *
 * | Spalte      | Typ        | Constraints                     |
 * |-------------|------------|---------------------------------|
 * | id          | uuid       | Primary Key, DEFAULT random     |
 * | title       | text       | NOT NULL                        |
 * | description | text       | (optional)                      |
 * | status      | statusEnum | NOT NULL, DEFAULT 'todo'        |
 * | projectId   | uuid       | NOT NULL                        |
 * | assigneeId  | text       | (optional)                      |
 * | createdAt   | timestamp  | NOT NULL, DEFAULT now()         |
 */

// TODO 1) statusEnum definieren
export const statusEnum = pgEnum('status', ['todo', 'in_progress', 'done'])

// TODO 2) tasks-Tabelle definieren
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  // TODO: restliche Spalten
  title: text('title').notNull(),
  description: text('description'),
  status: statusEnum('status').notNull().default('todo'),
  projectId: uuid('projectId').notNull(),
  assigneeId: text('assigneeId'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert

//**
// Was ist bei status das Prinzip, das wir schon bei role in users.ts 
// gesehen haben? (Also: warum ruft man statusEnum('status') wie eine 
// Funktion auf, statt text('status') zu schreiben?)
// -------
// Das Prinzip ist, dass pgEnum(...) selbst eine Factory-Funktion 
// zurückgibt — wenn du export const statusEnum = pgEnum('status', [...]) 
// schreibst, ist statusEnum danach eine Funktion, die du genau wie text() 
// oder uuid() aufrufen kannst, um eine Spalte zu erzeugen. 
// Der Unterschied ist nur: die möglichen Werte sind auf die 
// Enum-Liste beschränkt, statt beliebiger Text. TypeScript kennt 
// dadurch sogar den exakten Typ 'todo' | 'in_progress' | 'done' für diese 
// Spalte 
//  */