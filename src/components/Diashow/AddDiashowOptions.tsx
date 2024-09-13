import React, { Dispatch, SetStateAction, useMemo, useRef } from 'react';
import useOutsideAlerter from '../util/useOutside';
import { ReactComponent as AudioIcon } from './../../assets/icons/audio-menu.svg';
import { ReactComponent as PhotoIcon } from './../../assets/icons/foto-video-menu.svg';
import { ReactComponent as DiashowIcon } from './../../assets/icons/diashow-menu.svg';
import { ReactComponent as VideoIcon } from './../../assets/icons/videoChooseIcon.svg';
import { useNavigate } from 'react-router-dom';

type AddDiashowOptionsPropsType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  uploadPicture: () => void;
  recordAudio: () => void;
};

const AddDiashowOptions = ({
  open,
  setOpen,
  uploadPicture,
  recordAudio,
}: AddDiashowOptionsPropsType) => {
  const navigate = useNavigate();

  const options = useMemo(() => {
    return [
      {
        value: 1,
        label: 'Foto aufnehmen',
        icon: <PhotoIcon />,
        handleClick: () => navigate('/diashow/photo'),
      },
      {
        value: 2,
        label: 'Video aufnehmen',
        icon: <VideoIcon />,
        handleClick: () => navigate('/diashow/video'),
      },
      {
        value: 3, 
        label: 'Sprachnachricht aufnehmen', 
        icon: <AudioIcon />, 
        handleClick: recordAudio,
      },
      {
        value: 4,
        label: 'Medien hochladen',
        icon: <DiashowIcon />,
        handleClick: uploadPicture,
      },
    ];
  }, [uploadPicture]);

  const container = useRef(null);
  useOutsideAlerter({ ref: container, callback: () => setOpen(false) });

  return (
    <div className="relative bg-red-600" ref={container}>
      {open && (
        <ul className="absolute shadow-card top-full left-0 w-full bg-white border border-t-0 border-int-mid-blue text-int-grey-40 rounded-[11px] z-50  min-w-[260px]">
          {options.map(({ value, label, icon, handleClick }, index) => {
            const chooseOption = () => {
              setOpen(false);
              handleClick();
            };
            return (
              <div key={index}>
                <li
                  className="hover:bg-int-light-blue py-2 px-[13px] cursor-pointer flex items-center text-int-dark-blue text-body"
                  onClick={chooseOption}
                >
                  <div className="mr-[10px] w-[25px] h-[25px] flex items-center justify-center">
                    {icon}
                  </div>
                  <div>{label}</div>
                </li>
                <hr className="bg-int-mid-blue" />
              </div>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AddDiashowOptions;
