import { useField } from 'remix-validated-form';

type FormInputProps = {
  id: string,
  name: string,
  type: 'text' | 'email' | 'color' | 'date',
  label: string,
  value?: string,
  defaultValue?:string
};
export function FormInput({
  id, name, type, label, value, defaultValue,
}: FormInputProps) {
  const { error } = useField(name);
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id}
          name={name}
          type={type}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={value}
          defaultValue={defaultValue}
        />
      </div>
      {error && (
        <span className="text-red-600">{error}</span>
      )}
    </div>
  );
}
