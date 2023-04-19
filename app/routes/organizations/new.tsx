import type { DataFunctionArgs, LoaderArgs, Session } from '@remix-run/node';
import { getSession } from '~/utils/session.server';
import type { User, OrganizationType } from '@prisma/client';
import {
  createOrganization,
  findOrganizationType,
} from '~/utils/repository.server';
import { redirect } from '@remix-run/node';
import { validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';
import { z } from 'zod';
import { delay } from '~/utils/functions';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { OrganizationForm } from '~/components/form/OrganizationForm';
import { gql, useMutation } from '@apollo/client';

export const loader = async () => {
  const organizationTypes = await getAllOrganizationType();
  return organizationTypes;
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

const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($object: organizations_insert_input!) {
  insert_organizations_one(object: $object) {
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

export default function NewOrganization() {
  const organizationTypes = useLoaderData<typeof loader>();

  const navigate = useNavigate();

  const [createOrganizationMutation] = useMutation(CREATE_ORGANIZATION);

  const handleCreateOrganization = async (formData: FormData, event: SubmitEvent) => {
    event.preventDefault();
    const result = await validator.validate(
      await formData,
    );

    if (result.error) {
      // validationError comes from `remix-validated-form`
      return validationError(result.error);
    }

    const {
      name, reference, email, phone, address, siret, organizationTypeId,
    } = result.data;

    await createOrganizationMutation({
      variables: {
        object: {
          name,
          reference,
          email,
          phone,
          address,
          siret,
          organization_type_id: organizationTypeId,
          user_id: 'd15e2f06-de86-11ed-b5ea-0242ac120002',
        },
      },
    });

    navigate('/organizations');
  };

  return (
    <div className="lg:ml-64 flex flex-col justify-center items-center">
      <OrganizationForm
        id="form-new-organization"
        method="post"
        validator={validator}
        organizationTypes={organizationTypes}
        onCancel={() => navigate('/organizations')}
        onSubmit={(data: any, event: any) => handleCreateOrganization(data, event)}
      />
    </div>
  );
}
