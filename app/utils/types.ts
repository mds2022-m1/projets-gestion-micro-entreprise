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
export type UserDTO = {
  name: string,
  email?: string,
  phone?: string,
  password?: string,
  companyName?: string,
  siret?: string,
  ape?: string,
  address?: string,
  bankAccountOwner?: string,
  bankDomiciliation?: string,
  bankRib?: string,
  bankIban?: string,
  bankBic?: string,
  githubId: string
};
