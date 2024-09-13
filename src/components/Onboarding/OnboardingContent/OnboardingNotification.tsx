import React, { useState } from 'react';
import { FButton } from '../../../styles/form';
import { ReactComponent as NotificationCloudIcon } from '../../../assets/icons/notification-cloud-icon.svg';
import { ReactComponent as InfoNotificationIcon } from '../../../assets/icons/InfoNotificationIcon.svg';
import Logo from '../../../assets/logo/base_icon.png';
import { Modal } from '../../Layout/Modal';

const OnboardingNotification = () => {
  const [isHelpModal, setIsHelpModal] = useState<boolean>(false);

  const openHelpModal = () => {
    setIsHelpModal(true);
  };

  const closeHelpModal = () => {
    setIsHelpModal(false);
  };

  const subscribeNotification = () => {
    if (window.Notification) {
      Notification.requestPermission(function (status) {
        console.log('Status: ', status);
        var n = new Notification('Intensiv Kontakt', {
          body: 'You have successfully subscribed to notifications',
          icon: Logo,
        });
      });
    } else {
      console.log("Your browser doesn't support notifications.");
    }
  };

  return (
    <div className="flex items-center justify-center  pl-[10px] pr-[10px]">
      <div className="w-[700px]">
        <div className="w-[450px] m-auto text-center">
          <div className="mb-[40px] flex justify-center items-center">
            <NotificationCloudIcon />
          </div>
          <div className="text-h1 font-BeVietnamBold text-black mb-[29px]">
            Auf Bestätigung des Krankenhauses warten...
          </div>
          <div className="mb-[22px] text-black text-[16px]">
            Aus datenschutzrechlichten Gründen müssen Sie durch eine Pflegekraft oder den/die
            nächste:n Angehörige:n bestätigt werden. Dies kann bis zu <b>24 Std.</b> dauern.
          </div>
          <div className="mb-[55px] text-black text-[16px]">
            Jetzt Benachrichtigungen erlauben und nicht verpassen, wenn Sie Nachrichten über ihren
            Angehörigen erhalten können.
          </div>
          <div className="w-[350px] m-auto">
            <FButton dark={true} onClick={subscribeNotification}>
              Benachrichtigungen erlauben
            </FButton>
          </div>
          <div className="flex items-center justify-center pt-[20px]">
            <div className="text-int-dark-blue text-sm cursor-pointer" onClick={openHelpModal}>
              Warum dauert die Zuordnung so lange?
            </div>
          </div>
        </div>
        {isHelpModal && (
          <Modal closeModal={closeHelpModal}>
            <div>
              <div className="text-h2 text-black pb-[20px]">
                <div className="border-b border-[rgba(60, 60, 67, 0.36)] ml-[-24px] flex items-center w-[450px] top-[-20px]">
                  <div className="mb-[20px] flex items-center ml-[13px] justify-center items-center">
                    <InfoNotificationIcon />
                    <b className=" ml-[4px] mt-[5px]">Hilfe</b>
                  </div>
                </div>
              </div>
              <div className="mb-[16px] text-black text-[24px]">
                Warum dauert die <b>Zuordnung</b> so lange?
              </div>
              <div className="mb-[8px] text-black text-[18px] font-bold">Schweigepflicht</div>
              <div className="text-[16px]">
                Die Schwiegepflicht (oder Verschwiegenheitspflicht) nach § 203 StGB ist zum Schutz
                aller Patient:innen da. Durch die Schweigepflicht ist es Behandelnden, also
                Ärzt:innen, Pfleger:innen und anderen Fachkräften, verboten, Informationen über
                eine:n Patient:in oder den Behandlungsverlauf mit anderen Menschen zu teilen. Das
                ist unabhängig davon, ob es Verwandte, Freunde oder Fremde Menschen sind. Durch eine
                Schweigepflichtsentbindung kann die / der Patient:in aber zustimmen, dass Sie alle
                Informationen erhalten. Das Einholen dieser Erlaubnis muss dokumentiert werden und
                kann daher bis zu 24 Std. daeuern.
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default OnboardingNotification;
