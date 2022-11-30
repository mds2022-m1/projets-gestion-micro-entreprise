import type { LoaderFunction } from '@remix-run/node';
import { authenticator } from '~/server/auth.server';

// eslint-disable-next-line max-len
export const loader: LoaderFunction = ({ request, params }) => authenticator.authenticate(params.provider as string, request, {
  successRedirect: '/',
  failureRedirect: '/login',
});
