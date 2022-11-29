// ./app/routes/index.tsx
import type { Organization } from '@prisma/client';
import { useLoaderData } from '@remix-run/react';
import { getAllOrganizations } from '~/utils/repository';
import { json } from '@remix-run/node';

export const loader = async () => {
  const organizations = await getAllOrganizations();

  return json(organizations);
};

export default function Index() {
  const organizations = useLoaderData<Organization[]>();
  return (
    <div className="h-screen bg-slate-700 flex flex-col justify-center items-center">
      <h2 className="text-blue-600 font-extrabold text-5xl">TailwindCSS Is Working!</h2>
      {organizations.map((organization) => (<div>{organization.name}</div>))}
    </div>
  );
}
