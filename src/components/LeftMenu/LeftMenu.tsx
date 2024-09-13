import { NavLink } from 'react-router-dom';
import { ReactComponent as NewsIcon } from '../../assets/icons/newsIcon.svg';
import { ReactComponent as DiashowIcon } from '../../assets/icons/diashowIcon.svg';
import { ReactComponent as MehrIcon } from '../../assets/icons/mehrIcon.svg';
import React, { useState } from 'react';
import { Modal } from '../Layout/Modal';
import AccountModalContent from './AccountModalContent';
import DatensicherheitModalContent from './DatensicherheitModalContent';
import LogoutModalContent from './LogoutModalContent';

export function LeftMenu() {
  const [isAccountModal, setIsAccountModal] = useState<boolean>(false);
  const [isDatensicherheitModal, setIsDatensicherheitModal] = useState<boolean>(false);
  const [isLogoutModal, setIsLogoutModal] = useState<boolean>(false);

  return (
    <div className="w-[120px] bg-[#ECEFF0] h-[calc(100vh-88px)] flex items-center flex-col justify-between border-r border-[#D3E4E8] min-w-[120px]">
      <div>
        <NavLink
          to="/news"
          className="flex items-center flex-col mb-[25px] mt-[35px] cursor-pointer"
        >
          {({ isActive }) => (
            <>
              <NewsIcon fill={isActive ? '#56A0BB' : '#6F7782'} />
              <div className={isActive ? 'text-sm mt-1 text-[#56A0BB]' : 'text-sm mt-1 '}>News</div>
            </>
          )}
        </NavLink>
        <NavLink
          to="/diashow"
          className="flex items-center flex-col mb-[25px] mt-[14px] cursor-pointer"
        >
          {({ isActive }) => (
            <>
              <DiashowIcon fill={isActive ? '#56A0BB' : '#6F7782'} />
              <div className={isActive ? 'text-sm mt-1 text-[#56A0BB]' : 'text-sm mt-1 '}>
                Diashows
              </div>
            </>
          )}
        </NavLink>
        <NavLink
          to="/mehr"
          className="flex items-center flex-col mb-[25px] mt-[14px] cursor-pointer"
        >
          {({ isActive }) => (
            <>
              <MehrIcon fill={isActive ? '#56A0BB' : '#6F7782'} />
              <div className={isActive ? 'text-sm mt-1 text-[#56A0BB]' : 'text-sm mt-1 '}>Mehr</div>
            </>
          )}
        </NavLink>
      </div>

      <div className="flex flex-col text-[11px]">
        <a 
          className="mb-[20px] cursor-pointer" 
          href="https://www.intensivkontakt.de/support" 
          target="_blank"
        >
          Hilfe
        </a>
        <span
          className="mb-[20px] cursor-pointer"
          onClick={() => {
            setIsDatensicherheitModal(true);
          }}
        >
          Datensicherheit
        </span>
        <span
          className="mb-[20px] cursor-pointer "
          onClick={() => {
            setIsAccountModal(true);
          }}
        >
          Account löschen
        </span>
        <span className="mb-[20px] cursor-pointer" onClick={() => setIsLogoutModal(true)}>
          Abmelden
        </span>
      </div>

      {isAccountModal && (
        <Modal
          closeModal={() => setIsAccountModal(false)}
          title={(
            <b>Account löschen</b>
          )}
        >
          <AccountModalContent closeModal={() => setIsAccountModal(false)} />
        </Modal>
      )}
      {isDatensicherheitModal && (
        <Modal
          closeModal={() => setIsDatensicherheitModal(false)}
          title={(
            <b>Datensicherheit</b>
          )}
        >
          <DatensicherheitModalContent />
        </Modal>
      )}
      {isLogoutModal && (
        <Modal
          closeModal={() => setIsLogoutModal(false)}
          title={(
            <b>Abmelden</b>
          )}
        >
          <LogoutModalContent closeModal={() => setIsLogoutModal(false)} />
        </Modal>
      )}
    </div>
  );
}
