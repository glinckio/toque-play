import { SetMetadata } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

export const AUDIT_METADATA_KEY = 'audit:metadata';

export interface AuditMeta {
  action: string;
  entityType: string;
  entityIdParam?: string;
  fetchBefore?: (
    prisma: PrismaService,
    entityId: string,
    request: any,
  ) => Promise<any>;
}

export function Audit(
  action: string,
  entityType: string,
  opts?: Omit<AuditMeta, 'action' | 'entityType'>,
): MethodDecorator {
  return SetMetadata(AUDIT_METADATA_KEY, {
    action,
    entityType,
    entityIdParam: opts?.entityIdParam ?? 'id',
    fetchBefore: opts?.fetchBefore,
  } satisfies AuditMeta);
}
