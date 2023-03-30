// ./app/routes/index.tsx
import { Form, useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/node';
import { authenticator } from '~/server/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  console.log('index', user);
  return { user };
};

export default function Index() {
  const { user } = useLoaderData();
  return (
    <div className="h-screen bg-slate-700 flex flex-col justify-center items-center">
      <h2 className="text-blue-600 font-extrabold text-5xl">TailwindCSS Is Working!</h2>
      <p>
        Hello
        {' '}
        {' '}
        {user.name}
      </p>
      <Form action="/logout" method="post">
        <button type="submit">Logout</button>
      </Form>
    </div>
  );
}
