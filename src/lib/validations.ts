import { z } from 'zod'

/**
 * ═══════════════════════════════════════════════════════════
 * AUFGABE 2.1 — Zod-Schemas (ca. 25 Min)
 * ═══════════════════════════════════════════════════════════
 *
 * Zod = Laufzeit-Validierung + TypeScript-Typen in einem.
 * Python-Analogie: Pydantic.
 *
 *   class CreateProject(BaseModel):              # Pydantic
 *       name: str = Field(min_length=1, max_length=100)
 *       description: Optional[str] = None
 *
 *   const createProjectSchema = z.object({      // Zod
 *     name: z.string().min(1).max(100),
 *     description: z.string().optional(),
 *   })
 *
 * Definiere drei Schemas:
 *
 * 1) createProjectSchema
 *    - name: string, min 1 (Meldung: 'Name ist erforderlich'), max 100
 *    - description: string, max 500, optional
 *
 * 2) createTaskSchema
 *    - title: string, min 1, max 200
 *    - description: string, max 1000, optional
 *    - projectId: string im UUID-Format → z.string().uuid()
 *
 * 3) updateSettingSchema
 *    - key: string, min 1
 *    - value: string
 *
 * Deutsche Fehlermeldungen als erstes Argument von min/max/uuid.
 */

// TODO 1) createProjectSchema
export const createProjectSchema = z.object({// TODO: Regeln ergänzen
  name: z.string().min(1, 'Name ist erforderlich').max(100),
  description: z.string().max(500).optional(), 
})

// TODO 2) createTaskSchema
export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),  // TODO
  projectId: z.string().uuid(), // TODO
})

// TODO 3) updateSettingSchema
export const updateSettingSchema = z.object({
  key: z.string().min(1), // TODO
  value: z.string(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateSettingInput = z.infer<typeof updateSettingSchema>
