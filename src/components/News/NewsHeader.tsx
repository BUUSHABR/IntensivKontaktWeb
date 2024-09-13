import React, { useState } from 'react';
import quitIcon from '../../assets/icons/quit.svg';
import logo from '../../assets/logo/logo_small.png';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../Layout/Modal';
import LogoutModalContent from '../LeftMenu/LogoutModalContent';

const NewsHeader = () => {
  const navigate = useNavigate();

  const [isLogoutModal, setIsLogoutModal] = useState<boolean>(false);

  return (
    <div className="bg-[#FAFAFA] flex justify-center">
      <div className="h-[38px] max-w-[1512px] w-screen flex flex-row justify-between border-b border-[#ECEFF0]">
        <div className="w-[120px] flex justify-center items-center ">
          <img
            src={logo}
            alt="#"
            onClick={() => {
              navigate('/news');
            }}
            className="cursor-pointer w-[24px] h-[24px]"
          />
        </div>
        <div className="flex items-center cursor-pointer" onClick={() => setIsLogoutModal(true)}>
          <img src={quitIcon} alt="#" />
          <div className="mr-2 ml-3 text-[#9BA6B5] text-xs">Abmelden</div>
        </div>
      </div>
      {isLogoutModal && (
        <Modal closeModal={() => setIsLogoutModal(false)} title={(<b>Abmelden</b>)}>
          <LogoutModalContent closeModal={() => setIsLogoutModal(false)} />
        </Modal>
      )}
    </div>
  );
};

export default NewsHeader;
