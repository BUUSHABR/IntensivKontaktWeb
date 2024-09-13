import React from 'react';
import { ReactComponent as RightArrow } from '../../../assets/icons/chevron.right-gray.svg';
import { ReactComponent as HourglassOrangeIcon } from '../../../assets/icons/hourglass-orange.svg';
import { ReactComponent as CheckedGreenIcon } from '../../../assets/icons/checked-green.svg';

type InvitationItemType = {
  email: string;
  phone: string;
  approved: boolean;
  onClick?: () => void;
};

const InvitationItem = ({ email, phone, approved, onClick }: InvitationItemType) => {
  return (
    <div
      className="w-[100%] pt-[10px] px-[16px] pb-[12px] bg-[#FFF] mt-[8px] mb-[8px] rounded-[10px] shadow-resultCard cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-center flex-wrap gap-5">
        <div className="flex items-center">
          <div
            className={`flex justify-center items-center mr-[12px] w-[30px] h-[30px] rounded-md ${
              approved ? 'bg-[#D0E0CA]' : 'bg-[#F0DECE]'
            } `}
          >
            {approved ? <CheckedGreenIcon /> : <HourglassOrangeIcon />}
          </div>
          <span className="text-int-black">
            {email !== '' ? email : phone}
          </span>
        </div>

        <RightArrow />
      </div>
    </div>
  );
};

export default InvitationItem;
