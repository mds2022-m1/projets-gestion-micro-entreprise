import type { OrganizationType } from '@prisma/client';

export type OrganizationTypeDTO = {
  id?: string,
  name: string,
  color: string
};

export type OrganizationDTO = {
  id?: string,
  name: string,
  reference: string,
  email: string,
  phone: string,
  address: string,
  siret: string,
  organizationType: OrganizationType
};
