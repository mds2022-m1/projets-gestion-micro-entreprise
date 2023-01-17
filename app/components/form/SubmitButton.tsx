import { clsx } from 'clsx';
import { useIsSubmitting } from 'remix-validated-form';

type SubmitButtonProps = {
  label: string,
  submittingLabel: string,
  type: 'creation' | 'deletion'
};
export function SubmitButton({ label, submittingLabel, type }: SubmitButtonProps) {
  const isSubmitting = useIsSubmitting();
  return (
    <button
      type="submit"
      className={clsx(
        type === 'creation' && 'bg-indigo-600  hover:bg-indigo-700 focus:ring-indigo-500',
        type === 'deletion' && 'bg-red-600  hover:bg-red-700 focus:ring-red-500',
        'ml-3 inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2',
      )}
    >
      {isSubmitting ? submittingLabel : label}
    </button>
  );
}
