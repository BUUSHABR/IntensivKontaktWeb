import React, { Dispatch, SetStateAction } from 'react';
import PhotoCamera from '../PhotoCamera/PhotoCamera';

type PhotoAvatarCameraType = {
  setIsPhotoAvatarCameraOpen: Dispatch<SetStateAction<boolean>>;
  setPhotoAvatar: Dispatch<SetStateAction<string>>;
  setIsAvatarModal: Dispatch<SetStateAction<boolean>>;
};

const PhotoAvatarCamera = ({
  setIsPhotoAvatarCameraOpen,
  setPhotoAvatar,
  setIsAvatarModal,
}: PhotoAvatarCameraType) => {
  const getAndSetPhoto = (canvas: any) => {
    canvas.toBlob((blob: Blob) => {
      setPhotoAvatar(URL.createObjectURL(blob));
      setIsPhotoAvatarCameraOpen(false);
      setIsAvatarModal(true);
    });
  };

  return (
    <PhotoCamera clickPhoto={getAndSetPhoto} clickClose={() => setIsPhotoAvatarCameraOpen(false)} />
  );
};

export default PhotoAvatarCamera;
