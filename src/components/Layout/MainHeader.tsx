import React from 'react';
import StudieIcon from '../../assets/icons/StudieIcon.svg';
import messageIcon from '../../assets/icons/messageIcon.svg';
import quitIcon from '../../assets/icons/quit.svg';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hoc';

const MainHeader = () => {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const locateToLogin = () => {
    navigate('/login');
    logout();
  };

  return (
    <div className="bg-[#FAFAFA] justify-end flex h-[38px] items-center xl:hidden ">
      <div className="flex mr-[131px]">
        {/*Temporary hidden until Studie link is available -->*/}
        <div className="flex items-center mr-[34px] cursor-pointer hidden">
          <img src={StudieIcon} />
          <div className="ml-[8px] text-xs">Studie</div>
        </div>
        {/*Temporary hidden until Studie link is available -->*/}
        <div className="flex items-center mr-[34px] cursor-pointer">
          <img src={messageIcon} />
          <div className="ml-[8px] text-xs">Kontakt</div>
        </div>
        <div className="flex items-center cursor-pointer" onClick={() => locateToLogin()}>
          <img src={quitIcon} />
          <div className="ml-[8px] text-xs">Anmelden</div>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
