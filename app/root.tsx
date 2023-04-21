import type { MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  // eslint-disable-next-line @typescript-eslint/comma-dangle
  ScrollRestoration,
} from '@remix-run/react';
import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import styles from './tailwind.css';

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
});

// eslint-disable-next-line import/no-default-export
export default function App() {
  const [login, setLogin] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { pathname } = window.location;
      if (pathname === '/login' || pathname === '/register') {
        setLogin(true);
      } else setLogin(false);
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div className={login ? 'hidden' : ''}>
          <Sidebar />
        </div>
        <div className={login ? '' : 'lg:pl-64 w-full h-screen'}>
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
