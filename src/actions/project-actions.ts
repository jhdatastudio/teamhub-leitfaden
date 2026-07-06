'use server'

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { projects } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { createProjectSchema } from '@/lib/validations'

type ProjectFormState = {
  error?: Record<string, string[]>
} | null

/**
 * ═══════════════════════════════════════════════════════════
 * AUFGABE 2.2 — Server Action: Projekt erstellen (ca. 45 Min)
 * ═══════════════════════════════════════════════════════════
 *
 * Ablauf einer Server Action mit Validierung:
 *
 *   1. Rohdaten aus formData extrahieren
 *      formData.get('name') gibt string | File | null zurück
 *   2. Mit Zod validieren: schema.safeParse(raw)
 *      → { success: true, data } oder { success: false, error }
 *   3. Bei Fehler: fieldErrors zurückgeben
 *      return { error: result.error.flatten().fieldErrors }
 *   4. In DB einfügen: db.insert(projects).values(...)
 *   5. Cache invalidieren: revalidateTag('projects')
 *   6. Weiterleiten: redirect('/projects')
 *
 * Fragen zum Diskutieren:
 *  - Warum safeParse statt parse? 
 *    ->  kein Absturz bei ungültigen Nutzereingaben, sondern kontrolliertes Fehler-Objekt
 *  - Warum steht redirect NACH revalidateTag?
 *    -> revalidateTag('projects') sagt Next.js "der Cache mit dem Tag 
 *      'projects' ist jetzt veraltet, beim nächsten Aufruf neu laden." 
 *      redirect('/projects') schickt den Browser sofort zur 
 *      /projects-Seite. Was würde passieren, 
 *      wenn redirect vor revalidateTag stehen würde?
 * 
 *      Wenn redirect('/projects') vor revalidateTag('projects') stehen würde, würde die Funktion beim redirect()-Aufruf sofort abbrechen (technisch: redirect() wirft intern eine spezielle "Weiterleitungs-Exception", die den restlichen Code der Funktion gar nicht mehr ausführen lässt) — revalidateTag('projects') danach würde nie aufgerufen. Der Browser würde also zur /projects-Seite springen, aber mit dem alten, gecachten Zustand (ohne das neue Projekt), weil der Cache ja nie als veraltet markiert wurde.
 *      Deshalb: erst revalidateTag (Cache als ungültig markieren), dann redirect (erst danach zur Seite springen) — so garantierst du, dass beim Ankommen auf /projects wirklich frische Daten geladen werden.


 *  - Was passiert, wenn man revalidateTag vergisst?
 *   ->  Ohne revalidateTag('projects') bleibt der gecachte Zustand (aus unstable_cache, 60 Sekunden gültig) einfach stehen. Der Nutzer würde sein neu erstelltes Projekt nicht sofort sehen — es würde erst nach Ablauf der 60 Sekunden automatisch neu geladen (oder gar nicht, wenn niemand die Seite neu aufruft). Das wäre ein verwirrendes Nutzererlebnis: "Ich hab doch gerade ein Projekt erstellt, wo ist es?"
 *
 * (Der auth()-Check kommt an Tag 3 dazu — heute noch ohne.)
 */
export async function createProject(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  // TODO Schritt 1: Rohdaten extrahieren
  //   description: formData.get('description') || undefined
  //   (leerer String soll als "nicht angegeben" gelten)
  const raw = {
    name: formData.get('name'),
    description: formData.get('description') || undefined,
  }
  // TODO Schritt 2+3: validieren, bei Fehler fieldErrors zurückgeben
  const result = createProjectSchema.safeParse(raw)

if (!result.success) {
  return { error: result.error.flatten().fieldErrors }
}
  // TODO Schritt 4: einfügen
await db.insert(projects).values({
  name: result.data.name,
  description: result.data.description,
  ownerId: 'test-user-1', 
})
  // TODO Schritt 5+6: Cache invalidieren + weiterleiten
revalidateTag('projects')
redirect('/projects')
}

/**
 * AUFGABE 2.2b — Projekt löschen
 *  - Lösche das Projekt mit der übergebenen id
 *    Tipp: db.delete(projects).where(eq(projects.id, id))
 *  - Cache invalidieren nicht vergessen!
 */
export async function deleteProject(id: string) {
  // TODO
}
