import React from 'react';
import { ReactComponent as InstagramIcon } from '../assets/icons/InstagramIcon.svg';
import { ReactComponent as LinkedinIcon } from '../assets/icons/linkedInIcon.svg';
import { ReactComponent as FbIcon } from '../assets/icons/facebookIcon.svg';

const Footer = () => {
  return (
    <div className=" bg-int-dark-blue flex justify-center ">
      <div className="h-[50px] max-w-[1521px] w-screen flex flex-row items-center justify-between">
        <div className="flex flex-row ml-[20px] items-center">
          {/* <div className="mr-[15px]">
            <InstagramIcon />
          </div> */}
          <div className="mr-[15px]">
            <a
              href="https://www.linkedin.com/company/intensivkontakt"
              target="_blank"
              rel="noreferrer"
            >
              <LinkedinIcon />
            </a>
          </div>
          {/* <div className="mr-[15px]">
            <FbIcon />
          </div> */}
          <div className="flex items-center">
            <span className="text-[11px] text-int-mid-blue mr-[60px]">IntensivKontakt® 2022</span>
          </div>
        </div>
        <div className="mr-[10px] ml-[10px] flex flex-row w-[500px] justify-between">
          <a
            className="text-[11px] mx-[5px] text-int-mid-blue"
            href="mailto:info@intensivkontakt.de"
          >
            info@intensivkontakt.de
          </a>
          <a
            className="text-[11px] mx-[5px] text-int-mid-blue whitespace-nowrap"
            href="tel:+4940524796030"
          >
            +49 (40) 524796030
          </a>
          <a
            className="text-[11px] mx-[5px] text-int-mid-blue"
            href="https://www.intensivkontakt.de/impressum"
            target="_blank"
            rel="noreferrer"
          >
            Impressum
          </a>
          <a
            className="text-[11px] mx-[5px] text-int-mid-blue"
            href="https://www.intensivkontakt.de/datenschutz"
            target="_blank"
            rel="noreferrer"
          >
            Datenschutz
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
