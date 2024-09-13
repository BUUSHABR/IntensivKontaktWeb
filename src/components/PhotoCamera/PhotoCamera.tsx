import React, { useEffect, useState } from 'react';
import photoStart from '../../assets/icons/PhotoStart.png';
import cameraSideImg from './../../assets/icons/camera-side.svg';
import closeIcon from '../../assets/icons/close-modal.svg';
import ToastConsumer from '../../hoc/toastProvider';


type PhotoCameraType = {
  clickPhoto: (a: any) => void;
  clickClose: () => void;
};

const PhotoCamera = ({ clickPhoto, clickClose}: PhotoCameraType) => {
  const [cameraView, setCameraView] = useState<boolean>(false);
  const { toast } = ToastConsumer();


  useEffect(() => {
    startWebcam();
    return () => {
      stopUseCamera();
    };
  }, [cameraView]);

  let video: any;

  const init = () => {
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
  };

  const startWebcam = () => {
    init();
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: !cameraView
          ? true
          : {
              facingMode: {
                exact: 'environment',
              },
            },
      })
      .then((stream) => {
        video = document.querySelector('#video');
        // @ts-ignore
        window.stream = stream;
        video.srcObject = stream;
        video.setAttribute('playsinline', '');
        video.play();
      })
      .catch((error) => {
        toast.error('Zugang zur Verwendung der Kamera gewähren');
        setCameraView(false);
      });
  };

  let canvas: any, ctx: any;

  const snapshot = () => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  };

  const stopUseCamera = () => {
    // @ts-ignore
    window.stream.getTracks().forEach(function (track: any) {
      track.stop();
    });
  };

  return (
    <>
      <div className="absolute top-0 left-0 h-[100vh] bg-black flex object-fill">
        <video className="w-screen object-cover" id="video" />
      </div>

      <div className="absolute right-0 top-0 flex flex-col items-center justify-center h-[100%] w-[120px] bg-[rgba(90,98,102,0.4)]">
        <div className="cursor-pointer">
          <button
            onClick={() => {
              snapshot();
              clickPhoto(canvas);
            }}
          >
            <img src={photoStart} alt="screen" />
          </button>
        </div>

        <div
          className="invisible xl:visible cursor-pointer text-white mt-[15px]"
          onClick={() => setCameraView(!cameraView)}
        >
          <img src={cameraSideImg} />
        </div>

        <div
          className="cursor-pointer absolute bottom-[45px]"
          onClick={() => {
            clickClose();
          }}
        >
          <img src={closeIcon} alt="close" />
        </div>
      </div>

      <div className="hidden">
        <canvas id="myCanvas" width="1080" height="810" className="w-[300px]" />
      </div>
    </>
  );
};

export default PhotoCamera;
