import React, { useState } from 'react';
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
  return (
    <div className="lg:ml-64 h-screen flex flex-col justify-center items-center">
      Bonjour
    </div>
  );
}
