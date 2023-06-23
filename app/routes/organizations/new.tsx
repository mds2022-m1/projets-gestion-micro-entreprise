import type { DataFunctionArgs, Session } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { getSession } from '~/utils/session.server';
import type { OrganizationType, User } from '@prisma/client';
import { createOrganization, findOrganizationType, getAllOrganizationType } from '~/utils/repository.server';
import { validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';
import { z } from 'zod';
import { delay } from '~/utils/functions';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { OrganizationForm } from '~/components/form/OrganizationForm';

export const loader = async () => getAllOrganizationType();

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
      formId: 'form-new-organization',
      fieldErrors: { organizationTypeId: "Type d'organisation introuvable" },
    });
  }

  await createOrganization({
    name, reference, email, phone, address, siret, organizationType, user,
  });

  await delay(500);

  return redirect('/organizations');
};

export default function NewOrganization() {
  const organizationTypes = useLoaderData<typeof loader>();

  const navigation = useNavigate();

  return (
    <div className="lg:ml-64 flex flex-col justify-center items-center">
      <OrganizationForm
        id="form-new-organization"
        method="post"
        validator={validator}
        organizationTypes={organizationTypes}
        onCancel={() => navigation('/organizations')}
      />
    </div>
  );
}
