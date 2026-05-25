import { query } from "@/lib/db/pool";

export async function logAction(
  actorId: string | null,
  action: string,
  entityType?: string,
  entityId?: string,
  metadata?: Record<string, unknown>
) {
  try {
    await query(
      "INSERT INTO audit_log (actor_id, action, entity_type, entity_id, metadata) VALUES ($1, $2, $3, $4, $5)",
      [actorId, action, entityType ?? null, entityId ?? null, metadata ? JSON.stringify(metadata) : null]
    );
  } catch {
    console.error("[audit] Failed to log action:", action);
  }
}
