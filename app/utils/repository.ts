import type { Organization, User } from '@prisma/client';
import { db } from '~/utils/db.server';
import type { UserDTO } from '~/utils/types';
import type { GitHubProfile } from 'remix-auth-socials';

export async function getAllOrganizations(): Promise<Organization[]> {
  return db.organization.findMany();
}

export async function getUserByGithubId(githubId: string): Promise<User | null> {
  return db.user.findUnique({
    where: { githubId },
  });
}

export async function createUser(userDTO: UserDTO): Promise<User> {
  return db.user.create({
    data: userDTO,
  });
}

export const findOrCreateUserFromGithubProfile = async (profile: GitHubProfile): Promise<User> => {
  console.log('profile', profile);
  const user = await db.user.findUnique({
    where: { githubId: profile.id },
  });

  if (user) return user;

  return db.user.create({
    data: {
      // eslint-disable-next-line no-underscore-dangle
      name: profile._json.name,
      // eslint-disable-next-line no-underscore-dangle
      email: profile.emails[0].value,
      githubId: profile.id,
    },
  });
};
