import React, { useEffect, useState } from 'react';
import http from '../util/http';
import WaveSoundAnimation from './WaveSoundAnimation';
import NativeAudioPlayer from './NativeAudioPlayer';
import { FButton } from '../../styles/form';
import ToastConsumer from '../../hoc/toastProvider';

const MicRecorder = require('mic-recorder-to-mp3');

export const shortFormatSeconds = (val: number) => {
  const minutes = Math.trunc(val / 60) < 10 ? Math.trunc(val / 60) : Math.trunc(val / 60);
  const seconds = val % 60 < 10 ? '0' + (val % 60) : val % 60;
  return minutes + ':' + seconds;
};

interface RecordAudioProps {
  closeModal: () => void;
  patientId: number;
  refetchDiashowList: () => void;
  showUploadResult: (status: 'success' | 'failed') => void;
}

export default function RecordAudio({
  closeModal,
  patientId,
  refetchDiashowList,

  showUploadResult,
}: RecordAudioProps) {
  const { toast } = ToastConsumer();
  const [Mp3Recorder] = useState(new MicRecorder({ bitRate: 128 }));
  const limitSecondsRecordAudio = 120;

  const [sendingAudioToApi, setSendingAudioToApi] = useState(false);
  const [stepRecordAudio, setStepRecordAudio] = useState('start');
  const [timerId, setTimerId] = useState<NodeJS.Timer>();
  const [seconds, setSeconds] = useState(0);
  const [blobURL, setBlobURL] = useState('');
  const [soundFile, setSoundFile] = useState<any>(null);

  useEffect(() => {
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: true });
    } else {
      toast.error('MediaDevices werden im Browser nicht unterstützt!');
    }

    return () => {
      clearInterval(timerId as NodeJS.Timeout);
      setSeconds(0);
      setStepRecordAudio('start');
      if (Mp3Recorder.activeStream !== null) {
        stopRecordMp3();
      }
    };
  }, []);

  useEffect(() => {
    if (seconds >= limitSecondsRecordAudio) {
      startListeningAudio();
    }
  }, [seconds]);

  const startRecordMp3 = () => {
    Mp3Recorder.start()
      .then(() => {})
      .catch(() => toast.error('Etwas ist schief gelaufen'));
  };

  const stopRecordMp3 = () => {
    Mp3Recorder.stop()
      .getMp3()
      // @ts-ignore
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob);
        setBlobURL(blobURL);
        const file = new File(
          buffer,
          `sound_${new Date().toLocaleString().replace(/:|,| /gi, function myFunction(x) {
            return '_';
          })}.mp3`,
          {
            type: blob.type,
            lastModified: Date.now(),
          },
        );
        setSoundFile(file);
      })
      .catch(() => toast.error('Etwas ist schief gelaufen'));
  };

  const sendSoundData = () => {
    setSendingAudioToApi(true);

    const formData: any = new FormData();
    formData.append('asset', soundFile);
    formData.append('asset_type', 'audio');
    formData.append('name', 'Voicemessage.mp3');
    formData.append('patient', patientId);

    http
      .post(`/contacts/assets/?patient=${patientId}`, formData)
      .then(() => {
        closeModal();
        showUploadResult('success');
        refetchDiashowList();
      })
      .catch(() => {
        closeModal();
        showUploadResult('failed');
      });

    setTimeout(() => {
      closeModal();
    }, 1000);
  };

  const startWaitingPressButton = () => {
    setStepRecordAudio('start');
    clearInterval(timerId as NodeJS.Timeout);
    setSeconds(0);
  };

  const startRecordAudio = () => {
    setStepRecordAudio('recording');
    startRecordMp3();
    const timerInterval = setInterval(() => {
      setSeconds((state) => state + 1);
    }, 1000);
    setTimerId(timerInterval);
  };

  const startListeningAudio = () => {
    stopRecordMp3();
    setStepRecordAudio('listening');
    clearInterval(timerId as NodeJS.Timeout);
  };

  return (
    <div>
      <div>
        {stepRecordAudio === 'start' && (
          <>
            <div className="flex justify-center mb-[30px]">
              <div
                className="h-[78px] w-[78px] border-4 rounded-full border-int-grey-40 flex justify-center items-center cursor-pointer"
                onClick={startRecordAudio}
              >
                <div className="h-[64px] w-[64px]  rounded-full bg-int-red"></div>
              </div>
            </div>
          </>
        )}

        {stepRecordAudio === 'recording' && (
          <>
            <WaveSoundAnimation />
            <div className="mb-[8px]">
              <span className="text-[11px] text-int-red text-center font-BeVietnamRegular">
                {shortFormatSeconds(seconds)}
              </span>
            </div>
            <div className="flex justify-center">
              <div
                className="h-[78px] w-[78px] border-4 rounded-full border-int-grey-40 flex justify-center items-center cursor-pointer"
                onClick={startListeningAudio}
              >
                <div className="h-[32px] w-[32px]  rounded-md bg-int-red"></div>
              </div>
            </div>
          </>
        )}

        {stepRecordAudio === 'listening' && (
          <>
            <div className="mt-[40px] mb-[10px]">
              {blobURL === '' ? <span>Loading</span> : <NativeAudioPlayer audio={blobURL} />}
            </div>

            <div
              className="flex justify-center cursor-pointer relative z-10"
              onClick={sendSoundData}
            >
              <FButton dark={true} block disabled={sendingAudioToApi}>
                Sprachnachricht Senden
              </FButton>
            </div>
            <div
              className="text-[16px] font-medium text-int-grey-40 leading-snug text-center cursor-pointer mt-[20px] mb-[2px]"
              onClick={startWaitingPressButton}
            >
              Neu aufnehmen
            </div>
          </>
        )}
      </div>
    </div>
  );
}
