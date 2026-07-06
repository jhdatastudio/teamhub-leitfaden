import { relations } from 'drizzle-orm'
import { users } from './users'
import { projects } from './projects'
import { tasks } from './tasks'

/**
 * ═══════════════════════════════════════════════════════════
 * AUFGABE 1.4 — Relations definieren (ca. 15 Min)
 * ═══════════════════════════════════════════════════════════
 *
 * Drizzle braucht explizite relations()-Definitionen, damit
 * db.query.projects.findMany({ with: { tasks: true } })
 * funktioniert (JOIN-Abfragen).
 *
 * Beziehungen in TeamHub:
 *   users    1 ──── n  projects   (ein User besitzt viele Projekte)
 *   projects 1 ──── n  tasks      (ein Projekt hat viele Tasks)
 *
 * Syntax-Beispiel für eine 1:n-Beziehung:
 *
 *   export const xRelations = relations(x, ({ many }) => ({
 *     ys: many(y),
 *   }))
 *   export const yRelations = relations(y, ({ one }) => ({
 *     x: one(x, { fields: [y.xId], references: [x.id] }),
 *   }))
 */

// TODO: usersRelations (many: projects)
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
}))

// TODO: projectsRelations (one: owner/users, many: tasks)
export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, { fields: [projects.ownerId], references: [users.id] }),
  tasks: many(tasks),
}))
// TODO: tasksRelations (one: project)

export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, { fields: [tasks.projectId], references: [projects.id] }),
}))



//**
//  Kannst du mir kurz erklären, was der Unterschied zwischen der 
// Foreign-Key-Definition in projects.ts (.references(() => users.id, ...)) 
// und der separaten relations.ts-Datei ist? Also: wofür braucht man 
// beides, reicht nicht eins von beiden?
// 
// 
//  die beiden machen tatsächlich zwei völlig unterschiedliche Dinge, 
// auf zwei verschiedenen Ebenen:
// .references() in projects.ts wirkt auf Datenbank-Ebene. 
// Wenn du gleich die Migration ausführst (Aufgabe 1.5), 
// erzeugt Drizzle daraus echtes SQL wie:
// sqlownerId text REFERENCES users(id) ON DELETE CASCADE
// Das ist ein echter Constraint in Postgres selbst — 
// die Datenbank verweigert z.B. das Löschen eines Users, 
// wenn die Cascade-Regel nicht definiert wäre, oder verweigert das 
// Anlegen eines Projekts mit einer ownerId, die keinen echten User 
// referenziert. Das würde auch greifen, wenn du direkt mit psql oder 
// einem anderen Tool auf die DB zugreifst — komplett unabhängig von 
// Drizzle oder JavaScript.
// relations() in relations.ts wirkt nur auf Drizzle-Query-Ebene, 
// rein im JavaScript-Code. Das erzeugt keinerlei SQL, keinen Constraint 
// in der Datenbank. Es sagt nur Drizzles Query-Builder: "wenn jemand 
// db.query.projects.findMany({ with: { tasks: true } }) aufruft, weißt du, 
// wie du das JOIN dafür bauen musst." Ohne relations() müsstest du jeden 
// JOIN manuell mit .leftJoin(...) selbst schreiben.
// Python/SQLAlchemy-Vergleich: .references() entspricht 
// ForeignKey('users.id') in einer Column-Definition — das landet in der 
// DDL, ist ein echter DB-Constraint. relations() entspricht relationship() 
// in SQLAlchemy — das ist reine ORM-Bequemlichkeit für den Python-Code, 
// erzeugt selbst keine SQL-Constraints, nur die Foreign-Key-Spalte 
// darunter tut das.
// Kurz: eine definiert Datenintegrität (DB erzwingt es), 
// die andere definiert Entwickler-Ergonomie (bequemer Code für Joins). 
// Man braucht beide, aber aus unterschiedlichen Gründen — nicht wegen 
// "Trennung" im Sinne von Ordnung, sondern weil sie schlicht 
// unterschiedliche Probleme lösen.
// 
// 
// 
// 
//  */