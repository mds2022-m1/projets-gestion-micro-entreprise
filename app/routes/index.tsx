// ./app/routes/index.tsx
import type { LoaderFunction } from '@remix-run/node';
import { authenticator } from '~/server/auth.server';
import { useLoaderData } from '@remix-run/react';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  return user;
};

export default function Index() {
  const user = useLoaderData<typeof loader>();

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      Bonjour
      {' '}
      {user !== undefined ? user.name : null}
    </div>
  );
}
