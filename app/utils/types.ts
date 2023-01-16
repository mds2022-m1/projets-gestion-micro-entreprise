import type { OrganizationType, User } from '@prisma/client';

export type OrganizationTypeDTO = {
  id?: string,
  name: string,
  color: string,
  user: User
};

export type OrganizationDTO = {
  id?: string,
  name: string,
  reference: string,
  email: string,
  phone: string,
  address: string,
  siret: string,
  organizationType: OrganizationType,
  user: User
};
