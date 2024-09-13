import React from 'react';
import { ReactComponent as RightArrow } from '../../../assets/icons/chevron.right-gray.svg';

type PatientInvitationItemType = {
  firstName: string;
  lastName: string;
  onClick?: () => void;
};

const PatientInvitationItem = ({ firstName, lastName, onClick }: PatientInvitationItemType) => {
    return (
        <div
            className="w-[100%] pt-[10px] px-[16px] pb-[12px] bg-[#FFF] mt-[8px] mb-[8px] rounded-[10px] shadow-resultCard cursor-pointer"
            onClick={onClick}
        >
            <div className="flex justify-between items-center flex-wrap gap-5">
                <div className="flex items-center">
          <span className="text-int-black">
            {firstName} {lastName}
          </span>
                </div>
                <div className="flex items-center">
                    <div className="w-[26px] h-[26px] text-[#FFFFFF] bg-[#EB5757] rounded-full flex justify-center items-center mr-[10px]">
                        1
                    </div>
                    <RightArrow />
                </div>
            </div>
        </div>
    );
};

export default  PatientInvitationItem;