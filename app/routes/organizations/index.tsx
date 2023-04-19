import { Link, useLoaderData } from '@remix-run/react';
import { getAllOrganization } from '~/utils/repository.server';
import { gql, useQuery } from '@apollo/client';

export const loader = async () => {
  // const organizations = await getAllOrganization();
  // return organizations;
};

const ORGANIZATIONS_QUERY = gql`
  query GetOrganizations {
    organizations {
      id
      name
      reference
      email
      phone
      address
      siret
      organization_type_id
      user_id
      organization_type {
          id,
          name
      }
    }
  }
`;

export default function Posts() {
  // const organizations = useLoaderData<typeof loader>();
  const { data } = useQuery(ORGANIZATIONS_QUERY, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  return (
    <div>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data && data.organizations.map((org: any) => (
          <li key={org.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow min-w-[15rem]">
            <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="truncate text-sm font-medium text-gray-900">{org.name}</h3>
                  <span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                    {/* @ts-ignore */}
                    {org.organization_type.name}
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
