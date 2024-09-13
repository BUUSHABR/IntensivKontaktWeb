import { useEffect, useMemo, useState } from 'react';
import classnames from 'classnames';
import { useField } from 'formik';

interface InputProps {
  id?: string;
  type?: string;
  name?: string;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  onBlur?: any;
  isLoginInput?: boolean;
}

export function FInput(props: InputProps) {
  const [field] = useField({ name: props.name || '' });
  const [focused, setFocused] = useState(false);

  // Only for isLoginInput components
  const [isShowPlaceholder, setIsShowPlaceholder] = useState(true);

  useEffect(() => {
    if (field.value) {
      setFocused(true);
    } else {
      setFocused(false);
    }
    //eslint-disable next line
  }, [field.value]);

  useEffect(() => {
    if (props.isLoginInput) {
      let inputFounded = false;
      let count = 0;
      const interval = setInterval(() => {
        count++;
        const prefillingInput = document.querySelector(
          'input#password:-webkit-autofill',
        ) as HTMLInputElement;
        if (prefillingInput) {
          inputFounded = true;
          setIsShowPlaceholder(false);
        }

        if (inputFounded || count === 120) {
          clearInterval(interval);
        }
      }, 30);
      return () => {
        clearInterval(interval);
      };
    }
  }, [props.isLoginInput]);

  const inputClass = useMemo(() => {
    return classnames(
      'border inline-block text-int-grey-60 p-[10px] rounded-[4px] w-full outline-none',
      {
        'border-red-600': props.error,
        'border-int-mid-blue': !props.error,
      },
    );
  }, [props.error]);

  const labelClass = useMemo(() => {
    return classnames('absolute left-2 transition-all transform cursor-auto pointer-events-none', {
      'text-int-red': props.error,
      'top-1/2 -translate-y-1/2': !focused,
      'top-[2px] text-[10px] leading-4': !isShowPlaceholder && props.isLoginInput && !focused,
      '-top-[8px] text-[10px] leading-4': focused,
    });
  }, [props.error, focused, isShowPlaceholder, props.isLoginInput]);
  return (
    <div className={`mb-2 ${props.className}`}>
      <div className="mb-1 relative">
        <input
          id={props.id}
          type={props.type}
          className={`${inputClass} rounded-[8px]`}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            if (!field.value) {
              setFocused(false);
            }
            field.onBlur(e);
            if (props.onBlur) {
              props.onBlur(e);
            }
          }}
          name={field.name}
          value={field.value}
          onChange={field.onChange}
        />
        <label className={labelClass}>
          <div className="px-[2px] text-center">
            <span className="relative z-10 text-int-grey-60">{props.placeholder}</span>
            {focused && (
              <div
                className={`bg-white left-0 w-full h-[2px] top-[9px] transform -translate-y-1/2 absolute z-0`}
              ></div>
            )}

            {!isShowPlaceholder && props.isLoginInput && !focused && (
              <div className="bg-white left-0 w-full h-[3px] top-[7px] transform -translate-y-1/2 absolute z-0"></div>
            )}
          </div>
        </label>
      </div>
      {props.error && props.errorMessage && (
        <span className="text-red-600 font-BeVietnamRegular text-button">{props.errorMessage}</span>
      )}
    </div>
  );
}