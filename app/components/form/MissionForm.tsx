import { FormInput } from '~/components/form/FormInput';
import { SubmitButton } from '~/components/form/SubmitButton';
import type { Validator } from 'remix-validated-form';
import { useField, ValidatedForm } from 'remix-validated-form';
import type { Organization, Mission } from '@prisma/client';
import type { FormMethod } from '@remix-run/react';

type MissionFormProps = {
  id: string,
  method: FormMethod,
  validator: Validator<any>,
  organizations: Omit<Organization, 'createdAt'>[],
  mission?: Omit<Mission, 'createdAt'>,
  onCancel: Function
};
export function MissionForm({
  id, method, validator, organizations, mission, onCancel,
}: MissionFormProps) {
  const organizationIdError = useField('organizationId', { formId: 'form-new-mission' }).error;

  return (
    <ValidatedForm id={id} validator={validator} className="space-y-8 divide-y divide-gray-200" method={method}>
      <div className="space-y-8 divide-y divide-gray-200">
        <div className="pt-8">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Créer une mission</h3>
          </div>
          <div className="mt-6">
            <div className="sm:col-span-4">
              <FormInput id="title" name="title" type="text" label="Titre" defaultValue={mission?.title} />
            </div>
            <div className="sm:col-span-4">
              <FormInput id="reference" name="reference" type="text" label="Référence" defaultValue={mission?.reference} />
            </div>
            <div className="sm:col-span-4">
              <FormInput id="comment" name="comment" type="text" label="Commentaire" defaultValue={mission?.comment ?? undefined} />
            </div>
            <div className="sm:col-span-4">
              <FormInput id="billedAt" name="billedAt" type="date" label="Facturation le" defaultValue={mission?.billedAt?.toLocaleDateString() ?? undefined} />
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="organizationId" className="block text-sm font-medium text-gray-700">
                Organisation
              </label>
              <div className="mt-1">
                <select
                  id="organizationId"
                  name="organizationId"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  defaultValue={mission?.organizationId}
                >
                  { organizations.map((organization) => (
                    // eslint-disable-next-line max-len
                    <option key={organization.id} value={organization.id}>{organization.name}</option>
                  ))}
                </select>
              </div>
              {organizationIdError && (
                <span className="text-red-600">{organizationIdError}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => onCancel()}
          >
            Annuler
          </button>
          <SubmitButton label="Enregistrer" submittingLabel="Enregistrement ..." type="edition" />
        </div>
      </div>
    </ValidatedForm>
  );
}
