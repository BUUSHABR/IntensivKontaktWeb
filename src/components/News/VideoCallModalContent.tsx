import React from 'react';
import { FButton } from '../../styles/form';
import { ReactComponent as CallIcon } from '../../assets/icons/callImage.svg';
import { useNavigate } from 'react-router-dom';

type VideoCallModalContentPropsType = {
  isCallGoing: boolean;
  duration?: number;
};

const VideoCallModalContent = ({ isCallGoing, duration }: VideoCallModalContentPropsType) => {
  const navigate = useNavigate();

  const navigateToCall = () => {
    navigate('/video-call');
  };

  return (
    <div>
      {isCallGoing ? (
        <div className="text-int-grey-90 text-h3 mb-[16px]">
          Jetzt teilnehmen und mit Kamera und
          <br />
          Audio mit Ihren Angehörigen sprechen.
        </div>
      ) : (
        <div className="text-int-grey-90 text-h3 mb-[16px] w-[316px]">
          Schade, versuchen Sie es später noch einmal. Aktuell können leider nur Pflegekräfte vor
          Ort virtuelle Besuche starten. In der Regel finden diese zwischen 09:00 Uhr und 18:00 Uhr
          statt.
        </div>
      )}
      <FButton disabled={!isCallGoing} dark={true} onClick={navigateToCall}>
        <div className="flex items-center justify-center">
          {isCallGoing ? (
            <>
              <span>
                <CallIcon fill={'white'} />
              </span>
              <span className="ml-[10px] font-BeVietnamBold">Jetzt teilnehmen</span>
            </>
          ) : (
            <>
              <span>
                <CallIcon fill={'#6F7782'} />
              </span>
              <span className="ml-[10px] font-BeVietnamBold text-int-grey-60">
                Jetzt teilnehmen
              </span>
            </>
          )}
        </div>
      </FButton>
    </div>
  );
};

export default VideoCallModalContent;
