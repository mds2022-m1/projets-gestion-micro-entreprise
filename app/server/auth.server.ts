import { Authenticator } from 'remix-auth';
import { GitHubStrategy, SocialsProvider } from 'remix-auth-socials';
import { sessionStorage } from '~/utils/session.server';
import { findOrCreateUserFromGithubProfile } from '~/utils/repository';
import type { User } from '@prisma/client';

// Create an instance of the authenticator
export const authenticator = new Authenticator<User>(sessionStorage, { sessionKey: '_session' });
// eslint-disable-next-line max-len
// You may specify a <User> type which the strategies will return (this will be stored in the session)
// export let authenticator = new Authenticator<User>(sessionStorage, { sessionKey: '_session' });

authenticator.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    callbackURL: `http://localhost:3000/auth/${SocialsProvider.GITHUB}/callback`,
    scope: ['read:user', 'user:email'],
  },
  async ({ profile }) => {
    const user = await findOrCreateUserFromGithubProfile(profile);
    console.log('strategy', user);
    return user;
  },
));
