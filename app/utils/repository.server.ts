import type {
  Organization, OrganizationType, Mission, User,
} from '@prisma/client';
import { db } from '~/utils/db.server';
import type { MissionDTO, OrganizationDTO, OrganizationTypeDTO } from '~/utils/types';
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

export async function findOrganizationType(id: string): Promise<OrganizationType | null> {
  return db.organizationType.findUnique({ where: { id } });
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
  return db.organization.findMany({ include: { organizationType: true } });
}

export async function findOrganization(id: string): Promise<Organization | null> {
  return db.organization.findUnique({ where: { id }, include: { organizationType: true } });
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

export async function deleteOrganization(id: string): Promise<Organization> {
  return db.organization.delete({ where: { id } });
}

export async function getAllMissions(): Promise<Mission[]> {
  return db.mission.findMany({ include: { Organization: true } });
}

export async function findMission(id: string): Promise<Mission | null> {
  // eslint-disable-next-line max-len
  return db.mission.findUnique({ where: { id }, include: { Organization: true, MissionLine: true } });
}

export async function createMission(missionDTO: MissionDTO): Promise<Mission> {
  return db.mission.create({
    data: {
      title: missionDTO.title,
      reference: missionDTO.reference,
      comment: missionDTO.comment,
      deposit: missionDTO.deposit,
      organizationId: missionDTO.organization.id,
      billedAt: missionDTO.billedAt ? new Date(missionDTO.billedAt) : null,
      userId: missionDTO.user.id,
    },
  });
}

export async function updateMission(missionDTO: MissionDTO): Promise<Mission> {
  return db.mission.update({
    where: {
      id: missionDTO.id,
    },
    data: {
      title: missionDTO.title,
      reference: missionDTO.reference,
      comment: missionDTO.comment,
      deposit: missionDTO.deposit,
      organizationId: missionDTO.organization.id,
      billedAt: missionDTO.billedAt ? new Date(missionDTO.billedAt) : null,
    },
  });
}

export async function deleteMission(id: string): Promise<Mission> {
  await db.missionLine.deleteMany({ where: { missionId: id } });
  return db.mission.delete({ where: { id } });
}
