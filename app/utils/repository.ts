import type { Organization, User } from '@prisma/client';
import { db } from '~/utils/db.server';

export async function getAllOrganizations(): Promise<Organization[]> {
  return db.organization.findMany();
}

//create a new User
export async function createOrganization(data: User): Promise<User> {
  return db.user.create({ data });
}


