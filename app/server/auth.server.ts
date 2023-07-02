import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { GitHubStrategy, SocialsProvider } from 'remix-auth-socials';
import { sessionStorage } from '~/utils/session.server';
import { findOrCreateUserFromGithubProfile, loginUser } from '~/utils/repository.server';
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
    callbackURL: `${process.env.APP_URL}/auth/${SocialsProvider.GITHUB}/callback`,
    scope: ['read:user', 'user:email'],
  },
  async ({ profile }) => {
    const user = await findOrCreateUserFromGithubProfile(profile);
    console.log('strategy', user);
    return user;
  },
));

authenticator.use(new FormStrategy(async ({ form }) => {
  const email = form.get('email')!.toString();
  const user = loginUser(email!.toString());
  console.log('strategy', 'user-pass');
  console.log('user', user);
  return user;
}), 'user-pass');
