import Link from 'next/link'
//*1.6a*/
import { db } from '@/db'
import { projects, tasks } from '@/db/schema'
import { count } from 'drizzle-orm'


/**
 * ═══════════════════════════════════════════════════════════
 * AUFGABE 1.6 — Erste Datenbankabfrage (ca. 30 Min)
 * ═══════════════════════════════════════════════════════════
 *
 * Diese Server Component zeigt aktuell hartkodierte Nullen.
 * Deine Aufgabe:
 *
 *  a) Importiere db, projects, tasks und count aus drizzle-orm
 *  b) Schreibe eine async-Funktion getStats(), die die Anzahl
 *     der Projekte und Tasks aus der DB liest.
 *     Tipp: db.select({ value: count() }).from(projects)
 *  c) Rufe getStats() in der Komponente auf (await!) und
 *     ersetze die Nullen.
 *
 * AUFGABE 2.5 (Tag 2) — Caching nachrüsten (ca. 20 Min):
 *  d) Wrappe getStats mit unstable_cache aus 'next/cache'
 *     – Cache-Key: ['dashboard-stats']
 *     – tags: ['projects', 'tasks']
 *     – revalidate: 60
 *  e) Wichtig: unstable_cache auf MODULEBENE definieren,
 *     nicht innerhalb der Komponente. Warum?
 *
 * BONUS 1.B — Letzte Projekte anzeigen:
 *  f) Lade zusätzlich die 3 neuesten Projekte
 *     (db.query.projects.findMany mit orderBy + limit)
 *     und zeige sie unter den Statistik-Karten als Liste an.
 */

//*1.6b*/
async function getStats() {
  const [projectCount] = await db.select({ value: count() }).from(projects)
  const [taskCount] = await db.select({ value: count() }).from(tasks)
  return {
    projects: projectCount.value,
    tasks: taskCount.value,
  }
}

//*Bonus 1.B*/
async function getRecentProjects() {
  return db.query.projects.findMany({
    orderBy: (p, { desc }) => [desc(p.createdAt)],
    limit: 3,
  })
}

export default async function DashboardPage() {
  // TODO b+c: echte Zahlen aus der Datenbank laden
  //*1.6c*/
const stats = await getStats()
//*Bonus 1.B*/
const recentProjects = await getRecentProjects()


  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Übersicht über alle Projekte und Aufgaben</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Projekte gesamt</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">{stats.projects}</p>
        </div>
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Aufgaben gesamt</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">{stats.tasks}</p>
        </div>
      </div>

      {recentProjects.length > 0 && (
  <div className="mb-8">
    <h2 className="text-lg font-semibold text-gray-900 mb-3">Neueste Projekte</h2>
    <ul className="space-y-2">
      {recentProjects.map((project) => (
        <li key={project.id} className="bg-white rounded-lg border p-3 text-sm">
          {project.name}
        </li>
      ))}
    </ul>
  </div>
)}

      <div className="flex gap-3">
        <Link
          href="/projects"
          className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Alle Projekte anzeigen
        </Link>
        <Link
          href="/api/export"
          target="_blank"
          className="bg-white text-gray-700 rounded-lg px-4 py-2 text-sm font-medium border hover:bg-gray-50 transition-colors"
        >
          JSON Export
        </Link>
      </div>
    </div>
  )
}
