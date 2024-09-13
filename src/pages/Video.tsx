import React, { useEffect, useState } from 'react';
import videoStart from '../assets/icons/VideoStart.png';
import cameraSideImg from '../assets/icons/camera-side.svg';
import closeIcon from '../assets/icons/close-modal.svg';
import { useNavigate } from 'react-router-dom';
import ToastConsumer from 'hoc/toastProvider';

const Video = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const [recordedBlobsArr, setRecordedBlobsArr] = useState<Array<BlobPart>>([]);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerMinutes, setTimerMinuter] = useState(0);
  const [isRecordButtonDisabled, setIsRecordButtonDisabled] = useState(false);

  const [cameraView, setCameraView] = useState<boolean>(false);
  const { toast } = ToastConsumer();

  const closeCamera = () => {
    navigate('/diashow');
  };

  useEffect(() => {
    if (isRecording) {
      let seconds = 0;
      let minutes = 0;
      const countTime = setInterval(() => {
        ++seconds;
        setTimerSeconds(seconds);
        if (seconds === 60) {
          minutes++;
          seconds = 0;
          setTimerSeconds(seconds);
          setTimerMinuter(minutes);
        }
      }, 1000);
      return () => clearInterval(countTime);
    }
  }, [isRecording]);

  useEffect(() => {
    if (timerMinutes === 3) {
      stopRecording();
    }
  }, [timerMinutes]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: !cameraView
        ? true
        : {
            facingMode: {
              exact: 'environment',
            },
          },
      })
      .then((stream) => {
        setIsRecordButtonDisabled(false);
        let gumVideo = document.getElementById('gum');
        // @ts-ignore
        window.stream = stream;
        // @ts-ignore
        gumVideo.setAttribute('playsinline', '');
        // @ts-ignore
        gumVideo.srcObject = stream;
      })
      .catch((error) => {
        toast.error('Zugang zur Verwendung der Kamera gewähren');
        setIsRecordButtonDisabled(true);
        setCameraView(false);
      });

    return () => {
      stopUseCamera();
    };
  }, [cameraView]);

  const stopUseCamera = () => {
    // @ts-ignore
    window.stream.getTracks().forEach(function (track: any) {
      track.stop();
    });
  };

  function handleDataAvailable(event: any) {
    if (event.data && event.data.size > 0) {
      setRecordedBlobsArr((oldArray) => [...oldArray, event.data]);
    }
  }

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    let mediaRecorder: any;
    try {
      // @ts-ignore
      mediaRecorder = new MediaRecorder(window.stream);
    } catch (e) {
      console.error('Exception while creating MediaRecorder: ' + e);
      return;
    }
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(10);
    setMediaRecorder(mediaRecorder);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    mediaRecorder!.stop();
    let superBuffer = new Blob(recordedBlobsArr, { type: 'video/mp4' });
    navigate('preview', {
      state: {
        videoSrc: window.URL.createObjectURL(superBuffer),
        videoBlob: superBuffer,
      },
    });
  };

  return (
    <>
      <div className="absolute h-[100vh] bg-black flex object-fill">
        <video className="w-screen object-cover" id="gum" autoPlay muted></video>
      </div>

      <div className="absolute right-0 top-0 flex flex-col items-center justify-center h-[100%] w-[120px] bg-[rgba(90,98,102,0.4)]">
        <div className={isRecording ? 'mb-[113px] text-red-600' : 'mb-[113px] text-white'}>
          {timerMinutes > 9 ? timerMinutes : `0${timerMinutes}`}:
          {timerSeconds > 9 ? timerSeconds : `0${timerSeconds}`}
        </div>

        <div className="text-white cursor-pointer">
          <button id="record" onClick={toggleRecording} disabled={isRecordButtonDisabled}>
            <img src={videoStart} alt="" />
          </button>
        </div>

        <div
          className="invisible xl:visible cursor-pointer text-white mt-[15px]"
          onClick={() => setCameraView(!cameraView)}
        >
          <img src={cameraSideImg} />
        </div>

        <div className="cursor-pointer absolute bottom-[45px]" onClick={closeCamera}>
          <img src={closeIcon} />
        </div>
      </div>

      <div className="hidden">
        <video className="w-[300px]" id="recorded" loop controls />
      </div>
    </>
  );
};

export default Video;
