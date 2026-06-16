export interface AuditLogActor {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  actorId: string | null;
  actorEmail: string | null;
  actorRole: string | null;
  oldValues: unknown;
  newValues: unknown;
  ipAddress: string | null;
  userAgent: string | null;
  method: string | null;
  route: string | null;
  createdAt: string;
  actor?: AuditLogActor | null;
}

export interface PaginatedAuditLogs {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const AUDIT_ENTITY_LABELS: Record<string, string> = {
  Tournament: "Torneio",
  Registration: "Inscrição",
  Friendly: "Amistoso",
  User: "Usuário",
  Team: "Time",
  Match: "Partida",
  Unknown: "Outro",
};

export function actionTone(action: string):
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "neutral" {
  const a = action.toUpperCase();
  if (
    a.endsWith("_CREATED") ||
    a.endsWith("_PUBLISHED") ||
    a.endsWith("_CONFIRMED") ||
    a.endsWith("_ACCEPTED") ||
    a.endsWith("_VERIFIED") ||
    a.endsWith("_REGISTERED") ||
    a.endsWith("_STARTED") ||
    a.endsWith("_UNBLOCKED") ||
    a.endsWith("_FINISHED")
  ) {
    return "success";
  }
  if (
    a.endsWith("_DELETED") ||
    a.endsWith("_CANCELLED") ||
    a.endsWith("_REJECTED") ||
    a.endsWith("_BLOCKED") ||
    a.endsWith("_REFUNDED") ||
    a.endsWith("_WALKOVER")
  ) {
    return "danger";
  }
  if (a.endsWith("_UPDATED") || a.endsWith("_DRAFTED") || a.endsWith("_PENDING")) {
    return "warning";
  }
  return "info";
}

export function formatDateTime(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
