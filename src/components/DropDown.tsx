import { useEffect, useRef, useState } from 'react';
import useOutsideAlerter from './../components/util/useOutside';
import { ReactComponent as ArrowSmall } from './../assets/icons/chevron.bottom.gray.svg';

interface OptionProps {
  value: any;
  label: string;
  icon?: string;
}

interface DropdownProps {
  name?: string;
  id?: string;
  options: Array<OptionProps>;
  onChange?: ({ label, value }: { label: string; value: any }) => void;
  placeholder?: string;
  inputName?: string;
}

export default function Dropdown({
  name,
  id,
  options,
  placeholder,
  onChange,
  inputName,
}: DropdownProps) {
  const container = useRef(null);
  const [selected, setSelected] = useState(placeholder || '');
  const [open, setOpen] = useState(false);
  useOutsideAlerter({ ref: container, callback: () => setOpen(false) });

  useEffect(() => {
    setSelected(placeholder || '');
  }, [placeholder]);

  const handleClick = ({ label, value }: OptionProps) => {
    setSelected(label);
    if (onChange) {
      onChange({ label, value });
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={container}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`block cursor-pointer h-full bg-white appearance-none w-full border  rounded-[8px] border-int-mid-blue text-int-grey-40 py-[11px] px-[13px] pr-[40px] min-w-[160px]`}
      >
        <span>{inputName ? inputName + ': ' + selected : selected}</span>
      </div>
      {open && (
        <ul className="absolute shadow-card top-full left-0 w-full bg-white border border-t-0 border-int-mid-blue text-int-grey-40 rounded z-50 max-h-[350px] overflow-auto">
          {options.map(({ value, label, icon }, index) => (
            <div key={index}>
              <li
                className="hover:bg-int-light-blue py-2 px-[13px] cursor-pointer flex items-center"
                onClick={() => handleClick({ value, label })}
              >
                {label}
              </li>
              <hr className="bg-int-mid-blue" />
            </div>
          ))}
        </ul>
      )}
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-int-grey-60">
        <ArrowSmall />
      </div>
    </div>
  );
}
