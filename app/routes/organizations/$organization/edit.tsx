import { OrganizationForm } from '~/components/form/OrganizationForm';
import { withZod } from '@remix-validated-form/with-zod';
import { z } from 'zod';
import {
  findOrganization,
  findOrganizationType,
  getAllOrganizationType, updateOrganization,
} from '~/utils/repository.server';
import { useLoaderData, useNavigate } from '@remix-run/react';
import type { LoaderArgs, DataFunctionArgs, Session } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { validationError } from 'remix-validated-form';
import { getSession } from '~/utils/session.server';
import type { OrganizationType, User } from '@prisma/client';
import { delay } from '~/utils/functions';

export const loader = async ({ params }: LoaderArgs) => {
  const organizationTypes = await getAllOrganizationType();
  const organization = await findOrganization(params.organization!);

  return {
    organizationTypes,
    organization,
  };
};
export const validator = withZod(
  z.object({
    name: z
      .string()
      .min(1, { message: 'Le nom est requis' }),
    reference: z
      .string()
      .min(1, { message: 'La référence est requise' }),
    email: z
      .string()
      .min(1, { message: 'L\'email est requis ' })
      .email({ message: 'Le format de l\'email est invalide' }),
    phone: z
      .string()
      .min(10, { message: 'Le téléphone est requis et doit faire au minimum 10 caractères' })
      .max(12, { message: 'Le message doit faire au maximum 12 caractères' })
      .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, { message: 'Le format de téléphone est invalide' }),
    address: z
      .string()
      .min(1, { message: 'L\'adresse est requise ' }),
    siret: z
      .string()
      .length(14, { message: 'Le numéro de SIRET est invalide' }),
    organizationTypeId: z
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
    name, reference, email, phone, address, siret, organizationTypeId,
  } = result.data;
  const session: Session = await getSession(request.headers.get('Cookie'));
  const user: User = session.get('_session');

  const organizationType: OrganizationType | null = await findOrganizationType(organizationTypeId);
  if (!organizationType) {
    return validationError({
      formId: 'form-edit-organization',
      fieldErrors: { organizationTypeId: "Type d'organisation introuvable" },
    });
  }

  await updateOrganization({
    id: params.organization, name, reference, email, phone, address, siret, organizationType, user,
  });

  await delay(500);

  return redirect(`/organizations/${params.organization}`);
};

export default function EditOrganization() {
  const { organizationTypes } = useLoaderData<typeof loader>();
  const { organization } = useLoaderData<typeof loader>();

  const navigation = useNavigate();

  return (
    <div className="lg:ml-64 flex flex-col justify-center items-center">
      <OrganizationForm
        id="form-edit-organization"
        method="put"
        validator={validator}
        organizationTypes={organizationTypes}
        organization={organization ?? undefined}
        onCancel={() => navigation(`/organizations/${organization?.id}`)}
      />
    </div>
  );
}
