import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { ReactComponent as PhotoIcon } from './../../assets/icons/foto-video-menu.svg';
import { ReactComponent as DiashowIcon } from './../../assets/icons/diashow-menu.svg';
import { ReactComponent as DeleteIcon } from './../../assets/icons/delete-avatar.svg';
import useOutsideAlerter from '../util/useOutside';

type AddAvatarOptionsPropsType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  openAvatarModal: Dispatch<SetStateAction<boolean>>;
  setIsOpenDeleteAvatarModal: Dispatch<SetStateAction<boolean>>;
  avatar: string | null | undefined;
  setIsPhotoAvatarCameraOpen: Dispatch<SetStateAction<boolean>>;
};

const AddAvatarOptions = ({
  open,
  setOpen,
  openAvatarModal,
  setIsOpenDeleteAvatarModal,
  avatar,
  setIsPhotoAvatarCameraOpen,
}: AddAvatarOptionsPropsType) => {
  const [options, setOptions] = useState([
    {
      value: 1,
      label: 'Foto aufnehmen',
      icon: <PhotoIcon />,
      handleClick: () => setIsPhotoAvatarCameraOpen(true),
    },
    {
      value: 2,
      label: 'Profilbild auswählen',
      icon: <DiashowIcon />,
      handleClick: () => openAvatarModal(true),
    },
    {
      value: 3,
      label: 'Profilbild löschen',
      icon: <DeleteIcon fill={'#56A0BB'} />,
      handleClick: () => setIsOpenDeleteAvatarModal(true),
    },
  ]);

  useEffect(() => {
    if (avatar === null || avatar === undefined) {
      setOptions([
        {
          value: 1,
          label: 'Foto aufnehmen',
          icon: <PhotoIcon />,
          handleClick: () => setIsPhotoAvatarCameraOpen(true),
        },
        {
          value: 2,
          label: 'Profilbild auswählen',
          icon: <DiashowIcon />,
          handleClick: () => openAvatarModal(true),
        },
      ]);
    } else {
      setOptions([
        {
          value: 1,
          label: 'Foto aufnehmen',
          icon: <PhotoIcon />,
          handleClick: () => setIsPhotoAvatarCameraOpen(true),
        },
        {
          value: 2,
          label: 'Profilbild auswählen',
          icon: <DiashowIcon />,
          handleClick: () => openAvatarModal(true),
        },
        {
          value: 3,
          label: 'Profilbild löschen',
          icon: <DeleteIcon fill={'#56A0BB'} />,
          handleClick: () => setIsOpenDeleteAvatarModal(true),
        },
      ]);
    }
  }, [avatar]);

  const avatarContainer = useRef(null);
  useOutsideAlerter({ ref: avatarContainer, callback: () => setOpen(false) });

  return (
    <div className="relative bg-red-600" ref={avatarContainer}>
      {open && (
        <ul className="absolute shadow-card top-full left-[24px] -top-[34px] w-full bg-white border border-t-0 border-int-mid-blue text-int-grey-40 rounded-[11px] z-50 min-w-[230px] overflow-hidden">
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
                {index !== options.length - 1 && <hr className="bg-int-mid-blue" />}
              </div>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AddAvatarOptions;
