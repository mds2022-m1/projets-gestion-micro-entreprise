import type { LoaderArgs } from '@remix-run/node';
import { authenticator } from '~/server/auth.server';

export const loader = async ({ request }: LoaderArgs) => {
  // Effacer les données de session de l'utilisateur
  // await ReactSession.set("user", null);

  // Déconnecter l'utilisateur
  await authenticator.logout(request, { redirectTo: '/login' });
};
