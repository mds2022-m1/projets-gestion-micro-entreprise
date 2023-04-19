import { FormInput } from '~/components/form/FormInput';
import { SubmitButton } from '~/components/form/SubmitButton';
import type { Validator } from 'remix-validated-form';
import { useField, ValidatedForm } from 'remix-validated-form';
import type { Organization, OrganizationType } from '@prisma/client';
import type { FormMethod } from '@remix-run/react';

type OrganizationFormProps = {
  id: string,
  method: FormMethod,
  validator: Validator<any>,
  organizationTypes: Omit<OrganizationType, 'createdAt'>[],
  organization?: Omit<Organization, 'createdAt'>,
  onCancel: Function,
  onSubmit?: any,
};
export function OrganizationForm({
  id, method, validator, organizationTypes, organization, onCancel, onSubmit,
}: OrganizationFormProps) {
  const organizationTypeIdError = useField('organizationTypeId', { formId: 'form-new-organization' }).error;

  return (
    <ValidatedForm id={id} validator={validator} className="space-y-8 divide-y divide-gray-200" method={method} onSubmit={onSubmit}>
      <div className="space-y-8 divide-y divide-gray-200">
        <div className="pt-8">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Créer une organisation</h3>
          </div>
          <div className="mt-6">
            <div className="sm:col-span-4">
              <FormInput id="name" name="name" type="text" label="Nom" defaultValue={organization?.name} />
            </div>
            <div className="sm:col-span-4">
              <FormInput id="reference" name="reference" type="text" label="Référence" defaultValue={organization?.reference} />
            </div>
            <div className="sm:col-span-4">
              <FormInput id="email" name="email" type="email" label="Email" defaultValue={organization?.email} />
            </div>
            <div className="sm:col-span-4">
              <FormInput id="phone" name="phone" type="text" label="Téléphone" defaultValue={organization?.phone} />
            </div>
            <div className="sm:col-span-4">
              <FormInput id="address" name="address" type="text" label="Adresse" defaultValue={organization?.address} />
            </div>
            <div className="sm:col-span-4">
              <FormInput id="siret" name="siret" type="text" label="Numéro de SIRET" defaultValue={organization?.siret} />
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="organizationTypeId" className="block text-sm font-medium text-gray-700">
                Type d&apos;organisation
              </label>
              <div className="mt-1">
                <select
                  id="organizationTypeId"
                  name="organizationTypeId"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  defaultValue={organization?.organizationTypeId}
                >
                  { organizationTypes.map((organizationType) => (
                    // eslint-disable-next-line max-len
                    <option key={organizationType.id} value={organizationType.id}>{organizationType.name}</option>
                  ))}
                </select>
              </div>
              {organizationTypeIdError && (
                <span className="text-red-600">{organizationTypeIdError}</span>
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
