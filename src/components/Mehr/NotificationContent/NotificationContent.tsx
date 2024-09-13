import React, { useEffect, useState } from 'react';
import http from '../../util/http';
import ToastConsumer from '../../../hoc/toastProvider';
import Preloader from '../../Preloader';

const NotificationContent = () => {
  const { toast } = ToastConsumer();

  const [pushNotification, setPushNotification] = useState<boolean>(false);
  const [emailNotification, setEmailNotification] = useState<boolean>(false);
  const [smsNotification, setSmsNotification] = useState<boolean>(false);
  const [disableCheckbox, setDisableCheckbox] = useState<boolean>(true);

  const [isLoadingNotificationData, setIsLoadingNotificationData] = useState<boolean>(true);

  const fetchNotificationData = () => {
    setIsLoadingNotificationData(true);
    http
      .get('/relatives/notifications_config/me/')
      .then((res) => {
        setPushNotification(res.push);
        setEmailNotification(res.email);
        setSmsNotification(res.sms);
        setDisableCheckbox(false);
      })
      .finally(() => {
        setIsLoadingNotificationData(false);
      });
  };

  const toggleNotification = (data: any) => {
    setDisableCheckbox(true);
    http
      .patch('/relatives/notifications_config/me/', data)
      .then((res) => {
        fetchNotificationData();
        toast.success('Speichern erfolgreich');
      })
      .catch(() => {
        toast.error('Fehler speichern');
        fetchNotificationData();
      })
      .finally(() => {
        setDisableCheckbox(false);
      });
  };

  useEffect(() => {
    fetchNotificationData();
  }, []);

  return (
    <div className="px-[23px]">
      <div className="mt-[27px] mb-[17px] text-[16px] text-black font-bold text-center">
        Benachrichtigungen
      </div>
      <div className="mt-[27px] mb-[17px] pl-[20px] pr-[20px] text-[16px] text-int-grey-60 text-left">
      Verpassen Sie nicht wie es Ihrem oder Ihrer Liebsten geht und erfahren Sie immer, wenn es neue Nachrichten und 
      die Möglichkeit für einen virtuellen Besuch gibt.
      </div>
      <div className="h-[20px]">
        {isLoadingNotificationData && (
          <div className="flex items-center justify-center">
            <Preloader small={true} />
          </div>
        )}
      </div>

      <div className="w-[100%] pt-[10px] pl-[16px] pb-[12px] bg-[#FFF] mt-[21px] rounded-[10px] shadow-resultCard">
        <div className="flex justify-between flex-wrap gap-5">
          <span className="text-int-black">Push-Benachrichtigungen</span>
          <label className="checkbox-field w-6 h-6">
            <input
              type="checkbox"
              checked={pushNotification}
              onChange={() => {
                setPushNotification((prev) => !prev);
                toggleNotification({ push: !pushNotification });
              }}
              disabled={disableCheckbox}
            />
            <span className="checkmark"></span>
          </label>
        </div>
        <hr className="mt-[11px] border-int-light-blue" />
        <div className="flex justify-between mt-[10px] flex-wrap gap-5">
          <span className="text-int-black">E-Mail-Benachrichtigungen</span>
          <label className="checkbox-field w-6 h-6">
            <input
              type="checkbox"
              checked={emailNotification}
              onChange={() => {
                setEmailNotification((prev) => !prev);
                toggleNotification({ email: !emailNotification });
              }}
              disabled={disableCheckbox}
            />
            <span className="checkmark"></span>
          </label>
        </div>
        <hr className="mt-[11px] border-int-light-blue" />
        <div className="flex justify-between mt-[10px] flex-wrap gap-5">
          <span className="text-int-black">SMS-Benachrichtigungen</span>
          <label className="checkbox-field w-6 h-6">
            <input
              type="checkbox"
              checked={smsNotification}
              onChange={() => {
                setSmsNotification((prev) => !prev);
                toggleNotification({ sms: !smsNotification });
              }}
              disabled={disableCheckbox}
            />
            <span className="checkmark"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationContent;
