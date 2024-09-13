import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import useOutsideAlerter from './../components/util/useOutside';
import { ReactComponent as ArrowSmall } from './../assets/icons/chevron.bottom.gray.svg';

interface OptionProps {
  value: any;
  label: string;
  icon?: string;
}

interface DropdownProps {
  options: Array<OptionProps>;
  onChange?: ({ label, value }: { label: string; value: any }) => void;
  placeholder?: string;
  inputName?: string;
  setIsSearchText?: Dispatch<SetStateAction<boolean>>;
}

export default function SearchDropDown({
  options,
  placeholder,
  onChange,
  setIsSearchText,
}: DropdownProps) {
  const container = useRef(null);
  const [selected, setSelected] = useState(placeholder || '');
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [optionsArr, setOptionsArr] = useState<any[]>();
  useOutsideAlerter({ ref: container, callback: () => setOpen(false) });

  useEffect(() => {
    setSelected(placeholder || '');
  }, [placeholder]);

  const onInputChange = (e: any) => {
    setInputText(e.target.value);
    setOpen(true);
  };

  useEffect(() => {
    setOptionsArr(options);
  }, [options]);

  useEffect(() => {
    const arr = options.filter((o) => {
      return o.label.toLowerCase().includes(inputText.toLowerCase());
    });
    setOptionsArr(arr);

    if (inputText && setIsSearchText) {
      setIsSearchText(true);
    } else {
      setIsSearchText && setIsSearchText(false);
    }
  }, [inputText, setIsSearchText]);

  const handleClick = ({ label, value }: OptionProps) => {
    setSelected(label);
    setInputText('');
    if (onChange) {
      onChange({ label, value });
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={container}>
      <input
        className={`block cursor-pointer h-full bg-white appearance-none w-full border  rounded-[8px] border-int-mid-blue text-int-grey-40 py-[11px] px-[13px] pr-[40px] min-w-[160px] focus:outline-none focus:border-int-mid-blue`}
        placeholder={selected || placeholder}
        onChange={onInputChange}
        onFocus={() => setOpen(true)}
        value={inputText}
      />
      {open && (
        <ul className="absolute shadow-card top-full left-0 w-full bg-white border border-t-0 border-int-mid-blue text-int-grey-40 rounded z-50 max-h-[350px] overflow-auto">
          {optionsArr &&
            optionsArr.map(({ value, label, icon }, index) => (
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
      <div
        className="cursor-pointer absolute inset-y-0 right-2 flex items-center z-10 px-2 text-int-grey-60 "
        onClick={() => setOpen((prev) => !prev)}
      >
        <div>
          <ArrowSmall />
        </div>
      </div>
    </div>
  );
}
