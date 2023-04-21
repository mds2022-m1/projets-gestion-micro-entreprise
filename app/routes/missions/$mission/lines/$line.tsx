import type { DataFunctionArgs, LoaderArgs } from '@remix-run/node';
import {
  createMissionLine, findMission, findMissionLine, updateMissionLine,

} from '~/utils/repository.server';
import { redirect } from '@remix-run/node';
import { validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';
import { z } from 'zod';
import { delay } from '~/utils/functions';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { MissionLineForm } from '~/components/form/MissionLineForm';

export const loader = async ({ params }: LoaderArgs) => {
  const mission = await findMission(params.mission!);
  const missionLine = await findMissionLine(params.line!);
  return {
    mission,
    missionLine,
  };
};

export const validator = withZod(
  z.object({
    title: z
      .string()
      .min(1, { message: 'Le titre est requis' }),
    quantity: z
      .string()
      .min(1, { message: 'La quantité est requise' }),
    price: z
      .string()
      .min(1, { message: 'Le prix est requis' }),
    unit: z
      .string()
      .min(1, { message: 'L\'unité est requise' }),
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
    title, quantity, price, unit,
  } = result.data;

  await updateMissionLine({
    // eslint-disable-next-line max-len
    id: params.line!, title, quantity: parseInt(quantity, 10), price: parseFloat(price), unit, missionId: params.mission!,
  });

  await delay(500);

  return redirect(`/missions/${params.mission}`);
};

export default function NewMissionLine() {
  const { mission } = useLoaderData<typeof loader>();
  const { missionLine } = useLoaderData<typeof loader>();

  const navigation = useNavigate();

  return (
    <div className="lg:ml-64 flex flex-col justify-center items-center">
      <MissionLineForm
        id="form-new-mission-line"
        method="post"
        validator={validator}
        missionLine={missionLine ?? undefined}
        onCancel={() => navigation(`/missions/${mission?.id}`)}
      />
    </div>
  );
}
