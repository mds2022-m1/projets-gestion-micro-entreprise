import type { ActionArgs } from '@remix-run/node';
import { authenticator } from '~/server/auth.server';
import { ReactSession } from 'react-client-session';

export const action = async ({ request }: ActionArgs) => {
  // Effacer les données de session de l'utilisateur
  await ReactSession.set("user", null);
  
  // Déconnecter l'utilisateur
  await authenticator.logout(request, { redirectTo: '/login' });
  };
