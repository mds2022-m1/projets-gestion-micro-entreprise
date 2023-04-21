import type { DataFunctionArgs, Session, LoaderArgs } from '@remix-run/node';
import { getSession } from '~/utils/session.server';
import type { User, Organization } from '@prisma/client';
import {
  createMission, findMission,
  findOrganization,
  getAllOrganization, updateMission,
} from '~/utils/repository.server';
import { redirect } from '@remix-run/node';
import { validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';
import { z } from 'zod';
import { delay } from '~/utils/functions';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { MissionForm } from '~/components/form/MissionForm';

export const loader = async ({ params }: LoaderArgs) => {
  const organizations = await getAllOrganization();
  const mission = await findMission(params.mission!);
  return {
    organizations,
    mission,
  };
};

export const validator = withZod(
  z.object({
    title: z
      .string()
      .min(1, { message: 'Le titre est requis' }),
    reference: z
      .string()
      .min(1, { message: 'La référence est requise' }),
    comment: z
      .string()
      .nullable(),
    billedAt: z
      .string()
      .nullable(),
    organizationId: z
      .string(),
  }),
);

export const action = async ({
  request,
  params,
}: DataFunctionArgs) => {
  const result = await validator.validate(
    await request.formData(),
  );

  if (result.error) {
    // validationError comes from `remix-validated-form`
    return validationError(result.error);
  }

  const {
    title, reference, comment, billedAt, organizationId,
  } = result.data;
  const session: Session = await getSession(request.headers.get('Cookie'));
  const user: User = session.get('_session');

  const organization: Organization | null = await findOrganization(organizationId);
  if (!organization) {
    return validationError({
      formId: 'form-update-mission',
      fieldErrors: { organization: 'Organisation introuvable' },
    });
  }

  await updateMission({
    id: params.mission, title, reference, comment, deposit: 1, organization, billedAt, user,
  });

  await delay(500);

  return redirect(`/missions/${params.mission}`);
};

export default function EditMission() {
  const { organizations } = useLoaderData<typeof loader>();
  const { mission } = useLoaderData<typeof loader>();

  const navigation = useNavigate();

  return (
    <div className="lg:ml-64 flex flex-col justify-center items-center">
      <MissionForm
        id="form-update-mission"
        method="post"
        validator={validator}
        organizations={organizations}
        mission={mission ?? undefined}
        onCancel={() => navigation('/missions')}
      />
    </div>
  );
}
