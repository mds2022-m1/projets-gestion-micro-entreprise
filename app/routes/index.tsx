import React, { useState } from 'react';
import type { LoaderFunction } from '@remix-run/node';
import { authenticator } from '~/server/auth.server';
import { ModalOrganizationType } from '../components/ModalOrganizationType';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  console.log('index', user);
  return { user };
};

export default function Index() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="lg:ml-64 h-screen bg-slate-700 flex flex-col justify-center items-center">
      <button type="button" onClick={() => setShowModal(!showModal)} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Open Modal</button>
      {showModal && <ModalOrganizationType />}
    </div>
  );
}
