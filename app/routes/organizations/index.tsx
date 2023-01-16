import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid';
import { Link, useLoaderData } from '@remix-run/react';
import { getAllOrganization } from '~/utils/repository.server';

export const loader = async () => {
  const organizations = await getAllOrganization();
  return organizations;
};

export default function Posts() {
  const organizations = useLoaderData<typeof loader>();
  return (
    <div className="lg:ml-64 h-screen bg-slate-700 flex flex-col justify-center items-center">
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => (
          <li key={org.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
            <Link to={org.id}>
              <div className="flex w-full items-center justify-between space-x-6 p-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="truncate text-sm font-medium text-gray-900">{org.name}</h3>
                    <span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      {org.organizationTypeId}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-gray-500">{org.address}</p>
                </div>
                {/* <img
                className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
                src={org.img} alt="" /> */}
              </div>
              <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <div className="flex w-0 flex-1">
                    <a
                      href={`mailto:${org.email}`}
                      className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                    >
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      <span className="ml-3">Email</span>
                    </a>
                  </div>
                  <div className="-ml-px flex w-0 flex-1">
                    <a
                      href={`tel:${org.phone}`}
                      className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                    >
                      <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      <span className="ml-3">Call</span>
                    </a>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}