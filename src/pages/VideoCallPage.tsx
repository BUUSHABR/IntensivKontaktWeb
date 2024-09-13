import React, { useEffect, useMemo } from 'react';
import { ZoomMtg } from '@zoomus/websdk';
import http from '../components/util/http';
import { ZOOM_SDK_KEY } from '../components/util/constants';

import '@zoomus/websdk/dist/css/bootstrap.css';
import '@zoomus/websdk/dist/css/react-select.css';
import CurrentPatientConsumer from '../components/Mehr/CurrentPatient';
import useRealtivesProfileMe from '../components/Mehr/useRelativesProfileMe';
import ToastConsumer from 'hoc/toastProvider';

ZoomMtg.setZoomJSLib('https://source.zoom.us/2.9.0/lib', '/av');

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

const VideoCallPage = () => {
  const { toast } = ToastConsumer();
  const { currentPatientId } = CurrentPatientConsumer();
  const { data, isLoading } = useRealtivesProfileMe();

  const name = useMemo(() => {
    if (data) {
      return `${data?.first_name} ${data?.last_name}`;
    } else {
      return 'Relativ';
    }
  }, [data]);

  const showZoomDiv = () => {
    //@ts-ignore
    document.getElementById('zmmtg-root').style.display = 'block';
  };

  useEffect(() => {
    if (!isLoading) {
      ZoomMtg.i18n.load('de-DE').then(() => {
        showZoomDiv();
        getDataForCall(currentPatientId!).then((res) => {
          initialMeeting(
            res.id,
            res.credentials.signature,
            res.credentials.meeting_number,
            name || 'Relativ',
            res.credentials.meeting_password,
            res.credentials.zoom_id,
          );
        });
        ZoomMtg.i18n.reload('de-DE');
      });
    }
  }, [isLoading]);

  const getDataForCall = (patientId: string | number) => {
    return http.get(`/meetings/${patientId}/get_by_patient/`);
  };

  const initialMeeting = (
    id: string,
    signature: string,
    meetingNumber: string,
    userName: string,
    passWord: string,
    customerKey: string,
  ) => {
    ZoomMtg.init({
      leaveUrl: '/news',
      disablePreview: true,
      success: (success: any) => {
        ZoomMtg.join({
          signature,
          meetingNumber,
          userName,
          passWord,
          customerKey,
          sdkKey: ZOOM_SDK_KEY,
          error: (error: any) => {
            toast.error('Etwas ist schief gelaufen');
          },
          success: (success: any) => {
            http.patch(`/meetings/${id}/update_participants_list/`, {});
            let buttonFound = false;
            let t = setInterval(function () {
              let startButton = document.querySelector('.join-audio-by-voip__join-btn');
              if (startButton != null) {
                buttonFound = true;
                // @ts-ignore
                startButton.click();
              }
              startButton = document.querySelector('.join-audio-by-voip__join-btn');
              if (startButton == null && buttonFound) {
                clearInterval(t);
                let cameraButtonFounded = false;
                let interv = setInterval(function () {
                  let cameraButton = document.querySelector(
                    '.footer-button__wrapper button[arialabel="start sending my video"] ',
                  );

                  let cameraOn = document.querySelector(
                    '.footer-button__wrapper button[arialabel="stop sending my video"] ',
                  );

                  if (cameraOn != null) {
                    cameraButtonFounded = true;
                  }

                  if (cameraButton != null && !cameraButtonFounded) {
                    // @ts-ignore
                    cameraButton.click();
                  }

                  if (cameraButtonFounded) {
                    clearInterval(interv);
                  }
                  let audioButton = document.querySelector<HTMLElement>('.join-audio-container__btn')
                  let audioButtonText = document.querySelector<HTMLElement>('.footer-button-base__button-label')
                  audioButton?.setAttribute("style", "width:fit-content;");
                  audioButtonText?.setAttribute("style", "max-width:100%;");
                }, 500);
              }
            }, 500);

            let sidePanelFounded = false;
            let int = setInterval(function () {
              let sideRelativesPanel = document.querySelector(
                '.footer__btns-container div[feature-type="participants"] button',
              );

              if (sideRelativesPanel != null && !sidePanelFounded) {
                sidePanelFounded = true;
                // @ts-ignore
                sideRelativesPanel.click();
              }

              if (sidePanelFounded) {
                clearInterval(int);
              }
            }, 500);
          },
        });
      },
      error: (error: any) => {
        toast.error('Etwas ist schief gelaufen');
      },
    });
  };

  return <></>;
};

export default VideoCallPage;
