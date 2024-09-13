import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import http from '../components/util/http';
import backPhotoIcon from '../assets/icons/backPhotoIcon.svg';
import sendPhotoIcon from '../assets/icons/sendPhotoIcon.svg';
import CurrentPatientConsumer from '../components/Mehr/CurrentPatient';
import Preloader from '../components/Preloader';

type PhotoLocationTypes = {
  photoInfo: {
    photoFile: File;
    photoSrc: string;
  };
};

const PhotoPreview = () => {
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const locationState = useLocation().state as PhotoLocationTypes;
  const photoInfo = locationState.photoInfo;
  const { currentPatientId: patientId } = CurrentPatientConsumer();

  const sendPhotoToChat = async () => {
    const formData: any = new FormData();
    formData.append('asset', photoInfo.photoFile);
    formData.append('asset_type', 'image');
    formData.append('name', photoInfo.photoFile.name || '');
    formData.append('patient', patientId);
    setLoading(true);
    await http
      .post(`/contacts/assets/?patient=${patientId}`, formData)
      .then((res) => {
        navigate('/diashow', { state: { isSuccess: 'success' } });
      })
      .catch(() => {
        navigate('/diashow', { state: { isSuccess: 'failed' } });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className="absolute top-0 left-0 w-[100%] h-[100%] bg-black flex items-center justify-center">
        <img src={photoInfo.photoSrc} className="w-[980px] h-[735px]" />
      </div>

      <div className="bg-black absolute bottom-0 h-[10%] w-[100%] flex justify-between text-white items-center py-[46px]">
        <div className="ml-[30px]">
          <button onClick={navigateBack}>
            <img src={backPhotoIcon} alt="Back" />
          </button>
        </div>

        <div className="mr-[50px] flex items-center justify-center">
          {isLoading && (
            <div>
              <Preloader small={true} />
            </div>
          )}
          <button onClick={sendPhotoToChat} disabled={isLoading}>
            <img src={sendPhotoIcon} alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoPreview;
