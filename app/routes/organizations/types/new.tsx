import type { DataFunctionArgs, Session } from '@remix-run/node';
import { getSession } from '~/utils/session.server';
import type { User } from '@prisma/client';
import { createOrganizationType } from '~/utils/repository.server';
import { redirect } from '@remix-run/node';
import { FormInput } from '~/components/form/FormInput';
import { SubmitButton } from '~/components/form/SubmitButton';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';
import { z } from 'zod';
import { delay } from '~/utils/functions';

export const validator = withZod(
  z.object({
    name: z
      .string()
      .min(1, { message: 'Le nom est requis' }),
    color: z
      .string()
      .length(7, { message: 'La couleur est invalide' }),
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

  const { name, color } = result.data;
  const session: Session = await getSession(request.headers.get('Cookie'));
  const user: User = session.get('_session');

  await createOrganizationType({ name, color, user });
  await delay(500);

  return redirect('/organizations');
};

export default function NewOrganizationType() {
  return (
    <div className="lg:ml-64 flex flex-col justify-center items-center">
      <ValidatedForm validator={validator} className="space-y-8 divide-y divide-gray-200" method="post">
        <div className="space-y-8 divide-y divide-gray-200">
          <div className="pt-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Créer un type d&apos;organisation</h3>
            </div>
            <div className="mt-6">
              <div className="sm:col-span-4">
                <FormInput id="name" name="name" type="text" label="Nom" />
              </div>
              <div className="sm:col-span-4 mt-5">
                <FormInput id="color" name="color" type="color" label="Couleur" defaultValue="#ffffff" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Annuler
            </button>
            <SubmitButton label="Enregistrer" submittingLabel="Enregistrement ..." type="creation" />
          </div>
        </div>
      </ValidatedForm>
    </div>
  );
}
