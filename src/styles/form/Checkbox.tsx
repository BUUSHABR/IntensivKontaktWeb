import { Field } from 'formik';

interface CheckboxProps {
  id?: string;
  type?: string;
  name?: string;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  children: any;
  className?: string;
}

export function FCheckbox(props: CheckboxProps) {
  return (
    <div className={`mb-4 ${props.className}`}>
      <label className="flex checkbox-field mb-1">
        <Field
          type="checkbox"
          name={props.name}
          className="w-6 min-w-[24px] h-6 mr-2 rounded border border-int-mid-blue"
        ></Field>
        <span className="checkmark"></span>
        {props.children}
      </label>
      {props.error && props.errorMessage && (
        <span className="text-red-600 font-BeVietnamRegular text-button">{props.errorMessage}</span>
      )}
    </div>
  );
}
