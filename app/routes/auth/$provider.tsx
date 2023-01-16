import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { authenticator } from '~/server/auth.server';

export const loader: LoaderFunction = () => redirect('/login');

// eslint-disable-next-line max-len
export const action: ActionFunction = ({ request, params }) => authenticator.authenticate(params.provider as string, request);
