// ./app/routes/index.tsx
import { redirect } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { ReactSession } from 'react-client-session';

export const loader: LoaderFunction = async ({ request }) => {
  const user = ReactSession.get('user');
  if (!user) {
    return redirect('/login');
  }
  console.log('index', user);
  return { user };
};

export default function Index() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      Bonjour
    </div>
  );
}
