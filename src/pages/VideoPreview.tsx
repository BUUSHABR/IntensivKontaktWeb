import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import backPhotoIcon from '../assets/icons/backPhotoIcon.svg';
import sendPhotoIcon from '../assets/icons/sendPhotoIcon.svg';
import http from '../components/util/http';
import CurrentPatientConsumer from '../components/Mehr/CurrentPatient';
import Preloader from '../components/Preloader';

type VideoPreviewLocationState = {
  videoSrc: string;
  videoBlob: Blob;
};

const VideoPreview = () => {
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const videoLocationState = useLocation().state as VideoPreviewLocationState;
  const { currentPatientId } = CurrentPatientConsumer();
  const onNavigateBack = () => {
    navigate('/diashow/video');
  };

  const videoSrc = videoLocationState.videoSrc;
  const videoBlob = videoLocationState.videoBlob;

  const sendVideo = async () => {
    const file = new File([videoBlob], `video-${Date.now()}.mp4`, { type: 'video/mp4' });

    const formData: any = new FormData();
    formData.append('asset', file);
    formData.append('asset_type', 'video');
    formData.append('name', file.name || '');
    formData.append('patient', currentPatientId);
    setLoading(true);
    await http
      .post(`/contacts/assets/?patient=${currentPatientId}`, formData)
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

  return (
    <div className="bg-black h-screen">
      <video src={videoSrc} id="videoPreview" controls className="w-[100%] h-[90%]" />
      <div className="bg-black absolute bottom-0 h-[10%] w-[100%] flex justify-between text-white items-center py-[46px]">
        <div className="ml-[50px]">
          <button onClick={onNavigateBack}>
            <img src={backPhotoIcon} alt="Back" />
          </button>
        </div>
        <div className="flex items-center justify-center mr-[50px]">
          {isLoading && (
            <div>
              <Preloader small={true} />
            </div>
          )}
          <button onClick={sendVideo} disabled={isLoading}>
            <img src={sendPhotoIcon} alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
