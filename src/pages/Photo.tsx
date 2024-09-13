import React from 'react';
import { useNavigate } from 'react-router-dom';
import PhotoCamera from '../components/PhotoCamera/PhotoCamera';

const Photo = () => {
  const navigate = useNavigate();

  const closeCamera = () => {
    navigate('/diashow');
  };

  const sendPhotoInfo = (canvas: any) => {
    canvas.toBlob((blob: Blob) => {
      const file = new File([blob], `image-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const photoInfo = {
        photoSrc: canvas.toDataURL('image/jpeg'),
        photoFile: file,
      };
      navigate('/diashow/photo/preview', { state: { photoInfo: photoInfo } });
    });
  };

  return <PhotoCamera clickPhoto={sendPhotoInfo} clickClose={closeCamera} />;
};

export default Photo;
