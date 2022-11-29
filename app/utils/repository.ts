import type { Organization } from '@prisma/client';
import { db } from '~/utils/db.server';

export async function getAllOrganizations(): Promise<Organization[]> {
  return db.organization.findMany();
}
