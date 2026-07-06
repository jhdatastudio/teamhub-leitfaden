import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

/**
 * ═══════════════════════════════════════════════════════════
 * AUFGABE 1.2 — Singleton-Pattern (ca. 30 Min)
 * ═══════════════════════════════════════════════════════════
 *
 * Problem: Bei jedem Hot Reload in der Entwicklung lädt Next.js
 * dieses Modul neu → jedes Mal eine neue DB-Verbindung.
 * Neon (Free Tier) erlaubt nur begrenzt viele Verbindungen.
 *
 * Deine Aufgabe:
 *  a) Definiere ein Objekt `globalForDb`, das globalThis nutzt,
 *     um eine db-Instanz über Hot Reloads hinweg zu speichern.
 *     Tipp: globalThis as unknown as { db: ... | undefined }
 *  b) Erstelle die db-Instanz nur, wenn noch keine existiert.
 *     Tipp: Nullish Coalescing Operator ??
 *  c) Speichere die Instanz in globalForDb — aber nur wenn
 *     NODE_ENV nicht 'production' ist.
 *
 * Python-Analogie:
 *   _engine = None
 *   def get_engine():
 *       global _engine
 *       if _engine is None:
 *           _engine = create_engine(URL)
 *       return _engine
 */

const sql = neon(process.env.DATABASE_URL!)

// TODO a) globalForDb definieren
const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof drizzle<typeof schema>> | undefined
}
/**
 * globalThis — das globale Objekt (in Node vergleichbar mit 
 *    einem Modul, das immer im Speicher bleibt)
 * as unknown as {...} — ein doppelter Type-Cast. 
 *        TypeScript lässt dich nicht direkt von globalThis (ein sehr allgemeiner Typ) zu einem spezifischen Objekt-Typ casten, deshalb der Umweg über unknown. Python-Analogie: wie ein # type: ignore gefolgt von einer expliziten Typannotation — du sagst TypeScript "vertrau mir, das hat diese Form".
 * { db: ReturnType<typeof drizzle> | undefined } — das ist die
 *     Form: ein Objekt mit einem Feld db, das entweder eine Drizzle-Instanz ist oder undefined.
 */
// TODO b) db erstellen (Singleton) — ersetze die folgende Zeile:
export const db = globalForDb.db ?? drizzle(sql, { schema })

/**
 * ?? prüft die linke Seite (globalForDb.db)
 * Ist sie undefined oder null → nimm die rechte Seite (drizzle(sql, { schema }), also erzeuge neu)
 * Ist sie nicht undefined/null (also schon eine Instanz da) → nimm einfach die linke Seite, keine neue Verbindung
 */ 


// TODO c) Instanz in Entwicklung global speichern
if (process.env.NODE_ENV !== 'production') globalForDb.db = db

//**
//Oder eben die noch kompaktere Variante mit &&:
//process.env.NODE_ENV !== 'production' && (globalForDb.db = db)
//  
// 
// Wie && als Kurzform funktioniert: JS wertet && von links nach rechts aus und stoppt beim ersten false. Ist die linke Seite true (wir sind nicht in Production), wird die rechte Seite ausgeführt (die Zuweisung passiert). Ist die linke Seite false (wir sind in Production), wird die rechte Seite gar nicht erst angefasst.
// Ich empfehle dir hier trotzdem die if-Variante — die ist lesbarer und genau das, was im Seminar auch so vermittelt wird (die &&-Variante ist eher ein "Insider-Move", den du kennen solltest, aber nicht unbedingt selbst schreiben musst) */





//* Kannst du mir in eigenen Worten erklären, warum wir globalForDb.db ?? drizzle(sql, { schema }) schreiben und nicht einfach direkt export const db = drizzle(sql, { schema })? Also: was genau würde ohne den Singleton-Trick im Dev-Betrieb schiefgehen?
// Das Problem, das der Singleton löst:
// Next.js im Dev-Modus überwacht deine Dateien. Sobald du eine Datei speicherst (auch eine ganz andere, nicht mal db/index.ts selbst), lädt Next.js die betroffenen Module neu — das nennt sich Hot Reload. Das ist super für die Entwicklung, weil du nicht bei jeder Änderung den ganzen Server neu starten musst.
// Aber: Ohne den Singleton-Trick würde jedes Mal, wenn db/index.ts neu geladen wird, diese Zeile erneut ausgeführt:
// typescriptexport const db = drizzle(sql, { schema })
// Das heißt: jede Datei-Speicherung → eine komplett neue Datenbankverbindung wird aufgebaut — die alte Verbindung bleibt dabei einfach offen im Hintergrund hängen (sie wird nicht automatisch geschlossen). Nach 20 Speicherungen hast du 20 offene Verbindungen zu Neon. Neon (Free Tier) erlaubt aber nur eine begrenzte Anzahl gleichzeitiger Verbindungen — irgendwann kriegst du dann einen Fehler wie "too many connections".
// Wie der Singleton das verhindert:
// globalThis ist ein Objekt, das den Hot Reload übersteht — es wird nicht mit dem Modul neu erzeugt, sondern bleibt über den gesamten Node-Prozess hinweg bestehen. Deshalb:

// Beim allerersten Start: globalForDb.db ist undefined → ?? erzeugt eine neue Verbindung → die speichern wir in globalForDb.db
// Bei jedem weiteren Hot Reload: globalForDb.db ist schon gesetzt (von Schritt 1) → ?? nimmt einfach die bestehende Verbindung, statt eine neue zu bauen

// Python-Vergleich: Bei einem Flask-Dev-Server mit use_reloader=True hast du im Grunde das gleiche Problem — deshalb speichert man die DB-Engine oft auch dort in einer Modul-Variable, die geprüft wird, statt sie bei jedem Neustart-Zyklus neu zu erzeugen.
// 
// der Kern: Hot Reload lädt das Modul neu, ohne den Trick würde bei jedem Speichern eine neue Verbindung entstehen, alte bleiben offen hängen, und irgendwann sagt Neon "zu viele Verbindungen". globalThis umgeht das, weil es den Reload übersteht.
// 
// 
// 
// */