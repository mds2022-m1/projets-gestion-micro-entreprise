import { FormInput } from '~/components/form/FormInput';
import { SubmitButton } from '~/components/form/SubmitButton';
import type { Validator } from 'remix-validated-form';
import { ValidatedForm } from 'remix-validated-form';
import type { FormMethod } from '@remix-run/react';
import type { MissionLine } from '@prisma/client';

type MissionLineFormProps = {
  id: string,
  method: FormMethod,
  validator: Validator<any>,
  missionLine?: Omit<MissionLine, 'createdAt'>,
  onCancel: Function
};
export function MissionLineForm({
  id, method, validator, missionLine, onCancel,
}: MissionLineFormProps) {
  return (
    <ValidatedForm id={id} validator={validator} className="space-y-8 divide-y divide-gray-200" method={method}>
      <div className="space-y-8 divide-y divide-gray-200">
        <div className="pt-8">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">{missionLine ? 'Modifier un élément de mission' : 'Créer un élément de mission'}</h3>
          </div>
          <div className="mt-6">
            <div className="sm:col-span-4">
              <FormInput id="title" name="title" type="text" label="Titre" defaultValue={missionLine?.title} />
            </div>
            <div className="sm:col-span-4">
              <FormInput id="quantity" name="quantity" type="number" label="Quantité" defaultValue={missionLine?.quantity.toString()} />
            </div>
            <div className="sm:col-span-4">
              <FormInput id="price" name="price" type="number" label="Prix" defaultValue={missionLine?.price ? (missionLine.price / 100)?.toString() : undefined} />
            </div>
            <div className="sm:col-span-4">
              <FormInput id="unit" name="unit" type="text" label="Unité" defaultValue={missionLine?.unit} />
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
