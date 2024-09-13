import React from 'react';
import StudieIcon from '../../assets/icons/StudieIcon.svg';
import messageIcon from '../../assets/icons/messageIcon.svg';
import quitIcon from '../../assets/icons/quit.svg';
import background from '../../assets/icons/auth-background.png';
import linkedInIcon from '../../assets/icons/linkedInIcon.svg';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as IntensiveIcon } from './../../assets/icons/intenciveIcon.svg';
import { ReactComponent as DataProtectionIcon } from './../../assets/icons/data-protection.svg';
import { ReactComponent as Logo } from './../../assets/icons/logo-white.svg';
import InstagramIcon from '../../assets/icons/InstagramIcon.svg';
import FbIcon from '../../assets/icons/facebookIcon.svg';

type AuthLayoutPropsType = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutPropsType) => {
  const navigate = useNavigate();

  const locateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="h-screen bg-[#ECEFF0] md:h-auto">
      <div className="bg-[#FAFAFA] justify-end flex h-[38px] items-center xl:hidden ">
        <div className="flex mr-[131px]">
          {/*Temporary hidden until Studie link is available -->*/}
          <div className="flex items-center mr-[34px] cursor-pointer hidden">
            <img src={StudieIcon} />
            <div className="ml-[8px] text-xs">Studie</div>
          </div>
          {/*Temporary hidden until Studie link is available -->*/}
          <a className="flex items-center mr-[34px] cursor-pointer" href="mailto:info@intensivkontakt.de">
            <img src={messageIcon} />
            <div className="ml-[8px] text-xs">Kontakt</div>
          </a>
          <div className="flex items-center cursor-pointer" onClick={() => locateToLogin()}>
            <img src={quitIcon} />
            <div className="ml-[8px] text-xs">Anmelden</div>
          </div>
        </div>
      </div>

      <div
        className="h-[calc(80%-38px)] min-h-[600px] flex justify-center items-center pl-[10px] pr-[10px] xl:h-[80%] sm:h-[100%]"
        style={{
          background: `url(${background}`,
          backgroundSize: '100% auto',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top',
          backgroundColor: '#eaeeef',
        }}
      >
        {children}
      </div>
      <footer className="h-[15%] bg-int-dark-blue flex items-center justify-center min-h-[100px] lg:min-h-[170px] ">
        <div className="w-[1280px] lg:w-[90%] m-auto lg:ml-[20px] my-[5px] flex flex-col justify-between h-[100%] p-[10px] ">
          <div>
            {/* <Logo /> */}
            <div className="flex  lg:flex-col mt-[10px]">
              <a href="https://www.instagram.com/intensivkontakt/" target="_blank" className="footer_social-link w-inline-block p-[5px]" rel="noreferrer">
                <img className="mb-[10px] lg:mb-[10px] mx-[5px]" src={InstagramIcon} alt="#" />
              </a>
              <a href="https://www.linkedin.com/company/intensivkontakt/" target="_blank" className="footer_social-link w-inline-block  p-[5px]" rel="noreferrer">
                <img className="mb-[10px] lg:mb-[10px] mx-[5px]" src={linkedInIcon} alt="#" />
              </a>
              <a href="https://www.facebook.com/people/IntensivKontakt/100092273649855/" target="_blank" className="footer_social-link w-inline-block  p-[5px]" rel="noreferrer">
                <img className="mb-[10px] lg:mb-[10px] mx-[5px]" src={FbIcon} alt="#" />
              </a>

            </div>
            <div className="flex text-xs gap-x-9 lg:flex-col ">
            <div className="text-xs text-int-mid-blue w-[50%]">IntensivKontakt® 2022</div>
                <a
                  className="text-int-mid-blue mx-[5px]"
                  href="mailto:info@intensivkontakt.de"
                >
                  info@intensivkontakt.de
                </a>
                <a
                  className="text-int-mid-blue mx-[5px] whitespace-nowrap"
                  href="tel:+4940524796030"
                >
                  +49 (40) 524796030
                </a>
                <a
                  className="text-int-mid-blue mx-[5px]"
                  href="https://www.intensivkontakt.de/impressum"
                  target="_blank"
                  rel="noreferrer"
                >
                  Impressum
                </a>
                <a
                  className="text-int-mid-blue mx-[5px]"
                  href="https://www.intensivkontakt.de/datenschutz"
                  target="_blank"
                  rel="noreferrer"
                >
                  Datenschutz
                </a>
            </div>
          </div>
          </div>
      </footer>
    </div>
  );
};

export default AuthLayout;