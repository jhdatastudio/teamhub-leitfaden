import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

/**
 * ═══════════════════════════════════════════════════════════
 * AUFGABE 1.3a — Users-Tabelle (Teil von 45 Min für alle Schemas)
 * ═══════════════════════════════════════════════════════════
 *
 * Definiere die users-Tabelle mit folgenden Spalten:
 *
 * | Spalte    | Typ       | Constraints                        |
 * |-----------|-----------|-------------------------------------|
 * | id        | text      | Primary Key                         |
 * | name      | text      | NOT NULL                            |
 * | email     | text      | NOT NULL, UNIQUE                    |
 * | password  | text      | NOT NULL  (⚠️ nur Seminar!)         |
 * | role      | roleEnum  | NOT NULL, DEFAULT 'member'          |
 * | createdAt | timestamp | NOT NULL, DEFAULT now()             |
 *
 * Drizzle-Doku: https://orm.drizzle.team/docs/column-types/pg
 *
 * Python/SQLAlchemy-Analogie:
 *   class User(Base):
 *       __tablename__ = 'users'
 *       id = Column(String, primary_key=True)
 *       name = Column(String, nullable=False)
 * 
 * 
 * ⚠️ nur Seminar!
 * "Wir speichern hier Passwörter im Klartext (text), 
 * das ist in echten Projekten ein No-Go (man würde hashen, 
 * z.B. mit bcrypt), aber fürs Seminar vereinfachen wir das bewusst." 
 * Also einfach eine Sicherheitsnotiz, keine Constraint.
 */

export const roleEnum = pgEnum('role', ['admin', 'member'])

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  // TODO: restliche Spalten laut Tabelle oben ergänzen
  name: text('name').notNull(), 
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: roleEnum('role').notNull().default('member'),
  createdAt: timestamp('createdAt').notNull().defaultNow()

})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
