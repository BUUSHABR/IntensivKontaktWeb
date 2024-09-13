import React, { useState } from 'react';
import InvitationItem from './InvitationItem';
import AddInvitationForm from './AddInvitationForm';
import { useRelativesPendingInvites } from './useRelativesPendingInvites';
import { useRelativesAcceptedInvites } from './useRelativesAcceptedInvites';
import Preloader from '../../Preloader';
import EditPendingInvites from './EditPendingInvites';
import EditAcceptedInvites from './EditAcceptedInvites';

type InvitationItem = {
  id: string;
  patient: number;
  patient_relation: string;
  user : {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    invite_type: string;
    phone: string;
  }
};

const RelativesContent = () => {
  const {
    data: dataRelativesPendingInvites,
    isSuccess: isSuccessRelativesPendingInvites,
    isFetching: isFetchingRelativesPendingInvites,
  } = useRelativesPendingInvites();
  console.log(dataRelativesPendingInvites)
  const {
    data: dataRelativesAcceptedInvites,
    isSuccess: isSuccessRelativesAcceptedInvites,
    isFetching: isFetchingRelativesAcceptedInvites,
  } = useRelativesAcceptedInvites();

  const [selectedInvitation, setSelectedInvitation] = useState<InvitationItem | null>(null);
  console.log(selectedInvitation)
  const [isEditPendind, setIsEditPending] = useState<boolean>(true);

  return (
    <div className="px-[23px]">
      {selectedInvitation === null ? (
        <>
          <div className="mt-[27px] mb-[17px] text-[16px] text-black font-bold text-center">
            Angehörige einladen
          </div>
          <div className="mt-[27px] mb-[17px] pl-[20px] pr-[20px] text-[16px] text-int-grey-60 text-left">
            Sie können weitere Angehörige entweder per E-Mail-Adresse <b>oder</b> per Handynummer
            einladen.
          </div>
          <AddInvitationForm />
        </>
      ) : isEditPendind ? (
        <EditPendingInvites
          selectedInvitation={selectedInvitation}
          setSelectedInvitation={setSelectedInvitation}
        />
      ) : (
        <EditAcceptedInvites
          selectedInvitation={selectedInvitation}
          setSelectedInvitation={setSelectedInvitation}
        />
      )}
      <hr className="mt-[90px] mb-[30px] border-int-light-blue" />
      <div className="mt-[32px] mb-[16px] text-[14px] text-int-grey-90 text-left">
        Offene Einladungen
      </div>
      {isFetchingRelativesPendingInvites ? (
        <div className="flex items-center justify-center">
          <Preloader small={true} />
        </div>
      ) : (
        dataRelativesPendingInvites.length < 1 && (
          <div className="text-center">Aktuell wartet keine Offene Einladungen</div>
        )
      )}
      {isSuccessRelativesPendingInvites &&
        dataRelativesPendingInvites.map((item: any) => (
          <InvitationItem
            key={item.id}
            email={item.user.email}
            phone={item.user.phone}
            approved={false}
            onClick={() => {
              setIsEditPending(true);
              setSelectedInvitation(item);
            }}
          />
        ))}
      <div className="mt-[32px] mb-[16px] text-[14px] text-int-grey-90 text-left">
        Angenommene Einladungen
      </div>
      <div className="mb-[30px]">
        {isFetchingRelativesAcceptedInvites ? (
          <div className="flex items-center justify-center">
            <Preloader small={true} />
          </div>
        ) : (
          dataRelativesAcceptedInvites.length < 1 && (
            <div className="text-center">Aktuell wartet keine Angenommene Einladungen</div>
          )
        )}
        {isSuccessRelativesAcceptedInvites &&
          dataRelativesAcceptedInvites.map((item: any) => (
            <InvitationItem
              key={item.id}
              email={item.user.email}
              phone={item.user.phone}
              approved={true}
              onClick={() => {
                setIsEditPending(false);
                setSelectedInvitation(item);
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default RelativesContent;
