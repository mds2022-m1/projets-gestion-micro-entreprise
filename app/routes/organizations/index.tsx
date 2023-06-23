import { Link, useLoaderData } from '@remix-run/react';
import { getAllOrganization } from '~/utils/repository.server';

export const loader = async () => {
  const organizations = await getAllOrganization();
  return organizations;
};

export default function Posts() {
  const organizations = useLoaderData<typeof loader>();
  return (
    <div className="h-full w-full flex flex-col justify-start items-start p-6">
      <div className="w-full flex justify-between items-center mb-10">
        <h1 className="text-2xl font-medium">Organisations</h1>
        <div>
          <Link
            to="/organizations/types/new"
            className="bg-cyan-700 text-white px-6 py-2 rounded-lg mr-5"
          >
            Ajouter un type d&apos;organisation
          </Link>
          <Link
            to="/organizations/new"
            className="bg-cyan-700 text-white px-6 py-2 rounded-lg"
          >
            Ajouter
          </Link>
        </div>
      </div>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => (
          <li key={org.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow min-w-[15rem]">
            <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="truncate text-sm font-medium text-gray-900">{org.name}</h3>
                  <span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: org.organizationType.color }}>
                    {/* @ts-ignore */}
                    {org.organizationType.name}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-gray-500">{org.address}</p>
              </div>
              <img
                className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
                alt=""
              />
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="flex w-0 flex-1">
                  <Link
                    to={org.id}
                    className="relative -mr-px inline-flex w-0 flex-1 items-center rounded-bl-lg border border-transparent py-4 p-6 text-sm font-medium text-gray-700 hover:text-gray-500"
                  >
                    <span className="">Détail</span>
                  </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
