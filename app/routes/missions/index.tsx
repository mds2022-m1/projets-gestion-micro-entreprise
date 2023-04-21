import {
  BuildingOffice2Icon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Link } from 'react-router-dom';
import { getAllMissions } from '~/utils/repository.server';
import { useLoaderData } from '@remix-run/react';

export const loader = async () => {
  const missions = await getAllMissions();
  return missions;
};

export default function Missions() {
  const missions = useLoaderData<typeof loader>();

  // @ts-ignore
  // @ts-ignore
  return (
    <div className="h-full w-full flex flex-col justify-start items-start p-6">
      <div className="w-full flex justify-between items-center mb-10">
        <h1 className="text-2xl font-medium">Missions</h1>
        <Link
          to="/missions/new"
          className="bg-cyan-700 text-white px-6 py-2 rounded-lg"
        >
          Ajouter
        </Link>
      </div>
      <div className="w-full">
        <div className="overflow-hidden bg-white shadow sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {missions.map((mission) => (
              <li key={mission.id}>
                <Link to={mission.id} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-indigo-600">
                        {mission.title}
                      </p>
                      <div className="ml-2 flex flex-shrink-0">
                        <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          {mission.reference}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <BuildingOffice2Icon
                            className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                          {/* @ts-ignore */}
                          {mission.Organization.name}
                        </p>
                        {/* eslint-disable-next-line max-len */}
                        {/* <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <MapPinIcon
                            className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                          {mission.reference}
                        </p> */}
                      </div>
                      {mission.billedAt
                          && (
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <CalendarIcon
                              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            <p>
                              Facturé le
                              {' '}
                              <time
                                dateTime={mission.billedAt}
                              >
                                {new Date(mission.billedAt).toLocaleDateString(new Intl.Locale('fr'))}
                              </time>
                            </p>
                          </div>
                          )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
