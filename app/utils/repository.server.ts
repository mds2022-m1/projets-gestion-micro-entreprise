import type { Organization, OrganizationType, User } from '@prisma/client';
import { db } from '~/utils/db.server';
import type { OrganizationDTO, OrganizationTypeDTO } from '~/utils/types';
import type { GitHubProfile } from 'remix-auth-socials';

export const findOrCreateUserFromGithubProfile = async (profile: GitHubProfile): Promise<User> => {
  console.log('profile', profile);
  const user = await db.user.findUnique({
    where: { githubId: profile.id },
  });

  if (user) return user;

  return db.user.create({
    data: {
      // eslint-disable-next-line no-underscore-dangle
      name: profile._json.name ?? profile.displayName,
      // eslint-disable-next-line no-underscore-dangle
      email: profile.emails[0].value,
      githubId: profile.id,
    },
  });
};
export async function getAllOrganizationType(): Promise<OrganizationType[]> {
  return db.organizationType.findMany();
}

// eslint-disable-next-line max-len
export async function createOrganizationType(organizationTypeDTO: OrganizationTypeDTO): Promise<OrganizationType> {
  return db.organizationType.create({
    data: {
      name: organizationTypeDTO.name,
      color: organizationTypeDTO.color,
      userId: organizationTypeDTO.user.id,
    },
  });
}

// eslint-disable-next-line max-len
export async function updateOrganizationType(organizationTypeDTO: OrganizationTypeDTO): Promise<OrganizationType> {
  return db.organizationType.update({
    where: {
      id: organizationTypeDTO.id,
    },
    data: {
      name: organizationTypeDTO.name,
      color: organizationTypeDTO.color,
    },
  });
}

export async function deleteOrganizationType(id: string): Promise<void> {
  await db.organizationType.delete({ where: { id } });
}

export async function getAllOrganization(): Promise<Organization[]> {
  return db.organization.findMany();
}

export async function findOrganization(id: string): Promise<Organization | null> {
  return db.organization.findUnique({ where: { id } });
}

export async function createOrganization(organizationDTO: OrganizationDTO): Promise<Organization> {
  return db.organization.create({
    data: {
      name: organizationDTO.name,
      reference: organizationDTO.reference,
      email: organizationDTO.email,
      phone: organizationDTO.phone,
      address: organizationDTO.address,
      siret: organizationDTO.siret,
      organizationTypeId: organizationDTO.organizationType.id,
      userId: organizationDTO.user.id,
    },
  });
}

export async function updateOrganization(organizationDTO: OrganizationDTO): Promise<Organization> {
  return db.organization.update({
    where: {
      id: organizationDTO.id,
    },
    data: {
      name: organizationDTO.name,
      reference: organizationDTO.reference,
      email: organizationDTO.email,
      phone: organizationDTO.phone,
      address: organizationDTO.address,
      siret: organizationDTO.siret,
      organizationTypeId: organizationDTO.organizationType.id,
    },
  });
}

export async function deleteOrganization(id: string): Promise<void> {
  await db.organization.delete({ where: { id } });
}
