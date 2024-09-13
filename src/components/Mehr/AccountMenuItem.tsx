import React from 'react';
import { ReactComponent as RightArrowWhite } from '../../assets/icons/chevron.right-white.svg';
import { ReactComponent as RightArrow } from '../../assets/icons/chevron.right-gray.svg';
import { ReactComponent as RightArrowDisabled } from '../../assets/icons/chevron.right-dis.svg';

type AccountMenuItemType = {
  title: string;
  active: boolean;
  onClick: () => void;
  icon: any;
  bgIcon: string;
  disabled?: boolean;
  counter?: number;
};

const AccountMenuItem = ({
  title,
  active,
  onClick,
  icon,
  bgIcon,
  disabled,
  counter,
}: AccountMenuItemType) => {
  return (
    <div
      className={`pt-[10px] px-[16px] pb-[10px] mt-[8px] rounded-[10px] relative before:-z-[1] shadow-resultCard ${
        !disabled && 'cursor-pointer'
      }  ${active ? 'bg-int-dark-blue text-[#ffffff]' : 'bg-[#fff] text-[#000000]'}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex justify-between items-center flex-wrap gap-5">
        <div className="flex flex-row items-center">
          <div
            className="flex justify-center items-center w-[30px] h-[30px] rounded-md"
            style={{ backgroundColor: bgIcon }}
          >
            {icon}
          </div>
          <span className={`ml-[12px] ${disabled && 'text-[#c8ccd2]'} `}>{title}</span>
        </div>
        <div className="flex items-center">
          {counter! > 0 && <div className="w-[26px] h-[26px] text-[#FFFFFF] bg-[#EB5757] rounded-full flex justify-center items-center mr-[10px]">{counter}</div>}
          {disabled ? <RightArrowDisabled /> : active ? <RightArrowWhite /> : <RightArrow />}
        </div>
      </div>
    </div>
  );
};

export default AccountMenuItem;
