/* eslint-disable @typescript-eslint/comma-dangle */
import type { LoaderArgs, DataFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData, useTransition } from '@remix-run/react';
import { deleteMission, deleteMissionLine, findMission } from '~/utils/repository.server';

import {
  CurrencyEuroIcon, DocumentIcon, PencilIcon, TrashIcon
} from '@heroicons/react/20/solid';
import type { MissionLine } from '@prisma/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Link } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import { AlertBox } from '~/components/AlertBox';
import { redirect } from '@remix-run/node';
import { delay } from '~/utils/functions';

export const loader = async ({ params }: LoaderArgs) => {
  const mission = await findMission(params.mission!);
  return mission;
};

export const action = async ({
  request,
  params,
}: DataFunctionArgs) => {
  const formaData = await request.formData();

  if (formaData.get('action')?.toString() === 'delete-mission') {
    if (params.mission) {
      await deleteMission(params.mission);
      await delay(500);
      return redirect('/missions');
    }
  } else if (formaData.get('action')?.toString().includes('delete.mission.line')) {
    const actionSplit = formaData.get('action')?.toString().split('.');
    const id: string | undefined = actionSplit ? actionSplit[actionSplit.length - 1] : undefined;
    if (id) {
      await deleteMissionLine(id);
    }
  }

  return redirect(`/missions/${params.mission}`);
};

export default function MissionDetail() {
  const mission = useLoaderData<typeof loader>();

  const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
  const cancelButtonRef = useRef(null);

  const transition = useTransition();

  // @ts-ignore
  return (
    <main className="py-10 w-full h-full">
      <AlertBox
        open={showAlertDelete}
        setOpen={setShowAlertDelete}
        cancelRef={cancelButtonRef}
        title="Supprimer la mission"
        message="Êtes-vous sûr de vouloir supprimer cette mission? Cette action est irreversible."
        actionButton={(
          <Form method="delete">
            <button
              name="action"
              value="delete-mission"
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {transition.state === 'loading' ? 'Suppression ...' : 'Supprimer'}
            </button>
          </Form>
          )}
      />
      {/* Page header */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
        <div className="flex items-center space-x-5">
          <div className="flex-shrink-0">
            <div className="relative">
              <img className="h-16 w-16 rounded-full bg-gray-300" alt="" />
              <span
                className="absolute inset-0 rounded-full shadow-inner"
                aria-hidden="true"
              />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {mission?.title}
            </h1>
            <p className="text-sm font-medium text-gray-500">
              {/* @ts-ignore */}
              {mission?.Organization.name}
              {/* <time dateTime="2020-08-25">August 25, 2020</time> */}
            </p>
          </div>
        </div>
        <div className="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
          <a href={`/missions/${mission?.id}/edit`}>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            >
              Modifier
            </button>
          </a>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            onClick={() => setShowAlertDelete(true)}
          >
            Supprimer
          </button>
        </div>
      </div>

      {/* <div className="
      mx-auto mt-8 grid max-w-3xl grid-cols-1
      gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3"> */}
      <div className="mx-auto mt-8 max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2 lg:col-start-1">
          {/* Description list */}
          <section aria-labelledby="applicant-information-title">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2
                  id="applicant-information-title"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Informations
                </h2>
                {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Personal details and application.
                </p> */}
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Référence
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {mission?.reference ?? '-'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Prix</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {/* @ts-ignore */}
                      { mission ? `${(mission?.MissionLine.reduce((accumulator: number, currentline: MissionLine) => accumulator + (currentline.quantity * currentline.price), 0) ?? 0) / 100}€` : '-'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Facturé le</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      { mission?.billedAt ? new Date(mission.billedAt).toLocaleDateString(new Intl.Locale('fr')) : '-'}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {mission?.comment ?? '-'}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex justify-between items-center w-full mb-4">
                      <dt className="text-sm font-medium text-gray-500">
                        Détail
                      </dt>
                      <Link
                        to={`/missions/${mission?.id}/lines`}
                        className="bg-cyan-700 text-white px-4 py-1.5 rounded-md text-xs"
                      >
                        Ajouter
                      </Link>
                    </div>
                    <dd className="mt-1 text-sm text-gray-900">
                      <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
                        {/* @ts-ignore */}
                        {mission?.MissionLine.map((line: MissionLine) => (
                          <li
                            key={line.id}
                            className="flex flex-col items-center gap-y-2 py-3 pl-3 pr-4 text-sm"
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex w-0 flex-1 items-center">
                                <DocumentIcon
                                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                                  aria-hidden="true"
                                />
                                <span className="ml-2 w-0 flex-1 truncate">
                                  {line.title}
                                </span>
                              </div>
                              <div className="flex ml-4 flex-shrink-0">
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <Link to={`/missions/${mission.id}/lines/${line.id}`}>
                                  <button
                                    type="button"
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                  >
                                    <PencilIcon
                                      className="h-4 w-4 flex-shrink-0 text-gray-400 mr-2"
                                      aria-hidden="true"
                                    />
                                  </button>
                                </Link>
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <Form method="DELETE">
                                  <button
                                    type="submit"
                                    name="action"
                                    value={`delete.mission.line.${line.id}`}
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                  >
                                    <TrashIcon
                                      className="h-4 w-4 flex-shrink-0 text-gray-400 mr-2"
                                      aria-hidden="true"
                                    />
                                  </button>
                                </Form>
                              </div>
                            </div>
                            <div className="flex flex-col items-start w-full pl-6 text-xs">
                              <div className="flex items-center justify-between">
                                <CurrencyEuroIcon
                                  className="h-4 w-4 flex-shrink-0 text-gray-400 mr-2"
                                  aria-hidden="true"
                                />
                                <span>
                                  {`${line.quantity + line.unit} * ${line.price / 100}€`}
                                  {'  '}
                                  =
                                  {'  '}
                                  { (line.quantity * line.price) / 100}
                                  €
                                </span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>
        </div>

        {/* <section aria-labelledby="timeline-title" className="lg:col-span-1 lg:col-start-3">
          <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
            <h2 id="timeline-title" className="text-lg font-medium text-gray-900">
              Timeline
            </h2>

            <div className="mt-6 flow-root">
              <ul className="-mb-8">
                {timeline.map((item, itemIdx) => (
                  <li key={item.id}>
                    <div className="relative pb-8">
                      {itemIdx !== timeline.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={classNames(
                              item.type.bgColorClass,
                              'h-8 w-8 rounded-full flex items-center
                              justify-center ring-8 ring-white',
                            )}
                          >
                            <item.type.icon className="h-5 w-5 text-white" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">
                              {item.content}
                              {' '}
                              <span className="font-medium text-gray-900">
                                {item.target}
                              </span>
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            <time dateTime={item.datetime}>{item.date}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="justify-stretch mt-6 flex flex-col">
              <button
                type="button"
                className="
                inline-flex items-center justify-center rounded-md
                border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium
                 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2
                  focus:ring-blue-500 focus:ring-offset-2"
              >
                Advance to offer
              </button>
            </div>
          </div>
        </section> */}
      </div>
    </main>
  );
}
