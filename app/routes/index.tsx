// ./app/routes/index.tsx
import type { LoaderFunction } from '@remix-run/node';
import { authenticator } from '~/server/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  return { };
};

export default function Index() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      Bonjour
    </div>
  );
}
