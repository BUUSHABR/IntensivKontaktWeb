import React, { ReactChild, ReactChildren } from 'react';
import { ReactComponent as Arrow } from '../../assets/icons/chevron.left.svg';

export type OnboardingItemLayoutPropsType = {
  children: ReactChildren | ReactChild;
  backLink?: () => void;
  progressWidthPercent: number;
};

const OnboardingItemLayout = ({
  children,
  backLink,
  progressWidthPercent,
}: OnboardingItemLayoutPropsType) => {
  return (
    <div className="flex pl-[10px] pr-[10px] relative w-full min-h[450px]">
      <div className="flex flex-col rounded-[15px] w-full">
        <div className="flex items-center gap-2 w-full justify-center mb-12">
          <div className="cursor-pointer flex-none" onClick={backLink}>
            <Arrow />
          </div>
          <div className="grow text-center">
            <div className="text-black font-BeVietnamBold text-h3 text-center">
              Angehörigen finden
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="w-[100%] bg-[#CBCFD5] rounded-[100px] h-[8px] relative">
            <div
              className={`absolute bg-int-dark-blue h-[100%] top-0 left-0 rounded-[100px]`}
              style={{ width: `${progressWidthPercent}%` }}
            ></div>
          </div>
        </div>
        {/**/}
        <div className="px-[20px] w-[100%]">{children}</div>
      </div>
    </div>
  );
};

export default OnboardingItemLayout;
