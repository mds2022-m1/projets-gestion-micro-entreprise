import type { LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { findOrganization } from '~/utils/repository.server';

export const loader = async ({ params }: LoaderArgs) => {
  const organization = await findOrganization(params.organization!);
  return organization;
};

export default function OrganizationDetail() {
  const organization = useLoaderData<typeof loader>();
  return (
  // <main className="mx-auto max-w-4xl">
  //   <h1 className="my-6 border-b-2 text-center text-3xl">
  //     The post title:
  //     {' '}
  //     {/* {post.id} */}
  //   </h1>
  // </main>
    <p>{organization?.name}</p>
  );
}
